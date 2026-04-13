export interface GuideData {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  viewFileLabel: string;
  viewFileHref: string;
  downloadFileLabel: string;
  downloadFileHref: string;
}

export interface RequirementItem {
  number: number;
  text: string;
}

export interface QuickLinkItem {
  label: string;
  href: string;
}

export interface RelatedService {
  question: string;
  title: string;
  description: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface IPLicensingOverviewSectionProps {
  guideData?: GuideData;
  requirements?: RequirementItem[];
  exemptions?: string[];
  quickLinks?: QuickLinkItem[];
  relatedPages?: Array<{ title: string; href: string }>;
  relatedServices?: RelatedService[];
}
