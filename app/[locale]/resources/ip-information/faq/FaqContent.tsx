'use client';

import Section from '@/components/atoms/Section';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useState, useMemo } from 'react';
import ExpandableTabGroup from '@/components/molecules/ExpandableTabGroup';
import GlossaryTabs from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import { useTranslations } from 'next-intl';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';

type FilterValues = {
  search?: string;
  category?: string | string[];
  serviceType?: string | string[];
};

interface FaqCategory {
  id: string;
  label: string;
  questions: Array<{
    id: string;
    title: string;
    description: string;
    lastUpdate?: string;
    services?: string[];
  }>;
  services?: string[];
}

interface FaqContentProps {
  categories: FaqCategory[];
}

export function FaqContent({ categories }: FaqContentProps) {
  const t = useTranslations('common.filters');
  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => {
        if (category.id === 'topographic') return false;
        const label = category.label.toLowerCase();
        return !label.includes('topographic design');
      }),
    [categories],
  );
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    visibleCategories[0]?.id || 'general',
  );
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(new Set());

  const categoryQuestions =
    visibleCategories.find((cat) => cat.id === activeCategory)?.questions || [];
  const searchTerm = filterValues.search?.toLowerCase().trim() || '';

  const selectedServiceTypes = Array.isArray(filterValues.serviceType)
    ? filterValues.serviceType
    : filterValues.serviceType
      ? [filterValues.serviceType]
      : [];

  const serviceToCategoryMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    visibleCategories.forEach((category) => {
      const services = category.services || [];
      services.forEach((service) => {
        const serviceKey = service.toLowerCase().replace(/\s+/g, '-');
        if (!map[serviceKey]) {
          map[serviceKey] = [];
        }
        if (!map[serviceKey].includes(category.id)) {
          map[serviceKey].push(category.id);
        }
      });
    });

    return map;
  }, [visibleCategories]);

  let filteredQuestions: Array<{
    id: string;
    title: string;
    description: string;
    lastUpdate?: string;
    services?: string[];
    categoryLabel?: string;
    categoryId?: string;
  }> = [];

  const hasAllServicesSelected = selectedServiceTypes.includes('all');

  const normalizeServiceKey = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

  if (selectedServiceTypes.length > 0 && !hasAllServicesSelected) {
    const relevantCategoryIds = new Set<string>();

    selectedServiceTypes.forEach((serviceKey) => {
      const categoryIds = serviceToCategoryMap[serviceKey] || [];
      categoryIds.forEach((catId) => relevantCategoryIds.add(catId));
    });

    if (relevantCategoryIds.size > 0) {
      filteredQuestions = visibleCategories
        .filter((cat) => relevantCategoryIds.has(cat.id))
        .flatMap((cat) =>
          cat.questions.map((q) => ({
            ...q,
            categoryLabel: cat.label,
            categoryId: cat.id,
          })),
        );
    }
  } else {
    filteredQuestions = categoryQuestions.map((q) => ({
      ...q,
      categoryLabel: visibleCategories.find((c) => c.id === activeCategory)?.label,
      categoryId: activeCategory,
    }));
  }

  if (selectedServiceTypes.length > 0 && !hasAllServicesSelected) {
    filteredQuestions = filteredQuestions.filter((question) => {
      const questionServices = question.services || [];
      const questionKeys = questionServices.map(normalizeServiceKey);
      return selectedServiceTypes.some((serviceKey) => questionKeys.includes(serviceKey));
    });
  }

  if (searchTerm) {
    filteredQuestions = filteredQuestions.filter(
      (question) =>
        question.title.toLowerCase().includes(searchTerm) ||
        question.description.toLowerCase().includes(searchTerm),
    );
  }

  const activeQuestions = filteredQuestions;

  const categoryOptions = visibleCategories.map((category) => ({
    label: category.label || category.id,
    value: category.id,
  }));

  // Get current category from filterValues or activeCategory
  const currentCategory =
    typeof filterValues.category === 'string' ? filterValues.category : activeCategory;

  const activeCategoryData = visibleCategories.find((category) => category.id === currentCategory);
  const selectedCategoryId =
    typeof filterValues.category === 'string' ? filterValues.category : activeCategory;
  const selectedCategoryData = visibleCategories.find(
    (category) => category.id === selectedCategoryId,
  );
  const questionServicesFallback = Array.from(
    new Set(
      (selectedCategoryData?.questions || [])
        .flatMap((question) => question.services || [])
        .filter(Boolean),
    ),
  );
  const selectedServices =
    selectedCategoryData?.services && selectedCategoryData.services.length > 0
      ? selectedCategoryData.services
      : questionServicesFallback;
  const isCategorySelected =
    typeof filterValues.category === 'string' && filterValues.category.trim().length > 0;

  const serviceTypeOptions = useMemo(() => {
    if (!selectedServices.length) {
      return [];
    }

    const options = selectedServices.map((service) => ({
      label: service,
      value: service.toLowerCase().replace(/\s+/g, '-'),
    }));

    const sortedOptions = options.sort((a, b) => a.label.localeCompare(b.label));
    return [
      {
        label: t('all'),
        value: 'all',
      },
      ...sortedOptions,
    ];
  }, [selectedServices, t]);

  const shouldShowServiceFilter = true;

  const filterFields = [
    {
      id: 'search',
      label: t('search'),
      type: 'search' as const,
      placeholder: t('search'),
    },
    {
      id: 'category',
      label: t('category'),
      type: 'select' as const,
      options: categoryOptions,
      multiselect: false,
    },
    ...(shouldShowServiceFilter
      ? [
          {
            id: 'serviceType',
            label: t('services'),
            type: 'select' as const,
            options: serviceTypeOptions,
            multiselect: true,
            disabled: !isCategorySelected,
          },
        ]
      : []),
  ];

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    if (fieldId === 'category' && typeof value === 'string') {
      const newCategory = value;
      setActiveCategory(newCategory);
      setExpandedQuestionIds(new Set());

      const categoryServices =
        visibleCategories.find((category) => category.id === newCategory)?.services || [];
      const categoryServiceKeys = categoryServices.map((s) => s.toLowerCase().replace(/\s+/g, '-'));

      const currentServiceTypes = Array.isArray(filterValues.serviceType)
        ? filterValues.serviceType
        : filterValues.serviceType
          ? [filterValues.serviceType]
          : [];

      const validServiceTypes = currentServiceTypes.filter((serviceKey) => {
        if (serviceKey === 'all') return true;
        return categoryServiceKeys.includes(serviceKey);
      });

      setFilterValues((prev) => ({
        ...prev,
        [fieldId]: value,
        serviceType: validServiceTypes.length > 0 ? validServiceTypes : undefined,
      }));
    } else {
      setFilterValues((prev) => ({ ...prev, [fieldId]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setActiveCategory(visibleCategories[0]?.id || 'general');
    setExpandedQuestionIds(new Set());
  };

  const isMobile = useIsMobile();
  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(filterValues.category) ||
    (Array.isArray(filterValues.serviceType)
      ? filterValues.serviceType.length > 0
      : Boolean(filterValues.serviceType));

  return (
    <>
      <div className="bg-white -mt-20 px-4">
        <LayoutWrapper className="px-0 md:px-8">
          <div className="w-full max-w-[1280px]">
            {isMobile ? (
              <MobileFilters
                fields={filterFields}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                searchFieldId="search"
              />
            ) : (
              <Filters
                fields={filterFields}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                showHideFilters={false}
                isClearDisabled={!hasActiveFilters}
                variant="faq"
                clearButtonClassName="h-8 px-3 py-0 rounded-sm text-sm font-medium text-gray-400 hover:text-gray-600"
              />
            )}
          </div>
        </LayoutWrapper>
      </div>

      <div className="px-4">
        <Section background="white" className="px-0 md:px-8">
          <div className="w-full max-w-[1280px]">
            <div className="mb-6 lg:mb-8">
              <GlossaryTabs
                tabs={visibleCategories.map((cat) => cat.id)}
                tabLabels={visibleCategories.reduce(
                  (acc, cat) => {
                    acc[cat.id] = cat.label;
                    return acc;
                  },
                  {} as Record<string, string>,
                )}
                activeTab={
                  activeCategoryData?.id ||
                  (visibleCategories.length > 0 ? visibleCategories[0].id : 'general')
                }
                onTabChange={(id) => {
                  setActiveCategory(id);
                  setExpandedQuestionIds(new Set());
                }}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl lg:text-2xl font-semibold mb-4">
                {searchTerm
                  ? `${t('search')} (${activeQuestions.length})`
                  : visibleCategories.find((c) => c.id === activeCategory)?.label || t('faq')}
              </h2>
              {activeQuestions && activeQuestions.length > 0 ? (
                <ExpandableTabGroup
                  items={activeQuestions}
                  expandedIds={expandedQuestionIds}
                  onToggle={(id) => {
                    setExpandedQuestionIds((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(id)) {
                        newSet.delete(id);
                      } else {
                        newSet.add(id);
                      }
                      return newSet;
                    });
                  }}
                  showFeedback={true}
                  variant="bordered"
                />
              ) : (
                <p className="text-gray-500">{t('noServicesAvailable')}</p>
              )}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
