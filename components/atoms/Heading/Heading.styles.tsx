import { cva } from 'class-variance-authority';

const baseStyles = [
  'font-medium',
  /** Match Figma display styles (−2%), not a fixed px value */
  'tracking-[-0.02em]',
  'transition-colors',
  'duration-200',
  'motion-reduce:transition-none',
];

const sizeStyles = {
  custom: '',
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
  h6: 'text-sm md:text-base',
};

const colorStyles = {
  default: 'text-text-default',
  muted: 'text-text-muted',
  white: 'text-white',
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
};

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignStyles = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
};

export const heading = cva(baseStyles, {
  variants: {
    size: sizeStyles,
    color: colorStyles,
    weight: weightStyles,
    align: alignStyles,
  },
  defaultVariants: {
    size: 'h1',
    color: 'default',
    weight: 'semibold',
    align: 'left',
  },
});
