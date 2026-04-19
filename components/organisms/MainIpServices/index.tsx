'use client';

import React from 'react';
import ContentBlock from '@/components/molecules/ContentBlock';
import Section from '@/components/atoms/Section';
import Card from '@/components/molecules/Card';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import Button from '@/components/atoms/Button';
import { ROUTES } from '@/lib/routes';
import { useLocale } from 'next-intl';

// Fallback data when Drupal API is unavailable
const fallbackData = [
  { title: 'Patents', href: ROUTES.SERVICES.PATENTS },
  { title: 'Trademarks', href: ROUTES.SERVICES.TRADEMARKS },
  { title: 'Copyrights', href: ROUTES.SERVICES.COPYRIGHTS },
  { title: 'Designs', href: ROUTES.SERVICES.DESIGNS },
  {
    title: 'Layout designs of IC',
    href: ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS,
  },
  { title: 'Plant varieties', href: ROUTES.SERVICES.PLANT_VARIETIES },
];

export interface MainIpServicesProps {
  heading: string;
  text: React.ReactNode | string;
  items?: Array<{ title: string; href: string }>;
}

export const MainIpServices = ({ heading, text, items }: MainIpServicesProps) => {
  // Use Drupal data if available, otherwise fallback
  const cards = items && items.length > 0 ? items : fallbackData;
  const isRtl = useLocale() === 'ar';
  return (
    <Section
      background="neutral"
      columns="two"
      itemsAlign="start"
      className="max-w-screen-xl w-full px-4 md:px-8 lg:px-8 py-2 md:py-4 lg:py-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,616px)] lg:gap-8 xl:gap-12"
    >
      <div className="flex flex-col justify-center">
        <ContentBlock heading={heading} text={text} className="mb-2 md:mb-4 lg:mb-8" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full xl:max-w-[616px] xl:justify-self-end">
        {cards.map((item) => (
          <Card
            key={item.title}
            shadow={false}
            className="h-[158px] max-w-none rounded-2xl border border-[#D2D6DB] p-6"
          >
            <div className="flex flex-col h-full w-full">
              <span className="text-lg font-medium mb-8">
                {item.title.includes('integrated circuits') ? 'Layout designs of IC' : item.title}
              </span>
              <div className="mt-auto self-end w-full">
                <Button
                  intent="secondary"
                  href={item.href}
                  ariaLabel={item.title}
                  className="w-[40px] md:w-20 h-[40px] md:h-10 px-4 flex items-center justify-center shrink-0"
                >
                  <ArrowWide
                    direction={isRtl ? 'left' : 'right'}
                    className={isRtl ? '!rotate-180' : 'rotate-0'}
                    size="smallWide"
                    background="natural"
                    shape="square"
                  />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};
