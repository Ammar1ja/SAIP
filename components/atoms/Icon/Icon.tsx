'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { IconProps, StaticIconProps } from './Icon.types';
import { iconContainer, icon } from './Icon.styles';
import { InlineSvgIcon } from '@/components/atoms/ButtonIcon';
import { getProxyUrl } from '@/lib/drupal/utils';

/**
 * Static Icon component for server-side rendering
 * Use this version when the icon is purely presentational
 */
export function StaticIcon({
  src,
  component: IconComponent,
  alt,
  background = 'none',
  size = 'medium',
  svgSize,
  className,
  ariaHidden = true,
  ...props
}: StaticIconProps) {
  const innerSvgSize = svgSize || size;
  const resolvedSrc = src ? getProxyUrl(src, 'view') : undefined;

  return (
    <div
      className={twMerge(iconContainer({ background, size }), className)}
      role="img"
      aria-label={alt}
      aria-hidden={ariaHidden}
      data-size={size}
      data-background={background}
      {...props}
    >
      {IconComponent ? (
        <IconComponent
          className={icon({ size: innerSvgSize })}
          aria-hidden="true"
          focusable="false"
        />
      ) : resolvedSrc ? (
        // Check if src is SVG or regular image
        resolvedSrc.endsWith('.svg') || resolvedSrc.startsWith('<svg') ? (
          <InlineSvgIcon
            src={resolvedSrc}
            alt=""
            className={icon({ size: innerSvgSize })}
            ariaHidden
            role="presentation"
          />
        ) : (
          <img
            src={resolvedSrc}
            alt={alt || ''}
            className={icon({ size: innerSvgSize })}
            aria-hidden="true"
            role="presentation"
          />
        )
      ) : null}
    </div>
  );
}

/**
 * Interactive Icon component that supports click events and keyboard navigation
 * Use this version when the icon needs to be clickable or interactive
 */
export const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      src,
      component: IconComponent,
      alt,
      background = 'none',
      size = 'medium',
      svgSize,
      className,
      onClick,
      interactive,
      role,
      ariaLabel,
      ariaHidden,
      ariaPressed,
      ariaExpanded,
      ariaControls,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const isClickable = interactive || onClick;
    const interactiveClasses = isClickable
      ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500'
      : '';
    const innerSvgSize = svgSize || size;

    const resolvedSrc = src ? getProxyUrl(src, 'view') : undefined;

    const containerProps = {
      ref,
      className: twMerge(iconContainer({ background, size }), interactiveClasses, className),
      role: role || (isClickable ? 'button' : 'img'),
      'aria-label': ariaLabel || alt,
      'aria-hidden': ariaHidden,
      'aria-pressed': ariaPressed,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      'data-size': size,
      'data-background': background,
      tabIndex: isClickable ? (tabIndex ?? 0) : undefined,
      onClick,
      onKeyDown: isClickable
        ? (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.(e as any);
            }
          }
        : undefined,
      ...props,
    };

    return (
      <div {...containerProps}>
        {IconComponent ? (
          <IconComponent
            className={icon({ size: innerSvgSize })}
            aria-hidden="true"
            focusable="false"
          />
        ) : resolvedSrc ? (
          // Check if src is SVG or regular image
          resolvedSrc.endsWith('.svg') || resolvedSrc.startsWith('<svg') ? (
            <InlineSvgIcon
              src={resolvedSrc}
              alt=""
              className={icon({ size: innerSvgSize })}
              ariaHidden
              role="presentation"
            />
          ) : (
            <img
              src={resolvedSrc}
              alt={alt || ''}
              className={icon({ size: innerSvgSize })}
              aria-hidden="true"
              role="presentation"
            />
          )
        ) : null}
      </div>
    );
  },
);

Icon.displayName = 'Icon';
