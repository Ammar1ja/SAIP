'use client';

import React, { useMemo, useState } from 'react';
import { ROUTES } from '@/lib/routes';
import Section from '@/components/atoms/Section';
import { FilterButtonGroup } from '@/components/molecules/FilterButtonGroup/FilterButtonGroup';
import StatisticsCard from '@/components/organisms/StatisticsSection/StatisticsCard';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { IPObservatoryData } from '@/lib/drupal/services/ip-observatory.service';
import { useTranslations } from 'next-intl';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { useIsMobile } from '@/hooks/useIsMobile';
import LastUpdateBar from '@/components/atoms/LastUpdateBar';

interface IpObservatoryContentProps {
  data: IPObservatoryData;
}

export default function IpObservatoryContent({ data }: IpObservatoryContentProps) {
  const t = useTranslations('ipObservatory');
  const tCategories = useTranslations('ipCategories.names');
  const isMobile = useIsMobile();

  // Tab keys for state management (language-independent)
  const TAB_APPLICATION = 'application';
  const TAB_CERTIFICATES = 'certificates';

  const [activeTabKey, setActiveTabKey] = useState(TAB_APPLICATION);

  // Get statistics from Drupal data
  const ipServicesData =
    activeTabKey === TAB_APPLICATION
      ? data.statistics.ipServices.application
      : data.statistics.ipServices.certificates;
  const ipEnablementData =
    data.statistics.ipEnablement.application.length > 0
      ? data.statistics.ipEnablement.application
      : data.statistics.ipEnablement.certificates;
  const ipEnforcementData =
    data.statistics.ipEnforcement.application.length > 0
      ? data.statistics.ipEnforcement.application
      : data.statistics.ipEnforcement.certificates;

  // Tab labels from translations
  const tabConfig = [
    { key: TAB_APPLICATION, label: t('tabs.registrationApplication') },
    { key: TAB_CERTIFICATES, label: t('tabs.registrationCertificates') },
  ];

  const tabLabels = tabConfig.map((tab) => tab.label);
  const activeTab = tabConfig.find((tab) => tab.key === activeTabKey)?.label || tabLabels[0];

  const handleTabChange = (label: string) => {
    const tab = tabConfig.find((t) => t.label === label);
    if (tab) {
      setActiveTabKey(tab.key);
    }
  };

  const normalizeCategoryKey = (value: string) =>
    value.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  const categoryKeyByNormalized: Record<string, string> = {
    patents: 'Patents',
    trademarks: 'Trademarks',
    copyrights: 'Copyrights',
    designs: 'Designs',
    'plant varieties': 'Plant Varieties',
    'plant variety': 'Plant Varieties',
    'layout designs': 'Layout Designs',
    'layout designs of ic': 'Layout Designs',
    'topographic designs of ic': 'Topographic designs of IC',
    'topographic design of ic': 'Topographic designs of IC',
  };

  const resolveCategoryHeading = useMemo(() => {
    const matchers: Array<{ match: RegExp; labelKey: string }> = [
      { match: /patent|براءات/, labelKey: 'Patents' },
      { match: /trademark|العلامات/, labelKey: 'Trademarks' },
      { match: /copyright|حقوق/, labelKey: 'Copyrights' },
      {
        match: /topographic|layout\s*design|التخطيطية|الدوائر/,
        labelKey: 'Topographic designs of IC',
      },
      { match: /designs|التصاميم/, labelKey: 'Designs' },
      { match: /plant\s*variet|الأصناف/, labelKey: 'Plant Varieties' },
    ];

    const resolveKeyFromLabel = (label: string) => {
      const rawKey = label.includes('ipCategories.names.')
        ? label.split('.').pop() || label
        : label;
      const normalizedKey = normalizeCategoryKey(rawKey);
      return categoryKeyByNormalized[normalizedKey];
    };

    return (label?: string) => {
      if (!label) return undefined;
      const keyFromLabel = resolveKeyFromLabel(label);
      if (keyFromLabel) return tCategories(keyFromLabel as any);
      const normalized = normalizeCategoryKey(label);
      const match = matchers.find((m) => m.match.test(normalized));
      return match ? tCategories(match.labelKey as any) : undefined;
    };
  }, [tCategories]);

  const resolveCardLabel = (label: string) => {
    if (!label) return label;
    const rawKey = label.includes('ipCategories.names.') ? label.split('.').pop() || label : label;
    const normalizedKey = normalizeCategoryKey(rawKey);
    const mappedKey = categoryKeyByNormalized[normalizedKey];
    if (mappedKey) {
      const translated = tCategories(mappedKey as any);
      return translated || label;
    }
    return label;
  };

  const renderMobileStatCard = (label: string, value: number) => {
    return (
      <div className="flex flex-col h-[240px] rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-[72px] leading-[72px] font-medium tracking-[-0.03em] text-success-600">
            {value}
          </div>
        </div>
        <div className="bg-neutral-50 px-6 py-4 rounded-t-3xl text-center text-[18px] leading-[28px] font-medium text-neutral-900">
          {label}
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <Section background="neutral">
          <div className="space-y-3">
            <h2 className="text-[30px] leading-[38px] font-medium text-neutral-900">
              {data.ipServices.heading}
            </h2>
            <p className="text-lg leading-7 text-text-primary-paragraph">
              {data.ipServices.description}
            </p>
          </div>
          <div className="mt-8">
            <FilterButtonGroup
              tabs={tabLabels}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              buttonClassName="h-8 px-2"
            />
          </div>
          <div className="mt-8 space-y-6">
            {ipServicesData.map((item, idx) => {
              const heading = resolveCategoryHeading(item.label);
              return (
                <div key={`${item.label}-${idx}`} className="space-y-4">
                  {heading && (
                    <h3 className="text-[30px] leading-[38px] font-medium text-neutral-900">
                      {heading}
                    </h3>
                  )}
                  {renderMobileStatCard(resolveCardLabel(item.label), item.value)}
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_SERVICES.ROOT}>
              <Button intent="secondary" outline className="w-full" ariaLabel={t('seeDetails')}>
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </Section>

        <Section background="neutral">
          <h2 className="text-[30px] leading-[38px] font-medium text-neutral-900">
            {data.ipEnablement.heading}
          </h2>
          <div className="mt-8 space-y-4">
            {ipEnablementData.map((item, idx) => (
              <div key={`${item.label}-${idx}`}>
                {renderMobileStatCard(resolveCardLabel(item.label), item.value)}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_ENABLEMENT.ROOT}>
              <Button intent="secondary" outline className="w-full" ariaLabel={t('seeDetails')}>
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </Section>

        <Section background="neutral">
          <h2 className="text-[30px] leading-[38px] font-medium text-neutral-900">
            {data.ipEnforcement.heading}
          </h2>
          <div className="mt-8 space-y-4">
            {ipEnforcementData.map((item, idx) => (
              <div key={`${item.label}-${idx}`}>
                {renderMobileStatCard(resolveCardLabel(item.label), item.value)}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_ENFORCEMENT.ROOT}>
              <Button intent="secondary" outline className="w-full" ariaLabel={t('seeDetails')}>
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </Section>

        <FeedbackSection />
      </>
    );
  }

  return (
    <>
      <Section>
        <div className="flex flex-col md:flex-row xl:px-4 md:justify-between mb-6 gap-4">
          <div className="flex-grow">
            <h2 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[60px] font-medium md:tracking-[-0.96px] mb-2 md:mb-4">
              {data.ipServices.heading}
            </h2>
            <p className="text-base md:text-[18px] md:leading-[28px] text-neutral-600 max-w-[628px] mb-4 md:mb-0">
              {data.ipServices.description}
            </p>
            <div className="mt-4 md:mt-6 w-full">
              <FilterButtonGroup
                tabs={tabLabels}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0 md:self-start">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_SERVICES.ROOT}>
              <Button
                intent="secondary"
                outline
                className="w-full md:w-auto h-10 px-5"
                ariaLabel={t('seeDetails')}
              >
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ipServicesData.map((item, idx) => {
              const heading = resolveCategoryHeading(item.label);
              return (
                <div key={`${item.label}-${idx}`} className="space-y-6">
                  {heading && (
                    <h3 className="text-[32px] leading-[40px] md:text-[36px] md:leading-[44px] font-medium text-neutral-900 md:tracking-[-0.72px]">
                      {heading}
                    </h3>
                  )}
                  <StatisticsCard {...item} />
                </div>
              );
            })}
          </div>
          {data.lastDataUpdate && (
            <div className="flex justify-center">
              <LastUpdateBar
                date={data.lastDataUpdate}
                label={t('lastDataUpdate')}
                className="max-w-[846px] w-full py-2 px-4"
                textClassName="text-[18px] leading-[28px] text-neutral-600"
              />
            </div>
          )}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col md:flex-row md:justify-between xl:px-4 mb-6 gap-4">
          <div className="flex-grow">
            <h2 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[60px] font-medium md:tracking-[-0.96px] mb-2 md:mb-4">
              {data.ipEnablement.heading}
            </h2>
            <p className="text-base md:text-[18px] md:leading-[28px] text-neutral-600 max-w-[628px]">
              {data.ipEnablement.description}
            </p>
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0 md:self-start">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_ENABLEMENT.ROOT}>
              <Button
                intent="secondary"
                outline
                className="w-full md:w-auto h-10 px-5"
                ariaLabel={t('seeDetails')}
              >
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {ipEnablementData.map((item, idx) => (
            <StatisticsCard key={idx} {...item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col md:flex-row md:justify-between xl:px-4 mb-6 gap-4">
          <div className="flex-grow">
            <h2 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[60px] font-medium md:tracking-[-0.96px] mb-2 md:mb-4">
              {data.ipEnforcement.heading}
            </h2>
            <p className="text-base md:text-[18px] md:leading-[28px] text-neutral-600 max-w-[628px]">
              {data.ipEnforcement.description}
            </p>
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0 md:self-start">
            <Link href={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_ENFORCEMENT.ROOT}>
              <Button
                intent="secondary"
                outline
                className="w-full md:w-auto h-10 px-5"
                ariaLabel={t('seeDetails')}
              >
                {t('seeDetails')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {ipEnforcementData.map((item, idx) => (
            <StatisticsCard key={idx} {...item} />
          ))}
        </div>
      </Section>
      <FeedbackSection />
    </>
  );
}
