import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { heading } from './Heading.styles';

/**
 * Heading HTML tag types
 */
export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';

/**
 * Heading level types
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Heading component props
 */
export interface HeadingProps extends VariantProps<typeof heading> {
  /** Heading content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML tag to render */
  as?: HeadingTag;
  /** ARIA heading level for non-semantic headings */
  ariaLevel?: HeadingLevel;
  /** Text color variant */
  color?: 'default' | 'muted' | 'white' | 'primary' | 'success' | 'warning' | 'error';
  /** Text weight variant */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** ARIA label for the heading */
  ariaLabel?: string;
  /** ARIA described by */
  ariaDescribedby?: string;
  /** ID of the heading */
  id?: string;
}
