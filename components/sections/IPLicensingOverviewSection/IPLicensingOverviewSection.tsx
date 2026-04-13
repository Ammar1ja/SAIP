'use client';

import React from 'react';
import Section from '@/components/atoms/Section';
import Card from '@/components/molecules/Card';
import QuickLinks from '@/components/organisms/QuickLinks';
import IPLicensingRelatedServicesSection from '@/components/sections/IPLicensingRelatedServicesSection';
import { IP_LICENSING_RELATED_SERVICES } from '@/components/sections/IPLicensingRelatedServicesSection/IPLicensingRelatedServicesSection.data';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import Image from 'next/image';
import { ROUTES } from '@/lib/routes';
import {
  IP_LICENSING_GUIDE_DATA,
  IP_LICENSING_REQUIREMENTS,
  IP_LICENSING_EXEMPTIONS,
} from './IPLicensingOverviewSection.data';
import { IPLicensingOverviewSectionProps } from './IPLicensingOverviewSection.types';
import { useTranslations } from 'next-intl';

const IPLicensingOverviewSection = ({
  guideData = IP_LICENSING_GUIDE_DATA,
  requirements = IP_LICENSING_REQUIREMENTS,
  exemptions = IP_LICENSING_EXEMPTIONS,
  quickLinks,
  relatedPages,
  relatedServices,
}: IPLicensingOverviewSectionProps) => {
  const t = useTranslations('ipLicensing');

  const defaultQuickLinks = [
    { label: t('quickLinks.ipAgents'), href: ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT },
    {
      label: t('quickLinks.supervisoryUnit'),
      href: ROUTES.RESOURCES.IP_LICENSING.SUPERVISORY_UNIT_FOR_NON_PROFIT_SECTOR_ORGANIZATIONS.ROOT,
    },
  ];

  const resolvedQuickLinks = quickLinks && quickLinks.length > 0 ? quickLinks : defaultQuickLinks;

  const sortedRequirements = [...requirements].sort((a, b) => a.number - b.number);

  return (
    <>
      <Section id="information-library" className="pt-20 pb-10">
        <h2 className="mb-12 text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
          {t('informationLibrary')}
        </h2>
        <h3 className="mb-6 max-w-[720px] text-[36px] leading-[44px] tracking-[-0.72px] font-medium">
          {guideData.title}
        </h3>
        <Card
          variant="wide"
          className="items-stretch gap-0 min-h-[372px] overflow-hidden rounded-2xl bg-neutral-100 max-sm:flex-col sm:p-0"
        >
          <div className="relative h-[280px] w-full shrink-0 sm:h-[372px] sm:w-[416px] sm:max-w-[416px]">
            <Image
              src={'/images/photo-container.png'}
              alt={'Guide Image'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8 p-10">
            <p className="max-w-[628px] text-[18px] leading-[28px] text-primary-paragraph">
              {guideData.description}
            </p>
            <div className="flex flex-wrap gap-4 max-sm:flex-col">
              <a
                href={guideData.viewFileHref}
                className="inline-flex h-10 items-center justify-center rounded-sm border border-neutral-300 bg-white px-4 text-base font-medium text-neutral-900 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={t('viewFile')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5 ltr:mr-2 rtl:ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {t('viewFile')}
              </a>
              <a
                href={guideData.downloadFileHref}
                className="inline-flex h-10 items-center justify-center rounded-sm bg-green-700 px-4 text-base font-medium text-white transition hover:bg-green-800 focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={t('downloadFile')}
                download
              >
                <svg
                  className="w-5 h-5 ltr:mr-2 rtl:ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('downloadFile')}
              </a>
            </div>
          </div>
        </Card>
      </Section>

      <Section id="requirements" className="py-10">
        <h2 className="mb-4 max-w-[628px] text-[36px] leading-[44px] tracking-[-0.72px] font-medium">
          {t('requirementsTitle')}
        </h2>
        <p className="mb-8 max-w-[628px] text-base leading-6 text-primary-paragraph">
          {t('requirementsDescription')}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedRequirements.map((item) => (
            <div
              key={item.number}
              className="flex min-h-[212px] flex-col rounded-2xl border border-neutral-300 bg-white p-6 outline-none transition-shadow focus-within:ring-2 focus-within:ring-primary-500"
              tabIndex={0}
              aria-label={`Requirement ${item.number}: ${item.text}`}
              role="article"
            >
              <span
                className="mb-2 text-[48px] leading-[60px] tracking-[-0.96px] font-medium text-primary-700"
                aria-hidden="true"
              >
                {item.number}
              </span>
              <span className="text-base leading-6 text-[#1F2A37]">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 max-w-[628px]">
          <div className="flex-1">
            <ul className="list-disc space-y-1 pl-6 text-base leading-6 text-primary-paragraph rtl:pr-6 rtl:pl-0">
              {exemptions.map((exemption, index) => (
                <li key={index}>{exemption}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div id="quick-links">
        <QuickLinks title={t('quickLinksTitle')} links={resolvedQuickLinks} />
      </div>

      {(relatedServices && relatedServices.length > 0
        ? relatedServices
        : IP_LICENSING_RELATED_SERVICES
      ).length > 0 && (
        <div id="related-services">
          <IPLicensingRelatedServicesSection
            title={t('relatedServicesTitle')}
            services={
              relatedServices && relatedServices.length > 0
                ? relatedServices
                : IP_LICENSING_RELATED_SERVICES.map((service) => {
                    // Map service href to translation key
                    const translationKeyMap: Record<string, string> = {
                      '/saip-platform/ip-agent-registration': 'relatedServices.licenseRegistration',
                      '/saip-platform/ip-agent-exam': 'relatedServices.agentsExam',
                    };
                    const translationKey =
                      translationKeyMap[service.ctaHref] || 'relatedServices.licenseRegistration';

                    return {
                      ...service,
                      question: t(`${translationKey}.question`),
                      title: t(`${translationKey}.title`),
                      description: t(`${translationKey}.description`),
                      price: t(`${translationKey}.price`),
                      ctaLabel: t('goToPlatform'),
                    };
                  })
            }
          />
        </div>
      )}

      <div id="related-pages">
        <RelatedPagesSection pages={relatedPages} />
      </div>
    </>
  );
};

export default IPLicensingOverviewSection;
