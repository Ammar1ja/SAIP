import { cva } from 'class-variance-authority';

export const list = cva(
  [
    'text-text-primary-paragraph',
    'space-y-1',
    'ps-[2ch]',
    'list-outside',
    'text-base',
    'leading-relaxed',
    'text-neutral-700',
  ],
  {
    variants: {
      ordered: {
        true: 'list-decimal',
        false: 'list-disc',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      ordered: false,
      size: 'md',
    },
  },
);
