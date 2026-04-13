export interface Tab {
  id: string;
  label: string;
}

export interface Offer {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface OffersSectionProps {
  tabs?: Tab[];
  data?: Offer[];
}
