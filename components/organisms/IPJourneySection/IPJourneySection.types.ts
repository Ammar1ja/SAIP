export interface TocItem {
  id: string;
  label: string;
  subItems?: TocItem[];
}

export interface IPJourneySectionListItem {
  title: string;
  description?: string; // Optional to match JourneySectionData
  buttonLabel?: string;
  buttonHref?: string;
  sections?: Array<{
    heading?: string;
    content?: string | string[];
    isNumbered?: boolean;
  }>;
  example?: {
    items: string[];
  };
  icon?: string;
  category?: string;
}

export interface IPJourneySectionData {
  title: string;
  subtitle?: string;
  description?: string;
  subDescription?: string;
  buttonLabel?: string;
  buttonHref?: string;
  items?: IPJourneySectionListItem[];
  showContentSwitcher?: boolean;
  contentSwitcherItems?: Array<{ id: string; label: string }>;
  parentSectionId?: string | null;
  subsections?: Array<IPJourneySectionData & { id: string }>;
  isLevel3?: boolean;
  displayType?:
    | 'default'
    | 'timeline'
    | 'expandable'
    | 'checklist'
    | 'cards'
    | 'header'
    | 'accordion'
    | 'accordion-group'
    | 'list-with-button';
}

export interface IPJourneySectionProps {
  title?: string;
  description?: string;
  secondDescription?: string;
  backgroundImage?: string;
  sectionIds: readonly string[];
  sections: Record<string, IPJourneySectionData>;
  tocItems: TocItem[];
  tocAriaLabel?: string;
  tocName?: string;
}
