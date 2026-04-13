'use client';

import React from 'react';
import Section from '@/components/atoms/Section';
import CenterCard from '@/components/molecules/CenterCard';
import Button from '@/components/atoms/Button';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import { centersData, LOCATION_OPTIONS, SORT_OPTIONS } from './CentersSection.data';
import { CenterCardProps } from '@/components/molecules/CenterCard/CenterCard.types';
import { useTranslations } from 'next-intl';

// Extend CenterCardProps to be compatible with FilterableItem
interface FilterableCenterCard extends CenterCardProps {
  title?: string;
  description?: string;
  labels?: string[];
  [key: string]: unknown;
}

// Convert centers data to filterable format
const filterableCentersData: FilterableCenterCard[] = centersData.map((center) => ({
  ...center,
  title: center.name, // Map name to title for search compatibility
}));

// Filter function for centers with sorting
const filterCenters = (
  items: FilterableCenterCard[],
  filterValues: Record<string, string | string[]>,
): FilterableCenterCard[] => {
  let filtered = items.filter((center) => {
    // Search functionality
    const search = typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
    const matchesSearch =
      !search ||
      center.name.toLowerCase().includes(search) ||
      center.location.toLowerCase().includes(search);

    // Location filter
    const locationMatch =
      !filterValues.location ||
      filterValues.location === 'all' ||
      center.location === filterValues.location;

    return matchesSearch && locationMatch;
  });

  // Apply sorting
  if (filterValues.sort) {
    filtered = [...filtered].sort((a, b) => {
      if (filterValues.sort === 'a-z') {
        return a.name.localeCompare(b.name);
      } else if (filterValues.sort === 'z-a') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }

  return filtered;
};

// Card renderer for centers
const renderCenterCard = (center: FilterableCenterCard, index: number) => (
  <CenterCard key={`${center.name}-${index}`} {...center} />
);

// Filter fields configuration
const FILTER_FIELDS = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search',
  },
  {
    id: 'location',
    label: 'Location',
    type: 'select' as const,
    placeholder: 'Select',
    options: LOCATION_OPTIONS,
  },
  {
    id: 'sort',
    label: 'Sort',
    type: 'select' as const,
    placeholder: 'A - Z',
    options: SORT_OPTIONS,
  },
];

// Component for showing just first 3 centers (for Overview tab)
const CentersSection = () => {
  const t = useTranslations('ipSupportCenters.centers');
  const firstThreeCenters = centersData.slice(0, 3);

  return (
    <Section background="white" padding="medium">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-center text-3xl font-medium md:text-start">{t('title')}</h2>
          <Button
            intent="secondary"
            outline
            size="md"
            href="/services/ip-support-centers?tab=centers"
            ariaLabel={t('viewFullList')}
            className="shrink-0"
          >
            {t('viewFullList')}
          </Button>
        </div>
        <div className="grid w-full min-w-0 grid-cols-1 justify-items-center gap-[24px] md:grid-cols-2 md:justify-items-stretch lg:grid-cols-3">
          {firstThreeCenters.map((center, index) => (
            <CenterCard key={`${center.name}-${index}`} {...center} />
          ))}
        </div>
      </div>
    </Section>
  );
};

// Component for full centers list with filtering (for Centers tab)
export const CentersListSection = () => {
  const t = useTranslations('ipSupportCenters.centers');
  const tCommon = useTranslations('common.filters');

  const translatedFilterFields = [
    {
      id: 'search',
      label: tCommon('search'),
      type: 'search' as const,
      placeholder: tCommon('search'),
    },
    {
      id: 'location',
      label: t('location'),
      type: 'select' as const,
      placeholder: tCommon('select'),
      options: LOCATION_OPTIONS,
    },
    {
      id: 'sort',
      label: t('sort'),
      type: 'select' as const,
      displayAs: 'buttons' as const,
      placeholder: t('aToZ'),
      options: [
        { value: 'a-z', label: t('aToZ') },
        { value: 'z-a', label: t('zToA') },
      ],
    },
  ];

  return (
    <FilterableCardsSection<FilterableCenterCard>
      title={t('networkTitle')}
      items={filterableCentersData}
      filterFields={translatedFilterFields}
      cardRenderer={renderCenterCard}
      filterFunction={filterCenters}
      filterColumns={3}
      gridColumns={{
        base: 1,
        md: 2,
        lg: 3,
      }}
      gridGap="gap-[24px]"
      cardsContainerClassName="w-full min-w-0 justify-items-center md:justify-items-stretch"
      showTotalCount={true}
      totalCountLabel={t('totalNumber')}
      filtersInSeparateSection={false}
      filtersBackground="white"
      cardsBackground="white"
      containerClassName="max-w-7xl mx-auto"
      initialFilters={{ sort: 'a-z' }}
    />
  );
};

export default CentersSection;
