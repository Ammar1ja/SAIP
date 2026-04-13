'use client';

import React from 'react';
import { CardGrid } from '@/components/organisms/CardGrid/CardGrid';
import { tiscResponsibilitiesData } from './TiscResponsibilities.data';

const tiscCardItems = tiscResponsibilitiesData.map((item) => ({
  ...item,
  icon: {
    ...item.icon,
    className: '!h-12 !w-12 !min-h-12 !min-w-12 !p-0 [&_svg]:!h-7 [&_svg]:!w-7',
  },
}));

export const TiscResponsibilities = () => {
  return (
    <CardGrid
      items={tiscCardItems}
      heading="TISC responsibilities"
      showViewAll={false}
      gridClassName="grid w-full min-w-0 grid-cols-1 justify-items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
      cardClassName="box-border h-[176px] min-h-[176px] max-h-[176px] w-[410px] max-w-full min-w-0 overflow-hidden rounded-[8px] border border-border-natural-primary bg-white !p-6 shadow-none flex flex-col items-stretch"
      cardContentClassName="flex min-h-0 flex-1 flex-col items-start gap-4 w-full !space-y-0"
      cardDescriptionClassName="!text-[16px] !leading-6 font-normal text-gray-900 line-clamp-3"
      cardIconClassName="shrink-0"
    />
  );
};
