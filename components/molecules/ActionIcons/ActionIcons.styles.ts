import { cva } from 'class-variance-authority';

export const actionIconsContainer = cva(
  [
    'flex',
    'items-center',
    'justify-start',
    'gap-3',
    'bg-white',
    'rounded-lg',
    'px-4',
    'py-3',
    'shadow-sm',
    'border',
    'border-gray-200',
  ],
  {
    variants: {
      size: {
        sm: ['px-3', 'py-2', 'gap-2'],
        md: ['px-12', 'py-4', 'gap-5'],
        lg: ['px-6', 'py-4', 'gap-4'],
        panel: [
          'w-full',
          'rounded-2xl',
          'px-4',
          'py-4',
          'gap-4',
          'border-transparent',
          'shadow-[0px_4px_8px_0px_rgba(16,24,40,0.1),0px_2px_4px_0px_rgba(16,24,40,0.06)]',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const actionIcon = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'text-neutral-900',
    'hover:text-neutral-950',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'rounded',
  ],
  {
    variants: {
      size: {
        sm: ['h-8', 'w-8'],
        md: ['h-10', 'w-10'],
        lg: ['h-10', 'w-10'],
        panel: ['h-10', 'w-10'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
