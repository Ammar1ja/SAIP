'use client';

import { useSearchParams } from 'next/navigation';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Tabs from '@/components/molecules/Tabs';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import {
  LocationPinIcon,
  PatentMediaIcon,
  PatentDocIcon,
  PatentServicesIcon,
} from '@/components/icons/services';
import Section from '@/components/atoms/Section';
import InformationLibrarySection from '@/components/organisms/InformationLibrarySection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import IPMediaSection from '@/components/organisms/IPMediaSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { IPInfringementData } from '@/lib/drupal/services/ip-infringement.service';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { useTranslations } from 'next-intl';
import FeedbackSection from '@/components/organisms/FeedbackSection';

interface IpInfringementPageContentProps {
  data: IPInfringementData;
  breadcrumbItems: BreadcrumbItem[];
  mediaItems: {
    news: any[];
    articles: any[];
    videos: any[];
  };
}

export default function IpInfringementPageContent({
  data,
  breadcrumbItems,
  mediaItems,
}: IpInfringementPageContentProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const tTabs = useTranslations('common.tabs');
  const tNav = useTranslations('common.nav');
  const tStats = useTranslations('common.statistics');
  const tFilters = useTranslations('common.filters');
  const t = useTranslations('ipInfringement');
  const tMedia = useTranslations('ipInfringement.media');
  const tButtons = useTranslations('common.buttons');

  // Filter configuration for Centers tab
  const FILTER_FIELDS = [
    {
      id: 'search',
      label: tFilters('search'),
      type: 'search' as const,
      placeholder: tFilters('search'),
    },
  ];

  // Card renderer for IP infringement services
  const renderServiceCard = (service: (typeof data.services)[0], _index: number) => {
    const serviceHref = service.href?.trim() || '#';

    return (
      <ServiceCard
        key={service.id}
        title={service.title}
        description={service.description}
        labels={service.labels}
        variant="services"
        href={serviceHref}
        primaryButtonLabel={tButtons('viewDetails')}
        primaryButtonHref={serviceHref}
        className="max-w-none"
      />
    );
  };

  const TABS = [
    {
      id: 'overview',
      label: tTabs('overview'),
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'centers',
      label: tTabs('services'),
      icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'media',
      label: tTabs('media'),
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const navigationItems = [
    { label: tNav('informationLibrary'), href: '#information-library' },
    { label: t('infringementGuides'), href: '#guide' },
    { label: tNav('statistics'), href: '#statistics' },
    { label: tNav('relatedPages'), href: '#related-pages' },
  ];

  return (
    <main className="min-h-screen">
      <Section padding="none" className="pt-6">
        <Breadcrumbs className="mb-8" items={breadcrumbItems} />
        <Tabs tabs={TABS} defaultActiveTab="overview" className="mb-6" syncWithQueryParam="tab" />
      </Section>

      {activeTab === 'overview' && (
        <>
          <HeroStatic
            title={data.heroHeading}
            description={data.heroSubheading}
            backgroundImage={data.heroImage?.src || '/images/services/infringement.jpg'}
            overlay={true}
            textColor="white"
            titleWeight="medium"
            titleClassName="max-w-[954px] lg:text-[72px] lg:leading-[90px] lg:tracking-[-0.02em] font-medium"
            descriptionClassName="font-body text-[20px] leading-[30px] font-normal tracking-normal text-white [&_p]:text-[20px] [&_p]:leading-[30px] [&_p]:font-normal"
          />
          <Navigation items={navigationItems} className="hidden lg:block" />
          <section id="information-library">
            <InformationLibrarySection
              title={tNav('informationLibrary')}
              video={data.overview.video}
              guide={data.overview.guide}
              guideMobileVariant="single"
              guideMobileMaxCards={1}
            />
          </section>
          <section id="statistics">
            <StatisticsSection
              title={tStats('title')}
              ctaLabel={tStats('viewMore')}
              ctaHref="/resources/statistics"
              stats={data.overview.statistics}
            />
          </section>
          <section id="related-pages">
            <RelatedPagesSection pages={data.overview.relatedPages} />
          </section>
        </>
      )}

      {activeTab === 'centers' && (
        <FilterableCardsSection
          title={t('servicesTitle')}
          titleClassName="text-4xl md:text-5xl lg:text-[72px] lg:leading-[90px] tracking-[-0.02em] font-medium text-[#161616]"
          items={data.services}
          filterFields={FILTER_FIELDS}
          cardRenderer={renderServiceCard}
          gridColumns={{ base: 1, md: 2, lg: 3 }}
          gridGap="gap-6"
          showTotalCount={true}
          totalCountLabel={tFilters('totalNumber')}
          totalCountClassName="text-3xl md:text-4xl lg:text-[48px] leading-tight tracking-[-0.02em] font-medium mb-8 mt-8 text-[#161616]"
          emptyStateText={tFilters('noItemsFound')}
          filtersBackground="white"
          cardsBackground="white"
          containerClassName="max-w-screen-xl mx-auto"
          cardsContainerClassName="items-stretch"
        />
      )}

      {activeTab === 'media' && (
        <IPMediaSection
          heroTitle={data.media.heroTitle}
          heroDescription={data.media.heroDescription}
          heroImage={data.media.heroImage}
          tabs={[
            { id: 'news', label: tMedia('news') },
            { id: 'videos', label: tMedia('videos') },
            { id: 'articles', label: tMedia('articles') },
          ]}
          content={{
            news: {
              title: tMedia('news'),
              description: data.media.heroDescription,
            },
            videos: {
              title: tMedia('videos'),
              description: data.media.heroDescription,
            },
            articles: {
              title: tMedia('articles'),
              description: data.media.heroDescription,
            },
          }}
          filterFields={[
            {
              id: 'search',
              label: tFilters('search'),
              type: 'search',
              placeholder: tFilters('search'),
            },
            {
              id: 'date',
              label: tFilters('date'),
              type: 'date',
              variant: 'range',
              placeholder: tFilters('selectDateRange'),
            },
          ]}
          badgeLabel={tMedia('badgeLabel')}
          category="IP Infringement"
          items={mediaItems}
        />
      )}
      <FeedbackSection />
    </main>
  );
}
