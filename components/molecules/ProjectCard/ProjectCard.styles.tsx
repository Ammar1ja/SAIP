import { cva } from 'class-variance-authority';

export const projectCard = cva([
  'w-full',
  'bg-white',
  'rounded-lg',
  'border',
  'border-gray-200',
  'shadow-sm',
  'overflow-hidden',
  'p-6',
]);

export const projectHeader = cva(['pb-6']);

export const projectGrid = cva([
  'bg-gray-50',
  'grid',
  'grid-cols-1',
  'md:grid-cols-2',
  'lg:grid-cols-4',
  'rounded-md',
  'gap-4',
  'p-6',
]);

export const projectItem = cva(['flex', 'flex-col', 'rounded-lg']);

export const projectItemContent = cva(['grid', 'grid-cols-[auto_1fr]', 'gap-x-3', 'items-center']);

export const projectIcon = cva([
  'col-start-1',
  'flex items-center',
  'justify-center',
  'w-8',
  'h-8',
  'bg-success-600',
  'rounded-sm',
  'text-white',
]);
