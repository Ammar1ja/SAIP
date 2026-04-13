'use client';

import React, { FC, useCallback } from 'react';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import {
  SystemsAndRegulationsData,
  RegulationItem,
} from '@/lib/drupal/services/systems-and-regulations.service';
import moment from 'moment';
import { useTranslations } from 'next-intl';

interface SystemsAndRegulationsSectionProps {
  data: SystemsAndRegulationsData;
}

type SystemRegulationItem = RegulationItem;

const systemsRegulationsFilterFunction = (
  items: SystemRegulationItem[],
  filterValues: Record<string, string | string[]>,
): SystemRegulationItem[] => {
  return items.filter((item) => {
    const search =
      typeof filterValues.search === 'string' ? filterValues.search.toLowerCase().trim() : '';
    const matchesSearch =
      !search ||
      (item.title && item.title.toLowerCase().includes(search)) ||
      (item.publicationNumber && item.publicationNumber.toLowerCase().includes(search));

    const categoryFilter = filterValues.category;
    const matchesCategory = (() => {
      if (!categoryFilter || (Array.isArray(categoryFilter) && categoryFilter.length === 0)) {
        return true;
      }
      if (typeof categoryFilter === 'string') {
        const filterValue = categoryFilter.toLowerCase().trim();
        if (filterValue === 'all' || filterValue === '') return true;
        return item.labels?.some((label) => label.toLowerCase().trim() === filterValue) ?? false;
      }
      if (Array.isArray(categoryFilter)) {
        const normalizedFilters = categoryFilter
          .map((v) => String(v).toLowerCase().trim())
          .filter((v) => v !== '');
        if (normalizedFilters.length === 0) return true;

        if (normalizedFilters.some((v) => v === 'all')) return true;

        const normalizedLabels = (item.labels || [])
          .map((label) => String(label).toLowerCase().trim())
          .filter((label) => label !== '');

        return normalizedLabels.some((label) => normalizedFilters.includes(label));
      }

      return true;
    })();

    const typeFilter = filterValues.type;
    const matchesType = (() => {
      if (
        !typeFilter ||
        (typeof typeFilter === 'string' && typeFilter.toLowerCase().trim() === 'all')
      ) {
        return true;
      }
      if (typeof typeFilter === 'string') {
        const filterValue = typeFilter.toLowerCase().trim();
        return item.labels?.some((label) => label.toLowerCase().trim() === filterValue) ?? false;
      }
      return true;
    })();

    const dateFilter = filterValues.date;
    const today = moment().endOf('day'); // End of today for comparison
    let matchesDate = true;

    const itemDateValue = item.durationDateValue || item.durationDate;
    if (itemDateValue) {
      const itemDate = moment(
        itemDateValue,
        [
          moment.ISO_8601,
          'M/D/YYYY',
          'MM/DD/YYYY',
          'DD/MM/YYYY',
          'DD.MM.YYYY',
          'YYYY-MM-DD',
          'M-D-YYYY',
          'MM-DD-YYYY',
        ],
        true,
      );

      if (itemDate.isValid()) {
        if (itemDate.isAfter(today)) {
          return false;
        }
      }
    }

    if (dateFilter && typeof dateFilter === 'string') {
      const [filterFromStr, filterToStr] = dateFilter.includes('|')
        ? dateFilter.split('|')
        : [dateFilter, dateFilter];
      const filterFrom = moment(filterFromStr, moment.ISO_8601, true);
      const filterTo = moment(filterToStr, moment.ISO_8601, true);

      if (filterFrom.isValid() && filterTo.isValid()) {
        if (filterFrom.isAfter(filterTo)) {
          return false;
        }

        if (itemDateValue) {
          const itemDate = moment(
            itemDateValue,
            [
              moment.ISO_8601,
              'M/D/YYYY',
              'MM/DD/YYYY',
              'DD/MM/YYYY',
              'DD.MM.YYYY',
              'YYYY-MM-DD',
              'M-D-YYYY',
              'MM-DD-YYYY',
            ],
            true,
          );

          if (itemDate.isValid()) {
            matchesDate =
              itemDate.isSameOrAfter(filterFrom.startOf('day')) &&
              itemDate.isSameOrBefore(filterTo.endOf('day')) &&
              !itemDate.isAfter(today);
          } else {
            matchesDate = false;
          }
        } else {
          matchesDate = false;
        }
      } else {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });
};

const SystemsAndRegulationsSection: FC<SystemsAndRegulationsSectionProps> = ({ data }) => {
  const t = useTranslations('common.filters');

  const renderCard = useCallback((item: SystemRegulationItem) => {
    const slug = item.publicationNumber || item.title.toLowerCase().replace(/\s+/g, '-');
    const detailHref = `/resources/lows-and-regulations/systems-and-regulations/${slug}`;
    const resolvedType =
      item.type || item.labels?.find((label) => /system|regulation|نظام|لائحة/i.test(label)) || '';
    const cardLabels = item.category
      ? [item.category]
      : item.labels?.filter((label) => label !== resolvedType) || [];

    return (
      <ServiceCard
        key={item.title}
        title={item.title}
        titleBg="green"
        variant="report"
        reportType={resolvedType}
        reportTypeLabel={t('type')}
        publicationDate={item.durationDate}
        href={detailHref}
        primaryButtonHref={item.primaryButtonHref}
        primaryButtonLabel={item.primaryButtonLabel}
        secondaryButtonHref={item.secondaryButtonHref}
        secondaryButtonLabel={item.secondaryButtonLabel}
        labels={cardLabels}
      />
    );
  }, []);

  return (
    <FilterableCardsSection
      items={data.regulations}
      filterFields={data.filterFields}
      filterFunction={systemsRegulationsFilterFunction}
      cardRenderer={renderCard}
      filterColumns={4}
      gridColumns={{
        base: 1,
        sm: 2,
        lg: 3,
      }}
      gridGap="gap-6"
      pagination={{
        enabled: true,
        pageSize: 6,
      }}
      showTotalCount={true}
      totalCountLabel={t('totalNumber')}
      cardsBackground="white"
      filtersVariant="default"
      filtersContainerClassName="max-w-[1280px] w-full mx-auto"
      containerClassName="max-w-[1280px] w-full mx-auto"
      sectionClassName="px-4 md:px-8 xl:px-0"
      filtersComponentStyles="pt-0 md:pt-0 pb-0"
      filtersStyles="!rounded-lg !border-[#D2D6DB] !bg-white !shadow-none !p-6 md:!p-8 md:!min-h-[196px]"
      emptyStateText={t('noItemsFound')}
    />
  );
};

export default SystemsAndRegulationsSection;
