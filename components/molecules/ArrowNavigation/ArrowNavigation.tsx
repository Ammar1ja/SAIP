'use client';

import { ArrowNavigationProps } from './ArrowNavigation.types';
import Link from 'next/link';
import Arrow from '@/components/atoms/Arrow';

export const ArrowNavigation = ({
  currentIndex,
  totalItems,
  searchParams,
  intent = 'primary',
}: ArrowNavigationProps) => {
  const isPrevDisabled = currentIndex === 0 || totalItems <= 1;
  const isNextDisabled = currentIndex === totalItems - 1 || totalItems <= 1;

  const getHref = (index: number) => `?${searchParams}=${index}`;

  return (
    <nav className="flex items-center gap-4" role="navigation" aria-label="Pagination navigation">
      {isPrevDisabled ? (
        <span aria-disabled="true">
          <Arrow direction="left" background="disabled" />
        </span>
      ) : (
        <Link href={getHref(currentIndex - 1)} scroll={false} aria-label="Previous item">
          <Arrow direction="left" background={intent === 'primary' ? 'primary' : 'natural'} />
        </Link>
      )}

      {isNextDisabled ? (
        <span aria-disabled="true">
          <Arrow direction="right" background="disabled" />
        </span>
      ) : (
        <Link href={getHref(currentIndex + 1)} scroll={false} aria-label="Next item">
          <Arrow direction="right" background={intent === 'primary' ? 'primary' : 'natural'} />
        </Link>
      )}
    </nav>
  );
};
