import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';

export interface RelatedServicesSectionProps {
  title?: string;
  description?: string;
  services: ServiceCardProps[];
  cardWidth?: number;
}
