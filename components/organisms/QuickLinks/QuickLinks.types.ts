export interface QuickLinkItem {
  label: string;
  href: string;
}

export interface QuickLinksProps {
  title: string;
  links: QuickLinkItem[];
  className?: string;
}
