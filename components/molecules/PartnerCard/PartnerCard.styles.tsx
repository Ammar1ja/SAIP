import { cva } from 'class-variance-authority';

export const partnerCard = cva([
  'flex',
  'flex-col',
  'items-center',
  'gap-4',
  'p-6',
  'h-full',
  'bg-white',
  'rounded-xl',
  'shadow-sm',
  'transition',
]);
