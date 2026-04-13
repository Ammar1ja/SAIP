import { twMerge } from 'tailwind-merge';
import { HeadingProps } from './Heading.types';
import { heading } from './Heading.styles';

/**
 * Heading component for displaying headings with various styles and accessibility features
 */
export function Heading({
  children,
  size,
  as = 'h1',
  className,
  ariaLevel,
  color,
  weight,
  align,
  ariaLabel,
  ariaDescribedby,
  id,
  ...props
}: HeadingProps) {
  const Component = as as React.ElementType;
  const isSemanticHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as);

  return (
    <Component
      className={twMerge(heading({ size, color, weight, align }), className)}
      {...(!isSemanticHeading && ariaLevel ? { role: 'heading', 'aria-level': ariaLevel } : {})}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      id={id}
      {...props}
    >
      {children}
    </Component>
  );
}
