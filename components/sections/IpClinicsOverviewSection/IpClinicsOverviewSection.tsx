'use client';

import StatisticsSection from '@/components/organisms/StatisticsSection';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import VideoInfoCard from '@/components/molecules/VideoInfoCard';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import { useTabs } from '@/hooks/useTabs';
import { IPClinicsData } from '@/lib/drupal/services/ip-clinics.service';
import { useTranslations } from 'next-intl';

interface IpClinicsOverviewSectionProps {
  data: IPClinicsData;
}

function IpClinicsOverviewSection({ data }: IpClinicsOverviewSectionProps) {
  const tNav = useTranslations('common.nav');
  const tStats = useTranslations('common.statistics');
  const tIpClinics = useTranslations('ipClinics.nav');
  const tButtons = useTranslations('buttons');

  const anchorItems = [
    { label: tNav('informationLibrary'), href: '#information' },
    { label: tIpClinics('servicesOfIpClinics'), href: '#services' },
    { label: tNav('statistics'), href: '#statistics' },
    { label: tNav('relatedPages'), href: '#related-pages' },
  ];

  const { activeTab, setActiveTab } = useTabs(data.overview.serviceTabs);

  // Apply translations to button labels
  const translatedServiceTabsData = data.overview.serviceTabsData.map((tab) => ({
    ...tab,
    buttonLabel: tab.buttonLabel === 'Download file' ? tButtons('downloadFile') : tab.buttonLabel,
    buttonLabel2: tab.buttonLabel2 === 'View file' ? tButtons('viewFile') : tab.buttonLabel2,
  }));

  return (
    <>
      <HeroStatic
        title={data.overview.title}
        description={data.overview.description}
        backgroundImage={data.heroImage?.src || '/images/ip-clinics/hero.jpg'}
      />
      <Navigation items={anchorItems} />
      <section id="information">
        <Section className="max-w-[1280px] w-full mx-auto px-4 md:px-8 2xl:px-0">
          <Heading
            size="custom"
            as="h2"
            className="mb-6 text-[30px] leading-[38px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px] tracking-[-0.02em] font-medium text-text-default"
          >
            {data.overview.videoCard.title}
          </Heading>
          <VideoInfoCard
            title={data.overview.videoCard.description}
            videoSrc={data.overview.videoCard.videoSrc}
            poster={data.overview.videoCard.videoPoster}
            className="xl:min-h-[512px]"
          />
        </Section>
      </section>
      <section id="services">
        <Section>
          <ServicesInformation
            title={data.overview.servicesTitle}
            description={data.overview.servicesDescription}
            tabs={data.overview.serviceTabs}
            data={translatedServiceTabsData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            headerDescriptionClassName="max-w-[628px] pb-6 text-[16px] leading-[24px] text-text-primary-paragraph"
          />
        </Section>
      </section>
      <section id="statistics">
        <StatisticsSection title={tStats('title')} stats={data.overview.statistics} columns={2} />
      </section>
      <section id="related-pages">
        <RelatedPagesSection />
      </section>
    </>
  );
}

export default IpClinicsOverviewSection;
