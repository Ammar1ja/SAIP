'use client';

import { useState } from 'react';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import Section from '@/components/atoms/Section';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import {
  CommitteeTabData,
  CommitteeResponsibilityData,
} from '@/lib/drupal/services/ip-general-secretariat.service';
import { StatisticsCardData } from '@/lib/drupal/services/common-types';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

interface GeneralSecretariatOverviewProps {
  committeeVerticalTabs: Array<{ id: string; label: string }>;
  committeeVerticalTabsData: CommitteeTabData[];
  responsibilities: CommitteeResponsibilityData[];
  statistics: StatisticsCardData[];
  relatedPages: Array<{ title: string; href: string }>;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  committeesTitle: string;
  committeesDescription: string;
}

const INITIAL_ITEMS_TO_SHOW = 6;
const MOBILE_ITEMS_TO_SHOW = 3;

export const GeneralSecretariatOverview = ({
  committeeVerticalTabs,
  committeeVerticalTabsData,
  responsibilities,
  statistics,
  relatedPages,
  heroTitle,
  heroDescription,
  heroImage,
  committeesTitle,
  committeesDescription,
}: GeneralSecretariatOverviewProps) => {
  const t = useTranslations('ipGeneralSecretariat.overview');
  const tButtons = useTranslations('buttons');

  const [activeVerticalTab, setActiveVerticalTab] = useState(
    committeeVerticalTabs[0]?.id || 'trademark-committee',
  );
  const [showAllResponsibilities, setShowAllResponsibilities] = useState(false);

  const hasMoreResponsibilities = responsibilities.length > MOBILE_ITEMS_TO_SHOW;

  const overviewAnchorItems = [
    { label: t('nav.committees'), href: '#committees' },
    { label: t('nav.responsibilities'), href: '#responsibilities' },
    { label: t('nav.statistics'), href: '#statistics' },
    { label: t('nav.relatedPages'), href: '#related' },
  ];

  return (
    <>
      <HeroStatic
        title={heroTitle}
        description={heroDescription}
        backgroundImage={heroImage || '/images/designs/hero.jpg'}
      />

      <Navigation items={overviewAnchorItems} className="hidden lg:block" />

      <Section id="committees" background="white" padding="large">
        <ServicesInformation
          tabs={committeeVerticalTabs}
          data={committeeVerticalTabsData}
          activeTab={activeVerticalTab}
          onTabChange={setActiveVerticalTab}
          title={committeesTitle}
          description={committeesDescription}
        />
      </Section>

      <Section id="responsibilities" background="neutral" padding="large">
        <div className="mb-6 flex w-full min-w-0 flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <h2 className="min-w-0 font-body text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[48px] md:leading-[60px]">
            {t('responsibilitiesTitle')}
          </h2>
          {hasMoreResponsibilities && (
            <button
              type="button"
              onClick={() => setShowAllResponsibilities(!showAllResponsibilities)}
              className="hidden shrink-0 md:inline-flex px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              aria-expanded={showAllResponsibilities}
              aria-label={showAllResponsibilities ? tButtons('viewLess') : tButtons('viewAll')}
            >
              {showAllResponsibilities ? tButtons('viewLess') : tButtons('viewAll')}
            </button>
          )}
        </div>
        <div
          className={twMerge(
            'grid w-full min-w-0 grid-cols-1 justify-items-start gap-x-6 gap-y-6',
            'sm:grid-cols-2',
            'lg:grid-cols-3',
          )}
        >
          {responsibilities.map((responsibility, index) => {
            const hideOnMobile = !showAllResponsibilities && index >= MOBILE_ITEMS_TO_SHOW;
            const hideOnDesktop = !showAllResponsibilities && index >= INITIAL_ITEMS_TO_SHOW;

            return (
              <div
                key={responsibility.id}
                className={twMerge(
                  'box-border flex h-auto min-h-[120px] w-full min-w-0 max-w-[410.67px] items-center overflow-visible rounded-lg border border-border-natural-primary bg-white p-6 shadow-none sm:h-[120px] sm:min-h-[120px] sm:max-h-[120px] sm:overflow-hidden',
                  hideOnMobile ? 'hidden md:flex' : '',
                  hideOnDesktop ? 'md:hidden' : '',
                )}
              >
                <p className="m-0 w-full text-start font-body text-[16px] font-normal leading-6 tracking-normal text-text-primary-paragraph max-sm:line-clamp-none sm:line-clamp-3 sm:leading-5">
                  {responsibility.description}
                </p>
              </div>
            );
          })}
        </div>
        {hasMoreResponsibilities && (
          <button
            onClick={() => setShowAllResponsibilities(!showAllResponsibilities)}
            className="mt-6 w-full md:hidden px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            aria-expanded={showAllResponsibilities}
            aria-label={showAllResponsibilities ? tButtons('viewLess') : tButtons('viewAll')}
          >
            {showAllResponsibilities ? tButtons('viewLess') : tButtons('viewAll')}
          </button>
        )}
      </Section>

      <section id="statistics">
        <StatisticsSection title={t('statisticsTitle')} stats={statistics} columns={3} />
      </section>

      <section id="related">
        <RelatedPagesSection pages={relatedPages} />
      </section>
    </>
  );
};
