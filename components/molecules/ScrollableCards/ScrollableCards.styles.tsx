import { cva } from 'class-variance-authority';

export const scrollableCardsContainer = cva([
  'flex',
  'w-full',
  'gap-6',
  'overflow-x-auto',
  'snap-x',
  'snap-mandatory',
  'py-1',
]);

export const cardWrapper = cva(
  [
    '!w-[302px]',
    'min-w-[302px]',
    '!max-w-[302px]',
    'shrink-0',
    'flex-col',
    'justify-between',
    'snap-start',
    'relative',
    'p-4! lg:p-6!',
  ],
  {
    variants: {
      height: {
        default: 'h-[320px]',
        compact: 'h-[250px]',
      },
    },
    defaultVariants: {
      height: 'default',
    },
  },
);

export const iconWrapper = cva('', {
  variants: {
    variant: {
      default: '',
      highlight: 'w-12 h-12 rounded-md bg-success-700 text-white flex items-center justify-center',
      pillar: 'absolute top-0 w-full h-full z-10',
    },
  },
});

export const iconElement = cva(
  [
    'absolute',
    'inset-0',
    'w-full',
    'h-full',
    'object-cover',
    'z-0',
    'pointer-events-none',
    'opacity-70',
  ],
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const cardTextContainer = cva(['flex', 'flex-col'], {
  variants: {
    variant: {
      default: '',
      highlight: '',
      pillar: 'justify-between h-full relative z-10',
    },
    spacing: {
      '6': 'space-y-6',
      '2': 'space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: '6',
  },
});
