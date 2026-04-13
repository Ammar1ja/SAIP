import { cva } from 'class-variance-authority';

export const arrow = cva(['flex', 'items-center', 'justify-center', 'hover:cursor-pointer'], {
  variants: {
    direction: {
      right: ['rotate-0', 'rtl:rotate-180'],
      left: ['rotate-180', 'rtl:rotate-0'],
    },
    background: {
      primary: [
        'bg-button-background-primary-default',
        'text-white',
        'hover:bg-button-background-primary-hover',
        'hover:border-white/10',
        'transition-colors',
      ],
      natural: [
        'bg-button-background-natural-default',
        'text-icon-default-500',
        'hover:bg-button-background-natural-hover',
        'hover:border-white/10',
        'transition-colors',
      ],
      disabled: ['bg-button-background-disabled', 'text-icon-default-400', 'hover:cursor-default'],
      none: ['bg-none'],
      transparent: [
        'bg-transparent',
        'text-white',
        'border',
        'border-white',
        'hover:bg-white/10',
        'hover:border-white/10',
        'transition-colors',
      ],
      transparentDisabled: [
        'bg-transparent',
        'text-icon-default-400',
        'border',
        'border-white',
        'hover:cursor-default',
      ],
    },
    size: {
      small: ['w-[32px]', 'h-[32px]'],
      medium: ['w-[40px]', 'h-[40px]'],
      smallWide: ['w-16', 'h-[32px]'],
    },
    shape: {
      round: ['rounded-full'],
      round_sm: ['rounded'],
      square: ['rounded-md'],
    },
  },
  defaultVariants: {
    direction: 'right',
    background: 'natural',
    size: 'medium',
    shape: 'round',
  },
});
