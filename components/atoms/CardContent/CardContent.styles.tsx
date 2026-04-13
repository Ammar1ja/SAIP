import { cva } from 'class-variance-authority';

const baseContentStyles = [
  'space-y-6',
  'transition-all',
  'duration-200',
  'motion-reduce:transition-none',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-primary-500',
  'focus-visible:ring-offset-2',
];

const baseTitleStyles = [
  'font-bold',
  'transition-colors',
  'duration-200',
  'motion-reduce:transition-none',
];

const baseDescriptionStyles = [
  'text-sm',
  'sm:text-base',
  'leading-relaxed',
  'transition-colors',
  'duration-200',
  'motion-reduce:transition-none',
];

export const cardContent = cva(baseContentStyles, {
  variants: {
    variant: {
      default: '',
      compact: 'space-y-4',
      bordered: ['border', 'border-neutral-200', 'rounded-lg', 'p-6'],
      elevated: ['shadow-md', 'rounded-lg', 'p-6', 'hover:shadow-lg', 'transition-shadow'],
      project: [
        'border',
        'border-gray-200',
        'rounded-lg',
        'shadow-sm',
        'overflow-hidden',
        'space-y-0',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const cardTitle = cva(baseTitleStyles, {
  variants: {
    size: {
      sm: 'text-lg sm:text-xl',
      md: 'text-xl sm:text-2xl',
      lg: 'text-[30px] leading-[38px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const cardDescription = cva(baseDescriptionStyles, {
  variants: {
    variant: {
      default: '',
      compact: 'text-sm sm:text-sm',
      bordered: 'text-text-muted',
      elevated: 'text-text-muted',
      project: 'text-sm text-gray-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const projectHeader = cva(['p-6', 'border-b', 'border-gray-200']);

export const projectGrid = cva([
  'grid',
  'grid-cols-1',
  'md:grid-cols-2',
  'lg:grid-cols-4',
  'gap-6',
  'p-6',
]);
