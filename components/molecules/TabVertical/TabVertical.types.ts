export interface Tab {
  id: string;
  label: string;
  subItems?: Tab[];
  icon?: React.ReactNode;
  description?: React.ReactNode;
}

export interface TabVerticalProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  showIcons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  indicatorHeight: 'lg' | 'md' | 'sm';
}
