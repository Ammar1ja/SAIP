import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';

export interface PublicationsSectionProps {
  title: string;
  description: string;
  cards: ServiceCardProps[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}
