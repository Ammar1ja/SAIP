import { cva } from 'class-variance-authority';

export const card = cva(['rounded-lg', 'p-6', 'w-full', 'transition-all', 'duration-200'], {
  variants: {
    variant: {
      default: 'bg-white rounded-2xl px-8 py-6 flex max-w-lg',
      blurred: 'bg-primary-700/70 backdrop-blur-xl text-white max-w-lg',
      mission:
        'bg-gradient-to-r from-[#104631] to-[#1B8354] md:from-[#104631]/70 md:to-[#1B8354]/70 md:backdrop-blur-xl text-white rounded-2xl px-6 py-5 md:py-6',
      news: 'bg-white hover:shadow-lg',
      pillar: 'bg-white rounded-2xl px-8 py-6 flex shadow-md',
      value:
        'bg-gradient-to-b from-[#1C6846]/80 to-[#1C6846]/60 text-white border-l-2 border-white pl-4 py-6',
      wide: 'bg-white rounded-2xl px-12 py-10 flex w-full max-w-none',
    },
    shadow: {
      true: 'shadow-md',
      false: '',
    },
    border: {
      true: 'border-border-natural-primary border',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    shadow: false,
    border: true,
  },
});
