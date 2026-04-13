import React from 'react';
import { TableOfContentProps, TocItem } from './TableOfContent.types';
import { twMerge } from 'tailwind-merge';

function containsActiveItem(item: TocItem, activeId: string): boolean {
  if (item.id === activeId) return true;
  return item.subItems?.some((sub) => containsActiveItem(sub, activeId)) ?? false;
}

const renderItems = (
  items: TocItem[],
  activeId: string,
  onItemClick: (id: string) => void,
  level = 1,
) => (
  <ul
    className={twMerge(level === 1 ? 'ps-0' : 'ms-2 border-s border-neutral-200 ps-3')}
    aria-level={level}
  >
    {items.map((item) => {
      const isExactActive = activeId === item.id;
      const sectionContainsActive = containsActiveItem(item, activeId);
      const isExpanded =
        level === 1 ? Boolean(item.subItems?.length && sectionContainsActive) : true;

      const level1Highlighted = level === 1 && sectionContainsActive;

      return (
        <li key={item.id} className="relative">
          <button
            type="button"
            onClick={() => onItemClick(item.id)}
            className={twMerge(
              'relative block w-full text-start text-sm leading-5 transition-colors',
              'rounded-lg py-2 pe-2',
              level === 1 && 'ps-4',
              level === 1 &&
                (level1Highlighted
                  ? 'font-semibold text-primary-600'
                  : 'font-normal text-text-primary-paragraph'),
              level === 1 &&
                level1Highlighted &&
                'before:pointer-events-none before:absolute before:start-0 before:top-1/2 before:h-8 before:w-[0.1875rem] before:-translate-y-1/2 before:rounded-full before:bg-primary-600',
              level > 1 &&
                (isExactActive
                  ? 'my-0.5 bg-neutral-100 py-2 ps-3 text-sm font-semibold text-primary-600'
                  : 'ps-2 text-sm font-normal text-text-primary-paragraph'),
              level > 1 &&
                isExactActive &&
                'before:pointer-events-none before:absolute before:start-0 before:top-1/2 before:h-8 before:w-[0.1875rem] before:-translate-y-1/2 before:rounded-full before:bg-primary-600',
              'hover:cursor-pointer hover:bg-neutral-50',
              level > 1 && isExactActive && 'hover:bg-neutral-100',
            )}
            aria-current={isExactActive ? 'true' : undefined}
            aria-level={level}
            id={`toc-${item.id}`}
            aria-expanded={item.subItems?.length ? isExpanded : undefined}
          >
            {item.label}
          </button>
          {item.subItems && item.subItems.length > 0 && isExpanded && (
            <div className="mt-0.5">
              {renderItems(item.subItems, activeId, onItemClick, level + 1)}
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

export const TableOfContent = ({
  items,
  activeId,
  onItemClick,
  className,
  ariaLabel,
  name = 'Patents',
  onThisPageText = 'On this page',
  journeyText,
  variant = 'card',
  showHeader = true,
}: TableOfContentProps) => {
  const containerClassName =
    variant === 'sheet'
      ? 'w-full min-w-0 max-w-none bg-transparent p-0 text-sm leading-5 shadow-none rounded-none'
      : 'w-[302px] min-w-[302px] rounded-2xl bg-white p-6 shadow-card';

  return (
    <nav
      className={twMerge(containerClassName, className)}
      aria-label={ariaLabel || 'Table of content'}
    >
      {showHeader && (
        <>
          <div className="mb-2 text-sm font-medium leading-5 text-text-primary-paragraph">
            {onThisPageText}
          </div>
          <div className="text-display-sm mb-4 font-semibold text-text-default">
            {journeyText || `${name} journey`}
          </div>
        </>
      )}
      {renderItems(items, activeId, onItemClick)}
    </nav>
  );
};

export default TableOfContent;
