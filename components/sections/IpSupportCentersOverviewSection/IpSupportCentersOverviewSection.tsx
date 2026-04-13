'use client';

import AboutIpSupportCenters from '@/components/organisms/AboutIpSupportCenters';
import CallToActionBanner from '@/components/organisms/CallToActionBanner';
import CentersSection from '@/components/organisms/CentersSection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import { CardGrid } from '@/components/organisms/CardGrid/CardGrid';
import { IPSupportCentersData } from '@/lib/drupal/services/ip-support-centers.service';
import {
  AimIcon,
  BrainIcon,
  ChartsIcon,
  CourtIcon,
  InternetIcon,
  LightBulbIcon,
  MegaphoneIcon,
  BookIcon,
} from '@/components/icons';
import { useTranslations } from 'next-intl';

interface IpSupportCentersOverviewSectionProps {
  data: IPSupportCentersData;
}

// Map icon names to icon components
const iconMap: Record<string, any> = {
  AimIcon,
  BrainIcon,
  ChartsIcon,
  CourtIcon,
  InternetIcon,
  LightBulbIcon,
  MegaphoneIcon,
  BookIcon,
};

const IpSupportCentersOverviewSection = ({ data }: IpSupportCentersOverviewSectionProps) => {
  const t = useTranslations('ipSupportCenters');

  // Transform responsibilities to CardGrid format
  const responsibilitiesItems = data.overview.responsibilities.map((resp) => ({
    description: resp.description,
    icon: {
      component: iconMap[resp.icon] || AimIcon,
      alt: 'Icon',
      size: 'medium' as const,
      background: 'green' as const,
      // Figma: 48×48 icon tile, 8px radius, #079455
      className: '!h-12 !w-12 !min-h-12 !min-w-12 !p-0 [&_svg]:!h-7 [&_svg]:!w-7',
    },
  }));

  return (
    <>
      <div id="about-tisc">
        <AboutIpSupportCenters
          heading={data.overview.aboutHeading}
          paragraphs={data.overview.aboutParagraphs}
          image={data.overview.aboutImage}
        />
      </div>
      <div id="tisc-responsibilities">
        <CardGrid
          items={responsibilitiesItems}
          heading={t('responsibilities')}
          showViewAll={true}
          gridClassName="grid w-full min-w-0 grid-cols-1 justify-items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
          cardClassName="box-border h-[176px] min-h-[176px] max-h-[176px] w-[410px] max-w-full min-w-0 overflow-hidden rounded-[8px] border border-border-natural-primary bg-white !p-6 shadow-none flex flex-col items-stretch"
          cardContentClassName="flex min-h-0 flex-1 flex-col items-start gap-4 w-full !space-y-0"
          cardDescriptionClassName="!text-[16px] !leading-6 font-normal text-gray-900 line-clamp-3"
          cardIconClassName="shrink-0"
        />
      </div>
      <CallToActionBanner
        title={data.overview.ctaBanner.title}
        buttonLabel={data.overview.ctaBanner.buttonLabel}
        buttonHref={data.overview.ctaBanner.buttonHref}
      />
      <div id="tisc-guidelines">
        <Section background="white" className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <Heading as="h2" size="h2">
                {t('guidelines')}
              </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {data.overview.guidelines.map((guideline, index) => (
                <ServiceCard key={index} {...guideline} className="min-h-[350px]" />
              ))}
            </div>
          </div>
        </Section>
      </div>
      <div id="statistics">
        <StatisticsSection
          title={t('statistics')}
          ctaLabel={t('viewMoreStatistics')}
          ctaHref="/resources/statistics"
          stats={data.overview.statistics}
          columns={2}
        />
      </div>
      <div id="centers">
        <CentersSection />
      </div>
    </>
  );
};

export default IpSupportCentersOverviewSection;
