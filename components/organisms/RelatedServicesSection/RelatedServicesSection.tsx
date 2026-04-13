'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RelatedServicesSectionProps } from './RelatedServicesSection.types';
import ServiceCard from '@/components/molecules/ServiceCard/ServiceCard';
import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';
import ScrollableCards from '@/components/molecules/ScrollableCards';

const RelatedServicesSection: React.FC<RelatedServicesSectionProps> = ({
  title,
  description,
  services,
  cardWidth = 628,
}) => {
  const t = useTranslations('serviceDetail');

  // Use props if provided, otherwise use translations
  const displayTitle = title || t('relatedServices');
  const displayDescription = description || t('relatedServicesDesc');

  return (
    <ScrollableCards
      heading={displayTitle}
      text={displayDescription}
      variant="highlight"
      background="neutral"
      items={[]}
      cardWidth={cardWidth}
    >
      {services?.length
        ? services.map((service: ServiceCardProps, idx: number) => (
            <div
              key={idx}
              className="shrink-0 snap-start"
              style={{ width: cardWidth, maxWidth: cardWidth }}
              tabIndex={-1}
            >
              <ServiceCard {...service} variant={service.variant || 'services'} />
            </div>
          ))
        : null}
    </ScrollableCards>
  );
};

export default RelatedServicesSection;
