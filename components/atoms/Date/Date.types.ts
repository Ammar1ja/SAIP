/**
 * Date format types
 */
export type DateFormat = 'short' | 'long' | 'relative';

/**
 * Date variant types
 */
export type DateVariant = 'default' | 'muted' | 'white';

/**
 * Date size types
 */
export type DateSize = 'sm' | 'md' | 'lg';

/**
 * Date component props
 */
export interface DateProps {
  /** Date to format (string in ISO format or Date object) */
  date: string | Date;
  /** Date format style */
  format?: DateFormat;
  /** Date color variant */
  variant?: DateVariant;
  /** Date size */
  size?: DateSize;
  /** Additional CSS classes */
  className?: string;
}
