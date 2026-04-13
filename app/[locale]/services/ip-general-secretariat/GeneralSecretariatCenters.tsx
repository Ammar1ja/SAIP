'use client';

import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import { ServiceItemData } from '@/lib/drupal/services/service-directory.service';

interface GeneralSecretariatCentersProps {
  services: ServiceItemData[];
  filterFields: Array<{
    id: string;
    label: string;
    type: 'search';
    placeholder: string;
  }>;
  renderServiceCard: (service: ServiceItemData, index: number) => React.ReactNode;
  title: string;
  totalCountLabel: string;
  emptyStateText: string;
}

export const GeneralSecretariatCenters = ({
  services,
  filterFields,
  renderServiceCard,
  title,
  totalCountLabel,
  emptyStateText,
}: GeneralSecretariatCentersProps) => {
  return (
    <FilterableCardsSection
      title={title}
      titleInFiltersSection
      titleClassName="text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] tracking-[-1.44px] font-medium text-left rtl:text-right"
      items={services}
      filterFields={filterFields}
      cardRenderer={renderServiceCard}
      filtersInSeparateSection
      filtersBackground="primary-25"
      cardsBackground="white"
      gridColumns={{
        base: 1,
        md: 2,
        lg: 3,
      }}
      showTotalCount={true}
      totalCountLabel={totalCountLabel}
      totalCountClassName="text-[32px] sm:text-[40px] md:text-[48px] leading-[40px] sm:leading-[52px] md:leading-[60px] tracking-[-0.96px] mt-12 mb-8"
      emptyStateText={emptyStateText}
      containerClassName="max-w-7xl mx-auto px-4 md:px-0 pt-24"
      gridGap="gap-6"
      filtersComponentStyles="pt-12 pb-16 -mb-24"
      filtersStyles="p-10 mt-6 rounded-3xl border border-[#d2d6db] shadow-none max-w-[1062px] mx-auto"
      filtersContainerClassName="max-w-7xl mx-auto px-4 md:px-0"
    />
  );
};
