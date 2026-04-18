import { cva } from 'class-variance-authority';

export const footerWrapper = cva(['text-white', 'bg-success-900', 'text-sm', 'leading-relaxed']);

export const linkGroup = cva(['flex', 'flex-col', 'gap-2']);

export const heading = cva([
  'text-base',
  'font-semibold',
  'mb-3',
  'border-b',
  'border-white/30',
  'pb-2',
]);

export const bottomBar = cva([
  'flex',
  'flex-col',
  'lg:flex-row',
  'items-start',
  'justify-between',
  'border-t',
  'border-white/30',
  'pt-6',
  'mt-8',
  'gap-4',
]);

export const bottomText = cva(['space-y-1']);

export const iconButton = cva([
  'w-8',
  'h-8',
  'cursor-pointer',
  'rounded-md',
  'border',
  'border-white/30',
  'flex',
  'items-center',
  'justify-center',
  'hover:bg-white/10',
  'focus-visible:outline',
  'focus-visible:outline-2',
  'focus-visible:outline-white',
  'transition-colors',
]);
