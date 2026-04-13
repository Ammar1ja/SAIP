'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ServiceCard from '@/components/molecules/ServiceCard';
import { TreatyCard } from '@/lib/drupal/services/international-treaties.service';

interface TreatiesCardsProps {
  treaties: TreatyCard[];
}

export function TreatiesCards({ treaties }: TreatiesCardsProps) {
  const t = useTranslations('internationalTreaties');

  return (
    <div id="treaties" className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treaties.map((treaty) => (
          <ServiceCard
            key={treaty.id}
            title={treaty.title}
            description={treaty.description}
            primaryButtonLabel={t('readMore')}
            primaryButtonHref={treaty.href}
            variant="default"
            titleBg="default"
          />
        ))}
      </div>
    </div>
  );
}
