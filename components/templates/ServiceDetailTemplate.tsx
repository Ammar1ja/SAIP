'use client';

import { useState } from 'react';
import Breadcrumbs from '../molecules/Breadcrumbs';
import Section from '../atoms/Section';
import TimelineSteps from '../organisms/TimelineSteps';
import RequirementsList from '../organisms/RequirementsList';
import DetailSidebar from '../organisms/DetailSidebar';
import { Clock, BadgeDollarSign, Users, MapPin } from 'lucide-react';
import { ServiceDetailData } from '@/lib/drupal/services/service-universal.service';
import { useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.svg';

const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

interface ServiceDetailTemplateProps {
  data: ServiceDetailData;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  tags?: string[];
}

export default function ServiceDetailTemplate({
  data,
  breadcrumbs,
  tags,
}: ServiceDetailTemplateProps) {
  const [activeTab, setActiveTab] = useState('steps');
  const locale = useLocale();
  const defaultBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/services-overview' },
    { label: data.title },
  ];

  const defaultTags = ['Service', 'Protection'];
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <Breadcrumbs className="mb-8" items={breadcrumbs || defaultBreadcrumbs} />
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
        <h1 className="text-5xl font-bold mb-2">{data.title}</h1>
        <div className="flex gap-2 mb-4">
          {(tags || defaultTags).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{data.description}</p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: 'Execution time',
                  value: data.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: 'Service fee',
                  value: data.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: 'Target group',
                  value: data.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: 'Service channel',
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel="Go to FAQs page"
              primaryButtonLabel="Go to SAIP Platform"
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel="Go to SAIP Platform"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-8 border-b border-neutral-200 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`cursor-pointer py-2 px-1 text-lg font-medium border-b-2 transition focus:outline-none ${activeTab === tab.id ? 'border-primary-700 text-primary-900' : 'border-transparent text-neutral-500 hover:text-primary-700'}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'steps' && <TimelineSteps steps={data.steps as any} />}
            {activeTab === 'requirements' && <RequirementsList requirements={data.requirements} />}
          </div>
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: 'Execution time',
                  value: data.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: 'Service fee',
                  value: data.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: 'Target group',
                  value: data.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: 'Service channel',
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel="Go to FAQs page"
              primaryButtonLabel="Go to SAIP Platform"
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel="Go to SAIP Platform"
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
