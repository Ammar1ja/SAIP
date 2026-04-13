import { ReactNode } from 'react';
import { SectionProps } from '@/components/atoms/Section/Section.types';
import { ExpandableTabGroupItem } from '@/components/molecules/ExpandableTabGroup/ExpandableTabGroup.types';

export interface DetailPageLayoutProps {
  sidebar?: ReactNode;
  children?: ReactNode;
  defaultTabs?: ExpandableTabGroupItem[];
  sectionProps?: SectionProps;
  className?: string;
  sidebarClassName?: string;
  /** Reserve space for sidebar even when not provided */
  reserveSidebarSpace?: boolean;
}
