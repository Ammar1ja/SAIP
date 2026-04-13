import React, { FC } from 'react';
import Link from 'next/link';
import { SitemapListItems } from '@/components/molecules/SitemapList/SitemapList.types';
import { twMerge } from 'tailwind-merge';

interface SitemapListProps {
  items: SitemapListItems[];
  level?: number;
}

export const SitemapList: FC<SitemapListProps> = ({ items, level = 0 }) => {
  const isTopLevel = level === 0;

  return (
    <ul
      className={twMerge(
        'list-disc',
        isTopLevel
          ? 'space-y-8 ltr:pl-4 rtl:pr-4 marker:text-neutral-900'
          : 'mt-3 space-y-3 ltr:pl-5 rtl:pr-5 marker:text-success-800',
      )}
    >
      {items.map((item) => {
        const hasChildren = !!item.children?.length;

        const linkClass = twMerge(
          'transition-colors',
          isTopLevel
            ? 'font-body text-[16px] leading-6 font-medium tracking-normal text-text-default'
            : 'text-sm md:text-[15px] leading-6',
          item.href && !isTopLevel && 'text-success-800 hover:text-success-900 hover:underline',
          !item.href && !isTopLevel && 'text-neutral-700',
        );

        return (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ) : (
              <span className={linkClass}>{item.label}</span>
            )}
            {hasChildren && <SitemapList items={item.children!} level={level + 1} />}
          </li>
        );
      })}
    </ul>
  );
};

export default SitemapList;
