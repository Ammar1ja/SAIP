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
import type { IPLicensingServiceDetail } from '@/lib/drupal/services/service-detail-ip-licensing.service';
import { ROUTES } from '@/lib/routes';
import { useTranslations, useLocale } from 'next-intl';
import LeadingIcon from '@/assets/images/leading_icon.png';
import Location from '@/assets/images/location.png';
import Riyal from '@/assets/images/Riyal.png';
import User from '@/assets/images/user.png';
import Watch from '@/assets/images/watch.png';
interface RegistrationPageClientProps {
  data: IPLicensingServiceDetail;
  relatedServices: any[];
}

export default function RegistrationPageClient({
  data,
  relatedServices,
}: RegistrationPageClientProps) {
  const [activeTab, setActiveTab] = useState('steps');
  const t = useTranslations('serviceDetail');
  const tCommon = useTranslations('common');
  const tSidebar = useTranslations('serviceDetail.sidebar');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const locale = useLocale();
  const isRtl = locale === 'ar' ? true : false;
  const TABS = [
    { id: 'steps', label: t('applicationSteps') },
    { id: 'requirements', label: t('requirements') },
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
            { label: data.title },
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
        <h1 className="text-5xl font-bold mb-2">{data.title}</h1>
        <div className="flex gap-2 mb-4 my-[16px]">
          <span className="inline-block bg-[#F9FAFB] text-[#1F2A37] border border-[#E5E7EB] rounded-full px-3 py-1 text-xs font-semibold">
            IP licensing
          </span>
          <span className="inline-block bg-[#F9FAFB] text-[#1F2A37] border border-[#E5E7EB] rounded-full px-3 py-1 text-xs font-semibold">
            IP Enablement
          </span>
        </div>
        <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{data.description}</p>
      </Section>
      <Section background="white" padding="default">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-[24px]">
          {/* Mobile Sidebar */}
          <div className="block lg:hidden w-full max-w-full rounded-xl xl:shadow mb-8 px-4 mt-4">
            <DetailSidebar
              items={[
                {
                  icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('executionTime'),
                  value: data.executionTime,
                },
                {
                  icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceFee'),
                  value: data.serviceFee,
                },
                {
                  icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('targetGroup'),
                  value: data.targetGroup,
                },
                {
                  icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                  label: tSidebar('serviceChannel'),
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel={tSidebar('faqLabel')}
              primaryButtonLabel={tSidebar('platformButton')}
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel={tSidebar('platformButton')}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="relative flex gap-8 mb-8 ">
              {TABS.map((tab) => (
                <>
                  <button
                    key={tab.id}
                    className={`relative cursor-pointer py-2 px-1 text-[14px] font-medium  transition focus:outline-none ${
                      activeTab === tab.id
                        ? '  text-[#161616] font-semibold'
                        : ' text-[#384250] hover:text-[#1B8354] font-medium'
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
                  <div
                    className={`absolute bottom-[-3px] left-0 right-0 w-full h-[3px] bg-[#D2D6DB] rounded-full`}
                  ></div>
                </>
              ))}
            </div>
            {activeTab === 'steps' && <TimelineSteps steps={data.steps} />}
            {activeTab === 'requirements' && <RequirementsList requirements={data.requirements} />}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-full lg:w-[411px] flex-shrink-0 h-auto xl:h-[528px]">
            <DetailSidebar
              items={[
                {
                  icon: <img src={Watch.src} alt="" className="w-6 h-6 object-contain" />,
                  label: t('executionTime'),
                  value: data.executionTime,
                },
                {
                  icon: <img src={Riyal.src} alt="" className="w-6 h-6 object-contain" />,
                  label: t('serviceFee'),
                  value: data.serviceFee,
                },
                {
                  icon: <img src={User.src} alt="" className="w-6 h-6 object-contain" />,
                  label: t('targetGroup'),
                  value: data.targetGroup,
                },
                {
                  icon: <img src={Location.src} alt="" className="w-6 h-6 object-contain" />,
                  label: t('serviceChannel'),
                  value: data.serviceChannel,
                },
              ]}
              faqHref={data.faqHref}
              faqLabel={t('faqLabel')}
              primaryButtonLabel={t('goToPlatform')}
              primaryButtonHref={data.platformHref}
              primaryButtonAriaLabel={t('goToPlatform')}
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
      <FeedbackSection pageTitle="IP Agent Registration Service" />
    </main>
  );
}
