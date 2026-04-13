import { ReactNode } from 'react';

export interface SectionTab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SectionWithTabsProps<T = any> {
  title: string;
  ariaLabel?: string;
  tabs: SectionTab[];
  data: T[];
  renderPanel: (item: T) => ReactNode;
  defaultActiveTab?: string;
  className?: string;
}
