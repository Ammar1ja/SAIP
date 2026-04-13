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
  getDesignsPageData,
  getDesignsPageDataExternalApi,
} from '@/lib/drupal/services/designs.service';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function DesignsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const useExternalStats = shouldUseExternalStatisticsApi('designs');
  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getDesignsPageDataExternalApi(locale, { includeJourney: false })
      : getDesignsPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Designs', locale),
      fetchArticlesByCategory('Designs', locale),
      fetchVideosByCategory('Designs', locale),
    ]),
  ]);

  const t = messages.breadcrumbs as Record<string, string>;
  const tTabs = messages.tabs as Record<string, string>;
  const tPageNavigation = messages.pageNavigation as Record<string, string>;

  const tabsData = [
    {
      label: tTabs?.overview || '',
      value: 'overview',
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.journey || '',
      value: 'journey',
      icon: <JourneyIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.services || '',
      value: 'services',
      icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      label: tTabs?.media || '',
      value: 'media',
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  // Navigation items built from Drupal data (Designs does not have publications section)
  const navigationItems = [
    { label: data.overview.header.title, href: '#information-library' },
    { label: data.overview.guide.guideTitle, href: '#guide' },
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    {
      label: (data as any).relatedPages?.title || tPageNavigation?.relatedPages || '',
      href: '#related-pages',
    },
  ];

  return (
    <IPCategoryTemplate
      hero={{
        title: data.heroHeading,
        description: data.heroSubheading,
        backgroundImage: data.heroImage?.src || '',
      }}
      navigation={{ items: navigationItems }}
      overview={{
        header: {
          title: data.overview.header.title,
          description: data.overview.header.description,
          videoSrc: data.overview.header.videoSrc || '',
          videoPoster: data.overview.header.videoPoster?.src || '',
        },
        guide: data.overview.guide,
        statistics: data.overview.statistics,
        relatedPages: (data as any).relatedPages,
      }}
      journey={{
        ...data.journey,
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocName: t?.designs || '',
      }}
      journeyEndpoint={`/api/ip-category-journey?category=designs&locale=${locale}`}
      isFallbackData={data.dataSource === 'fallback'}
      services={data.services}
      media={
        <IPMediaSection
          heroImage={data.media.heroImage}
          tabs={data.media.tabs}
          filterFields={data.media.filterFields}
          category="Designs"
          items={{
            news: newsItems,
            articles: articleItems,
            videos: videoItems,
          }}
        />
      }
      tabsData={tabsData}
      breadcrumbs={[
        { label: t?.home || '', href: ROUTES.HOME },
        { label: t?.services || '', href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        {
          label: (messages.navigation?.groups as any)?.ipProtection || '',
        },
        { label: t?.designs || '' },
      ]}
    />
  );
}
