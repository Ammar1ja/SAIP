export type NavigationItem = {
  label: string;
  href: string;
};

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  bold?: boolean;
  topOffset?: number;
  forceCompact?: boolean;
  showActiveMarker?: boolean;
}
