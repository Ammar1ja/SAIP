'use client';

import ScrollableCards from '@/components/molecules/ScrollableCards';
import { HighlightsProps } from './Highlights.types';
import { useTranslations } from 'next-intl';

export const Highlights = ({ highlights, heading, text }: HighlightsProps) => {
  const t = useTranslations('buttons');

  const items = highlights.map((h) => ({
    id: h.id,
    icon: h.icon,
    title: h.title,
    description: h.description,
    buttonLabel: (h as any).buttonLabel || h.title,
    buttonHref: h.buttonHref || (h as any).url || '#',
  }));

  return (
    <ScrollableCards
      heading={heading}
      text={text}
      items={items}
      variant="highlight"
      background="neutral"
    />
  );
};
