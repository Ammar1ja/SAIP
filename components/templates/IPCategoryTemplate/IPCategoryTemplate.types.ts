import { IPOverviewSectionProps } from '@/components/organisms/IPOverviewSection/IPOverviewSection.types';
import { IPJourneySectionProps } from '@/components/organisms/IPJourneySection/IPJourneySection.types';
import { IPServicesSectionProps } from '@/components/organisms/IPServicesSection/IPServicesSection.types';
import { NavigationProps } from '@/components/molecules/Navigation/Navigation.type';
import { ReactNode } from 'react';

export interface HeroSectionProps {
  title: string;
  description: string;
  secondDescription?: string;
  backgroundImage: string;
}

export interface BreadcrumbType {
  label: string;
  href?: string;
}

export interface TabType {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface IPCategoryTemplateProps {
  hero: HeroSectionProps;
  navigation?: NavigationProps;
  overview: IPOverviewSectionProps;
  journey: IPJourneySectionProps;
  journeyEndpoint?: string;
  isFallbackData?: boolean;
  services: IPServicesSectionProps;
  media: React.ReactNode;
  tabsData: TabType[];
  breadcrumbs: BreadcrumbType[];
  tabsClassName?: string;
}
