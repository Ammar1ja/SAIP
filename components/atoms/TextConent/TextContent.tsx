import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TextContentProps } from './TextContent.types';
import { textContent } from './TextContent.styles';

/**
 * TextContent component for displaying text content with various styles and accessibility features
 */
export const TextContent = React.forwardRef<HTMLElement, TextContentProps>(
  (
    {
      children,
      className,
      size,
      color,
      weight,
      align,
      as = 'div',
      allowHtml = false,
      skipPresetStyles = false,
      ariaLabel,
      ariaDescribedby,
      role,
      id,
      ...props
    },
    ref,
  ) => {
    const Component = as;

    const alignClass = align ? `text-${align}` : '';

    const presetClass = skipPresetStyles ? '' : textContent({ size, color, weight });
    const mergedClass = twMerge(presetClass, alignClass, className);

    // If allowHtml is true and children is a string, use dangerouslySetInnerHTML
    if (allowHtml && typeof children === 'string') {
      return (
        <Component
          ref={ref as any}
          className={mergedClass}
          role={role}
          id={id}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          dangerouslySetInnerHTML={{ __html: children }}
          {...props}
        />
      );
    }

    return (
      <Component
        ref={ref as any}
        className={mergedClass}
        role={role}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

TextContent.displayName = 'TextContent';
