import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LayoutWrapperProps } from './LayoutWrapper.types';
import { layoutWrapper } from './LayoutWrapper.styles';

/**
 * LayoutWrapper component
 */
export const LayoutWrapper = React.forwardRef<HTMLDivElement, LayoutWrapperProps>(
  ({ children, className, variant = 'default', as: Component = 'div', role }, ref) => {
    return (
      <Component ref={ref} className={twMerge(layoutWrapper({ variant }), className)} role={role}>
        {children}
      </Component>
    );
  },
);

LayoutWrapper.displayName = 'LayoutWrapper';
