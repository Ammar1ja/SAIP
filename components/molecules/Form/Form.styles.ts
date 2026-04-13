import { cva } from 'class-variance-authority';

/** Figma: field vertical gap = Global/spacing-3xl (24px → `gap-6`). */
export const formContainer = cva([
  'flex',
  'flex-col',
  'gap-8',
  'bg-neutral-50',
  'rounded-xl',
  'p-12',
  'border-0',
  'shadow-none',
  'w-full',
]);

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

export const formActions = cva(['flex', 'justify-end', 'pt-0', 'border-0']);

export const formPhoneInputWrapper = cva([
  'flex',
  'items-center',
  'h-10',
  'border',
  'border-[#9DA4AE]',
  'rounded-[4px]',
  'shadow-none',
  'focus-within:ring-1',
  'focus-within:ring-primary-500/30',
  'focus-within:border-primary-500',
]);
