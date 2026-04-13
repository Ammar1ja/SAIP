import { cva } from 'class-variance-authority';

export const requirementsList = cva(['space-y-4', 'pl-6', 'list-decimal']);

export const requirementsListItem = cva(['block', 'mb-4', 'text-base']);

export const requirementsListBullet = cva([
  'mt-1',
  'w-2',
  'h-2',
  'rounded-full',
  'bg-primary-700',
  'inline-block',
]);
