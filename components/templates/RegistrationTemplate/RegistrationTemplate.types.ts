export interface RegistrationStep {
  number: number;
  title: string;
  icon: string;
  details: (string | { label: string; href: string; external?: boolean })[];
}

export interface RegistrationSidebarData {
  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;
}

export interface RegistrationTemplateProps {
  title: string;
  labels: string[];
  description: string;
  steps: RegistrationStep[];
  requirements: string[];
  sidebarData: RegistrationSidebarData;
  breadcrumbs?: { label: string; href?: string }[];
  backHref?: string;
}
