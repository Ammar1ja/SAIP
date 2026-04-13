import { ReactNode } from 'react';

/**
 * DropdownBase component props
 */
export interface DropdownBaseProps {
  /** Content of the dropdown button */
  buttonContent: ReactNode;
  /** Content of the dropdown menu */
  children: ReactNode;
  /** Accessible label for the dropdown */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DropdownBase variant types
 */
export type DropdownBaseVariant = 'default' | 'compact';
