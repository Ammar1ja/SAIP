export interface TocItem {
  id: string;
  label: string;
  subItems?: TocItem[];
}

export interface TableOfContentProps {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  className?: string;
  ariaLabel?: string;
  name?: string;
  onThisPageText?: string;
  journeyText?: string;
  variant?: 'card' | 'sheet';
  showHeader?: boolean;
}
