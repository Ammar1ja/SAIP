'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import Section from '@/components/atoms/Section';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { useMultiFilter } from '@/lib/hooks/useMultiFilter';
import { getUniqueOptions } from '@/lib/utils/getUniqueOptions';
import Spinner from '@/components/atoms/Spinner';
import { getProjectsData, type ProjectData } from '@/lib/drupal/services/projects.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { useIsMobile } from '@/hooks/useIsMobile';

const ProjectCard = dynamic(
  () => import('@/components/molecules/ProjectCard').then((mod) => mod.ProjectCard),
  { loading: () => <Spinner size={40} className="h-40" /> },
);

// Hardcoded data removed - now using Drupal data

type FilterValues = {
  search?: string;
  tenderActivity?: string | string[];
  tenderStage?: string | string[];
  tenderType?: string | string[];
  publicationDate?: string;
  bidSubmissionDeadline?: string;
  sorting?: string;
};

export function ProjectsContent() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const tBreadcrumbs = useTranslations('projects.breadcrumbs');
  const tFilters = useTranslations('projects.filters');
  const isMobile = useIsMobile();

  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects data from Drupal with locale
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjectsData(locale);
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [locale]);

  // Dynamic options
  const tenderActivityOptions = useMemo(
    () => getUniqueOptions(projects, 'mainActivity'),
    [projects],
  );
  const tenderStageOptions = useMemo(() => getUniqueOptions(projects, 'tenderStage'), [projects]);
  const tenderTypeOptions = useMemo(() => getUniqueOptions(projects, 'tenderType'), [projects]);

  const tCommonFilters = useTranslations('common.filters');

  const filterFields = [
    {
      id: 'search',
      label: tFilters('search'),
      type: 'search' as const,
      placeholder: tFilters('search'),
    },
    {
      id: 'tenderActivity',
      label: tFilters('tenderActivity'),
      type: 'select' as const,
      options: tenderActivityOptions,
      multiselect: true,
    },
    {
      id: 'tenderStage',
      label: tFilters('tenderStage'),
      type: 'select' as const,
      options: tenderStageOptions,
      multiselect: true,
    },
    {
      id: 'tenderType',
      label: tFilters('tenderType'),
      type: 'select' as const,
      options: tenderTypeOptions,
      multiselect: true,
    },

    {
      id: 'publicationDate',
      label: tCommonFilters('publicationDate'),
      type: 'date' as const,
      variant: 'range' as const,
      placeholder: tCommonFilters('selectDateRange') || 'Select date range',
    },
    {
      id: 'bidSubmissionDeadline',
      label: tFilters('bidSubmissionDeadline'),
      type: 'date' as const,
      variant: 'range' as const,
      placeholder: tCommonFilters('selectDateRange') || 'Select date range',
    },
    {
      id: 'sorting',
      label: tFilters('sorting') || 'Sorting according to',
      type: 'select' as const,
      placeholder: tCommonFilters('select') || 'Select',
      options: [
        { value: 'asc', label: tFilters('ascending') || 'Ascending' },
        { value: 'desc', label: tFilters('descending') || 'Descending' },
      ],
    },
  ];

  // Helper function to parse date string to Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    if (dateString.includes('T') || dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Try to parse different date formats

    const cleanDate = dateString.split(' ').pop() || dateString; // Get date part if time is included

    // Try parsing with dots (DD.MM.YYYY) - filter display format
    let parts = cleanDate.split('.');
    if (parts.length === 3 && !cleanDate.includes('T')) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      const fullYear = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
      return new Date(fullYear, month, day);
    }

    parts = cleanDate.split('/');
    if (parts.length === 3 && !cleanDate.includes('T')) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      // Handle 2-digit years
      const fullYear = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
      return new Date(fullYear, month, day);
    }

    // Fallback to standard Date parsing
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Helper function to check if date is within range
  const isDateInRange = (dateString: string, rangeString: string | undefined): boolean => {
    if (!rangeString) return true;
    const [fromStr, toStr] = rangeString.split('|');
    if (!fromStr || !toStr) return true;

    const projectDate = parseDate(dateString);
    const fromDate = parseDate(fromStr) || new Date(fromStr);
    const toDate = parseDate(toStr) || new Date(toStr);

    if (!projectDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true;

    // Set time to start/end of day for comparison
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    projectDate.setHours(0, 0, 0, 0);

    return projectDate >= fromDate && projectDate <= toDate;
  };

  // Base filtering logic (search, selects)
  const baseFilteredProjects = useMultiFilter({
    data: projects,
    filterValues,
    fieldMap: {
      tenderActivity: 'mainActivity',
      tenderStage: 'tenderStage',
      tenderType: 'tenderType',
    },
    searchFn: (item, search) =>
      item.title.toLowerCase().includes(search) ||
      (!!item.mainActivity && item.mainActivity.toLowerCase().includes(search)),
  });

  // Apply date filters and sorting
  const filteredProjects = useMemo(() => {
    let filtered = [...baseFilteredProjects];

    // Apply date filters
    if (filterValues.publicationDate) {
      filtered = filtered.filter((item) =>
        isDateInRange(item.publicationDate, filterValues.publicationDate),
      );
    }

    if (filterValues.bidSubmissionDeadline) {
      filtered = filtered.filter((item) =>
        isDateInRange(item.bidSubmissionDeadline, filterValues.bidSubmissionDeadline),
      );
    }

    // Apply sorting
    if (filterValues.sorting) {
      filtered = filtered.sort((a, b) => {
        // Sort by publication date
        const dateA = parseDate(a.publicationDate);
        const dateB = parseDate(b.publicationDate);

        if (!dateA || !dateB) return 0;

        if (filterValues.sorting === 'asc') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
    }

    return filtered;
  }, [
    baseFilteredProjects,
    filterValues.publicationDate,
    filterValues.bidSubmissionDeadline,
    filterValues.sorting,
  ]);

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  return (
    <>
      <Section background="primary-50" overlap>
        <Breadcrumbs
          variant="subpage"
          className="mb-8"
          items={[
            {
              label: tBreadcrumbs('home'),
              href: '/',
            },
            {
              label: tBreadcrumbs('saip'),
            },
            {
              label: tBreadcrumbs('projects'),
            },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-12">
          <h1 className="font-medium text-4xl sm:text-5xl md:text-6xl lg:text-[72px] lg:leading-[90px] lg:tracking-[-0.02em] text-text-default flex-1 min-w-0 max-w-[1046px]">
            {t('pageTitle')}
          </h1>
          <a
            href="https://etimad.sa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('etimad')}
            className="hidden sm:inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-sm font-medium hover:bg-primary-800 transition"
          >
            {' '}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>{t('etimad')}</span>
          </a>
        </div>
      </Section>
      <Section background="neutral" fullWidth constrain={false}>
        <div className="mx-auto w-full max-w-[1062px]">
          {isMobile ? (
            <MobileFilters
              fields={filterFields}
              values={filterValues}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              searchFieldId="search"
            />
          ) : (
            <Filters
              fields={filterFields}
              values={filterValues}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              variant="projects"
              mainFieldsCount={4}
            />
          )}
        </div>
        <div className="mx-auto mt-12 w-full max-w-[1280px]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-8 ">
            {t('totalNumber')}: {filteredProjects.length}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size={60} />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          )}
        </div>
      </Section>
      <FeedbackSection />
    </>
  );
}
