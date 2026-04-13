import { PatentDocIcon, PatentServicesIcon, PatentMediaIcon } from '@/components/icons/services';
import IPServiceTemplate from '@/components/templates/IPServiceTemplate';
import IPLicensingOverviewSection from '@/components/sections/IPLicensingOverviewSection';
import { getIPLicensingPageData } from '@/lib/drupal/services/ip-licensing.service';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';
import IPMediaSection from '@/components/organisms/IPMediaSection/IPMediaSection';

export default async function IpLicensingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getIPLicensingPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  // Fetch Media items (News, Articles, Videos) by category
  const [newsItems, articleItems, videoItems] = await Promise.all([
    fetchNewsByCategory('IP Licensing', locale),
    fetchArticlesByCategory('IP Licensing', locale),
    fetchVideosByCategory('IP Licensing', locale),
  ]);

  const TABS_DATA = [
    {
      id: 'overview',
      label: messages.tabs.overview,
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'services',
      label: messages.tabs.services,
      icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'media',
      label: messages.tabs.media,
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  const hasRelatedPages = Boolean(data.overview.relatedPages?.length);
  const relatedServicesNavLabel =
    messages.pageNavigation.relatedServices ||
    messages.ipLicensing?.relatedServicesTitle ||
    'Related services';

  const navigationItems = [
    { label: messages.pageNavigation.informationLibrary, href: '#information-library' },
    { label: messages.pageNavigation.quickLinks, href: '#quick-links' },
    { label: relatedServicesNavLabel, href: '#related-services' },
    ...(hasRelatedPages
      ? [{ label: messages.pageNavigation.relatedPages, href: '#related-pages' }]
      : []),
  ];

  // Translate service options
  const serviceTypeOptions = [
    { value: 'guidance', label: messages.common.filters.serviceTypeOptions.guidance },
    { value: 'protection', label: messages.common.filters.serviceTypeOptions.protection },
    { value: 'management', label: messages.common.filters.serviceTypeOptions.management },
    { value: 'enforcement', label: messages.common.filters.serviceTypeOptions.enforcement },
  ];

  const targetGroupOptions = [
    { value: 'individuals', label: messages.common.filters.targetGroupOptions.individuals },
    { value: 'enterprises', label: messages.common.filters.targetGroupOptions.enterprises },
  ];

  return (
    <IPServiceTemplate
      tabs={TABS_DATA}
      defaultActiveTab="overview"
      navigationItems={navigationItems}
      breadcrumbs={[
        { label: messages.breadcrumbs.home, href: '/' },
        { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
        { label: messages.breadcrumbs.ipEnablement },
        { label: messages.breadcrumbs.ipLicensing },
      ]}
      overview={{
        hero: {
          title: data.heroHeading,
          description: data.heroSubheading,
          backgroundImage: data.heroImage?.src || '/images/ip-licensing/hero.jpg',
        },
        sections: (
          <IPLicensingOverviewSection
            guideData={data.overview.guideData}
            requirements={data.overview.requirements}
            exemptions={data.overview.exemptions}
            quickLinks={data.overview.quickLinks}
            relatedPages={data.overview.relatedPages}
            relatedServices={data.overview.relatedServices}
          />
        ),
      }}
      services={{
        title: data.services.title,
        services: data.services.services,
        serviceTypeOptions,
        targetGroupOptions,
      }}
      media={{
        heroImage: data.heroImage?.src || '/images/ip-licensing/hero.jpg',
        heroTitle: data.media.heroTitle,
        heroDescription: data.media.heroDescription,
        tabs: data.media.tabs,
        category: 'IP Licensing',
        items: {
          news: newsItems,
          articles: articleItems,
          videos: videoItems,
        },
        badgeLabel: messages.breadcrumbs.ipLicensing,
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
      }}
    />
  );
}
