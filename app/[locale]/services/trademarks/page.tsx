import IPCategoryTemplate from '@/components/templates/IPCategoryTemplate/IPCategoryTemplate';
import { ROUTES } from '@/lib/routes';
import {
  JourneyIcon,
  PatentDocIcon,
  PatentServicesIcon,
  PatentMediaIcon,
} from '@/components/icons/services';
import IPMediaSection from '@/components/organisms/IPMediaSection/IPMediaSection';
import {
  getTrademarksPageData,
  getTrademarksPageDataExternalApi,
} from '@/lib/drupal/services/trademarks.service';
import { GazetteShareNavIcon } from '@/components/organisms/GazetteSection/GazetteShareNavIcon';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function TrademarksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const useExternalStats = shouldUseExternalStatisticsApi('trademarks');
  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getTrademarksPageDataExternalApi(locale, { includeJourney: false })
      : getTrademarksPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Trademarks', locale),
      fetchArticlesByCategory('Trademarks', locale),
      fetchVideosByCategory('Trademarks', locale),
    ]),
  ]);

  const t = messages.breadcrumbs as Record<string, string>;
  const tTabs = messages.tabs as Record<string, string>;

  const tabsData = [
    {
      label: tTabs?.overview || 'Overview',
      value: 'overview',
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.journey || 'Journey',
      value: 'journey',
      icon: <JourneyIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.services || 'Services',
      value: 'services',
      icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.media || 'Media',
      value: 'media',
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  // Navigation items built from Drupal data
  const navigationItems = [
    { label: data.overview.header.title, href: '#information-library' },
    { label: data.overview.guide.guideTitle, href: '#guide' },
    { label: data.overview.gazette?.heading || 'IP Gazette', href: '#ip-gazette' },
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    { label: (data as any).relatedPages?.title || 'Related pages', href: '#related-pages' },
  ];

  return (
    <IPCategoryTemplate
      hero={{
        title: data.heroHeading,
        description: data.heroSubheading,
        backgroundImage: data.heroImage?.src || '/images/trademarks/hero.jpg',
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
        gazette: data.overview.gazette
          ? {
              ...data.overview.gazette,
              buttonIcon: <GazetteShareNavIcon />,
              id: 'ip-gazette',
              isReversed: false,
            }
          : undefined,
        relatedPages: (data as any).relatedPages,
      }}
      journey={{
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocAriaLabel: data.journey.tocAriaLabel,
        tocName: t?.trademarks || 'Trademarks',
      }}
      journeyEndpoint={`/api/ip-category-journey?category=trademarks&locale=${locale}`}
      isFallbackData={data.dataSource === 'fallback'}
      services={{
        title: data.services.title,
        services: data.services.services,
        serviceTypeOptions: data.services.serviceTypeOptions,
        targetGroupOptions: data.services.targetGroupOptions,
        category: 'trademarks',
      }}
      media={
        <IPMediaSection
          heroImage={data.media.heroImage}
          tabs={data.media.tabs}
          filterFields={data.media.filterFields}
          category="Trademarks"
          items={{
            news: newsItems,
            articles: articleItems,
            videos: videoItems,
          }}
        />
      }
      tabsData={tabsData}
      breadcrumbs={[
        { label: t?.home || 'Home', href: ROUTES.HOME },
        { label: t?.services || 'Services', href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        {
          label: (messages.navigation?.groups as any)?.ipProtection || 'IP Protection & Management',
        },
        { label: t?.trademarks || 'Trademarks' },
      ]}
    />
  );
}
