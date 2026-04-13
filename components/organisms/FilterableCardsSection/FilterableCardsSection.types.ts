import { FilterField } from '@/components/molecules/Filters/Filters.types';

// Base type for filterable items
export type FilterableItem = {
  title?: string;
  description?: string;
  labels?: string[];
  [key: string]: unknown;
};

export interface FilterableCardsSectionProps<T extends FilterableItem = FilterableItem> {
  /** Page title */
  title?: string;
  /** Render title in filters section when separated */
  titleInFiltersSection?: boolean;
  /** Custom title class */
  titleClassName?: string;
  /** Items to display and filter */
  items: T[];
  /** Filter configuration */
  filterFields: FilterField[];
  /** Custom card renderer - required */
  cardRenderer: (item: T, index: number) => React.ReactNode;
  /** Initial filter values */
  initialFilters?: Record<string, string | string[]>;
  /** Custom filter function */
  filterFunction?: (items: T[], filterValues: Record<string, string | string[]>) => T[];
  /** Number of filter columns (1-4) */
  filterColumns?: 1 | 2 | 3 | 4;
  /** Number of grid columns */
  gridColumns?: {
    base?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
    xl?: 1 | 2 | 3 | 4;
  };
  /** Grid gap */
  gridGap?: string;
  /** Cards layout mode */
  cardsLayout?: 'grid' | 'flex';
  /** Show total count */
  showTotalCount?: boolean;
  /** Total count label */
  totalCountLabel?: string;
  /** Show filters in separate section */
  filtersInSeparateSection?: boolean;
  /** Background for filters section */
  filtersBackground?: 'white' | 'neutral' | 'primary-25' | 'primary-50';
  /** Background for cards section */
  cardsBackground?: 'white' | 'neutral' | 'primary-25' | 'primary-50';
  /** Filters visual variant */
  filtersVariant?: import('@/components/molecules/Filters/Filters.types').FiltersProps['variant'];
  /** Custom container class */
  containerClassName?: string;
  /** Custom cards container class */
  cardsContainerClassName?: string;
  /** Custom section container class */
  filtersComponentStyles?: string;
  /** Optional className merged into Section inner container (both filters and cards sections). */
  sectionClassName?: string;
  /** Custom filters wrapper class */
  filtersContainerClassName?: string;
  /** Custom filters component class */
  filtersStyles?: string;
  /** Custom total count class */
  totalCountClassName?: string;
  /** Pagination settings */
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  /** Additional actions or content */
  headerActions?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state content */
  emptyStateContent?: React.ReactNode;
  /** Empty state text (when no custom content) */
  emptyStateText?: string;
}
