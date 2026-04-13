import { cva } from 'class-variance-authority';

export const selectContainer = cva('relative w-full flex items-center');

export const select = cva([
  'w-full',
  'h-12',
  'pl-4',
  'pr-10',
  'rounded-sm',
  'border',
  'border-gray-200',
  'text-gray-900',
  'text-sm',
  'appearance-none',
  'placeholder-gray-500',
  '[&::-ms-expand]:hidden',
  '[&::-webkit-select-arrow]:opacity-0',
  '[&::-moz-select-arrow]:opacity-0',
  'select-none',
  '-webkit-appearance-none',
  '-moz-appearance-none',
  'focus:outline-none',
  'focus:ring-1',
  'focus:ring-primary-500',
  'focus:border-transparent',
  'disabled:bg-gray-100',
  'disabled:text-gray-500',
  'disabled:cursor-not-allowed',
  'cursor-pointer',
]);

export const chevronIcon = cva([
  'absolute',
  'right-4',
  'top-1/2',
  '-translate-y-1/2',
  'w-5',
  'h-5',
  'text-gray-400',
  'pointer-events-none',
  'transition-transform',
  'duration-200',
  'ease-in-out',
]);
