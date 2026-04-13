import { ReactNode } from 'react';

/**
 * LayoutWrapper variant types
 */
export type LayoutWrapperVariant = 'default' | 'narrow' | 'wide';

/**
 * LayoutWrapper component props
 */
export interface LayoutWrapperProps {
  /** Content of the layout wrapper */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Layout variant */
  variant?: LayoutWrapperVariant;
  /** HTML element to render as */
  as?: 'div' | 'section' | 'main' | 'article' | 'aside';
  /** ARIA role attribute */
  role?: string;
}
