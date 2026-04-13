'use client';

import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { GuidelineItemData } from '@/lib/drupal/services/guidelines.service';
import { useTranslations } from 'next-intl';
import moment from 'moment';

interface GuidelinesContentProps {
  guidelines: GuidelineItemData[];
  categoryOptions: Array<{ label: string; value: string }>;
}

function GuidelinesContent({ guidelines, categoryOptions }: GuidelinesContentProps) {
  const t = useTranslations('common.filters');

  // Translate "All" option
  const translatedCategoryOptions = categoryOptions.map((opt) => ({
    ...opt,
    label: opt.value === 'all' ? t('all') : opt.label,
  }));

  const guidelinesFilterFunction = (
    items: GuidelineItemData[],
    filterValues: Record<string, string | string[]>,
  ) => {
    return items.filter((item) => {
      const search =
        typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
      const matchesSearch =
        !search ||
        item.title?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search);

      let matchesCategory = true;
      if (Array.isArray(filterValues.category) && filterValues.category.length > 0) {
        if (!filterValues.category.includes('all')) {
          const itemCategory = (item.category || '').toLowerCase();
          matchesCategory = filterValues.category.some((cat) => cat.toLowerCase() === itemCategory);
        }
      }

      let matchesDate = true;
      if (
        typeof filterValues.publicationDate === 'string' &&
        filterValues.publicationDate.includes('|')
      ) {
        const [fromStr, toStr] = filterValues.publicationDate.split('|');
        if (fromStr && toStr) {
          const fromDate = moment(fromStr);
          const toDate = moment(toStr);
          const publicationDate = moment(item.publicationDate, [
            moment.ISO_8601,
            'DD.MM.YYYY',
            'D.M.YYYY',
            'DD/MM/YYYY',
            'D/M/YYYY',
            'YYYY-MM-DD',
          ]);

          if (fromDate.isValid() && toDate.isValid() && publicationDate.isValid()) {
            matchesDate =
              (publicationDate.isAfter(fromDate, 'day') ||
                publicationDate.isSame(fromDate, 'day')) &&
              (publicationDate.isBefore(toDate, 'day') || publicationDate.isSame(toDate, 'day'));
          } else {
            matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  const FILTER_FIELDS = [
    {
      id: 'search',
      label: t('search'),
      type: 'search' as const,
      placeholder: t('search'),
    },
    {
      id: 'publicationDate',
      label: t('publicationDate'),
      type: 'date' as const,
      variant: 'range' as const,
      placeholder: t('selectDateRange'),
    },
    {
      id: 'category',
      label: t('category'),
      type: 'select' as const,
      options: translatedCategoryOptions,
      multiselect: true,
    },
  ];

  const renderCard = (guideline: GuidelineItemData, index: number) => {
    // Use index + title for unique key (some guidelines have duplicate titles)
    return <ServiceCard key={`${index}-${guideline.title}`} {...guideline} titleBg="green" />;
  };

  return (
    <FilterableCardsSection
      items={guidelines}
      filterFields={FILTER_FIELDS}
      filterFunction={guidelinesFilterFunction}
      cardRenderer={renderCard}
      showTotalCount={true}
      totalCountLabel={t('totalNumber')}
      emptyStateText={t('noItemsFound')}
      filtersInSeparateSection={true}
      pagination={{ enabled: true, pageSize: 9 }}
      filtersBackground="neutral"
      gridColumns={{ base: 1, md: 2, lg: 3 }}
    />
  );
}

export default GuidelinesContent;
