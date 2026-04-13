'use client';

import { ServicesDirectory, ServicesOverview } from '@/components/icons/services';
import IpClinicsOverviewSection from '@/components/sections/IpClinicsOverviewSection';
import Section from '@/components/atoms/Section';
import Tabs from '@/components/molecules/Tabs';
import IpClinicsServicesSection from '@/components/sections/IpClinicsServicesSection';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { IPClinicsData } from '@/lib/drupal/services/ip-clinics.service';
import { useTranslations } from 'next-intl';
import FeedbackSection from '@/components/organisms/FeedbackSection';

interface IpClinicsPageContentProps {
  data: IPClinicsData;
  breadcrumbItems: BreadcrumbItem[];
}

export default function IpClinicsPageContent({ data, breadcrumbItems }: IpClinicsPageContentProps) {
  const t = useTranslations('common.tabs');

  const tabsData = [
    {
      id: 'overview',
      label: t('overview'),
      icon: <ServicesOverview className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'services',
      label: t('services'),
      icon: <ServicesDirectory className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const defaultActiveTab = 'overview';
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || defaultActiveTab;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <IpClinicsOverviewSection data={data} />;
      case 'services':
        return <IpClinicsServicesSection services={data.services} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <Section padding="none" className="pt-6">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
        <Tabs
          tabs={tabsData}
          defaultActiveTab={defaultActiveTab}
          ariaLabel="Service navigation tabs"
          className="mb-6"
          syncWithQueryParam="tab"
        />
      </Section>
      {renderTabContent()}
      <FeedbackSection />
    </main>
  );
}
