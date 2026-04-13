import { cva } from 'class-variance-authority';

export const paragraphStyles = cva('leading-relaxed text-neutral-700', {
  variants: {
    variant: {
      default: 'py-2',
      compact: 'py-0',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    weight: 'normal',
  },
});
