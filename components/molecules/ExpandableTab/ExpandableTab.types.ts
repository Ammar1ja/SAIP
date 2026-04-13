import { ReactNode } from 'react';

export interface ExpandableTabProps {
  title: string | ReactNode;
  description: string | ReactNode;
  image?: {
    src: string;
    alt: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  id?: string;
  showFeedback?: boolean;
  lastUpdate?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
  buttonLabel2?: string;
  buttonHref2?: string;
  buttonAriaLabel2?: string;
  variant?: 'default' | 'bordered';
  isFirst?: boolean;
  isLast?: boolean;
}
