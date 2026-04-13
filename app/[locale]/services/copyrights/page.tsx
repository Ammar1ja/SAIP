import { getTabsData } from './tabs.data';
import { ROUTES } from '@/lib/routes';
import IPCategoryTemplate from '@/components/templates/IPCategoryTemplate/IPCategoryTemplate';
import IPMediaSection from '@/components/organisms/IPMediaSection/IPMediaSection';
import {
  getCopyrightsPageData,
  getCopyrightsPageDataExternalApi,
} from '@/lib/drupal/services/copyrights.service';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function CopyrightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tabsData = getTabsData(locale);
  const useExternalStats = shouldUseExternalStatisticsApi('copyrights');
  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getCopyrightsPageDataExternalApi(locale, { includeJourney: false })
      : getCopyrightsPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Copyrights', locale),
      fetchArticlesByCategory('Copyrights', locale),
      fetchVideosByCategory('Copyrights', locale),
    ]),
  ]);

  const t = messages.breadcrumbs as Record<string, string>;

  // Navigation items built from Drupal data (no Publications block — not in overview design)
  const navigationItems = [
    { label: data.overview.header.title, href: '#information-library' },
    { label: data.overview.guide.guideTitle, href: '#guide' },
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    { label: data.relatedPages?.title || 'Related pages', href: '#related-pages' },
  ];

  return (
    <IPCategoryTemplate
      hero={{
        title: data.heroHeading,
        description: data.heroSubheading,
        backgroundImage: data.heroImage?.src || '/images/services/copyrights.jpg',
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
        tocName: t?.copyrights || 'Copyrights',
      }}
      journeyEndpoint={`/api/ip-category-journey?category=copyrights&locale=${locale}`}
      isFallbackData={data.dataSource === 'fallback'}
      services={{
        title: data.services.title,
        services: data.services.services,
        serviceTypeOptions: data.services.serviceTypeOptions,
        targetGroupOptions: data.services.targetGroupOptions,
        category: 'copyrights',
      }}
      media={
        <IPMediaSection
          heroImage={data.media.heroImage}
          tabs={data.media.tabs}
          filterFields={data.media.filterFields}
          category="Copyrights"
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
        { label: t?.services || 'Services', href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        {
          label: (messages.navigation?.groups as any)?.ipProtection || 'IP Protection & Management',
        },
        { label: t?.copyrights || 'Copyrights' },
      ]}
    />
  );
}
