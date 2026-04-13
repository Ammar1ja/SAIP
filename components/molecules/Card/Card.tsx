'use client';

import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CardProps } from './Card.types';
import { card } from './Card.styles';

/**
 * Card component that provides a flexible container with various visual styles
 * @param props - Card props including accessibility attributes
 * @returns Accessible Card component
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      shadow,
      border,
      children,
      role = 'region',
      ariaLabel,
      ariaLabelledby,
      interactive,
      onClick,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const isClickable = interactive || onClick;
    const interactiveClasses = isClickable
      ? 'cursor-pointer hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 active:scale-[0.99]'
      : '';

    const baseProps = {
      ref,
      className: twMerge(card({ variant, shadow, border }), interactiveClasses, className),
      role: isClickable ? 'button' : role,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      tabIndex: isClickable ? (tabIndex ?? 0) : undefined,
      onClick,
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if (onClick) {
            onClick(undefined as any);
          }
        }
        onKeyDown?.(e);
      },
      ...props,
    };

    return <div {...baseProps}>{children}</div>;
  },
);

Card.displayName = 'Card';
