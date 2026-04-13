import { ElementType, ReactNode } from 'react';

/**
 * Label variant types
 */
export type LabelVariant = 'default' | 'success' | 'warning' | 'error' | 'disabled';

/**
 * Label size types
 */
export type LabelSize = 'sm' | 'md' | 'lg';

/**
 * Label component props
 */
export interface LabelProps {
  /** Label content */
  children: ReactNode;
  /** Label variant */
  variant?: LabelVariant;
  /** Label size */
  size?: LabelSize;
  /** Whether the label is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** ID of the form control this label is bound to */
  htmlFor?: string;
  /** Component to render as */
  as?: 'label' | 'span';
  /** ID for referencing the label */
  id?: string;
  /** ARIA role when used as a status indicator */
  role?: string;
  /** ARIA label override */
  ariaLabel?: string;
  /** ID of element that describes this label */
  ariaDescribedby?: string;
  /** Additional props */
  [key: string]: any;
}
