'use client';

import { FC, useMemo } from 'react';
import Section from '@/components/atoms/Section';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import { OffersSectionProps } from './IpAcademyOffersSection.types';
import { TABS, OFFERS } from './IpAcademyOffersSection.data';
import Heading from '@/components/atoms/Heading';
import { useTabs } from '@/hooks/useTabs';
import { useTranslations } from 'next-intl';

const OffersSection: FC<OffersSectionProps> = ({ tabs = TABS, data = OFFERS }) => {
  const t = useTranslations('ipAcademy');
  const tTabs = useTranslations('tabs');

  // Translate tab labels from messages
  const translatedTabs = useMemo(() => {
    return tabs.map((tab) => {
      let label = tab.label;
      if (tab.id === 'training') label = tTabs('trainingPrograms');
      else if (tab.id === 'qualifications') label = tTabs('proQualifications');
      else if (tab.id === 'projects') label = tTabs('educationProjects');
      return { ...tab, label };
    });
  }, [tabs, tTabs]);

  const { activeTab, setActiveTab } = useTabs(translatedTabs);

  // Apply translations to button labels
  const translatedData = useMemo(() => {
    return data.map((offer) => ({
      ...offer,
      buttonLabel: offer.buttonLabel === 'Learn more' ? t('learnMore') : offer.buttonLabel,
    }));
  }, [data, t]);

  return (
    <Section padding="large">
      <Heading
        as="h2"
        size="custom"
        className="mb-6 text-[30px] leading-[38px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px] tracking-[-0.02em] font-medium text-text-default"
        aria-label={t('whatWeOffer')}
      >
        {t('whatWeOffer')}
      </Heading>
      {translatedTabs?.length && translatedData?.length ? (
        <ServicesInformation
          tabs={translatedTabs}
          data={translatedData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showHeader={false}
          tabsContainerClassName="w-[308px] shrink-0"
          photoContainerClassName="h-[472px] rounded-2xl bg-neutral-100"
          photoImageClassName="h-[472px] w-[416px] rounded-l-2xl rounded-r-none"
          photoContentClassName="space-y-3 px-10"
          photoDescriptionClassName="text-[18px] leading-[28px] text-primary-paragraph"
        />
      ) : (
        <p className="text-center text-neutral-500">No offers available.</p>
      )}
    </Section>
  );
};

export default OffersSection;
