'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import Location from '@/assets/images/location.png';
import Riyal from '@/assets/images/Riyal.png';
import User from '@/assets/images/user.png';
import Watch from '@/assets/images/watch.png';
interface ServiceDetailClientProps {
  steps: Array<{
    number: number;
    title: string;
    icon?: string;
    details: (
      | string
      | { label: string; href: string; external?: boolean; variant?: 'link' | 'button' }
    )[];
  }>;
  requirements: string[];
  // Instead of pre-rendered sidebar items, pass raw values
  sidebarData: {
    executionTime: string;
    serviceFee: string;
    targetGroup: string;
    serviceChannel: string;
  };
  faqHref: string;
  platformHref: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
}

export default function ServiceDetailClient({
  steps,
  requirements,
  sidebarData,
  faqHref,
  platformHref,
  secondaryButtonLabel,
  secondaryButtonHref,
}: ServiceDetailClientProps) {
  const [activeTab, setActiveTab] = useState('steps');
  const t = useTranslations('serviceDetail');
  const tSidebar = useTranslations('serviceDetail.sidebar');

  // Generate sidebar items using CLIENT translations
  const sidebarItems = [
    {
      icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
      label: tSidebar('executionTime'),
      value: sidebarData.executionTime,
    },
    {
      icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
      label: tSidebar('serviceFee'),
      value: sidebarData.serviceFee,
    },
    {
      icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
      label: tSidebar('targetGroup'),
      value: sidebarData.targetGroup,
    },
    {
      icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
      label: tSidebar('serviceChannel'),
      value: sidebarData.serviceChannel,
    },
  ];

  const tabs = [
    { id: 'steps', label: t('tabs.steps') },
    { id: 'requirements', label: t('tabs.requirements') },
  ];

  return (
    <Section background="white" padding="default">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Mobile Sidebar */}
        <div className="block lg:hidden w-full max-w-full rounded-xl xl:shadow mb-8 px-4 mt-4">
          <DetailSidebar
            items={sidebarItems}
            faqHref={faqHref}
            faqLabel={t('sidebar.faqLabel')}
            primaryButtonLabel={t('sidebar.platformButton')}
            primaryButtonHref={platformHref}
            primaryButtonAriaLabel={t('sidebar.platformButton')}
            secondaryButtonLabel={secondaryButtonLabel}
            secondaryButtonHref={secondaryButtonHref}
            secondaryButtonAriaLabel={secondaryButtonLabel}
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-8 border-b !border-b-[3px] border-neutral-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`relative cursor-pointer py-2 px-1 text-lg font-medium  transition focus:outline-none ${
                  activeTab === tab.id
                    ? 'border-primary-700 text-primary-900'
                    : 'border-transparent text-neutral-500 hover:text-primary-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
                <div
                  className={`z-30 absolute bottom-[-3px] w-full h-[3px] bg-[#1B8354] !rounded-full ${activeTab === tab.id ? 'bg-[#1B8354]' : 'bg-transparent'}`}
                ></div>
              </button>
            ))}
          </div>
          {activeTab === 'steps' && steps.length > 0 && <TimelineSteps steps={steps} />}
          {activeTab === 'steps' && steps.length === 0 && (
            <p className="text-neutral-500">{t('emptyStates.noSteps')}</p>
          )}
          {activeTab === 'requirements' && requirements.length > 0 && (
            <RequirementsList requirements={requirements} />
          )}
          {activeTab === 'requirements' && requirements.length === 0 && (
            <p className="text-neutral-500">{t('emptyStates.noRequirements')}</p>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
          <DetailSidebar
            items={sidebarItems}
            faqHref={faqHref}
            faqLabel={t('sidebar.faqLabel')}
            primaryButtonLabel={t('sidebar.platformButton')}
            primaryButtonHref={platformHref}
            primaryButtonAriaLabel={t('sidebar.platformButton')}
            secondaryButtonLabel={secondaryButtonLabel}
            secondaryButtonHref={secondaryButtonHref}
            secondaryButtonAriaLabel={secondaryButtonLabel}
          />
        </div>
      </div>
    </Section>
  );
}
