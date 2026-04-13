import { getTabsData } from './tabs.data';
import { ROUTES } from '@/lib/routes';
import IPCategoryTemplate from '@/components/templates/IPCategoryTemplate/IPCategoryTemplate';
import IPMediaSection from '@/components/organisms/IPMediaSection/IPMediaSection';
import {
  getPatentsPageData,
  getPatentsPageDataExternalApi,
} from '@/lib/drupal/services/patents.service';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function PatentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tabsData = getTabsData(locale);
  const useExternalStats = shouldUseExternalStatisticsApi('patents');

  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getPatentsPageDataExternalApi(locale, { includeJourney: false })
      : getPatentsPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Patents', locale),
      fetchArticlesByCategory('Patents', locale),
      fetchVideosByCategory('Patents', locale),
    ]),
  ]);
  const t = messages.breadcrumbs as Record<string, string>;

  // Navigation items built from Drupal data
  const navigationItems = [
    { label: data.overview.header.title, href: '#information-library' },
    { label: data.overview.guide.guideTitle, href: '#guide' },
    { label: data.overview.publications.publicationsTitle, href: '#publications' },
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    { label: data.relatedPages?.title || 'Related pages', href: '#related-pages' },
  ];

  return (
    <IPCategoryTemplate
      hero={{
        title: data.heroHeading,
        description: data.heroSubheading,
        backgroundImage: data.heroImage?.src || '/images/about/hero.jpg',
      }}
      navigation={{ items: navigationItems }}
      overview={{
        header: {
          title: data.overview.header.title,
          description: data.overview.header.description,
          videoSrc: data.overview.header.videoSrc || '',
          videoPoster: data.overview.header.videoPoster?.src || '',
        },
        guide: {
          guideTitle: data.overview.guide.guideTitle,
          guideCards: data.overview.guide.guideCards,
          ctaLabel: data.overview.guide.ctaLabel,
          ctaHref: data.overview.guide.ctaHref,
        },
        publications: {
          publications: data.overview.publications.publications,
          publicationsTitle: data.overview.publications.publicationsTitle,
          publicationsDescription: data.overview.publications.publicationsDescription,
          publicationsCtaLabel: data.overview.publications.publicationsCtaLabel,
          publicationsCtaHref: data.overview.publications.publicationsCtaHref,
        },
        statistics: {
          statistics: data.overview.statistics.statistics,
          statisticsTitle: data.overview.statistics.statisticsTitle,
          statisticsCtaLabel: data.overview.statistics.statisticsCtaLabel,
          statisticsCtaHref: data.overview.statistics.statisticsCtaHref,
        },
        relatedPages: data.relatedPages,
      }}
      journey={{
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocAriaLabel: data.journey.tocAriaLabel,
        tocName: t?.patents || 'Patents',
      }}
      journeyEndpoint={`/api/ip-category-journey?category=patents&locale=${locale}`}
      isFallbackData={data.dataSource === 'fallback'}
      services={{
        title: data.services.title,
        services: data.services.services,
        serviceTypeOptions: data.services.serviceTypeOptions,
        targetGroupOptions: data.services.targetGroupOptions,
        category: 'patents',
      }}
      media={
        <IPMediaSection
          heroImage={data.media.heroImage}
          tabs={data.media.tabs}
          filterFields={data.media.filterFields}
          category="Patents"
          items={{
            news: newsItems,
            articles: articleItems,
            videos: videoItems,
          }}
        />
      }
      tabsData={tabsData.map((tab) => ({ label: tab.label, value: tab.id, icon: tab.icon }))}
      breadcrumbs={[
        { label: t?.home || 'Home', href: ROUTES.HOME },
        {
          label: t?.services || 'Services',
          href: ROUTES.SERVICES.SERVICES_OVERVIEW,
        },
        {
          label: (messages.navigation?.groups as any)?.ipProtection || 'IP Protection & Management',
        },
        { label: t?.patents || 'Patents' },
      ]}
    />
  );
}
