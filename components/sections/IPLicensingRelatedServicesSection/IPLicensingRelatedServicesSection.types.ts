export interface RelatedService {
  question: string;
  title: string;
  description: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface IPLicensingRelatedServicesSectionProps {
  title?: string;
  services?: RelatedService[];
}
