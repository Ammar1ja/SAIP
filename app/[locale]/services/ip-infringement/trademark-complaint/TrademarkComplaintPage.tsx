'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import {
  TRADEMARK_COMPLAINT_STEPS,
  TRADEMARK_COMPLAINT_REQUIREMENTS,
  TRADEMARK_COMPLAINT_SIDEBAR,
} from './TrademarkComplaint.data';
import { IP_INFRINGEMENT_SERVICES } from '../IpInfringementServices.data';

const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const WatchFigmaIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 13.2192 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.7731 8.88846H12.1154C11.7807 7.07308 10.6423 5.53847 9.08461 4.66539H9.10768V1.66539C9.10768 0.746163 8.36153 0 7.4423 0H4.77691C3.85768 0 3.11153 0.746163 3.11153 1.66539V4.67692C1.25768 5.72692 0 7.71924 0 10C0 12.2808 1.25768 14.2692 3.11153 15.3231V18.3346C3.11153 19.2539 3.85768 20 4.77691 20H7.4423C8.36153 20 9.10768 19.2539 9.10768 18.3346V15.3231C10.6538 14.4462 11.7807 12.9192 12.1154 11.1115H12.7731C13.0192 11.1115 13.2192 10.9115 13.2192 10.6654V9.33078C13.2192 9.08462 13.0192 8.88846 12.7731 8.88846ZM4.21539 1.66539C4.21539 1.3577 4.46538 1.11154 4.76922 1.11154H7.43461C7.7423 1.11154 7.98844 1.36155 7.98844 1.66539V4.18846C7.39229 3.99616 6.75769 3.88847 6.09999 3.88847C5.4423 3.88847 4.80767 3.99616 4.21151 4.18846V1.66539H4.21539ZM7.99229 18.3346C7.99229 18.6423 7.7423 18.8885 7.43845 18.8885H4.77307C4.46537 18.8885 4.21923 18.6385 4.21923 18.3346V15.8115C4.81538 16.0038 5.44999 16.1115 6.10768 16.1115C6.76537 16.1115 7.39998 16.0038 7.99613 15.8115L7.99229 18.3346ZM6.10384 15C3.34615 15 1.10383 12.7577 1.10383 10C1.10383 7.24232 3.34615 5.00001 6.10384 5.00001C8.86153 5.00001 11.1038 7.24232 11.1038 10C11.1038 12.7577 8.86153 15 6.10384 15Z"
      fill="currentColor"
    />
    <path
      d="M9.08077 11.3154L6.66152 9.70384V7.55768C6.66152 7.24998 6.41153 7.00384 6.10768 7.00384C5.80384 7.00384 5.55385 7.25383 5.55385 7.55768V10.0038C5.55385 10.0423 5.55384 10.0769 5.56538 10.1115C5.56538 10.1269 5.57306 10.1423 5.58075 10.1577C5.5846 10.1769 5.59228 10.1961 5.59997 10.2154C5.60767 10.2308 5.61538 10.2461 5.62307 10.2615C5.63076 10.2769 5.63844 10.2961 5.64998 10.3115C5.66152 10.3269 5.67306 10.3423 5.68845 10.3577C5.69998 10.3692 5.70769 10.3846 5.71923 10.3961C5.74615 10.4231 5.77306 10.4461 5.80383 10.4654L8.46921 12.2423C8.56537 12.3038 8.66922 12.3346 8.77691 12.3346C8.95768 12.3346 9.13462 12.2461 9.23846 12.0885C9.40769 11.8346 9.33846 11.4884 9.08461 11.3192L9.08077 11.3154Z"
      fill="currentColor"
    />
  </svg>
);

const RiyalFigmaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M11.2025 17.7177C10.8813 18.4258 10.669 19.1942 10.5876 20L17.385 18.5635C17.7062 17.8556 17.9183 17.0871 17.9998 16.2812L11.2025 17.7177Z"
      fill="currentColor"
    />
    <path
      d="M17.385 14.2599C17.7062 13.552 17.9185 12.7835 17.9998 11.9776L12.7049 13.0972V10.945L17.3848 9.9563C17.706 9.2484 17.9183 8.47985 17.9997 7.67405L12.7048 8.79265V1.0527C11.8934 1.50558 11.1729 2.10842 10.5871 2.81951V9.24028L8.46951 9.68776V0C7.65817 0.452726 6.93762 1.05572 6.3519 1.76681V10.1351L1.61371 11.136C1.29251 11.8439 1.08003 12.6125 0.998523 13.4183L6.3519 12.2873V14.9976L0.61471 16.2096C0.293504 16.9175 0.0811821 17.6861 -0.000160122 18.4919L6.00507 17.2232C6.49392 17.1221 6.91409 16.8347 7.18725 16.4393L8.28858 14.8161V14.8158C8.4029 14.6478 8.46951 14.4454 8.46951 14.2273V11.8398L10.5871 11.3923V15.6967L17.3848 14.2596L17.385 14.2599Z"
      fill="currentColor"
    />
  </svg>
);

const UserFigmaIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 20 19.1188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.0039 8.89572C12.4587 8.89572 14.4518 6.9065 14.4518 4.44786C14.4518 1.98922 12.4625 0 10.0039 0C7.54524 0 5.55599 1.98922 5.55599 4.44786C5.55599 6.9065 7.54524 8.89572 10.0039 8.89572ZM10.0039 1.11582C11.843 1.11582 13.3398 2.61254 13.3398 4.4517C13.3398 6.29087 11.843 7.78762 10.0039 7.78762C8.16471 7.78762 6.66796 6.29087 6.66796 4.4517C6.66796 2.61254 8.16471 1.11582 10.0039 1.11582Z"
      fill="currentColor"
    />
    <path
      d="M13.005 10.6733H7.00272C3.1397 10.6733 0 13.813 0 17.676V18.5648C0 18.8726 0.250144 19.1188 0.554107 19.1188C0.858071 19.1188 1.10816 18.8687 1.10816 18.5648V17.676C1.10816 14.4286 3.75145 11.7852 6.99885 11.7852H13.0012C16.2486 11.7852 18.8919 14.4286 18.8919 17.676V18.5648C18.8919 18.8726 19.142 19.1188 19.446 19.1188C19.7499 19.1188 20 18.8687 20 18.5648V17.676C20 13.813 16.8604 10.6733 12.9973 10.6733H13.005Z"
      fill="currentColor"
    />
  </svg>
);

const LocationFigmaIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 16.1839 19.4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15.9454 6.29C14.9954 1.95 11.3054 0 8.08535 0C4.86535 0 1.18535 1.94 0.225353 6.28C-0.824647 11.08 1.99535 15.11 4.53535 17.64C5.66535 18.81 6.86535 19.4 8.08535 19.4C9.30535 19.4 10.4954 18.81 11.6254 17.65C14.1854 15.12 17.0154 11.1 15.9554 6.3L15.9454 6.29ZM10.8354 16.87C8.99535 18.76 7.16535 18.77 5.31535 16.87C2.95535 14.53 0.345353 10.83 1.29535 6.52C2.17535 2.52 5.50535 1.11 8.08535 1.11C10.6654 1.11 13.9954 2.53 14.8754 6.53C15.8254 10.84 13.2054 14.53 10.8354 16.87Z"
      fill="currentColor"
    />
    <path
      d="M8.08535 6.52C6.87535 6.52 5.89535 7.5 5.89535 8.71C5.89535 9.92 6.87535 10.9 8.08535 10.9C9.29535 10.9 10.2754 9.92 10.2754 8.71C10.2754 7.5 9.29535 6.52 8.08535 6.52ZM8.08535 9.8C7.48535 9.8 7.00535 9.32 7.00535 8.72C7.00535 8.12 7.48535 7.64 8.08535 7.64C8.68535 7.64 9.16535 8.12 9.16535 8.72C9.16535 9.32 8.68535 9.8 8.08535 9.8Z"
      fill="currentColor"
    />
  </svg>
);

const TrademarkComplaintPage = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const tSidebar = useTranslations('serviceDetail.sidebar');
  const t = useTranslations('serviceDetail');

  const sidebarItems = [
    {
      icon: <WatchFigmaIcon className="w-6 h-6 text-[#1B8354]" />,
      label: tSidebar('executionTime'),
      value: TRADEMARK_COMPLAINT_SIDEBAR.executionTime,
    },
    {
      icon: <RiyalFigmaIcon className="w-6 h-6 text-[#1B8354]" />,
      label: tSidebar('serviceFee'),
      value: TRADEMARK_COMPLAINT_SIDEBAR.serviceFee,
    },
    {
      icon: <UserFigmaIcon className="w-6 h-6 text-[#1B8354]" />,
      label: tSidebar('targetGroup'),
      value: TRADEMARK_COMPLAINT_SIDEBAR.targetGroup,
    },
    {
      icon: <LocationFigmaIcon className="w-6 h-6 text-[#1B8354]" />,
      label: tSidebar('serviceChannel'),
      value: TRADEMARK_COMPLAINT_SIDEBAR.serviceChannel,
    },
  ];

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
            { label: 'Complaint of trademark infringement' },
          ]}
        />
        <Link
          href={ROUTES.SERVICES.SERVICE_DIRECTORY}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
        >
          ← {t('goBackToServices')}
        </Link>
        <div className="mb-14" />
        <h1 className="text-5xl font-bold mb-2">Complaint of trademark infringement</h1>
        <div className="flex gap-2 mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold">
            IP Infringement
          </span>
          <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold">
            Enforcement
          </span>
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">
          Receive a complaint (trademark infringement application).
        </p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={sidebarItems}
              faqHref={TRADEMARK_COMPLAINT_SIDEBAR.faqHref}
              faqLabel={tSidebar('faqLabel')}
              primaryButtonLabel={tSidebar('platformButton')}
              primaryButtonHref={TRADEMARK_COMPLAINT_SIDEBAR.platformHref}
              primaryButtonAriaLabel={tSidebar('platformButton')}
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
            {activeTab === 'steps' && <TimelineSteps steps={TRADEMARK_COMPLAINT_STEPS} />}
            {activeTab === 'requirements' && (
              <RequirementsList requirements={TRADEMARK_COMPLAINT_REQUIREMENTS} />
            )}
          </div>
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={sidebarItems}
              faqHref={TRADEMARK_COMPLAINT_SIDEBAR.faqHref}
              faqLabel={tSidebar('faqLabel')}
              primaryButtonLabel={tSidebar('platformButton')}
              primaryButtonHref={TRADEMARK_COMPLAINT_SIDEBAR.platformHref}
              primaryButtonAriaLabel={tSidebar('platformButton')}
            />
          </div>
        </div>
      </Section>
      <RelatedServicesSection
        title="Related services"
        description="Short description"
        services={IP_INFRINGEMENT_SERVICES.filter(
          (s) => s.title !== 'Complaint of trademark infringement',
        )}
      />
    </main>
  );
};

export default TrademarkComplaintPage;
