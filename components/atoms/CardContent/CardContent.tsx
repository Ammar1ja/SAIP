import React, { forwardRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { CardContentProps } from './CardContent.types';
import {
  cardContent,
  cardTitle,
  cardDescription,
  projectGrid,
  projectHeader,
} from './CardContent.styles';

/**
 * CardContent component for displaying content in a card format with various styles and accessibility features
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      title,
      description,
      icon,
      variant = 'default',
      size = 'md',
      titleSize,
      className,
      titleClassName,
      descriptionClassName,
      iconClassName,
      onClick,
      interactive,
      headerContent,
      gridContent,
      children,
      ...props
    },
    ref,
  ) => {
    const isProject = variant === 'project';

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (interactive && onClick) {
          onClick(event);
        }
      },
      [interactive, onClick],
    );

    const styles = twMerge(cardContent({ variant }), className);

    const commonProps = {
      ref,
      className: styles,
      onClick: handleClick,
      'data-variant': variant,
      'data-size': size,
      'data-interactive': interactive,
      ...props,
    };

    return (
      <div {...commonProps}>
        {isProject ? (
          <>
            <div className={projectHeader()}>
              {icon && <div className={twMerge('mb-4', iconClassName)}>{icon}</div>}
              {title && (
                <h3 className={twMerge(cardTitle({ size: titleSize || size }), titleClassName)}>
                  {title}
                </h3>
              )}
              {description && (
                <p className={twMerge(cardDescription({ variant }), descriptionClassName)}>
                  {description}
                </p>
              )}
              {headerContent}
            </div>
            {gridContent && (
              <div className={projectGrid()}>
                {gridContent.map((item) => (
                  <div key={item.id} aria-label={item.ariaLabel}>
                    {item.content}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {icon && <div className={twMerge('mb-4', iconClassName)}>{icon}</div>}
            {title && (
              <h3 className={twMerge(cardTitle({ size: titleSize || size }), titleClassName)}>
                {title}
              </h3>
            )}
            {description && (
              <p className={twMerge(cardDescription({ variant }), descriptionClassName)}>
                {description}
              </p>
            )}
            {children}
          </>
        )}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';
