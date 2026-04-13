'use client';

import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import moment from 'moment';
import { ReportItemData } from '@/lib/drupal/services/reports.service';
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 6;

export interface ReportsSectionProps {
  reports: ReportItemData[];
  categoryOptions: Array<{ label: string; value: string }>;
  reportTypeOptions: Array<{ label: string; value: string }>;
}

const reportsFilterFunction = (
  items: ReportItemData[],
  filterValues: Record<string, string | string[]>,
): ReportItemData[] => {
  return items.filter((report) => {
    const search = typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
    const matchesSearch = !search || report.title.toLowerCase().includes(search);

    const normalize = (value: string) => value.trim().toLowerCase();
    const reportLabelSet = new Set((report.labels || []).map((label) => normalize(label)));
    const toArray = (value: string | string[] | undefined) =>
      Array.isArray(value) ? value : value ? [value] : [];

    const selectedCategories = toArray(filterValues.category);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => reportLabelSet.has(normalize(cat)));

    const selectedReportTypes = toArray(filterValues.reportType);
    const matchesReportType =
      selectedReportTypes.length === 0 ||
      selectedReportTypes.some((type) => normalize(type) === normalize(report.reportType));

    let matchesDate = true;
    if (filterValues.date && typeof filterValues.date === 'string') {
      const [dateFrom, dateTo] = filterValues.date.split('|');
      if (dateFrom && dateTo) {
        const fromDate = moment(dateFrom);
        const toDate = moment(dateTo);
        const reportDate = moment(report.publicationDate, 'DD.MM.YYYY');

        if (!reportDate.isValid() || !fromDate.isValid() || !toDate.isValid()) {
          matchesDate = false;
        } else {
          matchesDate = reportDate.isBetween(fromDate, toDate, 'day', '[]');
        }
      }
    }

    return matchesSearch && matchesCategory && matchesReportType && matchesDate;
  });
};

export const ReportsSection = ({
  reports,
  categoryOptions,
  reportTypeOptions,
}: ReportsSectionProps) => {
  const t = useTranslations('reports');

  const filterFields = [
    {
      id: 'search',
      type: 'search' as const,
      label: t('filters.search'),
      placeholder: t('filters.search'),
    },
    {
      id: 'date',
      type: 'date' as const,
      label: t('filters.date'),
      placeholder: t('filters.selectDate'),
      variant: 'range' as const,
    },
    {
      id: 'category',
      type: 'select' as const,
      label: t('filters.category'),
      multiselect: false,
      options: categoryOptions,
      placeholder: t('filters.selectCategory'),
    },
    {
      id: 'reportType',
      type: 'select' as const,
      label: t('filters.reportType'),
      multiselect: false,
      options: reportTypeOptions,
      placeholder: t('filters.selectReportType'),
    },
  ];

  const renderCard = (report: ReportItemData, index: number) => {
    return <ServiceCard key={index} {...report} />;
  };

  return (
    <FilterableCardsSection
      items={reports}
      filterFields={filterFields}
      filterFunction={reportsFilterFunction}
      cardRenderer={renderCard}
      filterColumns={4}
      gridColumns={{
        base: 1,
        sm: 2,
        lg: 3,
      }}
      pagination={{
        enabled: true,
        pageSize: ITEMS_PER_PAGE,
      }}
      showTotalCount={true}
      totalCountLabel={t('totalNumber')}
      totalCountClassName="text-[36px] leading-[44px] tracking-[-0.72px] mt-10 mb-6"
      gridGap="gap-6"
      filtersVariant="media"
      filtersStyles="rounded-3xl"
      filtersContainerClassName="max-w-[1280px] mx-auto"
      filtersComponentStyles="pt-0 md:pt-0 pb-0"
      containerClassName="max-w-[1280px] mx-auto"
      emptyStateText={t('noReportsFound')}
    />
  );
};
