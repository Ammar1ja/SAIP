'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import Location from '@/assets/images/location.png';
import Riyal from '@/assets/images/Riyal.png';
import User from '@/assets/images/user.png';
import Watch from '@/assets/images/watch.png';
import {
  COPYRIGHT_COMPLAINT_STEPS,
  COPYRIGHT_COMPLAINT_REQUIREMENTS,
  COPYRIGHT_COMPLAINT_SIDEBAR,
} from './CopyrightComplaint.data';
import { IP_INFRINGEMENT_SERVICES } from '../IpInfringementServices.data';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.png';
const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const CopyrightComplaintPage = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const tSidebar = useTranslations('serviceDetail.sidebar');
  const t = useTranslations('serviceDetail');
  const locale = useLocale();
  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      <Section background="primary-50" padding="medium">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: tBreadcrumbs('home') || 'Home', href: ROUTES.HOME },
            {
              label: tBreadcrumbs('serviceDirectory') || 'SAIP service directory',
              href: ROUTES.SERVICES.SERVICE_DIRECTORY,
            },
            { label: 'Complaint of copyright infringement' },
          ]}
        />
        <Link
          href={ROUTES.SERVICES.SERVICE_DIRECTORY}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-[#D2D6DB] rounded-[4px] h-[32px] text-sm hover:bg-neutral-100 transition bg-[#F7FDF9]"
        >
          <img
            src={LeadingIcon.src}
            alt=""
            className={`w-4 h-4 object-contain ${isRtl ? 'rotate-180 ml-2' : 'rotate-0 mr-2'}`}
          />{' '}
          {t('goBackToServices')}
        </Link>
        <div className="mb-14" />
        <h1 className="text-5xl font-bold mb-2">Complaint of copyright infringement</h1>
        <div className="flex gap-2 mb-4">
          <span className="inline-block bg-[#F9FAFB] text-[#1F2A37] border border-[#E5E7EB] rounded-full px-3 py-1 text-xs font-semibold">
            IP Infringement
          </span>
          <span className="inline-block bg-[#F9FAFB] text-[#1F2A37] border border-[#E5E7EB] rounded-full px-3 py-1 text-xs font-semibold">
            Enforcement
          </span>
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">
          A service that allows the user to modify the specifications "No substantial change may be
          made".
        </p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="block lg:hidden w-full max-w-full rounded-xl xl:shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('executionTime'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.executionTime,
                },
                {
                  icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceFee'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.serviceFee,
                },
                {
                  icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('targetGroup'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.targetGroup,
                },
                {
                  icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceChannel'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.serviceChannel,
                },
              ]}
              faqHref={COPYRIGHT_COMPLAINT_SIDEBAR.faqHref}
              faqLabel={tSidebar('faqLabel')}
              primaryButtonLabel={tSidebar('platformButton')}
              primaryButtonHref={COPYRIGHT_COMPLAINT_SIDEBAR.platformHref}
              primaryButtonAriaLabel={tSidebar('platformButton')}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-8 border-b !border-b-[3px] border-neutral-200 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`relative cursor-pointer py-2 px-1 text-lg font-medium  transition focus:outline-none ${activeTab === tab.id ? 'border-primary-700 text-primary-900' : 'border-transparent text-neutral-500 hover:text-primary-700'}`}
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
            {activeTab === 'steps' && <TimelineSteps steps={COPYRIGHT_COMPLAINT_STEPS} />}
            {activeTab === 'requirements' && (
              <RequirementsList requirements={COPYRIGHT_COMPLAINT_REQUIREMENTS} />
            )}
          </div>
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={[
                {
                  icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('executionTime'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.executionTime,
                },
                {
                  icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceFee'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.serviceFee,
                },
                {
                  icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('targetGroup'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.targetGroup,
                },
                {
                  icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceChannel'),
                  value: COPYRIGHT_COMPLAINT_SIDEBAR.serviceChannel,
                },
              ]}
              faqHref={COPYRIGHT_COMPLAINT_SIDEBAR.faqHref}
              faqLabel={tSidebar('faqLabel')}
              primaryButtonLabel={tSidebar('platformButton')}
              primaryButtonHref={COPYRIGHT_COMPLAINT_SIDEBAR.platformHref}
              primaryButtonAriaLabel={tSidebar('platformButton')}
            />
          </div>
        </div>
      </Section>
      <RelatedServicesSection
        title="Related services"
        description="Short description"
        services={IP_INFRINGEMENT_SERVICES.filter(
          (s) => s.title !== 'Complaint of copyright infringement',
        )}
      />
    </main>
  );
};

export default CopyrightComplaintPage;
