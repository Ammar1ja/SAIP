import { cva } from 'class-variance-authority';

export const date = cva(['font-medium', 'transition-colors', 'duration-200'], {
  variants: {
    variant: {
      default: 'text-text-default',
      muted: 'text-text-muted',
      white: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});
