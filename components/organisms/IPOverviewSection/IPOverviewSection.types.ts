import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export interface OverviewHeaderType {
  title: string;
  description: string;
  videoSrc: string;
  videoPoster: string;
}

export interface OverviewGuideType {
  guideTitle: string;
  guideCards: ServiceCardProps[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface OverviewPublicationsType {
  publicationsTitle: string;
  publicationsDescription: string;
  publications: ServiceCardProps[];
  publicationsCtaLabel: string;
  publicationsCtaHref: string;
}

export interface OverviewStatisticsType {
  statistics: StatisticsCardType[];
  statisticsTitle: string;
  statisticsCtaLabel: string;
  statisticsCtaHref: string;
}

export interface OverviewGazetteType {
  heading: string;
  text: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: React.ReactNode;
  id?: string;
  imageSrc: string;
  imageAlt: string;
  isReversed?: boolean;
}

export interface RelatedPagesType {
  title: string;
  pages: Array<{ title: string; href: string }>;
}

export interface IPOverviewSectionProps {
  header: OverviewHeaderType;
  guide: OverviewGuideType;
  publications?: OverviewPublicationsType;
  statistics: OverviewStatisticsType;
  gazette?: OverviewGazetteType;
  relatedPages?: RelatedPagesType;
}
