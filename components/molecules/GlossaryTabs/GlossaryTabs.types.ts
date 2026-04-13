export interface GlossaryTabsProps {
  tabs: string[];
  tabLabels?: Record<string, string>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  indicatorInsetPx?: number;
}
