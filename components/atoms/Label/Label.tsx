import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LabelProps } from './Label.types';
import { label } from './Label.styles';

/**
 * Label component that provides accessible form labels with various visual styles
 * and states. Can be used both as a form label and as a status indicator.
 */
const Label: React.FC<LabelProps> = ({
  children,
  variant = 'default',
  size = 'md',
  required = false,
  htmlFor,
  className,
  role,
  ariaLabel,
  ariaDescribedby,
  ...rest
}) => {
  const styles = twMerge(label({ variant, size, required }), className);

  const Component = htmlFor ? 'label' : 'span';

  const commonProps = {
    className: styles,
    htmlFor: htmlFor,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-required': htmlFor && required ? true : undefined,
    role: htmlFor ? undefined : role,
    'data-variant': variant,
    'data-size': size,
    'data-required': required,
    ...rest,
  };

  return (
    <Component {...commonProps}>
      {children}
      {required && <span className="sr-only">(Required)</span>}
    </Component>
  );
};

export default Label;
