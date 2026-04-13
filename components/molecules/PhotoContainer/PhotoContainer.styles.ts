import { cva } from 'class-variance-authority';

export const containerStyles = cva('w-full flex items-stretch rounded-[32px] bg-neutral-50', {
  variants: {},
  defaultVariants: {},
});

export const imageStyles = cva(
  'relative aspect-square w-[450px] h-[400px] shrink-0 overflow-hidden rounded-[32px]',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const textContainerStyles = cva('flex-1 flex items-center   ', {
  variants: {},
  defaultVariants: {},
});
