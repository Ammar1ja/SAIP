import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';

export interface ServiceOption {
  value: string;
  label: string;
}

export interface IPServicesSectionProps {
  title: string;
  services: ServiceCardProps[];
  serviceTypeOptions: ServiceOption[];
  targetGroupOptions: ServiceOption[];
  category?: string;
}
