'use client';

import Section from '@/components/atoms/Section';
import IPServiceTemplate from '@/components/templates/IPServiceTemplate';
import IpSupportCentersOverviewSection from '@/components/sections/IpSupportCentersOverviewSection';
import { CentersListSection } from '@/components/organisms/CentersSection';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import TimelineSteps from '@/components/organisms/TimelineSteps';
import DetailPageLayout from '@/components/layouts/DetailPageLayout';
import {
  PatentDocIcon,
  CirclePlusIcon,
  LocationPinIcon,
  PatentMediaIcon,
} from '@/components/icons/services';
import { IPSupportCentersData } from '@/lib/drupal/services/ip-support-centers.service';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { useTranslations } from 'next-intl';

interface IpSupportCentersPageContentProps {
  data: IPSupportCentersData;
  breadcrumbs: BreadcrumbItem[];
}

const HowToJoinSection = ({ data }: { data: IPSupportCentersData }) => (
  <>
    <HeroStatic
      title={data.howToJoin.title}
      description={data.howToJoin.description}
      backgroundImage={data.heroImage?.src || '/images/ip-support-centers/hero.jpg'}
    />
    <DetailPageLayout
      sectionProps={{ background: 'white', padding: 'default' }}
      reserveSidebarSpace={true}
    >
      <TimelineSteps steps={data.howToJoin.steps} />
    </DetailPageLayout>
  </>
);

export default function IpSupportCentersPageContent({
  data,
  breadcrumbs,
}: IpSupportCentersPageContentProps) {
  const t = useTranslations('common.tabs');
  const tMedia = useTranslations('ipSupportCenters.media');
  const tCommon = useTranslations('common.filters');
  const tNav = useTranslations('ipSupportCenters');
  const tPageNav = useTranslations('pageNavigation');

  const TABS = [
    {
      id: 'overview',
      label: t('overview'),
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'how-to-join',
      label: t('howToJoin'),
      icon: <CirclePlusIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'centers',
      label: t('centers'),
      icon: <LocationPinIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'media',
      label: t('media'),
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const MOCK_SERVICES_DATA = {
    title: 'IP support centers services',
    services: [],
    serviceTypeOptions: [{ value: 'all', label: 'All' }],
    targetGroupOptions: [{ value: 'all', label: 'All' }],
  };

  // Override media with translations for short labels (long texts from Drupal)
  const mediaWithTranslations = {
    ...data.media,
    // heroTitle and heroDescription come from Drupal (data.media)
    tabs: [
      { id: 'news', label: tMedia('news') },
      { id: 'videos', label: tMedia('videos') },
    ],
    content: {
      news: {
        title: tMedia('news'),
        description: data.media.heroDescription,
      },
      videos: {
        title: tMedia('videos'),
        description: data.media.heroDescription,
      },
    },
    filterFields: [
      {
        id: 'search',
        label: tCommon('search'),
        type: 'search',
        placeholder: tCommon('search'),
      },
      {
        id: 'date',
        label: tCommon('date'),
        type: 'date',
        variant: 'range',
        placeholder: tCommon('selectDate'),
      },
    ],
    badgeLabel: tMedia('badgeLabel'),
  };

  const navigationItems = [
    { label: tNav('aboutTisc'), href: '#about-tisc' },
    { label: tNav('responsibilities'), href: '#tisc-responsibilities' },
    { label: tNav('guidelines'), href: '#tisc-guidelines' },
    { label: tNav('statistics'), href: '#statistics' },
    { label: tNav('centers.title'), href: '#centers' },
    { label: tPageNav('relatedPages'), href: '#related-pages' },
  ];

  return (
    <IPServiceTemplate
      tabs={TABS}
      defaultActiveTab="overview"
      breadcrumbs={breadcrumbs}
      navigationItems={navigationItems}
      overview={{
        hero: {
          title: data.heroHeading,
          description: data.heroSubheading,
          backgroundImage: data.heroImage?.src || '/images/ip-support-centers/hero.jpg',
          // Figma: hero 532×1440; title block 945×180 Hug → 72/90 two lines; avoid 520px cap.
          className:
            '!p-0 max-lg:!h-[min(calc(100vh-72px),532px)] max-lg:!min-h-0 max-lg:!max-h-none lg:!h-[532px] lg:!min-h-[532px] lg:!max-h-[532px]',
          layoutWrapperClassName:
            'w-full h-full max-w-screen-xl !px-4 md:!px-8 md:!pt-12 md:!pb-14 !pt-6 !pb-8 sm:!pb-8 md:!pb-14',
          titleClassName:
            'm-0 box-border w-full max-w-[945px] shrink-0 p-0 font-medium lg:!text-[72px] lg:!leading-[90px] lg:!tracking-[-0.02em]',
          titleWeight: 'medium',
          descriptionClassName:
            'w-full max-w-[628px] font-body !text-[20px] !leading-[30px] !font-normal !tracking-normal !text-white [&_p]:!mb-5 [&_p:last-child]:!mb-0 [&_p]:!text-[20px] [&_p]:!leading-[30px] [&_p]:!font-normal [&_p]:!text-white',
          contentStackClassName: 'gap-5 md:gap-6',
          descriptionWrapperClassName: '!mt-0 w-full max-w-[628px]',
        },
        sections: <IpSupportCentersOverviewSection data={data} />,
      }}
      services={MOCK_SERVICES_DATA}
      media={mediaWithTranslations}
      additionalTabs={{
        'how-to-join': <HowToJoinSection data={data} />,
        centers: <CentersListSection />,
      }}
    />
  );
}
