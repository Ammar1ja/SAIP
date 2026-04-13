import { cva } from 'class-variance-authority';

export const textareaContainer = cva(['flex', 'flex-col', 'space-y-2']);

export const textareaLabel = cva(['text-sm', 'font-normal', 'leading-5', 'text-[#161616]']);

export const textareaField = cva([
  'h-24',
  'px-4',
  'py-3',
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
  'resize-vertical',
]);

export const textareaHelper = cva(['text-sm', 'text-[#384250]', 'flex', 'items-center', 'gap-1']);
