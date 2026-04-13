import { cva } from 'class-variance-authority';

export const NavigationContainer = cva(
  [
    'hidden lg:block',
    'sticky',
    'z-40',
    'w-full',
    'bg-neutral-200',
    'shadow-sm',
    'border-b border-border-natural-primary',
    'transition-all duration-300 ease-in-out',
  ],
  {
    variants: {
      compact: {
        true: 'py-2',
        false: 'py-3',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const NavigationOuter = cva(
  ['flex', 'flex-wrap', 'items-center', 'transition-all duration-300'],
  {
    variants: {
      compact: {
        true: 'gap-6',
        false: 'gap-8',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const NavigationInner = cva(
  [
    'text-text-primary-paragraph',
    'hover:text-neutral',
    'transition-colors',
    'text-sm',
    'leading-5',
    'relative',
    'flex',
    'items-center',
    'pl-4',
    'pr-3',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      bold: {
        true: 'font-bold',
        false: '',
      },
      active: {
        true: [
          'font-semibold',
          'text-text-default',
          'h-10',
          'before:content-[""]',
          'before:absolute',
          'before:left-0',
          'before:top-1',
          'before:bottom-1',
          'before:w-1',
          'before:bg-primary-600',
          'before:rounded-full',
        ].join(' '),
        false: 'font-normal',
      },
      compact: {
        true: 'text-sm',
        false: 'text-sm',
      },
    },
    defaultVariants: {
      bold: false,
      active: false,
      compact: false,
    },
  },
);
