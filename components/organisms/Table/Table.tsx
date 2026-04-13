'use client';

import React from 'react';
import Pagination from '@/components/atoms/Pagination';
import { useDirection } from '@/context/DirectionContext';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  renderCell?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  /** `grid`: full cell borders (default). `horizontal`: horizontal row rules; vertical center rule only on the header row (IP Services / Figma). */
  rules?: 'grid' | 'horizontal';
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className = '',
  rules = 'grid',
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}: TableProps<T>) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = data.slice(startIndex, endIndex);

  const getAlignClass = (align?: TableColumn<T>['align']) => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return isRtl ? 'text-left' : 'text-right';
    if (align === 'left') return isRtl ? 'text-right' : 'text-left';
    return isRtl ? 'text-right' : 'text-left';
  };

  const isHorizontal = rules === 'horizontal';

  return (
    <div>
      <table
        className={cn(
          'w-full border-separate',
          isHorizontal ? 'table-fixed border-spacing-0' : 'table-auto border-spacing-y-1',
          className,
        )}
        dir={dir}
      >
        <thead>
          <tr className={cn(isHorizontal ? 'bg-neutral-50' : 'bg-gray-100 text-sm text-gray-700')}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  getAlignClass(column.align),
                  column.width,
                  isHorizontal
                    ? cn(
                        'h-12 min-h-[48px] box-border border-b border-neutral-200 px-4 py-0 text-sm font-medium text-neutral-600 align-middle',
                        index < columns.length - 1 && 'border-e border-neutral-200',
                      )
                    : 'px-4 py-2 font-medium border border-gray-200 text-sm text-gray-700',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pageData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'transition-colors',
                isHorizontal
                  ? 'bg-white hover:bg-neutral-50/90'
                  : `${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#f3f4f6] hover:mix-blend-multiply`,
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn(
                    getAlignClass(column.align),
                    column.width,
                    isHorizontal
                      ? 'border-b border-neutral-200 px-4 py-4 text-neutral-900 align-middle'
                      : 'px-4 py-2 border border-gray-200',
                  )}
                >
                  {column.renderCell
                    ? column.renderCell(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {onPageChange && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default Table;
