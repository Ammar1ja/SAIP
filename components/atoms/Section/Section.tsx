'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useDirection } from '@/context/DirectionContext';
import { section, container } from './Section.styles';
import { SectionProps } from './Section.types';

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'white',
  columns,
  align,
  itemsAlign,
  fullWidth = false,
  rtlAwareAlign,
  responsiveAlignDirection,
  constrain = false,
  overlap = false,
  padding = 'default',
  scrollableContent = false,
  outerClassName,
  className,
  as = 'section',
  role,
  ariaLabel,
  id,
  ...rest
}) => {
  const dir = useDirection() || 'ltr';

  const effectiveAlign =
    rtlAwareAlign === 'left'
      ? dir === 'rtl'
        ? 'right'
        : 'left'
      : rtlAwareAlign === 'right'
        ? dir === 'rtl'
          ? 'left'
          : 'right'
        : align;

  const responsiveClass = (() => {
    if (!responsiveAlignDirection) return '';
    const isRTL = dir === 'rtl';
    const direction =
      responsiveAlignDirection === 'left' ? (isRTL ? 'right' : 'left') : isRTL ? 'left' : 'right';
    return `responsive-align-${direction}`;
  })();

  const containerClass = twMerge(
    container({
      columns,
      itemsAlign,
      align: effectiveAlign,
      fullWidth,
      constrain,
      overlap,
      scrollableContent,
    }),
    responsiveClass,
    className,
  );

  const styles = twMerge(
    section({
      background,
      padding,
    }),
    outerClassName,
  );

  const commonProps = {
    className: styles,
    'data-background': background,
    'data-columns': columns,
    'data-align': align,
    'data-items-align': itemsAlign,
    'data-fullwidth': fullWidth,
    'data-constrain': constrain,
    'data-overlap': overlap,
    'data-padding': padding,
    'data-scrollable-content': scrollableContent,
    role,
    'aria-label': ariaLabel,
    id,
    ...rest,
  };

  const Component = as;

  return (
    <Component {...commonProps}>
      <div className={containerClass}>{children}</div>
    </Component>
  );
};

export default Section;
