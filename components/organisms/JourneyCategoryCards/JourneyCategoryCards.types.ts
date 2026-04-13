export interface JourneyCategoryCard {
  title: string;
  description?: string; // Optional to match IPJourneySectionListItem
  icon?: string;
}

export interface JourneyCategoryCardsProps {
  items: JourneyCategoryCard[];
  className?: string;
}
