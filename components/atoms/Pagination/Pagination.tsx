'use client';

import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { PaginationProps, PaginationItem } from './Pagination.types';
import { paginationContainer, paginationButton } from './Pagination.styles';

export const defaultAriaLabels = {
  pagination: 'Pagination navigation',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  firstPage: 'Go to first page',
  lastPage: 'Go to last page',
  page: 'Go to page',
  currentPage: 'Current page',
  ellipsis: 'More pages',
};

// Generate pagination items logic
const usePagination = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): PaginationItem[] => {
  return useMemo(() => {
    if (totalPages <= 0) return [];

    const items: PaginationItem[] = [];

    // Helper function to add page items
    const addPageItem = (page: number, selected: boolean = false) => {
      items.push({
        type: 'page',
        page,
        selected,
        disabled: false,
      });
    };

    // Helper function to add ellipsis
    const addEllipsis = () => {
      items.push({
        type: 'ellipsis',
        disabled: true,
      });
    };

    // Previous button
    items.push({
      type: 'previous',
      disabled: currentPage <= 1,
    });

    // Calculate the range of pages to show
    const totalNumbers = siblingCount * 2 + 3; // +3 for current page and two edges
    const totalBlocks = totalNumbers + 2; // +2 for ellipses

    if (totalPages <= totalBlocks) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        addPageItem(i, i === currentPage);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Always show first page
      addPageItem(1, currentPage === 1);

      // Left ellipsis
      if (shouldShowLeftEllipsis) {
        addEllipsis();
      }

      // Sibling pages
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          addPageItem(i, i === currentPage);
        }
      }

      // Right ellipsis
      if (shouldShowRightEllipsis) {
        addEllipsis();
      }

      // Always show last page
      if (totalPages > 1) {
        addPageItem(totalPages, currentPage === totalPages);
      }
    }

    // Next button
    items.push({
      type: 'next',
      disabled: currentPage >= totalPages,
    });

    return items;
  }, [currentPage, totalPages, siblingCount]);
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  siblingCount = 1,
  className,
  showFirstLast = false,
  ariaLabel,
  ariaLabels = {},
}) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const labels = { ...defaultAriaLabels, ...ariaLabels };
  const finalAriaLabel = ariaLabel || labels.pagination;

  const items = usePagination(currentPage, totalPages, siblingCount);

  // In RTL, we use ChevronRight for "previous" and ChevronLeft for "next"
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const handleKeyDown = (event: React.KeyboardEvent, page?: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (page !== undefined) {
        handlePageChange(page);
      }
    }
  };

  return (
    <nav
      role="navigation"
      aria-label={finalAriaLabel}
      className={twMerge(paginationContainer(), className)}
    >
      {/* First page button (optional) */}
      {showFirstLast && currentPage > 3 && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          disabled={disabled || currentPage === 1}
          aria-label={labels.firstPage}
          className={twMerge(paginationButton({ variant: 'navigation' }))}
        >
          <PrevIcon className="w-4 h-4" />
          <PrevIcon className={twMerge('w-4 h-4', isRTL ? 'mr-0 -ml-2' : '-ml-2')} />
        </button>
      )}

      {items.map((item, index) => {
        const key = `${item.type}-${item.page || index}`;

        if (item.type === 'ellipsis') {
          return (
            <span
              key={key}
              className={twMerge(paginationButton({ variant: 'ellipsis' }))}
              aria-label={labels.ellipsis}
              aria-hidden="true"
            >
              <MoreHorizontal className="size-3 shrink-0" />
            </span>
          );
        }

        if (item.type === 'previous') {
          return (
            <button
              key={key}
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
              disabled={disabled || item.disabled}
              aria-label={labels.previousPage}
              className={twMerge(paginationButton({ variant: 'navigation' }))}
            >
              <PrevIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          );
        }

        if (item.type === 'next') {
          return (
            <button
              key={key}
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
              disabled={disabled || item.disabled}
              aria-label={labels.nextPage}
              className={twMerge(paginationButton({ variant: 'navigation' }))}
            >
              <NextIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          );
        }

        // Page number button
        if (item.type === 'page' && item.page) {
          const isSelected = item.selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handlePageChange(item.page!)}
              onKeyDown={(e) => handleKeyDown(e, item.page)}
              disabled={disabled}
              aria-label={
                isSelected ? `${labels.currentPage} ${item.page}` : `${labels.page} ${item.page}`
              }
              aria-current={isSelected ? 'page' : undefined}
              className={twMerge(
                paginationButton({
                  variant: isSelected ? 'active' : 'default',
                }),
              )}
            >
              {item.page}
            </button>
          );
        }

        return null;
      })}

      {/* Last page button (optional) */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          onKeyDown={(e) => handleKeyDown(e, totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label={labels.lastPage}
          className={twMerge(paginationButton({ variant: 'navigation' }))}
        >
          <NextIcon className="w-4 h-4" />
          <NextIcon className={twMerge('w-4 h-4', isRTL ? 'mr-0 -ml-2' : '-ml-2')} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
