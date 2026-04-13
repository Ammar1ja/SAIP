import { cva } from 'class-variance-authority';

const baseButtonStyles = [
  'inline-flex',
  'items-center',
  'gap-1',
  'rounded-md',
  'px-5',
  'py-5',
  'text-base',
  'leading-6',
  'font-medium',
  'text-text-default',
  'transition-colors',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-green-500',
  'focus-visible:ring-offset-2',
  'cursor-pointer',
  'motion-reduce:transition-none',
  'group',
];

const baseMenuStyles = [
  'absolute',
  'z-50',
  'mt-4',
  'rounded-md',
  'bg-white',
  'shadow-2xl',
  'ring-1',
  'ring-gray-200',
  'border',
  'border-green-100',
  'p-4',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-green-500',
  'focus-visible:ring-offset-2',
];

const baseMenuItemStyles = [
  'block',
  'rounded-md',
  'px-3',
  'py-2',
  'text-base',
  'leading-6',
  'text-text-default',
  'cursor-pointer',
  'hover:bg-green-50',
  'hover:text-green-700',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-green-500',
  'transition-colors',
  'duration-200',
  'motion-reduce:transition-none',
  'flex',
  'items-center',
  'gap-4',
];

export const dropdownButton = cva(baseButtonStyles, {
  variants: {
    isOpen: {
      true: 'bg-[#E5E7EB]',
      false: '',
    },
    isActive: {
      true: 'bg-green-700 text-white',
      false: 'hover:bg-[#E5E7EB] text-text-default',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    isOpen: false,
    isActive: false,
    disabled: false,
  },
});

export const dropdownMenu = cva(baseMenuStyles, {
  variants: {
    variant: {
      default: 'max-w-xs w-72',
      multiColumn: 'ltr:left-14 rtl:right-14 rtl:left-auto max-w-none',
      compact: 'w-48',
      fullWidth: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const menuItem = cva(baseMenuItemStyles, {
  variants: {
    isActive: {
      true: 'bg-green-50 text-green-800 font-semibold',
      false: '',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    isActive: false,
    disabled: false,
  },
});
