import { BookIcon } from '@/components/icons/BookIcon';
import { BrainIcon } from '@/components/icons/roles/BrainIcon';
import { AddNoteIcon, CirclePlusIcon, PatentMediaIcon } from '@/components/icons/services';
import IPServiceTemplate from '@/components/templates/IPServiceTemplate';
import IpAcademyOverviewSection from '@/components/sections/IpAcademyOverviewSection';
import EducationProjectsSection from '@/components/sections/EducationProjectsSection';
import ProQualificationSection from '@/components/sections/ProQualificationSection';
import TrainingProgramsSection from '@/components/sections/TrainingProgramsSection';
import { getIPAcademyPageData } from '@/lib/drupal/services/ip-academy.service';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ROUTES } from '@/lib/routes';
import Calendar from '@/assets/images/calendar.svg';
import Leading from '@/assets/images/leading_icon.svg';
import Location from '@/assets/images/location.svg';
import Riyal from '@/assets/images/Riyal.svg';
import User from '@/assets/images/user.svg';
import Watch from '@/assets/images/watch.svg';
export const revalidate = 300;

export default async function IpAcademyPage({ params }: { params: Promise<{ locale: string }> }) {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE');
  const { locale: paramLocale } = await params;
  const locale = paramLocale || cookieLocale?.value || 'en';

  const [data, messages] = await Promise.all([
    getIPAcademyPageData(locale),
    getMessages({ locale }),
  ]);

  // Ensure hero fields are strings (fix for Drupal {value, format, processed} objects)
  const ensureStr = (val: any): string => {
    if (!val) return '';
    const sanitize = (text: string): string => {
      return text
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/<[^>]*>/g, '')
        .trim();
    };
    if (typeof val === 'string') return sanitize(val);
    if (typeof val === 'object') {
      const text = val.processed || val.value || '';
      return typeof text === 'string' ? sanitize(text) : '';
    }
    return String(val);
  };

  const safeData = {
    ...data,
    trainingHeroTitle: ensureStr(data.trainingHeroTitle),
    trainingHeroDescription: ensureStr(data.trainingHeroDescription),
    qualificationsHeroTitle: ensureStr(data.qualificationsHeroTitle),
    qualificationsHeroDescription: ensureStr(data.qualificationsHeroDescription),
    projectsHeroTitle: ensureStr(data.projectsHeroTitle),
    projectsHeroDescription: ensureStr(data.projectsHeroDescription),
  };

  const TABS = [
    {
      id: 'overview',
      label: messages.tabs.overview,
      icon: <BookIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'training',
      label: messages.tabs.trainingPrograms,
      icon: <CirclePlusIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'qualifications',
      label: messages.tabs.proQualifications,
      icon: <BrainIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'projects',
      label: messages.tabs.educationProjects,
      icon: <AddNoteIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'media',
      label: messages.tabs.media,
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const navigationItems = [
    { label: messages.pageNavigation.informationLibrary, href: '#information-library' },
    { label: messages.pageNavigation.statistics, href: '#statistics' },
    { label: messages.pageNavigation.relatedPages, href: '#related-pages' },
  ];

  return (
    <IPServiceTemplate
      tabs={TABS}
      defaultActiveTab="overview"
      enableMobileScroll={true}
      tabsClassName="[&_[role=tablist]]:!p-0"
      tabsSectionClassName="pt-6 xl:!max-w-[1280px] xl:!px-0"
      breadcrumbs={[
        { label: messages.breadcrumbs.home, href: '/' },
        { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        { label: messages.breadcrumbs.ipEnablement },
        { label: messages.breadcrumbs.ipAcademy },
      ]}
      navigationItems={navigationItems}
      overview={{
        hero: {
          title: data.heroHeading,
          description: data.heroSubheading,
          backgroundImage: data.heroImage?.src || '/images/ip-academy/hero.jpg',
          // Figma: body text container width is fixed to 628px
          descriptionWrapperClassName: 'w-[628px] max-w-full',
          descriptionClassName:
            'w-[628px] max-w-full font-body text-[20px] font-normal leading-[30px] tracking-[0] text-white',
        },
        sections: (
          <IpAcademyOverviewSection
            statistics={data.overview.statistics}
            offers={data.overview.offers}
            advantages={data.overview.advantages}
            relatedPages={data.overview.relatedPages}
          />
        ),
      }}
      services={{
        title: 'IP Academy services',
        services: [],
        serviceTypeOptions: [{ value: 'all', label: 'All' }],
        targetGroupOptions: [{ value: 'all', label: 'All' }],
      }}
      media={{
        heroTitle: data.media.heroTitle,
        heroDescription: data.media.heroDescription,
        heroImage: data.media.heroImage,
        tabs: data.media.tabs,
        content: data.media.content,
        filterFields: [
          {
            id: 'search',
            label: messages.common.filters.search,
            type: 'search',
            placeholder: messages.common.filters.search,
          },
          {
            id: 'date',
            label: messages.common.filters.date,
            type: 'date',
            variant: 'range',
            placeholder: messages.common.filters.selectDate,
          },
        ],
        badgeLabel: messages.breadcrumbs.ipAcademy,
      }}
      additionalTabs={{
        training: (
          <TrainingProgramsSection
            programs={safeData.trainingProgramsForCards}
            heroTitle={safeData.trainingHeroTitle}
            heroDescription={safeData.trainingHeroDescription}
          />
        ),
        qualifications: (
          <ProQualificationSection
            items={safeData.qualificationsForCards}
            heroTitle={safeData.qualificationsHeroTitle}
            heroDescription={safeData.qualificationsHeroDescription}
          />
        ),
        projects: (
          <EducationProjectsSection
            projects={safeData.educationProjectsForCards}
            title={safeData.projectsHeroTitle}
            description={safeData.projectsHeroDescription}
            categoryOptions={safeData.educationProjectCategoryOptions}
          />
        ),
      }}
    />
  );
}
