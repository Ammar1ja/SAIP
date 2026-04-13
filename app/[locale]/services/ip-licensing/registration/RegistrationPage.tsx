'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import RequirementsList from '@/components/organisms/RequirementsList';
import ServiceInfoSidebar from '@/components/organisms/ServiceInfoSidebar';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import { Clock, BadgeDollarSign, Users, MapPin } from 'lucide-react';
import {
  REGISTRATION_STEPS,
  REGISTRATION_REQUIREMENTS,
  REGISTRATION_SIDEBAR,
} from './Registration.data';
import { IP_LICENSING_SERVICES_NEW_DATA } from '../IpLicensingServices.data';

const TABS = [
  { id: 'steps', label: 'Application steps' },
  { id: 'requirements', label: 'Requirements' },
];

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const RegistrationPage = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const t = useTranslations('serviceDetail');

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
            { label: 'IP agent license registration' },
          ]}
        />
        <Link
          href={ROUTES.SERVICES.SERVICE_DIRECTORY}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
        >
          ← {t('goBackToServices')}
        </Link>
        <div className="mb-14" />
        <h1 className="text-5xl font-bold mb-2">IP agent license registration</h1>
        <div className="flex gap-2 mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold">
            IP licensing
          </span>
          <span className="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-xs font-semibold">
            IP Enablement
          </span>
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">
          Become a certified IP Agent and represent clients in IP matters. Join a network of
          professionals dedicated to protecting IP in Saudi Arabia.
        </p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="block lg:hidden w-full max-w-full rounded-xl shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: 'Execution time',
                  value: REGISTRATION_SIDEBAR.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: 'Service fee',
                  value: REGISTRATION_SIDEBAR.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: 'Target group',
                  value: REGISTRATION_SIDEBAR.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: 'Service channel',
                  value: REGISTRATION_SIDEBAR.serviceChannel,
                },
              ]}
              faqHref={REGISTRATION_SIDEBAR.faqHref}
              faqLabel="Go to FAQs page"
              primaryButtonLabel="Go to SAIP Platform"
              primaryButtonHref={REGISTRATION_SIDEBAR.platformHref}
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
            {activeTab === 'steps' && <TimelineSteps steps={REGISTRATION_STEPS} />}
            {activeTab === 'requirements' && (
              <RequirementsList requirements={REGISTRATION_REQUIREMENTS} />
            )}
          </div>
          <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
            <DetailSidebar
              items={[
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: 'Execution time',
                  value: REGISTRATION_SIDEBAR.executionTime,
                },
                {
                  icon: <BadgeDollarSign className="w-6 h-6" />,
                  label: 'Service fee',
                  value: REGISTRATION_SIDEBAR.serviceFee,
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  label: 'Target group',
                  value: REGISTRATION_SIDEBAR.targetGroup,
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  label: 'Service channel',
                  value: REGISTRATION_SIDEBAR.serviceChannel,
                },
              ]}
              faqHref={REGISTRATION_SIDEBAR.faqHref}
              faqLabel="Go to FAQs page"
              primaryButtonLabel="Go to SAIP Platform"
              primaryButtonHref={REGISTRATION_SIDEBAR.platformHref}
              primaryButtonAriaLabel="Go to SAIP Platform"
            />
          </div>
        </div>
      </Section>
      <RelatedServicesSection
        title="Related services"
        description="Short description"
        services={IP_LICENSING_SERVICES_NEW_DATA.filter(
          (s) => s.title !== 'IP Agent License Registration',
        )}
      />
    </main>
  );
};

export default RegistrationPage;
