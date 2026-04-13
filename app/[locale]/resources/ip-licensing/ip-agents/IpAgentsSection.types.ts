import { FilterableItem } from '@/components/organisms/FilterableCardsSection/FilterableCardsSection.types';

export interface IpAgent extends FilterableItem {
  id: string;
  name: string;
  licenseNumber: string;
  location: string;
  email: string;
  phone: string;
  categories: string[];
}

export interface IpAgentsSectionProps {
  agents: IpAgent[];
  translations: {
    /** Select placeholder ("Select") for Category / Location dropdowns */
    select?: string;
    search: string;
    category: string;
    location: string;
    totalNumber: string;
    locationLabel: string;
    emailLabel: string;
    phoneLabel: string;
    categoryLabel: string;
  };
}
