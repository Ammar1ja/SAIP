import { cva } from 'class-variance-authority';

export const expandableTabGroupStyles = cva('w-full', {
  variants: {
    variant: {
      default: 'space-y-2',
      bordered: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tabItemStyles = cva(
  'w-full rounded-2xl border border-neutral-300 bg-white [&:not(:first-child)]:mt-2',
  {
    variants: {
      isActive: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);
