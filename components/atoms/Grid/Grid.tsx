import React from 'react';
import { GridProps } from './Grid.types';
import { cn } from '@/lib/utils/cn';

const Grid = ({ gap = 'gap-6', cols = { base: 1 }, children, className }: GridProps) => {
  const getGridClasses = () => {
    const classes = [];

    // Base columns
    if (cols?.base) classes.push(`grid-cols-${cols.base}`);

    if (cols?.sm) classes.push(`sm:grid-cols-${cols.sm}`);

    // Md breakpoint (768px+)
    if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);

    // Lg breakpoint (1024px+)
    if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);

    if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);

    return classes.join(' ');
  };

  return <div className={cn('grid', gap, getGridClasses(), className)}>{children}</div>;
};

export default Grid;
