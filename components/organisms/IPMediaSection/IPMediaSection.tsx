'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Section from '@/components/atoms/Section';
import { TabVertical } from '@/components/molecules/TabVertical/TabVertical';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import Heading from '@/components/atoms/Heading';
import { NewsArticleCard } from '@/components/organisms/NewsArticleCard';
import { VideoCard } from '@/components/molecules/VideoCard';
import Pagination from '@/components/atoms/Pagination';
import VideoCarousel from '@/components/organisms/VideoCarousel';
import { Button } from '@/components/atoms/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import moment from 'moment';

export interface IPMediaSectionProps {
  heroTitle?: string;
  heroDescription?: string;
  heroImage: string;
  tabs?: { id: string; label: string }[];
  content?: Record<string, { title: string; description: string }>;
  filterFields?: any[];
  badgeLabel?: string;
  items?: Record<string, any[]>;
  category?: string; // e.g., "Patents", "Trademarks", etc.
  titleClassName?: string;
}

const IPMediaSection = ({
  heroTitle,
  heroDescription,
  heroImage,
  tabs = [],
  content = {},
  filterFields = [],
  badgeLabel,
  items = {},
  category = 'Patents',
  titleClassName,
}: IPMediaSectionProps) => {
  const t = useTranslations('common.labels');
  const tFilters = useTranslations('common.filters');
  const tMedia = useTranslations('ipCategories.media');
  const tCategoryNames = useTranslations('ipCategories.names');
  const tMediaCenter = useTranslations('mediaCenter');
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || 'news');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    search: '',
    date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const logoSrc = '/images/saip-logo-mark-png.png';

  const activeTabItems = items[activeTab] || [];

  const normalizedFilterFields = useMemo(() => {
    const fields = [...filterFields];

    const hasSearch = fields.some((f: any) => f?.id === 'search' && f?.type === 'search');
    if (!hasSearch) {
      fields.unshift({ id: 'search', label: 'Search', type: 'search', placeholder: 'Search' });
    }

    const dateIndex = fields.findIndex((f: any) => f?.id === 'date' && f?.type === 'date');
    if (dateIndex === -1) {
      fields.push({
        id: 'date',
        label: 'Date',
        type: 'date',
        placeholder: 'Select date range',
        variant: 'range',
        restrictFutureDates: true,
      });
    } else {
      const existing = fields[dateIndex];
      fields[dateIndex] = {
        ...existing,
        variant: existing?.variant || 'range',
        restrictFutureDates: existing?.restrictFutureDates ?? true,
      };
    }

    return fields;
  }, [filterFields]);

  const translatedFilterFields = useMemo(() => {
    return normalizedFilterFields.map((field: any) => {
      const translatedField = { ...field };

      if (field.id === 'search') {
        translatedField.label = tFilters('search');
        translatedField.placeholder = tFilters('search');
      } else if (field.id === 'date') {
        translatedField.label = tFilters('date');
        translatedField.placeholder =
          field.variant === 'range' ? tFilters('selectDateRange') : tFilters('selectDate');
      }

      return translatedField;
    });
  }, [normalizedFilterFields, tFilters]);

  // Get translated category name
  const translatedCategory = tCategoryNames(category);

  // Translate tab labels
  const translatedTabs = tabs.map((tab) => ({
    ...tab,
    label: tMediaCenter(`tabs.${tab.id}`) || tab.label,
  }));

  // Use i18n texts if no custom content provided
  const getContentForTab = (tabId: string) => {
    if (content && content[tabId]) {
      return content[tabId];
    }
    // Fallback to i18n
    return {
      title: tMedia(`${tabId}.title`),
      description: tMedia(`${tabId}.description`, { category: translatedCategory }),
    };
  };

  const { title, description } = getContentForTab(activeTab);
  const filteredItems = useMemo(() => {
    let filtered = [...activeTabItems];

    const parseDate = (value?: string) => {
      if (!value) return null;
      const parsed = moment(value, [
        moment.ISO_8601,
        'DD.MM.YYYY',
        'D.M.YYYY',
        'DD/MM/YYYY',
        'D/M/YYYY',
        'YYYY-MM-DD',
      ]);
      return parsed.isValid() ? parsed.toDate() : null;
    };

    if (filters.search && typeof filters.search === 'string') {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          item.title?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.excerpt?.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (filters.date && typeof filters.date === 'string') {
      const [fromRaw, toRaw] = filters.date.split('|');
      const fromDate = parseDate(fromRaw);
      const toDate = parseDate(toRaw || fromRaw);

      if (fromDate && toDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        filtered = filtered.filter((item) => {
          const itemDate = parseDate(
            item.date || item.publicationDate || item.createdAt || item.created,
          );
          if (!itemDate) return false;
          return itemDate >= start && itemDate <= end;
        });
      }
    }

    return filtered;
  }, [activeTabItems, filters]);

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [fieldId]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', date: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleArticlesPoliciesClick = () => {
    router.push('/media-center/media-library/media-center/articles-policies');
  };

  const isArticlesTab = activeTab === 'articles';
  const articlesPoliciesLabel = tMediaCenter('articles.policies');

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const isVideosTab = activeTab === 'videos';
  const hasActiveFilters = Boolean(filters.search || filters.date);
  const featuredVideo = isVideosTab && !hasActiveFilters ? activeTabItems[0] : null;

  useEffect(() => {
    setFilters((prev) => ({ ...prev, date: '' }));
    setCurrentPage(1);
  }, [activeTab]);

  const finalHeroTitle = heroTitle || tMedia('heroTitle', { category: translatedCategory });
  const finalHeroDescription = heroDescription || tMedia('heroDescription');
  const finalBadgeLabel = badgeLabel || translatedCategory;

  return (
    <>
      <HeroStatic
        title={finalHeroTitle}
        description={finalHeroDescription}
        backgroundImage={heroImage}
        titleWeight="medium"
      />
      <Section>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start z-10 w-full lg:w-[302px] order-1 lg:order-1">
            <div className="bg-white rounded-2xl shadow-md overflow-x-auto lg:overflow-visible">
              <div className="lg:hidden flex border-b border-neutral-200">
                {translatedTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={twMerge(
                      'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'border-green-700 text-green-700'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900',
                    )}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="hidden lg:block">
                <TabVertical
                  tabs={translatedTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  ariaLabel="Media navigation"
                  className="rounded-2xl shadow-none"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 order-2 lg:order-2">
            {isArticlesTab && !isMobile ? (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Heading
                  size="custom"
                  as="h1"
                  weight="medium"
                  color="default"
                  className={twMerge(
                    'max-w-[954px] flex-1 min-w-0 text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px]',
                    titleClassName,
                  )}
                >
                  {title}
                </Heading>
                <Button
                  intent="outline"
                  onClick={handleArticlesPoliciesClick}
                  ariaLabel={articlesPoliciesLabel}
                  className="shrink-0"
                >
                  {articlesPoliciesLabel}
                </Button>
              </div>
            ) : (
              <Heading
                size="custom"
                as="h1"
                weight="medium"
                color="default"
                className={twMerge(
                  'mb-6 max-w-[954px] text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px]',
                  titleClassName,
                )}
              >
                {title}
              </Heading>
            )}
            <p className="mb-6 max-w-2xl text-[18px] leading-[28px] text-text-primary-paragraph">
              {description}
            </p>
            {isArticlesTab && isMobile && (
              <div className="mb-6 w-full">
                <Button
                  intent="outline"
                  onClick={handleArticlesPoliciesClick}
                  ariaLabel={articlesPoliciesLabel}
                  fullWidth
                >
                  {articlesPoliciesLabel}
                </Button>
              </div>
            )}
            <span className="mb-6 inline-block rounded-full border border-[#4D5761] px-[12px] py-[4px] text-sm font-normal text-[#1F2A37] font-medium !h-[32px]">
              {finalBadgeLabel}
            </span>
            <div className="w-full mb-6 lg:mb-8">
              {isMobile ? (
                <MobileFilters
                  fields={translatedFilterFields}
                  values={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  searchFieldId="search"
                />
              ) : (
                <Filters
                  fields={translatedFilterFields}
                  values={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  showHideFilters={false}
                  columns={Math.min(3, Math.max(1, translatedFilterFields.length)) as 1 | 2 | 3 | 4}
                  variant="media"
                />
              )}
            </div>
            <h2 className="text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] font-medium py-6 lg:py-12 tracking-[-0.72px]">
              {t('totalNumber')}: {filteredItems.length}
            </h2>
            {isVideosTab ? (
              hasActiveFilters ? (
                currentItems.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentItems.map((item: any) => (
                        <VideoCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          publishDate={item.date}
                          thumbnail={item.image}
                          categories={item.categories}
                          href={item.href}
                          logoSrc={logoSrc}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          siblingCount={1}
                          ariaLabel={tMediaCenter('videos.paginationAriaLabel')}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-neutral-400 italic text-sm sm:text-base">
                    {tFilters('noItemsFound')}
                  </div>
                )
              ) : (
                <div className="space-y-10">
                  {featuredVideo && (
                    <VideoCard
                      id={featuredVideo.id}
                      title={featuredVideo.title}
                      publishDate={featuredVideo.date}
                      thumbnail={featuredVideo.image}
                      categories={featuredVideo.categories}
                      href={featuredVideo.href}
                      logoSrc={logoSrc}
                      variant="featured"
                      className="max-w-[954px]"
                    />
                  )}
                  {activeTabItems.length > 0 && (
                    <VideoCarousel
                      heading={finalBadgeLabel}
                      videos={activeTabItems.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        publishDate: item.date,
                        thumbnail: item.image,
                        categories: item.categories,
                        href: item.href,
                        logoSrc,
                      }))}
                      emptyLabel={tFilters('noItemsFound')}
                      className="max-w-[954px]"
                    />
                  )}
                </div>
              )
            ) : currentItems.length > 0 ? (
              <>
                <div className="space-y-6">
                  {currentItems.map((item: any) => (
                    <NewsArticleCard
                      key={item.id}
                      title={item.title}
                      excerpt={item.excerpt}
                      date={item.date}
                      imageUrl={item.image}
                      href={item.href}
                      categories={
                        item.categories && item.categories.length > 0
                          ? item.categories
                          : [
                              {
                                id: item.type,
                                name:
                                  item.type === 'news'
                                    ? tMediaCenter('tabs.news')
                                    : item.type === 'article'
                                      ? tMediaCenter('tabs.articles')
                                      : tMediaCenter('tabs.videos'),
                              },
                            ]
                      }
                      className="border border-gray-200"
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      siblingCount={1}
                      ariaLabel={tMediaCenter('news.paginationAriaLabel')}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-neutral-400 italic text-sm sm:text-base">
                {tMedia('noDataYet')}
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default IPMediaSection;
