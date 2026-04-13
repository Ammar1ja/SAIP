import type { TabItem } from '@/components/molecules/Tabs/Tabs.types';
import type { DigitalGuideHeadingProps } from '@/components/molecules/DigitalGuideHeading';

export type DigitalGuideTabData = { id: string; content: React.ReactNode; cta?: React.ReactNode };

export type DigitalGuideTabsSectionProps = {
  tabs: TabItem[];
  defaultActiveTab: string;
  data: DigitalGuideTabData[];
} & DigitalGuideHeadingProps;
