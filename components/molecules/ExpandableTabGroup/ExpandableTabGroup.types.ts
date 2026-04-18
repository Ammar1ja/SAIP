import { JSX } from 'react';

export interface ExpandableTabGroupItem {
  id: string;
  title: string;
  description: string | JSX.Element;
  image?: {
    src: string;
    alt: string;
  };
  lastUpdate?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
  buttonLabel2?: string;
  buttonHref2?: string;
  buttonAriaLabel2?: string;
}

export interface ExpandableTabGroupProps {
  items: ExpandableTabGroupItem[];
  activeId?: string;
  onTabChange?: (id: string) => void;
  expandedIds?: Set<string>;
  onToggle?: (id: string) => void;
  className?: string;
  showFeedback?: boolean;
  variant?: 'default' | 'bordered' | 'minimal';
}
