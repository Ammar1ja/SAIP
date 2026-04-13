'use client';

import React from 'react';
import { CardGrid } from '@/components/organisms/CardGrid/CardGrid';
import { objectivesData } from './NationalStrategyObjectives.data';
interface NationalStrategyObjectivesProps {
  heading?: string;
  text?: string;
  items?: Array<{
    id: string;
    description: string;
    icon: string;
  }>;
}

export const NationalStrategyObjectives = ({
  heading = 'National strategy objectives',
  text: _text,
  items,
}: NationalStrategyObjectivesProps) => {
  const getObjectiveIconSrc = (description: string, index: number) => {
    const normalized = description.toLowerCase();

    if (normalized.includes('imagination') || normalized.includes('creative individuals')) {
      return '/icons/objectives/creativity.svg';
    }

    if (
      normalized.includes('development establishments') ||
      normalized.includes('intellectual property')
    ) {
      return '/icons/objectives/development.svg';
    }

    if (normalized.includes('society') || normalized.includes('creative efforts')) {
      return '/icons/objectives/innovation.svg';
    }

    return [
      '/icons/objectives/creativity.svg',
      '/icons/objectives/development.svg',
      '/icons/objectives/innovation.svg',
    ][index % 3];
  };

  // Use items from props (Drupal) or fallback to static data
  const objectiveItems =
    items ||
    objectivesData.map((item, index) => ({
      id: index.toString(),
      description: item.description || '',
      icon: '🎯',
    }));
  // Transform items to CardGrid format
  const cardGridItems = objectiveItems.map((item, index) => {
    const iconSrc = getObjectiveIconSrc(item.description, index);
    return {
      title: item.description,
      description: '',
      icon: {
        src: iconSrc,
        alt: item.description,
        size: 'large' as const,
        background: 'green' as const,
        className:
          '!h-12 !w-12 !min-h-12 !min-w-12 rounded-md !p-0 [&_svg]:!h-[18px] [&_svg]:!w-[18px] [&_svg]:text-white',
      },
    };
  });

  return (
    <CardGrid
      heading={heading}
      items={cardGridItems}
      showViewAll={false}
      background="white"
      headingClassName="text-[30px] leading-[38px] md:text-[48px] md:leading-[60px] tracking-[-0.02em] font-medium text-[#161616]"
      headingWrapperClassName="mb-12"
      gridClassName="gap-6 md:grid-cols-2 lg:grid-cols-3"
      cardClassName="h-auto min-h-[168px] max-w-none p-8 rounded-lg border-border-natural-primary md:h-[168px]"
      titleClassName="text-base font-normal text-[#1f2a37] line-clamp-none md:line-clamp-3"
    />
  );
};
