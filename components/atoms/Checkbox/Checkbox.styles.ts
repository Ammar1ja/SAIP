import { cva } from 'class-variance-authority';

export const checkboxContainer = cva(['flex', 'items-start', 'gap-4']);

export const checkboxField = cva([
  'h-6',
  'w-6',
  'shrink-0',
  'text-primary-600',
  'focus:ring-primary-500',
  'rounded-[2px]',
  'border',
  'border-[#6C737F]',
  'accent-primary-600',
]);

export const checkboxLabel = cva(['text-[16px]', 'font-medium', 'leading-6', 'text-[#1F2A37]']);
