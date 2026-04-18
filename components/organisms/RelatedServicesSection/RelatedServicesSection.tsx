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
  cardWidth = 410,
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
              <ServiceCard
                className={'w-full md:w-[410px] h-fit md:h-[358px] '}
                {...service}
                variant={service.variant || 'services'}
                primaryButtonLabel={'View details'}
              />
            </div>
          ))
        : null}
    </ScrollableCards>
  );
};

export default RelatedServicesSection;
