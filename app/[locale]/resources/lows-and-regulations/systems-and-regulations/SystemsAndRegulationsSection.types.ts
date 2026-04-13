import { FilterableItem } from '@/components/organisms/FilterableCardsSection/FilterableCardsSection.types';

export interface SystemOrRegulation extends FilterableItem {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  description: string;
  lastUpdated: string;
}

export interface SystemsAndRegulationsSectionProps {
  items?: SystemOrRegulation[];
}
