'use client';

import React, { forwardRef } from 'react';
import { Link } from '@/i18n/navigation';
import { ButtonProps } from './Button.types';
import { button } from './Button.styles';
import { twMerge } from 'tailwind-merge';
import Spinner from '@/components/atoms/Spinner';

/**
 * Button component that can be rendered as either a button or a link
 * @param props - Button props including accessibility attributes
 * @returns Button component with proper accessibility support
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      intent = 'primary',
      size = 'md',
      outline = false,
      underline = false,
      fullWidth = false,
      disabled = false,
      loading = false,
      href,
      download,
      target,
      className,
      children,
      ariaLabel,
      ariaExpanded,
      ariaControls,
      ariaPressed,
      ariaDescribedby,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const styles = twMerge(
      button({
        intent,
        size,
        outline,
        underline,
        fullWidth,
        disabled,
        loading,
      }),
      className,
    );

    // Auto-detect download from URL parameter
    const shouldDownload = download || (href && href.includes('?download=1'));

    // Handle downloads - let browser handle it naturally
    // The proxy API route already sets Content-Disposition headers
    const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call original onClick if provided
      onClick?.(e);
    };

    const commonProps = {
      className: styles,
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      'aria-pressed': ariaPressed,
      'aria-describedby': ariaDescribedby,
      'data-intent': intent,
      'data-size': size,
      'data-fullwidth': fullWidth,
      ...rest,
    };

    // Use native <a> for:
    // 1. Downloads (Next.js Link doesn't support download attribute)
    // 2. External links with target (Next.js Link doesn't support target attribute)
    // 3. API routes (e.g., /api/proxy-file) - prevent SPA navigation
    const isApiRoute = href?.startsWith('/api/');
    const shouldUseNativeAnchor = shouldDownload || target || isApiRoute;

    if (href && shouldUseNativeAnchor && !disabled) {
      return (
        <a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          download={shouldDownload ? (typeof download === 'string' ? download : '') : undefined}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={shouldDownload ? handleDownloadClick : onClick}
          {...commonProps}
        >
          {loading && <Spinner size={48} />}
          {children}
        </a>
      );
    }

    if (href && !disabled) {
      const linkProps = commonProps as Omit<React.ComponentProps<typeof Link>, 'href'>;
      return (
        <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...linkProps}>
          {loading && <Spinner size={48} />}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        aria-disabled={disabled}
        onClick={onClick}
        {...commonProps}
      >
        {loading && <Spinner size={48} />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
