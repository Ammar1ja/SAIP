import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  tabPanelClassName?: string;
  ariaLabel?: string;
  syncWithQueryParam?: string;
  enableMobileScroll?: boolean;
}
