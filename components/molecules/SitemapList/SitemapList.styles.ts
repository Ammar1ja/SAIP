import { cva } from 'class-variance-authority';

export const bulletStyle = cva(
  'rounded-full flex-shrink-0 ltr:mr-3 rtl:ml-3 transition-colors',
  {
    variants: {
      fill: {
        true: '',
        false: 'border-2',
      },
      color: {
        black: '',
        primary: '',
      },
      size: {
        large: 'w-2.5 h-2.5 mt-2.5',
        small: 'w-2 h-2 mt-2',
      },
    },
    compoundVariants: [
      { fill: true, color: 'black', class: 'bg-neutral-800' },
      { fill: true, color: 'primary', class: 'bg-primary-600' },
      { fill: false, color: 'black', class: 'border-neutral-400' },
      { fill: false, color: 'primary', class: 'border-primary-500' },
    ],
    defaultVariants: {
      fill: true,
      color: 'black',
      size: 'large',
    },
  },
);
