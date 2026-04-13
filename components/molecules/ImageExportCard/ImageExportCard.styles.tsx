import { cva } from 'class-variance-authority';

export const containerStyles = cva('max-w-screen-xl mx-auto py-3 md:py-4 lg:py-4', {
  variants: {},
  defaultVariants: {},
});

export const wrapperStyles = cva(
  'grid grid-cols-1 lg:grid-cols-[1.42fr_1fr] gap-12 items-center p-4 md:p-8 lg:p-8',
  {
    variants: {
      background: {
        white: 'bg-white',
        neutral: 'bg-neutral-50',
        green: 'bg-primary-50',
      },
      radius: {
        none: '',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-2xl',
      },
    },
    defaultVariants: {
      background: 'neutral',
      radius: 'xl',
    },
  },
);

export const imageStyles = cva('relative w-full', {
  variants: {
    aspect: {
      default: 'aspect-[5/2] lg:aspect-[471/195]',
    },
    radius: {
      none: '',
      md: 'rounded-md overflow-hidden',
      lg: 'rounded-lg overflow-hidden',
      xl: 'rounded-xl overflow-hidden',
      xl2: 'rounded-2xl overflow-hidden',
    },
  },
  defaultVariants: {
    aspect: 'default',
    radius: 'xl2',
  },
});
