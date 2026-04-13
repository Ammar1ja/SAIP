import { cva } from 'class-variance-authority';

export const tabsContainerStyles = cva(
  ['flex w-full rounded-md p-0 sm:p-1 items-center', 'flex-nowrap', 'border-none'],
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col h-full',
      },
      dir: {
        ltr: '',
        rtl: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      dir: 'ltr',
    },
  },
);

export const tabButtonStyles = cva(
  [
    'inline-flex h-10 min-w-0 flex-1 items-center justify-center px-3 text-sm text-center md:h-12',
    'sm:px-6 sm:text-sm sm:flex-1 sm:min-w-0',
    'md:flex-1 md:text-base',
    'transition-colors duration-150 font-normal',
    'whitespace-nowrap',
    'cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  ],
  {
    variants: {
      isActive: {
        true: 'bg-neutral-900 text-white shadow-none',
        false: 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100',
      },
      isFirst: {
        true: 'rounded-l-md rtl:rounded-l-none rtl:rounded-r-md',
        false: '',
      },
      isLast: {
        true: 'rounded-r-md rtl:rounded-r-none rtl:rounded-l-md',
        false: '',
      },
      withDivider: {
        true: 'border-l border-neutral-200 rtl:border-l-0 rtl:border-r',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed! opacity-50',
        false: '',
      },
      dir: {
        ltr: '',
        rtl: '',
      },
      mobileScrollable: {
        true: 'shrink-0 flex-none min-w-max sm:min-w-[100px] md:min-w-[170px] lg:min-w-0 lg:flex-1',
        false: '',
      },
    },
    defaultVariants: {
      isActive: false,
      isFirst: false,
      isLast: false,
      withDivider: false,
      disabled: false,
      dir: 'ltr',
      mobileScrollable: false,
    },
  },
);
