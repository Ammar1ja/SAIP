'use client';

import { FC } from 'react';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Button from '@/components/atoms/Button';
import { EducationProjectsSectionProps, EducationProject } from './EducationProjectsSection.types';
import { MOCK_EDUCATION_PROJECTS } from './EducationProjectsSection.data';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import { useTranslations } from 'next-intl';

const EducationProjectsSection: FC<EducationProjectsSectionProps> = ({
  projects = MOCK_EDUCATION_PROJECTS,
  title = 'Education projects',
  description = '',
  categoryOptions,
}) => {
  const t = useTranslations('ipAcademy.projects');
  const tCommon = useTranslations('common.filters');
  const tButtons = useTranslations('buttons');

  const resolvedCategoryOptions =
    categoryOptions && categoryOptions.length > 0
      ? categoryOptions
      : Array.from(new Set(projects.map((project) => project.category).filter(Boolean))).map(
          (category) => ({
            value: category,
            label: category,
          }),
        );

  const FILTER_FIELDS = [
    {
      id: 'search',
      label: tCommon('search'),
      type: 'search' as const,
      placeholder: tCommon('search'),
    },
    {
      id: 'category',
      label: t('category'),
      type: 'select' as const,
      options: resolvedCategoryOptions,
      placeholder: tCommon('select'),
    },
  ];
  const filterEducationProjects = (
    items: EducationProject[],
    filterValues: Record<string, string | string[]>,
  ) => {
    return items.filter((project) => {
      const search =
        typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
      const matchesSearch =
        !search ||
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search);

      const normalize = (value: string) => value.trim().toLowerCase();
      const selected =
        typeof filterValues.category === 'string'
          ? [filterValues.category]
          : Array.isArray(filterValues.category)
            ? filterValues.category
            : [];
      const matchesCategory =
        selected.length === 0 ||
        selected.some((value) => normalize(value) === normalize(project.category || ''));

      return matchesSearch && matchesCategory;
    });
  };

  const cardRenderer = (project: EducationProject, index: number) => (
    <article
      key={project.id}
      className="flex !h-[318px] min-h-[318px]  w-full max-w-[410px] flex-col justify-self-center gap-6 overflow-hidden rounded-lg border border-[#D2D6DB] bg-white p-6 shadow-none focus-within:ring-2 focus-within:ring-primary-500 md:max-w-none md:justify-self-stretch "
      tabIndex={0}
      aria-label={project.title}
    >
      <div className="flex h-[118px] shrink-0 items-center rounded-md bg-primary-50 p-6">
        <h3 className="line-clamp-2 text-[18px] leading-[28px] font-medium tracking-normal text-text-default">
          {project.title}
        </h3>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <p className="line-clamp-3 text-[16px] leading-[24px] font-normal tracking-normal text-text-primary-paragraph">
          {project.description}
        </p>
      </div>
      <div className="flex shrink-0 gap-4">
        <Button
          href={project.detailsUrl}
          intent="secondary"
          outline
          size="md"
          className="h-11 flex-1 justify-center"
          ariaLabel={t('viewDetails')}
        >
          <ViewFigmaIcon className="h-5 w-5 text-current" />
          {t('viewDetails')}
        </Button>
        <Button
          href={project.fileUrl || '#'}
          intent="primary"
          download
          size="md"
          className="h-11 flex-1 justify-center"
          ariaLabel={tButtons('downloadFile')}
        >
          <DownloadFigmaIcon className="h-5 w-5 text-current" />
          {tButtons('downloadFile')}
        </Button>
      </div>
    </article>
  );

  return (
    <>
      <HeroStatic
        title={title}
        description={description}
        backgroundImage="/images/ip-academy/hero.jpg"
        descriptionClassName="text-[18px] leading-[28px] md:text-[18px] md:leading-[28px]"
      />
      <FilterableCardsSection<EducationProject>
        items={projects}
        filterFields={FILTER_FIELDS}
        cardRenderer={cardRenderer}
        filterFunction={filterEducationProjects}
        filterColumns={2}
        gridColumns={{
          base: 1,
          md: 2,
          lg: 3,
        }}
        gridGap="gap-6"
        cardsContainerClassName="justify-items-center md:justify-items-stretch"
        showTotalCount={true}
        totalCountLabel={tCommon('totalNumber')}
        totalCountClassName="text-[30px] leading-[38px] tracking-normal md:text-5xl md:leading-[60px] md:tracking-[-0.96px]"
        filtersInSeparateSection={true}
        filtersBackground="white"
        cardsBackground="white"
        sectionClassName="px-4 md:px-8 xl:!px-0"
        pagination={{
          enabled: true,
          pageSize: 9,
        }}
        containerClassName="max-w-7xl mx-auto"
      />
    </>
  );
};

export default EducationProjectsSection;
