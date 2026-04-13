'use client';

import { useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';
import Spinner from '@/components/atoms/Spinner';
import { FilterableCardsSectionProps, FilterableItem } from './FilterableCardsSection.types';
import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import Pagination from '@/components/atoms/Pagination';
import { useTranslations } from 'next-intl';

// Default filter function for ServiceCard-like items
const defaultFilterFunction = <T extends FilterableItem>(
  items: T[],
  filterValues: Record<string, string | string[]>,
): T[] => {
  return items.filter((item) => {
    // Search functionality
    const search = typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
    const matchesSearch =
      !search ||
      (item.title && item.title.toLowerCase().includes(search)) ||
      (item.description && item.description.toLowerCase().includes(search));

    // Other filters
    const otherFiltersMatch = Object.entries(filterValues).every(([key, value]) => {
      if (key === 'search' || !value) return true;

      if (Array.isArray(value)) {
        if (value.length === 0) return true;

        // Skip filtering if "all" is selected
        if (value.includes('all')) return true;

        // For serviceType: check item.serviceType (e.g., "Guidance", "Protection")
        if (key === 'serviceType') {
          const itemServiceType = String(item.serviceType || '').toLowerCase();
          return value.some((v) => v.toLowerCase() === itemServiceType);
        }

        // For category: check both item.category (IP Categories like Patents, Trademarks)
        // and item.serviceCategory (Service Categories like IP Clinics, IP Licensing)
        if (key === 'category') {
          const itemCategory = String(item.category || '').toLowerCase();
          const itemServiceCategory = String((item as any).serviceCategory || '').toLowerCase();
          return value.some(
            (v) => v.toLowerCase() === itemCategory || v.toLowerCase() === itemServiceCategory,
          );
        }

        // For targetGroup: check item.targetGroup
        if (key === 'targetGroup') {
          const itemTargetGroup = String(item.targetGroup || '').toLowerCase();
          return value.some((v) => v.toLowerCase() === itemTargetGroup);
        }

        // For other array filters, check exact match with item properties
        return value.includes(String(item[key] || ''));
      }

      // For single values, check exact match (skip if value is "all")
      if (value === 'all') return true;
      return String(item[key] || '') === value;
    });

    return matchesSearch && otherFiltersMatch;
  });
};

// Generate grid class based on columns configuration
const generateGridClass = (gridColumns?: FilterableCardsSectionProps['gridColumns']) => {
  if (!gridColumns) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const classes = [];
  if (gridColumns.base) classes.push(`grid-cols-${gridColumns.base}`);
  if (gridColumns.sm) classes.push(`sm:grid-cols-${gridColumns.sm}`);
  if (gridColumns.md) classes.push(`md:grid-cols-${gridColumns.md}`);
  if (gridColumns.lg) classes.push(`lg:grid-cols-${gridColumns.lg}`);
  if (gridColumns.xl) classes.push(`xl:grid-cols-${gridColumns.xl}`);

  return classes.length > 0 ? classes.join(' ') : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
};

const FilterableCardsSection = <T extends FilterableItem = ServiceCardProps & FilterableItem>({
  title,
  titleInFiltersSection = false,
  titleClassName,
  items,
  filterFields,
  initialFilters = {},
  filterFunction = defaultFilterFunction,
  filterColumns,
  gridColumns,
  gridGap = 'gap-8',
  cardsLayout = 'grid',
  cardRenderer,
  showTotalCount = true,
  totalCountLabel,
  filtersInSeparateSection = false,
  filtersBackground = 'white',
  cardsBackground = 'white',
  filtersVariant,
  filtersComponentStyles,
  sectionClassName,
  filtersContainerClassName,
  containerClassName = 'max-w-7xl mx-auto',
  cardsContainerClassName,
  pagination,
  headerActions,
  isLoading = false,
  emptyStateContent,
  emptyStateText = 'No items found matching your filters.',
  filtersStyles,
  totalCountClassName,
}: FilterableCardsSectionProps<T>) => {
  const tFilters = useTranslations('common.filters');
  const [filterValues, setFilterValues] =
    useState<Record<string, string | string[]>>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Require cardRenderer to be provided
  if (!cardRenderer) {
    throw new Error('FilterableCardsSection requires a cardRenderer prop');
  }

  // Use translation if totalCountLabel is not provided
  const finalTotalCountLabel = totalCountLabel || tFilters('totalNumber');

  // Apply filters
  const filteredItems = useMemo(() => {
    return filterFunction(items, filterValues);
  }, [items, filterValues, filterFunction]);

  // Apply pagination
  const paginatedItems = useMemo(() => {
    if (!pagination?.enabled) return filteredItems;

    const startIndex = (currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, pagination?.enabled, pagination?.pageSize]);

  const totalPages = pagination?.enabled
    ? Math.ceil(filteredItems.length / pagination.pageSize)
    : 1;

  // Find search field ID
  const searchFieldId = filterFields.find((f) => f.type === 'search')?.id || 'search';

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    if (fieldId === searchFieldId && typeof value === 'string') {
      // Allow letters (any script incl. Arabic), numbers, spaces, hyphens,
      // parentheses, dots, commas, and common Arabic diacritics/marks.
      // Strip only control chars and dangerous characters (<, >, etc.)
      const sanitized = value.replace(/[<>{}\\]/g, '');
      setFilterValues((prev) => ({ ...prev, [fieldId]: sanitized }));
      setCurrentPage(1);
      return;
    }

    setFilterValues((prev) => ({ ...prev, [fieldId]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setCurrentPage(1);
  };

  const gridClass = generateGridClass(gridColumns);
  const layoutClass =
    cardsLayout === 'flex'
      ? twMerge('flex flex-wrap', gridGap, cardsContainerClassName)
      : twMerge('grid', gridClass, gridGap, cardsContainerClassName);
  const itemsToDisplay = pagination?.enabled ? paginatedItems : filteredItems;
  const isMobile = useIsMobile();

  const shouldRenderTitleInFilters = filtersInSeparateSection && titleInFiltersSection;

  const resolvedTitleClassName = titleClassName || 'text-5xl font-medium';

  const FiltersComponent = (
    <div
      className={twMerge(
        'relative z-10 w-full',
        filtersContainerClassName || 'max-w-7xl mx-auto',
        'pt-4 md:pt-20',
        filtersInSeparateSection ? 'pb-0' : 'pb-0 mb-12',
        filtersComponentStyles,
      )}
    >
      {shouldRenderTitleInFilters && title && (
        <div className="mb-8">
          <h1 className={twMerge(resolvedTitleClassName)}>{title}</h1>
        </div>
      )}
      {isMobile ? (
        <MobileFilters
          fields={filterFields}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          searchFieldId={searchFieldId}
        />
      ) : (
        <Filters
          fields={filterFields}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          columns={filterColumns}
          showHideFilters={false}
          variant={filtersVariant}
          className={filtersStyles}
        />
      )}
    </div>
  );

  const ContentComponent = (
    <div className={containerClassName}>
      {title && !shouldRenderTitleInFilters && (
        <div className="flex items-center justify-between mb-8">
          <h1 className={twMerge(resolvedTitleClassName)}>{title}</h1>
          {headerActions}
        </div>
      )}

      {!filtersInSeparateSection && FiltersComponent}

      {showTotalCount && (
        <h2
          className={twMerge(
            'text-3xl sm:text-4xl md:text-display-lg font-medium text-text-default mb-12',
            filtersInSeparateSection ? 'mt-12' : 'mt-0',
            totalCountClassName,
          )}
        >
          {finalTotalCountLabel}: {filteredItems.length}
        </h2>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={40} />
        </div>
      ) : itemsToDisplay.length > 0 ? (
        <div className={layoutClass}>
          {itemsToDisplay.map((item, index) => cardRenderer(item, index))}
        </div>
      ) : (
        emptyStateContent || (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-lg">{emptyStateText}</p>
          </div>
        )
      )}

      {pagination?.enabled && totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            siblingCount={1}
            showFirstLast={true}
            ariaLabels={{
              pagination: 'Results pagination',
              previousPage: 'Previous page',
              nextPage: 'Next page',
            }}
          />
        </div>
      )}
    </div>
  );

  if (filtersInSeparateSection) {
    return (
      <>
        <Section
          background={filtersBackground}
          padding="medium"
          constrain={false}
          className={sectionClassName}
          outerClassName="!pb-0"
        >
          {FiltersComponent}
        </Section>
        <Section
          background={cardsBackground}
          padding="medium"
          constrain={false}
          className={sectionClassName}
          outerClassName="!pt-0"
        >
          {ContentComponent}
        </Section>
      </>
    );
  }

  return (
    <Section
      background={cardsBackground}
      padding="medium"
      constrain={false}
      className={sectionClassName}
    >
      {ContentComponent}
    </Section>
  );
};

export default FilterableCardsSection;
