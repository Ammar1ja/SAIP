import { cva } from 'class-variance-authority';

export const filtersContainer = cva(
  [
    'w-full',
    'p-6',
    'bg-white',
    'border',
    'border-gray-200',
    'shadow-sm',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'relative',
    'overflow-visible',
  ],
  {
    variants: {
      variant: {
        default: ['rounded-lg'],
        projects: ['rounded-2xl'],
        services: ['rounded-3xl', 'p-10'],
        faq: [
          'mx-auto',
          'w-full',
          'max-w-[66.375rem]',
          'h-[12.25rem]',
          '!px-12',
          '!py-8',
          'rounded-xl',
          '!border-border-natural-primary',
          '!shadow-none',
        ],
        media: ['rounded-3xl', 'p-10', 'bg-[#f9fafb]', 'border-transparent', 'shadow-none'],
        ipObservatory: ['rounded-3xl', 'p-10', 'bg-[#f9fafb]', 'border-transparent', 'shadow-none'],
        /** IP Agents listing: three equal fields; min height 196px on md+ (Figma). */
        ipAgents: [
          'rounded-md',
          'border',
          'border-border-natural-primary',
          'bg-white',
          'p-6',
          'shadow-none',
          'flex',
          'flex-col',
          'gap-4',
          'md:h-[196px]',
          'md:min-h-[196px]',
          'md:justify-start',
          '[&_input]:h-11',
          '[&_input]:min-h-[44px]',
          '[&_input]:rounded-md',
          '[&_input]:border-border-natural-secondary',
          '[&_button[type=button]]:min-h-[44px]',
          '[&_button[type=button]]:h-11',
          '[&_button[type=button]]:rounded-md',
          '[&_button[type=button]]:border-border-natural-secondary',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const filtersGrid = cva(['grid', 'w-full'], {
  variants: {
    columns: {
      1: ['grid-cols-1'],
      2: ['grid-cols-1', 'sm:grid-cols-2'],
      3: ['grid-cols-1', 'md:grid-cols-3'],
      '3-faq': ['grid-cols-1', 'md:grid-cols-[316px_minmax(0,1fr)_minmax(0,1fr)]'],
      4: ['grid-cols-1', 'md:grid-cols-4'],
    },
    spacing: {
      default: ['gap-4'],
      faq: ['gap-6'],
      ipAgents: ['gap-6'],
    },
  },
  defaultVariants: {
    columns: 3,
    spacing: 'default',
  },
});

/** ipAgents: pure grid — do not mix with flex (was breaking Clear alignment). */
export const filtersActions = cva('', {
  variants: {
    variant: {
      default: 'mt-6 flex flex-row items-center justify-between',
      faq: 'mt-2 flex flex-row items-center justify-between',
      ipAgents:
        'mt-0 w-full shrink-0 grid grid-cols-1 justify-items-start md:grid-cols-3 md:gap-x-6',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const clearFilters = cva([
  'text-sm',
  'text-gray-500',
  'hover:text-gray-700',
  'font-medium',
  'cursor-pointer',
  'transition-colors',
  'duration-200',
  'ease-in-out',
]);

export const hideFilters = cva([
  'text-sm',
  'text-gray-500',
  'font-medium',
  'cursor-pointer',
  'transition-all',
  'duration-200',
  'ease-in-out',
  'hover:text-gray-700',
  'flex',
  'items-center',
  'gap-2',
  '[&_svg]:transition-transform',
  '[&_svg]:duration-200',
  '[&_svg]:ease-in-out',
]);

export const filtersWrapper = cva(['w-full', 'max-w-[1116px]', 'mx-auto']);
