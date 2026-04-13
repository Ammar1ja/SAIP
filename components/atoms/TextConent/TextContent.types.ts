import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { textContent } from './TextContent.styles';

/**
 * TextContent component props
 */
export interface TextContentProps extends VariantProps<typeof textContent> {
  /** Content of the text block */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Text size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Text color variant */
  color?: 'default' | 'muted' | 'white' | 'primary' | 'success' | 'warning' | 'error';
  /** Text weight variant */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** HTML element to render */
  as?: 'p' | 'span' | 'div' | 'strong' | 'em';
  /** Whether to render HTML content (use dangerouslySetInnerHTML) */
  allowHtml?: boolean;
  /** Skip TextContent preset typography (e.g. hero lead where classes set exact px sizes). */
  skipPresetStyles?: boolean;
  /** ARIA label for the text content */
  ariaLabel?: string;
  /** ARIA described by */
  ariaDescribedby?: string;
  /** Role of the text content */
  role?: string;
  /** ID of the text content */
  id?: string;
}
