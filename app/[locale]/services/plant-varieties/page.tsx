import {
  JourneyIcon,
  PatentDocIcon,
  PatentMediaIcon,
  PatentServicesIcon,
} from '@/components/icons/services';
import IPCategoryTemplate from '@/components/templates/IPCategoryTemplate/IPCategoryTemplate';
import { ROUTES } from '@/lib/routes';
import IPMediaSection from '@/components/organisms/IPMediaSection';
import {
  getPlantVarietiesPageData,
  getPlantVarietiesPageDataExternalApi,
} from '@/lib/drupal/services/plant-varieties.service';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function PlantVarietiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const useExternalStats = shouldUseExternalStatisticsApi('plant-varieties');
  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getPlantVarietiesPageDataExternalApi(locale, { includeJourney: false })
      : getPlantVarietiesPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Plant Varieties', locale),
      fetchArticlesByCategory('Plant Varieties', locale),
      fetchVideosByCategory('Plant Varieties', locale),
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
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    { label: (data as any).relatedPages?.title || 'Related pages', href: '#related-pages' },
  ];

  return (
    <main>
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
          tocName: t?.plantVarieties || 'Plant Varieties',
        }}
        journeyEndpoint={`/api/ip-category-journey?category=plant-varieties&locale=${locale}`}
        isFallbackData={data.dataSource === 'fallback'}
        services={data.services}
        media={
          <IPMediaSection
            heroImage={data.media.heroImage}
            tabs={data.media.tabs}
            filterFields={data.media.filterFields}
            category="Plant Varieties"
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
            label:
              (messages.navigation?.groups as any)?.ipProtection || 'IP Protection & Management',
          },
          { label: t?.plantVarieties || 'Plant Varieties' },
        ]}
      />
    </main>
  );
}
