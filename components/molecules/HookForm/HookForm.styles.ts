import { cva } from 'class-variance-authority';

export const formContainer = cva(['bg-white', 'space-y-6'], {
  variants: {
    wrapped: {
      true: 'border border-gray-200 rounded-lg shadow-sm p-6',
      false: '',
    },
  },
  defaultVariants: {
    wrapped: true,
  },
});

export const formGrid = cva(['grid', 'gap-6', 'w-full'], {
  variants: {
    columns: {
      1: ['grid-cols-1'],
      2: ['grid-cols-1', 'md:grid-cols-2'],
      3: ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3'],
      4: ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4'],
    },
  },
  defaultVariants: {
    columns: 1,
  },
});

export const formActions = cva(['flex', 'justify-end', 'pt-4'], {
  variants: {
    wrapped: {
      true: 'border-t border-gray-200',
      false: '',
    },
  },
  defaultVariants: {
    wrapped: true,
  },
});

export const formPhoneInputWrapper = cva([
  'flex',
  'items-center',
  'border',
  'border-gray-300',
  'rounded-md',
  'shadow-sm',
  'focus-within:ring-2',
  'focus-within:ring-primary-500',
  'focus',
  'within:border-primary-500',
  'placeholder-gray-400',
]);
