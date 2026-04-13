import { cva } from 'class-variance-authority';

export const navStyles = cva([
  'flex flex-col bg-white relative rounded-lg py-4 ',
  'border-0 shadow-none',
]);

export const tabStyles = cva(
  [
    'flex items-start gap-4 relative cursor-pointer transition-colors text-left rtl:text-right',
    'border-0 outline-none bg-transparent',
    'hover:bg-neutral-50',
    'px-4 py-3',
    '[&]:after:absolute [&]:after:bottom-0 [&]:after:h-[3px] [&]:after:bg-transparent [&]:after:z-10',
    '[dir="ltr"] [&]:after:left-5 [dir="rtl"] [&]:after:right-5',
    '[dir="ltr"] [&]:after:right-5 [dir="rtl"] [&]:after:left-5',
    'md:[&]:after:hidden',
    '[&]:before:absolute [&]:before:top-1/2 [&]:before:-translate-y-1/2 [&]:before:h-6 [&]:before:w-[3px] [&]:before:bg-transparent [&]:before:rounded-full',
    '[dir="ltr"] [&]:before:left-0',
    '[dir="rtl"] [&]:before:right-0',
    'md:[&]:before:bg-transparent',
  ],
  {
    variants: {
      isActive: {
        true: [
          'text-neutral-900 font-medium',
          '[&]:after:bg-green-600',
          'md:[&]:before:bg-green-600',
        ],
        false: 'text-neutral-500',
      },
      hasIcon: {
        true: '[dir="ltr"]:pl-2 [dir="rtl"]:pr-2 md:[dir="ltr"]:pl-4 md:[dir="rtl"]:pr-4',
        false: '[dir="ltr"]:pl-2 [dir="rtl"]:pr-2 md:[dir="ltr"]:pl-5 md:[dir="rtl"]:pr-5',
      },
      size: {
        sm: 'text-sm md:px-3 md:py-2',
        md: 'text-base',
        lg: 'text-lg md:px-5 md:py-4',
      },
    },
    compoundVariants: [
      {
        isActive: true,
        hasIcon: false,
        className: 'md:[dir="ltr"]:pl-5 md:[dir="rtl"]:pr-5',
      },
    ],
    defaultVariants: {
      size: 'md',
    },
  },
);
