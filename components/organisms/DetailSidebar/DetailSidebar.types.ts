import { ReactNode } from 'react';

export interface DetailSidebarItem {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export interface DetailSidebarProps {
  items: DetailSidebarItem[];
  faqHref?: string;
  faqLabel?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  primaryButtonAriaLabel?: string;
  primaryButtonHelperText?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  secondaryButtonAriaLabel?: string;
  className?: string;
}
