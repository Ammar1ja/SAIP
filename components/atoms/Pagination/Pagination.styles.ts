import { cva } from 'class-variance-authority';

export const paginationContainer = cva(['flex', 'items-center', 'justify-center', 'gap-2', 'p-4']);

export const paginationButton = cva(
  [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'min-w-[40px]',
    'h-[40px]',
    'text-sm',
    'font-medium',
    'transition-all',
    'duration-200',
    'cursor-pointer',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: ['text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-50', 'rounded-lg'],
        active: [
          'text-gray-900',
          'font-semibold',
          'after:absolute',
          'after:bottom-0',
          'after:left-1/2',
          'after:-translate-x-1/2',
          'after:w-6',
          'after:h-1',
          'after:bg-primary-600',
          'after:rounded-full',
        ],
        navigation: [
          'text-gray-500',
          'hover:text-gray-700',
          'hover:bg-gray-50',
          'rounded-lg',
          'p-2',
        ],
        ellipsis: [
          '!min-w-6 !h-6 !w-6 !max-w-6 shrink-0 p-0',
          'rounded-sm',
          'border border-text-default',
          'bg-white',
          'text-text-default',
          'cursor-default',
          'pointer-events-none',
          'focus:ring-0 focus:ring-offset-0',
        ],
      },
      size: {
        sm: ['min-w-[32px]', 'h-[32px]', 'text-xs'],
        md: ['min-w-[40px]', 'h-[40px]', 'text-sm'],
        lg: ['min-w-[48px]', 'h-[48px]', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);
