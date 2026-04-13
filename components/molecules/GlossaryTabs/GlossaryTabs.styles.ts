import { cva } from 'class-variance-authority';

export const tabButton = cva(
  'relative px-0 py-3 mr-8 text-sm font-medium transition-colors duration-200 border-b-2 border-transparent',
  {
    variants: {
      active: {
        true: 'text-gray-900 bg-button-background-primary-default',
        false: 'text-gray-500 hover:text-gray-700',
      },
    },
  },
);
