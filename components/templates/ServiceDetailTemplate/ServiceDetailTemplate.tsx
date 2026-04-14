'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import CommentsAndSuggestionsSection from '@/components/organisms/CommentsAndSuggestionsSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { Clock, BadgeDollarSign, Users, MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.svg';

export interface ServiceDetailData {
  id: string;
  title: string;
  description: string;
  category?: string;

  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;

  steps: Array<{
    number: number;
    title: string;
    icon?: string;
    details: string[];
  }>;

  requirements:
    | string[]
    | Array<{
        title: string;
        items: string[];
      }>;

  relatedServices?: Array<{
    title: string;
    description?: string;
    href: string;
    labels?: string[];
  }>;
}

interface ServiceDetailTemplateProps {
  serviceData: ServiceDetailData;
  breadcrumbItems: Array<{ label: string; href?: string }>;
  category?: string;
}

const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

export default function ServiceDetailTemplate({
  serviceData,
  breadcrumbItems,
  category,
}: ServiceDetailTemplateProps) {
  const [activeTab, setActiveTab] = useState('steps');
  const t = useTranslations('serviceDetail');
  const tSidebar = useTranslations('serviceDetail.sidebar');
  const tCommons = useTranslations('common');
  const locale = useLocale();

  // Normalize requirements format
  const normalizedRequirements = Array.isArray(serviceData.requirements)
    ? typeof serviceData.requirements[0] === 'string'
      ? serviceData.requirements
      : serviceData.requirements
    : [];
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <Breadcrumbs className="mb-8" items={breadcrumbItems} />

        <button
          className="cursor-pointer mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
          onClick={() => window.history.back()}
        >
          <LeadingIcon
            width={16}
            height={16}
            className={`${isRtl ? 'rotate-180 mt-1 ' : 'rotate-0 mb-1 '}`}
          />{' '}
          Go back to Services
        </button>

        <div className="mb-14" />

        <h1 className="text-5xl font-bold mb-2">{serviceData.title}</h1>

        {(category || serviceData.category) && (
          <div className="flex gap-2 mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold">
              {category || serviceData.category}
            </span>
          </div>
        )}

        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{serviceData.description}</p>
      </Section>

      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Mobile Sidebar */}
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: tSidebar('executionTime'),
                  value: serviceData.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: tSidebar('serviceFee'),
                  value: serviceData.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: tSidebar('targetGroup'),
                  value: serviceData.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: tSidebar('serviceChannel'),
                  value: serviceData.serviceChannel,
                },
              ]}
              faqHref={serviceData.faqHref}
              primaryButtonHref={serviceData.platformHref}
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

            {activeTab === 'steps' && <TimelineSteps steps={serviceData.steps} />}
            {activeTab === 'requirements' &&
              (typeof normalizedRequirements[0] === 'string' ? (
                <RequirementsList requirements={normalizedRequirements as string[]} />
              ) : (
                <RequirementsList requirements={normalizedRequirements as any} />
              ))}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: tSidebar('executionTime'),
                  value: serviceData.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: tSidebar('serviceFee'),
                  value: serviceData.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: tSidebar('targetGroup'),
                  value: serviceData.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: tSidebar('serviceChannel'),
                  value: serviceData.serviceChannel,
                },
              ]}
              faqHref={serviceData.faqHref}
              primaryButtonHref={serviceData.platformHref}
            />
          </div>
        </div>
      </Section>

      {/* Related Services */}
      {serviceData.relatedServices && serviceData.relatedServices.length > 0 && (
        <Section background="neutral" padding="large">
          <RelatedServicesSection
            title={t('relatedServices') || 'Related services'}
            description={t('relatedServicesDesc') || 'Explore more services'}
            services={serviceData.relatedServices}
          />
        </Section>
      )}

      {/* Comments & Suggestions */}
      <Section background="white" padding="large">
        <div className="max-w-7xl mx-auto">
          <CommentsAndSuggestionsSection buttonHref={ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT} />
        </div>
      </Section>

      {/* Feedback Section */}
      <FeedbackSection pageTitle={serviceData.title} />
    </main>
  );
}
