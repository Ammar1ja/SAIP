import { cva } from 'class-variance-authority';

export const infoItemVariants = cva('flex items-start gap-3', {
  variants: {
    variant: {
      default: 'text-gray-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
