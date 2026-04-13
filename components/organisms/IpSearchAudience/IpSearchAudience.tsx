'use client';

import React from 'react';
import { CardGrid } from '@/components/organisms/CardGrid/CardGrid';
import { IconBackground, IconProps } from '@/components/atoms/Icon/Icon.types';
import { Search, Scale, Landmark, Briefcase, BarChart2, LucideIcon } from 'lucide-react';

export interface AudienceItemProps {
  title: string;
  description: string;
  iconName: string;
}

export interface IpSearchAudienceSectionProps {
  heading: string;
  items: AudienceItemProps[];
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Search,
  Scale,
  Landmark,
  Briefcase,
  BarChart2,
};

export const IpSearchAudienceSection = ({ heading, items }: IpSearchAudienceSectionProps) => {
  const cardItems = items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: {
      component: iconMap[item.iconName] || Search,
      alt: `${item.title} icon`,
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
      className: 'rounded-md',
    },
  }));

  return (
    <CardGrid
      items={cardItems}
      heading={heading}
      showViewAll={true}
      className="max-w-[1280px] mx-auto xl:px-0"
      headingClassName="!text-[48px] !leading-[60px] !font-medium not-italic tracking-[-0.02em] text-text-default max-w-[720px] w-full antialiased"
      headingWrapperClassName="!mb-12"
      cardClassName="h-[204px] box-border p-6 rounded-2xl bg-white border border-[#D2D6DB] shadow-none flex flex-col items-start overflow-hidden"
      cardContentClassName="flex flex-col items-start flex-1 w-full !space-y-0 gap-0 [&>h3]:mt-0 [&>h3]:mb-0 [&>p]:mt-2"
      cardIconClassName="!mb-6"
      titleClassName="text-[18px] sm:text-[18px] md:text-[18px] lg:text-[18px] leading-[28px] sm:leading-[28px] md:leading-[28px] lg:leading-[28px] font-medium text-[#1F2A37] break-words"
      cardDescriptionClassName="text-[16px] leading-[24px] font-normal text-[#384250] break-words"
    />
  );
};
