import { cva } from 'class-variance-authority';

export const accessibilityTools = cva(['flex', 'flex-col', 'gap-1'], {
  variants: {
    variant: {
      default: '',
      compact: 'gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const accessibilityButton = cva(
  [
    'w-8',
    'h-8',
    'cursor-pointer',
    'rounded-[4px]',
    'border',
    'border-white/30',
    'flex',
    'items-center',
    'justify-center',
    'hover:bg-success-800',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-white',
    'transition-colors',
  ],
  {
    variants: {
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const heading = cva(
  ['text-base', 'font-semibold', 'mb-3', 'border-b', 'border-white/30', 'pb-2', 'text-white'],
  {
    variants: {
      variant: {
        default: '',
        compact: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
