'use client';

import { BreadcrumbsProps } from './Breadcrumbs.types';
import { ChevronIcon } from '@/components/icons';
import { twMerge } from 'tailwind-merge';
import React, { useEffect, useRef, useState } from 'react';
import { useDirection } from '@/context/DirectionContext';
import { useIsMobile } from '@/hooks/useIsMobile';

const variantClasses = {
  default: 'text-[#384250]',
  hero: 'text-white',
  subpage: 'text-[#384250]',
  services: 'text-[#1B8354]',
};

const currentItemClasses = {
  default: 'text-neutral-400 underline',
  hero: 'text-white/50 underline',
  subpage: 'text-neutral-400 underline',
  services: 'text-[#1B8354] underline',
};

const nonLinkItemClasses = {
  default: 'text-[#384250]',
  hero: 'text-white',
  subpage: 'text-[#384250]',
  services: 'text-[#1B8354]',
};

export function Breadcrumbs({ items, className = '', variant = 'default' }: BreadcrumbsProps) {
  const dir = useDirection();
  const isRtl = dir === 'rtl';
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const fullListRef = useRef<HTMLOListElement>(null);
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    if (!isMobile || items.length <= 2) {
      setShouldTruncate(false);
      return;
    }

    const checkOverflow = () => {
      if (containerRef.current && fullListRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const listWidth = fullListRef.current.scrollWidth;
        setShouldTruncate(listWidth > containerWidth + 5);
      }
    };

    const timeoutId = setTimeout(checkOverflow, 0);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [isMobile, items]);

  const displayItems =
    isMobile && items.length > 2
      ? [items[0], { label: '...' }, items[items.length - 1]]
      : !isMobile && shouldTruncate && items.length > 2
        ? [items[0], items[items.length - 1]]
        : items;

  const renderBreadcrumbItem = (item: (typeof items)[0], index: number, isLast: boolean) => {
    const itemTextClass = isMobile
      ? 'text-sm leading-5'
      : variant === 'services'
        ? 'text-sm'
        : 'text-[clamp(10px,1.5vw,14px)]';
    if (item.label === '...') {
      return (
        <li key={`ellipsis-${index}`}>
          {index > 0 && (
            <span className={twMerge('inline-flex items-center', isRtl ? 'ml-2' : 'mr-2')}>
              <ChevronIcon
                className={twMerge(
                  'transition-transform text-gray-400',
                  isMobile ? 'w-4 h-4' : 'w-3 h-3',
                  isRtl ? 'rotate-90' : 'rotate-270',
                )}
                aria-hidden="true"
              />
            </span>
          )}
          <span className={`whitespace-nowrap ${itemTextClass} ${currentItemClasses[variant]}`}>
            ...
          </span>
        </li>
      );
    }
    return (
      <li key={`${item.label}-${index}`}>
        {index > 0 && (
          <span className={twMerge('inline-flex items-center', isRtl ? 'ml-2' : 'mr-2')}>
            <ChevronIcon
              className={twMerge(
                'transition-transform text-gray-400',
                isMobile ? 'w-4 h-4' : 'w-3 h-3',
                isRtl ? 'rotate-90' : 'rotate-270',
              )}
              aria-hidden="true"
            />
          </span>
        )}
        {item.href && !isLast ? (
          <a
            href={item.href}
            className={twMerge(
              `whitespace-nowrap ${itemTextClass}`,
              variant === 'subpage'
                ? 'hover:text-gray-700'
                : variant === 'services'
                  ? 'hover:text-[#384250]'
                  : 'hover:text-primary',
            )}
          >
            {item.label}
          </a>
        ) : isLast ? (
          <span className={`whitespace-nowrap ${itemTextClass} ${currentItemClasses[variant]}`}>
            {item.label}
          </span>
        ) : !item.href ? (
          <span
            className={twMerge(`whitespace-nowrap ${itemTextClass}`, nonLinkItemClasses[variant])}
          >
            {item.label}
          </span>
        ) : (
          <span className={twMerge(`whitespace-nowrap ${itemTextClass}`, variantClasses[variant])}>
            {item.label}
          </span>
        )}
      </li>
    );
  };

  return (
    <nav ref={containerRef} className={twMerge('block', className)} dir={isRtl ? 'rtl' : 'ltr'}>
      {isMobile && items.length > 2 && (
        <ol
          ref={fullListRef}
          className={`flex items-center gap-1 text-sm ${variantClasses[variant]}`}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            width: 'max-content',
            top: '-9999px',
            left: '-9999px',
          }}
        >
          {items.map((item, index) =>
            renderBreadcrumbItem(item, index, index === items.length - 1),
          )}
        </ol>
      )}
      <ol
        className={twMerge(
          `flex items-center text-sm ${variantClasses[variant]}`,
          isMobile ? 'gap-1 flex-nowrap overflow-x-auto scrollbar-hide' : 'gap-2',
        )}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;

          if (
            !isMobile &&
            shouldTruncate &&
            items.length > 2 &&
            isFirst &&
            displayItems.length === 2
          ) {
            return (
              <React.Fragment key={`breadcrumb-${index}`}>
                {renderBreadcrumbItem(item, index, false)}
                <li key="ellipsis" className="flex items-center">
                  <span className={twMerge('inline-flex items-center', isRtl ? 'ml-2' : 'mr-2')}>
                    <ChevronIcon
                      className={twMerge(
                        'transition-transform text-gray-400',
                        isMobile ? 'w-4 h-4' : 'w-3 h-3',
                        isRtl ? 'rotate-90' : 'rotate-270',
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <span className={`text-[clamp(10px,1.5vw,14px)] ${currentItemClasses[variant]}`}>
                    ...
                  </span>
                </li>
              </React.Fragment>
            );
          }

          return renderBreadcrumbItem(item, index, isLast);
        })}
      </ol>
    </nav>
  );
}
