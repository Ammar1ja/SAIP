export interface PaginationProps {
  /** Current active page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when page changes */
  onPageChange: (page: number) => void;
  /** Whether pagination is disabled */
  disabled?: boolean;
  /** Number of page numbers to show around current page */
  siblingCount?: number;
  /** Additional class names */
  className?: string;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Simple aria label for the pagination navigation */
  ariaLabel?: string;
  /** Custom aria labels */
  ariaLabels?: {
    pagination?: string;
    previousPage?: string;
    nextPage?: string;
    firstPage?: string;
    lastPage?: string;
    page?: string;
    currentPage?: string;
    ellipsis?: string;
  };
}

export type PaginationItemType = 'page' | 'ellipsis' | 'previous' | 'next' | 'first' | 'last';

export interface PaginationItem {
  type: PaginationItemType;
  page?: number;
  selected?: boolean;
  disabled?: boolean;
}
