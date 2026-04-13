'use client';

import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Tabs from '@/components/molecules/Tabs';
import Section from '@/components/atoms/Section';
import ServiceCard from '@/components/molecules/ServiceCard';
import { GeneralSecretariatOverview } from './GeneralSecretariatOverview';
import { GeneralSecretariatCenters } from './GeneralSecretariatCenters';
import { GeneralSecretariatHowToJoin } from './GeneralSecretariatHowToJoin';
import { GeneralSecretariatDocumentsTable } from './GeneralSecretariatDocumentsTable';
import { IPGeneralSecretariatData } from '@/lib/drupal/services/ip-general-secretariat.service';
import { ServiceItemData } from '@/lib/drupal/services/service-directory.service';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { useTranslations } from 'next-intl';
import { PatentDocIcon } from '@/components/icons/services';
import { FilesIcon, FileTextIcon, InfoIcon } from 'lucide-react';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { useIsMobile } from '@/hooks/useIsMobile';

interface GeneralSecretariatPageContentProps {
  data: IPGeneralSecretariatData;
  breadcrumbItems: BreadcrumbItem[];
}

export default function GeneralSecretariatPageContent({
  data,
  breadcrumbItems,
}: GeneralSecretariatPageContentProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const t = useTranslations('ipGeneralSecretariat');
  const tFilters = useTranslations('common.filters');
  const tCommon = useTranslations('common.buttons');
  const isMobile = useIsMobile();

  const TABS = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      icon: isMobile ? undefined : <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'how-to-join',
      label: t('tabs.howToJoinMobile'),
      icon: isMobile ? undefined : <InfoIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'centers',
      label: t('tabs.centersMobile'),
      icon: isMobile ? undefined : <FilesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'documents-decisions',
      label: t('tabs.documentsDecisionsMobile'),
      icon: isMobile ? undefined : <FileTextIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const renderServiceCard = (item: ServiceItemData, _index: number) => (
    <ServiceCard
      key={item.id}
      title={item.title}
      description={item.description}
      labels={[item.serviceType]} // Show serviceType as label (e.g., "Protection")
      href={item.href}
      primaryButtonLabel={tCommon('viewDetails')}
      primaryButtonHref={item.href}
      variant="services"
    />
  );

  const CENTERS_FILTER_FIELDS = [
    {
      id: 'search',
      label: tFilters('search'),
      type: 'search' as const,
      placeholder: tFilters('search'),
    },
  ];

  return (
    <main className="min-h-screen">
      <Section padding="small" background="white">
        <Breadcrumbs items={breadcrumbItems} />
        <Tabs tabs={TABS} defaultActiveTab="overview" className="my-4" syncWithQueryParam="tab" />
      </Section>

      {activeTab === 'overview' && (
        <GeneralSecretariatOverview
          committeeVerticalTabs={data.overview.committeeVerticalTabs}
          committeeVerticalTabsData={data.overview.committeeVerticalTabsData}
          responsibilities={data.overview.responsibilities}
          statistics={data.overview.statistics}
          relatedPages={data.overview.relatedPages}
          heroTitle={data.heroHeading}
          heroDescription={data.heroSubheading}
          heroImage={data.heroImage?.src}
          committeesTitle={data.overview.committeesTitle}
          committeesDescription={data.overview.committeesDescription}
        />
      )}

      {activeTab === 'how-to-join' && (
        <GeneralSecretariatHowToJoin
          committeesList={data.committees.committeesList}
          heroImage={data.heroImage?.src}
        />
      )}

      {activeTab === 'centers' && (
        <GeneralSecretariatCenters
          services={data.services}
          filterFields={CENTERS_FILTER_FIELDS}
          renderServiceCard={renderServiceCard}
          title={t('centersTitle')}
          totalCountLabel={tFilters('totalNumber')}
          emptyStateText={tFilters('noItemsFound')}
        />
      )}

      {activeTab === 'documents-decisions' && (
        <GeneralSecretariatDocumentsTable
          documents={data.documentsAndDecisions}
          title={t('documentsTitle')}
          noDocumentsText={t('noDocuments')}
          viewDocumentText={t('viewDocument')}
        />
      )}
      <FeedbackSection />
    </main>
  );
}
