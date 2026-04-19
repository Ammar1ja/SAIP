import { cva } from 'class-variance-authority';

export const groupWrapper = cva('space-y-6');

export const topRow = cva('flex flex-col gap-4 rounded-xl bg-neutral-50 p-6 lg:h-[280px]');

export const searchColumn = cva('flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between');

export const letterTitle = cva('text-sm font-normal text-[#161616]');

export const letterList = cva(
  'flex flex-nowrap items-center gap-2 !overflow-x-auto scrollbar-thin [&:: -webkit - scrollbar]: h - 2 [&:: -webkit - scrollbar - track]: bg - gray - 100 [&:: -webkit - scrollbar - thumb]: rounded - full [&:: -webkit - scrollbar - thumb]: bg - gray - 300 hover: [&:: -webkit - scrollbar - thumb]: bg - gray - 400',
);

export const clearFiltersButton = cva([
  'text-sm font-medium rounded-sm h-8 px-3',
  'text-[#161616] bg-transparent hover:text-[#384250]',
  'shrink-0',
  'font-medium',
  'cursor-pointer',
  'transition-colors',
]);
