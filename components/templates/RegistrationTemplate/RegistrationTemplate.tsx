import { RegistrationTemplateProps } from './RegistrationTemplate.types';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import ServiceInfoSidebar from '@/components/organisms/ServiceInfoSidebar';
import LeadingIcon from '@/assets/images/leading_icon.svg';

const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

import { useState } from 'react';
import { useLocale } from 'next-intl';

const RegistrationTemplate = ({
  title,
  labels,
  description,
  steps,
  requirements,
  sidebarData,
  breadcrumbs,
  backHref,
}: RegistrationTemplateProps) => {
  const [activeTab, setActiveTab] = useState('steps');
  const locale = useLocale();
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        {breadcrumbs && <Breadcrumbs className="mb-8" items={breadcrumbs} />}
        {backHref && (
          <a
            href={backHref}
            className="mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition inline-block"
          >
            <LeadingIcon
              width={16}
              height={16}
              className={`${isRtl ? 'rotate-180 mt-1 ' : 'rotate-0 mb-1 '}`}
            />{' '}
            Go back to Services
          </a>
        )}
        <div className="mb-14" />
        <h1 className="text-5xl font-bold mb-2">{title}</h1>
        <div className="flex gap-2 mb-4">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold"
            >
              {label}
            </span>
          ))}
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{description}</p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Sticky sidebar na mobile nad krokami */}
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow-lg mb-8 px-4 mt-4">
            <ServiceInfoSidebar {...sidebarData} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-8 border-b border-neutral-200 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`py-2 px-1 text-lg font-medium border-b-2 transition focus:outline-none ${activeTab === tab.id ? 'border-primary-700 text-primary-900' : 'border-transparent text-neutral-500 hover:text-primary-700'}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'steps' && <TimelineSteps steps={steps} />}
            {activeTab === 'requirements' && <RequirementsList requirements={requirements} />}
          </div>
          {/* Sticky sidebar na desktopie po prawej */}
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <ServiceInfoSidebar {...sidebarData} />
          </div>
        </div>
      </Section>
    </main>
  );
};

export default RegistrationTemplate;
