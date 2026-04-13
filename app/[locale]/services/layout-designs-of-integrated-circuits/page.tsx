import { getTabsData } from './tabs.data';
import { ROUTES } from '@/lib/routes';
import IPCategoryTemplate from '@/components/templates/IPCategoryTemplate/IPCategoryTemplate';
import IPMediaSection from '@/components/organisms/IPMediaSection/IPMediaSection';
import {
  getTopographicDesignsPageData,
  getTopographicDesignsPageDataExternalApi,
} from '@/lib/drupal/services/topographic-designs.service';
import { getMessages } from 'next-intl/server';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import { shouldUseExternalStatisticsApi } from '@/lib/statistics-api/testing';

export const revalidate = 300;

export default async function TopographicDesignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tabsData = getTabsData(locale);
  const useExternalStats = shouldUseExternalStatisticsApi('layout-designs-of-integrated-circuits');
  const [messages, data, [newsItems, articleItems, videoItems]] = await Promise.all([
    getMessages({ locale }),
    useExternalStats
      ? getTopographicDesignsPageDataExternalApi(locale, { includeJourney: false })
      : getTopographicDesignsPageData(locale, { includeJourney: false }),
    Promise.all([
      fetchNewsByCategory('Layout Designs', locale),
      fetchArticlesByCategory('Layout Designs', locale),
      fetchVideosByCategory('Layout Designs', locale),
    ]),
  ]);

  const t = messages.breadcrumbs as Record<string, string>;

  // Navigation items built from Drupal data (Layout Designs does not have publications section)
  const navigationItems = [
    { label: data.overview.header.title, href: '#information-library' },
    { label: data.overview.statistics.statisticsTitle, href: '#statistics' },
    { label: (data as any).relatedPages?.title || 'Related pages', href: '#related-pages' },
  ];

  const mediaCenterMessages = messages.mediaCenter as any;
  const mediaContent = {
    news: {
      title: mediaCenterMessages?.news?.title || mediaCenterMessages?.tabs?.news || 'News',
      description:
        mediaCenterMessages?.news?.description ||
        'Get the latest information on IP system in Saudi Arabia.',
    },
    videos: {
      title: mediaCenterMessages?.videos?.title || mediaCenterMessages?.tabs?.videos || 'Videos',
      description:
        mediaCenterMessages?.videos?.description ||
        'Explore the latest updates on intellectual property through our video collection.',
    },
    articles: {
      title:
        mediaCenterMessages?.articles?.title || mediaCenterMessages?.tabs?.articles || 'Articles',
      description:
        mediaCenterMessages?.articles?.description ||
        'Read articles about intellectual property topics.',
    },
  };

  return (
    <IPCategoryTemplate
      hero={{
        title: data.heroHeading,
        description: data.heroSubheading,
        backgroundImage: data.heroImage?.src || '/images/services/layout-designs.jpg',
      }}
      navigation={{
        items: navigationItems,
        className:
          '!py-3 !shadow-none [&>div>div]:gap-4 [&_a]:font-normal [&_a]:h-8 [&_a]:text-[14px] [&_a]:leading-5 [&_a]:pl-4',
      }}
      overview={{
        header: {
          title: data.overview.header.title,
          description: data.overview.header.description,
          videoSrc: data.overview.header.videoSrc || '',
          videoPoster: data.overview.header.videoPoster?.src || '',
        },
        guide: data.overview.guide,
        // publications: not required for Layout Designs
        statistics: data.overview.statistics,
        relatedPages: (data as any).relatedPages,
      }}
      journey={{
        ...data.journey,
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocName: t?.topographicDesigns || 'Layout Designs of Integrated Circuits',
      }}
      journeyEndpoint={`/api/ip-category-journey?category=topographic&locale=${locale}`}
      isFallbackData={data.dataSource === 'fallback'}
      services={data.services}
      media={
        <IPMediaSection
          heroImage={data.media.heroImage}
          tabs={data.media.tabs}
          content={mediaContent}
          filterFields={data.media.filterFields}
          category="Layout Designs"
          titleClassName="md:text-[48px] md:leading-[60px] md:tracking-[-0.96px] md:font-medium"
          items={{
            news: newsItems,
            articles: articleItems,
            videos: videoItems,
          }}
        />
      }
      tabsData={tabsData.map((tab) => ({ label: tab.label, value: tab.id, icon: tab.icon }))}
      tabsClassName="
        md:[&_[role='tab']]:h-12
        md:[&_[role='tab']]:px-4
        md:[&_[role='tab']]:text-[20px]
        md:[&_[role='tab']]:leading-[30px]
        md:[&_[role='tab']]:font-normal
        md:[&_[role='tab']]:md:min-w-0
        md:[&_[role='tab'][aria-selected='true']]:bg-[#0D121C]
        md:[&_[role='tab'][aria-selected='true']]:text-white
      "
      breadcrumbs={[
        { label: t?.home || 'Home', href: ROUTES.HOME },
        { label: t?.services || 'Services', href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        {
          label: (messages.navigation?.groups as any)?.ipProtection || 'IP Protection & Management',
        },
        { label: t?.topographicDesigns || 'Layout Designs of Integrated Circuits' },
      ]}
    />
  );
}
