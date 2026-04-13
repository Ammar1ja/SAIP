import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export interface ServiceOption {
  value: string;
  label: string;
}

export interface IPServiceTemplateTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface IPServiceTemplateHero {
  title: string;
  description: string;
  backgroundImage: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  titleSize?: 'default' | 'small';
  titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  contentAlign?: 'center' | 'bottom';
  layoutWrapperClassName?: string;
  contentStackClassName?: string;
  descriptionWrapperClassName?: string;
}

export interface IPServiceTemplateOverview {
  hero: IPServiceTemplateHero;
  sections?: React.ReactNode;
  statistics?: {
    title: string;
    ctaLabel?: string;
    ctaHref?: string;
    stats: StatisticsCardType[];
    columns?: number;
  };
}

export interface IPServiceTemplateServices {
  title: string;
  services: ServiceCardProps[];
  serviceTypeOptions: ServiceOption[];
  targetGroupOptions: ServiceOption[];
}

export interface IPServiceTemplateMedia {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  tabs: { id: string; label: string }[];
  content?: Record<string, { title: string; description: string }>;
  filterFields: any[];
  badgeLabel: string;
  category?: string;
  items?: Record<string, any[]>;
}

export interface IPServiceTemplateProps {
  tabs: IPServiceTemplateTab[];
  defaultActiveTab?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  overview: IPServiceTemplateOverview;
  services: IPServiceTemplateServices;
  media: IPServiceTemplateMedia | React.ReactNode;
  additionalTabs?: Record<string, React.ReactNode>;
  navigationItems?: Array<{ label: string; href: string }>;
  enableMobileScroll?: boolean;
  tabsClassName?: string;
  tabsSectionClassName?: string;
}
