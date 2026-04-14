'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import CommentsAndSuggestionsSection from '@/components/organisms/CommentsAndSuggestionsSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import { Clock, BadgeDollarSign, Users, MapPin } from 'lucide-react';
import type { IPClinicsServiceDetail } from '@/lib/drupal/services/service-detail-ip-clinics.service';
import { ROUTES } from '@/lib/routes';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.svg';
interface ConsultancyServicesPageClientProps {
  data: IPClinicsServiceDetail;
  relatedServices: any[];
}

export default function ConsultancyServicesPageClient({
  data,
  relatedServices,
}: ConsultancyServicesPageClientProps) {
  const [activeTab, setActiveTab] = useState('steps');
  const t = useTranslations('serviceDetail');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const TABS = [
    { id: 'steps', label: t('applicationSteps') },
    { id: 'requirements', label: t('requirements') },
  ];
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: tBreadcrumbs('home') || 'Home', href: ROUTES.HOME },
            {
              label: tBreadcrumbs('serviceDirectory') || 'SAIP Service Directory',
              href: ROUTES.SERVICES.SERVICE_DIRECTORY,
            },
            { label: data.title },
          ]}
        />
        <Link
          href={ROUTES.SERVICES.SERVICE_DIRECTORY}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
        >
          <LeadingIcon
            width={16}
            height={16}
            className={`${isRtl ? 'rotate-180 mt-1 ' : 'rotate-0 mb-1 '}`}
          />{' '}
          {t('goBackToServices')}
        </Link>
        <div className="mb-8 md:mb-14" />
        <h1 className="text-3xl md:text-5xl font-medium mb-2">{data.title}</h1>
        {data.labels?.length ? (
          <div className="flex gap-2 mb-4">
            {data.labels.map((label) => (
              <span
                key={label}
                className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{data.description}</p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Mobile Sidebar */}
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: t('executionTime'),
                  value: data.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: t('serviceFee'),
                  value: data.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: t('targetGroup'),
                  value: data.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: t('serviceChannel'),
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel={t('faqLabel')}
              primaryButtonLabel={t('goToPlatform')}
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel={t('goToPlatform')}
              secondaryButtonLabel={data.secondaryButtonLabel}
              secondaryButtonHref={data.secondaryButtonHref}
              secondaryButtonAriaLabel={data.secondaryButtonLabel}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-8 border-b border-neutral-200 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`cursor-pointer py-2 px-1 text-lg font-medium border-b-2 transition focus:outline-none ${
                    activeTab === tab.id
                      ? 'border-primary-700 text-primary-900'
                      : 'border-transparent text-neutral-500 hover:text-primary-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'steps' && <TimelineSteps steps={data.steps} />}
            {activeTab === 'requirements' && <RequirementsList requirements={data.requirements} />}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: t('executionTime'),
                  value: data.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: t('serviceFee'),
                  value: data.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: t('targetGroup'),
                  value: data.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: t('serviceChannel'),
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel={t('faqLabel')}
              primaryButtonLabel={t('goToPlatform')}
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel={t('goToPlatform')}
              secondaryButtonLabel={data.secondaryButtonLabel}
              secondaryButtonHref={data.secondaryButtonHref}
              secondaryButtonAriaLabel={data.secondaryButtonLabel}
            />
          </div>
        </div>
      </Section>

      {/* Related Services */}
      {relatedServices.length > 0 && <RelatedServicesSection services={relatedServices} />}

      {/* Comments & Suggestions */}
      <Section background="white" padding="large">
        <div className="max-w-7xl mx-auto">
          <CommentsAndSuggestionsSection buttonHref={ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT} />
        </div>
      </Section>

      {/* Feedback Section */}
      <FeedbackSection pageTitle="IP Clinics Consultancy Services" />
    </main>
  );
}
