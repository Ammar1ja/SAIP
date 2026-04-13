import { ReactNode } from 'react';

export interface ScrollableCardsProps {
  heading: string;
  text?: string;
  variant: 'highlight' | 'pillar' | 'value';
  background?: 'white' | 'primary-50' | 'neutral';
  items: {
    id: string;
    icon?: ReactNode;
    title: string;
    description?: string;
    number?: string | number;
    buttonLabel?: string;
    buttonHref?: string;
  }[];
  children?: ReactNode;
  cardWidth?: number;
  headingClassName?: string;
}
