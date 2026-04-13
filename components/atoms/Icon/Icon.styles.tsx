import { cva } from 'class-variance-authority';

export const iconContainer = cva(
  ['relative', 'inline-flex', 'items-center', 'justify-center', 'rounded-md'],
  {
    variants: {
      background: {
        none: '',
        white: 'bg-white',
        light: 'bg-gray-50',
        dark: 'bg-gray-900',
        green: 'bg-[#079455] text-white', // Figma Background/background-success
        transparent: 'bg-transparent',
      },
      size: {
        small: 'w-6 h-6 p-1',
        medium: 'w-8 h-8 p-1.5',
        large: 'w-12 h-12 p-2',
      },
    },
    defaultVariants: {
      background: 'none',
      size: 'medium',
    },
  },
);

export const icon = cva(['transition-transform', '[color:inherit]'], {
  variants: {
    size: {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
