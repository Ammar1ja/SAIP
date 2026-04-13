import { cva } from 'class-variance-authority';

export const dropdownBase = cva(['relative'], {
  variants: {
    variant: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const button = cva(
  [
    'flex',
    'items-center',
    'gap-2',
    'text-sm',
    'text-gray-800',
    'hover:text-green-700',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-green-500',
    'cursor-pointer',
    'py-6',
  ],
  {
    variants: {
      variant: {
        default: '',
        compact: 'py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const menu = cva(
  [
    'absolute',
    'mt-2',
    'z-50',
    'rounded-md',
    'bg-white',
    'p-4',
    'shadow-2xl',
    'ring-1',
    'ring-gray-200',
    'border',
    'border-green-100',
    'w-72',
  ],
  {
    variants: {
      variant: {
        default: '',
        compact: 'w-56',
      },
      position: {
        left: 'left-0',
        right: 'right-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'right',
    },
  },
);
