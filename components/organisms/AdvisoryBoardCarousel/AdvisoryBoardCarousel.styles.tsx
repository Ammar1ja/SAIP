import { cva } from 'class-variance-authority';

export const wrapper = cva(['w-full']);

export const headerRow = cva(['flex', 'items-start', 'justify-between', 'gap-6', 'mb-4']);

export const heading = cva(['text-4xl', 'font-bold', 'mb-2']);

export const description = cva([
  'text-base',
  'md:text-lg',
  'mb-2',
  'bg-[#F5F9F8]',
  'p-3',
  'rounded',
  'border-l-4',
  'border-primary',
]);

export const description2 = cva(['text-base', 'md:text-lg', 'mb-0']);

export const nav = cva(['flex', 'items-center', 'gap-2']);

export const cardsRow = cva([
  'flex',
  'gap-6',
  'overflow-x-auto',
  'snap-x',
  'snap-mandatory',
  'py-2',
  'scroll-smooth',
  'scrollbar-thin',
  'scrollbar-track-transparent',
  'scrollbar-thumb-gray-300',
]);

export const carouselItem = cva(['shrink-0', 'snap-start', 'max-w-[90vw]'], {
  variants: {
    size: {
      default: 'w-[350px]',
      videos: 'w-[464px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
