import { cva } from 'class-variance-authority';

export const requirementsList = cva(['space-y-4', 'list-decimal']);

export const requirementsListItem = cva(['block', 'mb-4', 'text-[16px]', 'text-[#384250]']);

export const requirementsListBullet = cva([
  'mt-1',
  'w-2',
  'h-2',
  'rounded-full',
  'bg-primary-700',
  'inline-block',
]);
