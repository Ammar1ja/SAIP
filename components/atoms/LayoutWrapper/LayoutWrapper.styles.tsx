import { cva } from 'class-variance-authority';

export const layoutWrapper = cva(['w-full', 'mx-auto', 'px-4'], {
  variants: {
    variant: {
      default: 'max-w-screen-xl',
      narrow: 'max-w-screen-lg',
      wide: 'max-w-screen-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
