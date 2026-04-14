import { cva } from 'class-variance-authority';

export const searchContainer = cva(['relative', 'w-full', 'flex', 'flex-col', 'gap-2']);

export const searchWrapper = cva(['relative', 'w-full', 'flex', 'items-center']);

export const searchLabel = cva(['text-sm', 'font-normal', 'text-gray-700', 'dark:text-gray-200']);

export const searchInput = cva([
  'w-full',
  'h-10',
  'pl-12',
  'pr-4',
  'rounded-[4px]',
  'bg-white',
  'dark:bg-gray-800',
  'border',
  'border-[#9DA4AE]',
  'dark:border-[#9DA4AE]',
  'text-base',
  'text-text-primary-paragraph',
  'dark:text-gray-100',
  'placeholder-[#6C737F]',
  'dark:placeholder-gray-400',
  'focus:outline-none',
  'focus:ring-1',
  'focus:ring-primary-500/30',
  'focus:border-primary-500',
  'disabled:bg-gray-100',
  'dark:disabled:bg-gray-900',
  'disabled:cursor-not-allowed',
  'transition-[border-color,box-shadow,color]',
  'duration-200',
  'ease-in-out',
]);

export const searchLeadingIcon = cva([
  'absolute',
  'left-4',
  'top-1/2',
  '-translate-y-1/2',
  'shrink-0',
  'pointer-events-none',
  'size-[17.92px]',
  'text-icon-default-500',
]);
