import { cva } from 'class-variance-authority';

const baseStyles = [
  'flex',
  'items-center',
  'justify-center',
  'rounded-sm',
  'transition-colors',
  'cursor-pointer',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-offset-2',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'motion-reduce:transition-none',
  'border',
];

const intentStyles = {
  primary: [
    'bg-button-background-primary-default',
    'text-white',
    'hover:bg-button-background-primary-hover',
    'focus-visible:ring-button-background-primary-hover',
    'active:bg-button-background-primary-hover/90',
    'border-transparent',
  ],
  secondary: [
    'bg-button-background-natural-default',
    'text-text-default',
    'hover:bg-button-background-natural-hover',
    'focus-visible:ring-button-background-natural-hover',
    'active:bg-button-background-natural-hover/90',
    'border-border-natural-primary',
  ],
  neutral: [
    'bg-[#0D121C]',
    'text-white',
    'hover:bg-gray-800',
    'focus-visible:ring-text-default',
    'active:bg-gray-600',
    'border-transparent',
  ],
  transparent: [
    'bg-transparent',
    'hover:text-primary-700',
    'focus-visible:ring-text-default',
    'active:text-primary-900',
    'border-transparent',
  ],
  outline: [],
};

const sizeStyles = {
  sm: ['h-8', 'px-3', 'text-sm', 'gap-1.5'],
  md: ['h-10', 'px-4', 'text-base', 'gap-2'],
  lg: ['h-12', 'px-6', 'text-lg', 'gap-2.5'],
  /** 40px fixed, radius-sm; padding/gap/icon tuned to Figma hug ~226×40 (not px-6+gap-2.5+20px icon → ~245px) */
  mdWide: [
    'h-10',
    'min-h-10',
    'max-h-10',
    'px-[18px]',
    'py-0',
    'text-base',
    'font-normal',
    'leading-none',
    'gap-2',
  ],
};

export const button = cva(baseStyles, {
  variants: {
    intent: intentStyles,
    size: sizeStyles,
    outline: {
      true: '',
      false: '',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
    underline: {
      true: 'hover:underline',
      false: '',
    },
    disabled: {
      true: ['opacity-50', 'cursor-not-allowed'],
      false: [],
    },
    loading: {
      true: ['cursor-wait'],
      false: [],
    },
  },
  compoundVariants: [
    {
      outline: true,
      className: [
        'bg-transparent',
        'text-text-default',
        'border-gray-300',
        'hover:bg-gray-50',
        'focus-visible:ring-gray-300',
      ],
    },

    {
      outline: true,
      intent: 'secondary',
      className: [
        'bg-transparent',
        'border-1',
        'focus-visible:border-transparent',
        'border-border-natural-primary',
        'hover:border-border-natural-secondary',
        'hover:bg-button-background-natural-default',
        'focus-visible:ring-text-default',
        'active:bg-button-background-natural-hover',
        'active:border-border-natural-primary',
      ],
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    fullWidth: false,
    underline: false,
    outline: false,
  },
});
