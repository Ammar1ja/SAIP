import { cva } from 'class-variance-authority';

const baseStyles = [
  'leading-relaxed',
  'space-y-3',
  'transition-colors',
  'duration-200',
  'motion-reduce:transition-none',
];

const sizeStyles = {
  sm: ['text-sm', 'leading-[22px]'],
  md: ['text-[18px]', 'leading-[28px]'],
  lg: ['text-xl', 'leading-[32px]'],
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

export const textContent = cva(baseStyles, {
  variants: {
    size: sizeStyles,
    color: colorStyles,
    weight: weightStyles,
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    weight: 'normal',
  },
});
