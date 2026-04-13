import OffersSection from '@/components/sections/OffersSection';
import AdvantagesSection from '@/components/sections/AdvantagesSection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import { IP_ACADEMY_STATISTICS } from '@/app/[locale]/services/ip-academy/IpAcademyStatisticsSection.data';
import { TABS } from '@/components/sections/OffersSection/IpAcademyOffersSection.data';

interface OfferData {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  buttonLabel: string;
  buttonHref: string;
}

interface AdvantageData {
  title: string;
  description: string;
}

interface IpAcademyOverviewSectionProps {
  statistics?: {
    statistics: any[];
    statisticsTitle: string;
    statisticsCtaLabel: string;
    statisticsCtaHref: string;
  };
  offers?: OfferData[];
  advantages?: AdvantageData[];
  relatedPages?: { title: string; href: string }[];
}

const IpAcademyOverviewSection = ({
  statistics,
  offers,
  advantages,
  relatedPages,
}: IpAcademyOverviewSectionProps) => {
  return (
    <>
      <div id="information-library">
        <OffersSection tabs={TABS} data={offers} />
      </div>
      <AdvantagesSection advantagesData={advantages} />
      <div id="statistics">
        <StatisticsSection
          title={statistics?.statisticsTitle || 'Statistics'}
          stats={statistics?.statistics || IP_ACADEMY_STATISTICS}
          ctaLabel={statistics?.statisticsCtaLabel}
          ctaHref={statistics?.statisticsCtaHref}
          columns={2}
        />
      </div>
      <div id="related-pages">
        <RelatedPagesSection pages={relatedPages} />
      </div>
    </>
  );
};

export default IpAcademyOverviewSection;
