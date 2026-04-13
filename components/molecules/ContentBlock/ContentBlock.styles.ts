import { cva } from 'class-variance-authority';

export const contentBlock = cva(['space-y-2 md:space-y-4 lg:space-y-6'], {
  variants: {
    textAlign: {
      left: 'text-left rtl:text-right',
      center: 'text-center',
      right: 'text-right rtl:text-left',
    },
    lineHeight: {
      normal: 'leading-normal',
      none: 'leading-none',
    },
  },
  defaultVariants: {
    textAlign: 'left',
    lineHeight: 'normal',
  },
});
