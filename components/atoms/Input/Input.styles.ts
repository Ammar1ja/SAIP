import { cva } from 'class-variance-authority';

export const inputContainer = cva(['flex', 'flex-col', 'space-y-2']);

export const inputLabel = cva(['text-sm', 'font-normal', 'leading-5', 'text-[#161616]']);

export const inputField = cva([
  'h-10',
  'px-4',
  'border',
  'border-[#9DA4AE]',
  'rounded-[4px]',
  'shadow-none',
  'text-[16px]',
  'leading-6',
  'text-[#384250]',
  'focus:outline-none',
  'focus:ring-1',
  'focus:ring-primary-500/30',
  'focus:border-primary-500',
  'placeholder-[#6C737F]',
]);
