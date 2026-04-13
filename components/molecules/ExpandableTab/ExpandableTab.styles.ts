import { cva } from 'class-variance-authority';

export const expandableTabStyles = cva(['w-full transition-all duration-200'], {
  variants: {
    variant: {
      default: 'bg-white border border-neutral-200 rounded-lg overflow-hidden',
      bordered: 'border-t border-neutral-200 bg-transparent',
    },
    isExpanded: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const headerStyles = cva([
  'w-full min-h-[64px] transition-colors cursor-pointer',
  'flex items-center justify-between gap-4',
]);

export const titleStyles = cva(
  'text-base font-medium text-neutral-900 ltr:text-left rtl:text-right flex-1',
  {
    variants: {
      isExpanded: {
        true: '',
        false: '',
      },
    },
  },
);

export const contentStyles = cva(['overflow-hidden transition-all duration-200'], {
  variants: {
    variant: {
      default: 'bg-white',
      bordered: 'bg-transparent',
    },
    isExpanded: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const buttonStyles = cva([
  'flex items-center gap-2 text-neutral-600 hover:text-neutral-800',
  'transition-colors duration-200 shrink-0',
]);

export const chevronStyles = cva('transition-transform duration-200 shrink-0', {
  variants: {
    isExpanded: {
      true: 'rotate-180',
      false: 'rotate-0',
    },
    direction: {
      ltr: 'ms-3',
      rtl: 'scale-x-[-1] me-3',
    },
  },
});
