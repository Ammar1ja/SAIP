'use client';

import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs';
import ServiceCard from '@/components/molecules/ServiceCard';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import { PublicationsData, PublicationItemData } from '@/lib/drupal/services/publications.service';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import FeedbackSection from '@/components/organisms/FeedbackSection';

interface PublicationsContentProps {
  data: PublicationsData;
  breadcrumbs: BreadcrumbItem[];
}

const publicationsFilterFunction = (
  items: PublicationItemData[],
  filterValues: Record<string, string | string[]>,
): PublicationItemData[] => {
  return items.filter((item) => {
    const search = typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
    const matchesSearch =
      !search ||
      (item.title && item.title.toLowerCase().includes(search)) ||
      (item.publicationNumber && item.publicationNumber.toLowerCase().includes(search));

    let matchesDate = true;
    if (
      filterValues.date &&
      typeof filterValues.date === 'string' &&
      filterValues.date.includes('|')
    ) {
      const [dateFromStr, dateToStr] = filterValues.date.split('|');
      if (dateFromStr && dateToStr && item.durationDate) {
        try {
          const fromDate = moment(dateFromStr);
          const toDate = moment(dateToStr);
          const dateRangeParts = item.durationDate.split(' - ');
          if (dateRangeParts.length === 2) {
            const startDateStr = dateRangeParts[0].trim();
            const endDateStr = dateRangeParts[1].trim();
            let startDate, endDate;
            if (endDateStr.includes('.')) {
              const endParts = endDateStr.split('.');
              if (endParts.length === 3) {
                endDate = moment(endDateStr, 'DD.MM.YYYY');
                const startParts = startDateStr.split('.');
                if (startParts.length === 2) {
                  startDate = moment(`${startDateStr}.${endParts[2]}`, 'DD.MM.YYYY');
                } else if (startParts.length === 3) {
                  startDate = moment(startDateStr, 'DD.MM.YYYY');
                }
              }
            }
            if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
              matchesDate =
                (startDate.isBefore(toDate, 'day') || startDate.isSame(toDate, 'day')) &&
                (endDate.isAfter(fromDate, 'day') || endDate.isSame(fromDate, 'day'));
            } else {
              matchesDate = false;
            }
          } else {
            matchesDate = false;
          }
        } catch (error) {
          console.error('Error parsing date for filtering:', error);
          matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesDate;
  });
};

const PublicationsContent = ({ data, breadcrumbs }: PublicationsContentProps) => {
  const t = useTranslations('common.filters');

  const publicationsFilterFields = [
    { id: 'search', label: t('search'), type: 'search' as const, placeholder: t('search') },
    {
      id: 'date',
      label: t('date'),
      type: 'date' as const,
      variant: 'range' as const,
      placeholder: t('selectDateRange'),
    },
  ];

  const renderCard = (publication: (typeof data.publications)[0]) => {
    return (
      <ServiceCard key={publication.title} {...publication} titleBg="green" variant="report" />
    );
  };

  return (
    <div>
      <HeroStatic
        overlay
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage={data.heroImage?.src || '/images/publications/hero.jpg'}
        breadcrumbs={breadcrumbs}
      />

      <FilterableCardsSection
        items={data.publications}
        filterFields={publicationsFilterFields}
        filterFunction={publicationsFilterFunction}
        cardRenderer={renderCard}
        filterColumns={2}
        filtersVariant="media"
        gridColumns={{
          base: 1,
          sm: 2,
          lg: 3,
        }}
        gridGap="gap-6"
        pagination={{
          enabled: true,
          pageSize: 9,
        }}
        showTotalCount={true}
        totalCountLabel={t('totalNumber')}
        cardsBackground="neutral"
        emptyStateText={t('noPublicationsFound')}
      />
      <FeedbackSection />
    </div>
  );
};

export default PublicationsContent;
