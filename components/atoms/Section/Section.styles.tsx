import { cva } from 'class-variance-authority';

export const section = cva([], {
  variants: {
    background: {
      white: ['bg-white'],
      'neutral-25': ['bg-gray-25'],
      neutral: ['bg-neutral-50'],
      accent: ['bg-gradient-brand', 'text-white'],
      primary: ['bg-success-900', 'text-white'],
      'primary-25': ['bg-[#f7fdf9]'],
      'primary-50': ['bg-primary-50'],
      transparent: ['bg-transparent'],
    },
    padding: {
      none: ['py-0'],
      small: ['py-4'],
      medium: ['py-8'],
      large: ['py-12'],
      default: ['py-12 md:py-16 lg:py-20'],
    },
  },
  defaultVariants: {
    background: 'white',
    padding: 'default',
  },
});

export const container = cva(['px-4 md:px-8'], {
  variants: {
    align: {
      center: ['mx-auto'],
      right: ['ml-auto'],
      left: ['mr-auto'],
    },
    columns: {
      /* minmax(0,1fr) — иначе при lg min-content колонки ломают сетку (текст/картинка IP Search и др.) */
      two: ['grid', 'grid-cols-1', 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]', 'gap-12'],
      asymNarrowWide: ['grid', 'grid-cols-1', 'lg:grid-cols-[411px_1fr]', 'gap-12'],
    },
    itemsAlign: {
      center: ['items-center'],
      start: ['items-start'],
      end: ['items-end'],
      stretch: ['items-stretch'],
    },
    fullWidth: {
      true: ['w-full'],
      false: ['max-w-screen-xl', 'w-full'],
    },
    constrain: {
      true: ['container', 'mx-auto'],
      false: [''],
    },
    overlap: {
      true: [
        'after:absolute',
        'after:content-[""]',
        'after:left-0',
        'after:right-0',
        'after:bottom-0',
        'after:translate-y-1/2',
        'after:h-full',
        'after:bg-inherit',
        'after:-z-10',
      ],
      false: [''],
    },
    scrollableContent: {
      true: ['pr-0'], // Remove right padding for scrollable content
      false: [''],
    },
  },
  defaultVariants: {
    align: 'center',
    fullWidth: false,
    constrain: true,
    overlap: false,
    scrollableContent: false,
  },
});
