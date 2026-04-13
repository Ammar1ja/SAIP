'use client';

import { FC, useState } from 'react';
import Section from '@/components/atoms/Section';
import TabVertical from '@/components/molecules/TabVertical';
import { PhotoContainer } from '@/components/molecules/PhotoContainer/PhotoContainer';
import { ExpandableTabGroup } from '@/components/molecules/ExpandableTabGroup/ExpandableTabGroup';
import { NationalPillarsProps } from './NationalPillars.types';
import { NATIONAL_PILLARS } from './NationalPillars.data';
import {
  contentContainerStyles,
  navigationContainerStyles,
  titleStyles,
} from './NationalPillars.styles';
import { useTranslations } from 'next-intl';

export const NationalPillars: FC<NationalPillarsProps> = ({
  className,
  heading = 'National pillars',
  text: _text,
  items = NATIONAL_PILLARS,
}) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const t = useTranslations('common.errors');

  // ✅ Safety check: return early if no items
  if (!items || items.length === 0) {
    return (
      <Section className={className}>
        <h2 className={titleStyles()}>{heading}</h2>
        <p className="text-center text-gray-500 py-8">
          {t('noPillarsAvailable') || 'No pillars available.'}
        </p>
      </Section>
    );
  }

  const activePillar = items.find((pillar) => pillar.id === activeTab) || items[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab((prevTab) => (prevTab === tabId ? undefined : tabId));
  };

  return (
    <Section className={className}>
      <h2 className={titleStyles()}>{heading}</h2>

      {/* Desktop version */}
      <div className="hidden lg:block">
        <div className={contentContainerStyles()}>
          <div className={navigationContainerStyles()}>
            <TabVertical
              tabs={items.map((pillar) => ({
                id: pillar.id,
                label: pillar.title,
              }))}
              activeTab={activeTab || items[0]?.id || ''}
              onTabChange={setActiveTab}
            />
          </div>
          <div className="flex-1">
            <PhotoContainer
              description={activePillar?.description || ''}
              image={activePillar?.image}
              className="h-[320px] w-full rounded-2xl bg-neutral-100 xl:h-[372px] xl:max-w-[940px]"
              imageClassName="h-full w-[38%] min-w-[320px] rounded-l-2xl rounded-r-none xl:w-[416px]"
              contentClassName="flex h-full min-w-0 flex-1 items-center px-6 py-0 !space-y-0 xl:px-10"
              descriptionClassName="w-full max-w-[444px] text-[18px] leading-[28px] font-normal text-text-primary-paragraph"
            />
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="lg:hidden">
        <ExpandableTabGroup items={items} activeId={activeTab} onTabChange={handleTabChange} />
      </div>
    </Section>
  );
};
