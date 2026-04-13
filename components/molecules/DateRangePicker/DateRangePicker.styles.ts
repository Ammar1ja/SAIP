import { cva } from 'class-variance-authority';

export const container = cva('relative w-full flex flex-col gap-2');
export const labelStyle = cva('text-sm font-medium text-gray-700');
export const inputStyle = cva([
  'border',
  'border-gray-200',
  'w-full',
  'h-12',
  'rounded-sm',
  'px-4',
  'bg-white',
  'text-sm',
  'cursor-pointer',
  'flex',
  'items-center',
]);
