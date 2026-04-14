'use client';

import { FC, useMemo } from 'react';
import moment from 'moment';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { TrainingProgramsSectionProps, TrainingProgram } from './TrainingProgramsSection.types';
import { MOCK_TRAINING_PROGRAMS } from './TrainingProgramsSection.data';
import { LocationPinIcon } from '@/components/icons/services';
import { UsersIcon } from '@/components/icons/strategy/UsersIcon';
import { AddNoteIcon, PatentDocIcon, CirclePlusIcon } from '@/components/icons/services';
import { BookIcon } from '@/components/icons/BookIcon';
import { useTranslations, useLocale } from 'next-intl';
import Calendar from '@/assets/images/calendar.svg';
import Leading from '@/assets/images/leading_icon.svg';
import Location from '@/assets/images/location.svg';
import Riyal from '@/assets/images/Riyal.svg';
import User from '@/assets/images/user.svg';
import Watch from '@/assets/images/watch.svg';
const TrainingProgramsSection: FC<TrainingProgramsSectionProps> = ({
  programs = MOCK_TRAINING_PROGRAMS,
  heroTitle = 'Training programs',
  heroDescription = 'Explore our diverse range of over 40 specialized training courses designed to advance your skills in 10 distinct areas.',
}) => {
  const t = useTranslations('ipAcademy.training');
  const tCommon = useTranslations('common.filters');
  const locale = useLocale();

  const withLocale = (href: string | undefined) => {
    if (!href) return href;
    if (href.startsWith('http')) return href;
    if (href.startsWith('/api/')) return href;
    if (locale === 'en') return href.startsWith('/') ? href : `/${href}`;
    if (href.startsWith(`/${locale}/`)) return href;
    return href.startsWith('/') ? `/${locale}${href}` : `/${locale}/${href}`;
  };

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(programs.map((program) => program.category).filter(Boolean)),
    );

    return [
      { value: '', label: tCommon('select') },
      ...uniqueCategories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [programs, tCommon]);

  const filterFields = useMemo(
    () => [
      {
        id: 'search',
        label: tCommon('search'),
        type: 'search' as const,
        placeholder: tCommon('search'),
      },
      {
        id: 'date',
        label: t('date'),
        type: 'date' as const,
        variant: 'range' as const,
        placeholder: tCommon('selectDateRange') || 'Select date range',
      },
      {
        id: 'category',
        label: t('category'),
        type: 'select' as const,
        options: categoryOptions,
      },
    ],
    [categoryOptions, t, tCommon],
  );

  // Custom filter function for training programs
  const filterTrainingPrograms = (
    items: TrainingProgram[],
    filterValues: Record<string, string | string[]>,
  ) => {
    return items.filter((program) => {
      const search =
        typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
      const matchesSearch = !search || program.title.toLowerCase().includes(search);

      const matchesCategory = !filterValues.category || program.category === filterValues.category;

      // Date filtering - support both single date and date range
      let matchesDate = true;
      const dateFilter = filterValues.date;

      if (dateFilter && typeof dateFilter === 'string' && dateFilter.trim() !== '') {
        // Check if it's a date range (format: ISO|ISO)
        if (dateFilter.includes('|')) {
          const [fromStr, toStr] = dateFilter.split('|');
          const fromDate = moment(fromStr);
          const toDate = moment(toStr);

          if (fromDate.isValid() && toDate.isValid() && program.date) {
            let programDate: moment.Moment | null = null;
            let datePart = program.date.trim();

            if (program.date.includes(',')) {
              datePart = program.date.split(',')[0]?.trim() || program.date;
            } else {
              const parts = program.date.trim().split(' ');
              const lastPart = parts[parts.length - 1];
              if (lastPart && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(lastPart)) {
                datePart = lastPart;
              }
            }

            programDate = moment(datePart, ['DD.MM.YYYY', 'D.M.YYYY'], true);
            if (!programDate.isValid()) {
              programDate = moment(program.date);
            }

            if (!programDate.isValid()) {
              programDate = moment(
                datePart,
                [
                  'MM/DD/YYYY',
                  'DD/MM/YYYY',
                  'M/D/YYYY',
                  'D/M/YYYY',
                  'YYYY-MM-DD',
                  'MM-DD-YYYY',
                  'DD-MM-YYYY',
                ],
                true,
              );
            }

            if (programDate && programDate.isValid()) {
              // Check if program date is within range
              matchesDate =
                programDate.startOf('day').isSameOrAfter(fromDate.startOf('day'), 'day') &&
                programDate.startOf('day').isSameOrBefore(toDate.startOf('day'), 'day');
            } else {
              matchesDate = false;
            }
          } else if (fromDate.isValid() && toDate.isValid()) {
            matchesDate = false;
          }
        } else {
          // Single date filtering (backward compatibility)
          const filterDate = moment(dateFilter);

          if (filterDate.isValid() && program.date) {
            let programDate: moment.Moment | null = null;
            let datePart = program.date.trim();

            if (program.date.includes(',')) {
              datePart = program.date.split(',')[0]?.trim() || program.date;
            } else {
              const parts = program.date.trim().split(' ');
              const lastPart = parts[parts.length - 1];
              if (lastPart && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(lastPart)) {
                datePart = lastPart;
              }
            }

            programDate = moment(datePart, ['DD.MM.YYYY', 'D.M.YYYY'], true);
            if (!programDate.isValid()) {
              programDate = moment(program.date);
            }

            if (!programDate.isValid()) {
              programDate = moment(
                datePart,
                [
                  'MM/DD/YYYY',
                  'DD/MM/YYYY',
                  'M/D/YYYY',
                  'D/M/YYYY',
                  'YYYY-MM-DD',
                  'MM-DD-YYYY',
                  'DD-MM-YYYY',
                ],
                true,
              );
            }

            if (programDate && programDate.isValid()) {
              matchesDate = programDate.startOf('day').isSame(filterDate.startOf('day'), 'day');
            } else {
              matchesDate = false;
            }
          } else if (filterDate.isValid()) {
            matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  // Custom card renderer for detailed variant
  const cardRenderer = (program: TrainingProgram, index: number) => {
    const dateValue = program.time ? [program.time, program.date] : program.date;

    const detailsHref = withLocale(`/services/ip-academy/training-programs/${program.id}`);

    return (
      <ServiceCard
        key={program.id}
        title={program.title}
        variant="training"
        className="w-full lg:w-[628px] max-w-full"
        details={[
          {
            icon: <AddNoteIcon className="w-4 h-4 text-white" />,
            label: t('date'),
            value: dateValue,
          },
          {
            icon: <PatentDocIcon className="w-4 h-4 text-white" />,
            label: t('category'),
            value: program.category,
          },
          {
            icon: <BookIcon className="w-4 h-4 text-white" />,
            label: t('duration'),
            value: program.duration,
          },
          {
            icon: <CirclePlusIcon className="w-4 h-4 text-white" />,
            label: t('fees'),
            value: program.fees,
          },
          {
            icon: <LocationPinIcon className="w-4 h-4 text-white" />,
            label: t('location'),
            value: program.location,
          },
          {
            icon: <UsersIcon className="w-4 h-4 text-white" />,
            label: t('hosts'),
            value: program.host,
          },
        ]}
        primaryButtonLabel={t('readMore')}
        primaryButtonHref={detailsHref}
        secondaryButtonLabel={t('viewDetails')}
        secondaryButtonHref={detailsHref}
      />
    );
  };

  return (
    <>
      <HeroStatic
        title={heroTitle}
        description={heroDescription}
        backgroundImage="/images/ip-academy/hero.jpg"
        descriptionClassName="text-[18px] leading-[28px] md:text-[18px] md:leading-[28px]"
      />
      <FilterableCardsSection<TrainingProgram>
        items={programs}
        filterFields={filterFields}
        filterColumns={3}
        gridGap="gap-5"
        cardsLayout="flex"
        cardRenderer={cardRenderer}
        filterFunction={filterTrainingPrograms}
        showTotalCount={true}
        totalCountLabel={tCommon('totalNumber')}
        totalCountClassName="text-[30px] leading-[38px] tracking-normal md:text-5xl md:leading-[60px] md:tracking-[-0.96px]"
        filtersStyles="bg-[#f9fafb] rounded-3xl p-10 border border-[#e5e7eb]"
        cardsContainerClassName="flex-col md:flex-row md:flex-wrap md:justify-between md:items-stretch"
        cardsBackground="white"
      />
    </>
  );
};

export default TrainingProgramsSection;
