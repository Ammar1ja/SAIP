import { cva } from 'class-variance-authority';

const baseStyles = [
  'inline-flex',
  'items-center',
  'font-medium',
  'rounded-full',
  'px-2',
  'py-1',
  'leading-[18px]',
  'whitespace-nowrap',
  'transition-all',
  'duration-200',
  'motion-reduce:transition-none',
];

const variantStyles = {
  default: [
    'text-text-natural',
    'bg-neutral-light',
    'border',
    'border-neutral-secondary',
    'hover:bg-neutral-200',
  ],
  success: [
    'text-success-700',
    'bg-success-50',
    'border',
    'border-success-200',
    'hover:bg-success-100',
  ],
  warning: [
    'text-warning-700',
    'bg-warning-50',
    'border',
    'border-warning-200',
    'hover:bg-warning-100',
  ],
  error: ['text-error-700', 'bg-error-50', 'border', 'border-error-200', 'hover:bg-error-100'],
  disabled: [
    'text-neutral-500',
    'bg-neutral-100',
    'border',
    'border-neutral-200',
    'opacity-50',
    'cursor-not-allowed',
    'pointer-events-none',
  ],
};

const sizeStyles = {
  sm: ['text-xs', 'px-1.5', 'py-0.5'],
  md: ['text-sm', 'px-2', 'py-1'],
  lg: ['text-base', 'px-3', 'py-1.5'],
};

export const label = cva(baseStyles, {
  variants: {
    variant: variantStyles,
    size: sizeStyles,
    required: {
      true: 'after:content-["*"] after:ml-0.5 after:text-error-700',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    required: false,
  },
});
