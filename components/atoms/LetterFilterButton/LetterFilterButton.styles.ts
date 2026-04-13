import { cva } from 'class-variance-authority';

export const letterButton = cva(
  [
    'inline-flex h-8 min-h-8 w-[38px] min-w-[38px] max-w-[38px] items-center justify-center',
    'rounded-sm border border-border-natural-primary',
    'px-0 text-sm font-medium',
    'shrink-0 transition-colors',
  ],
  {
    variants: {
      selected: {
        true: 'border-transparent bg-button-background-primary-default text-white',
        false: 'bg-white text-text-default hover:bg-neutral-50',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);
