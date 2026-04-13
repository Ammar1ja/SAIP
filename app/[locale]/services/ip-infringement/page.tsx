import { getIPInfringementPageData } from '@/lib/drupal/services';
import IpInfringementPageContent from './IpInfringementPageContent';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import {
  fetchNewsByCategory,
  fetchArticlesByCategory,
  fetchVideosByCategory,
} from '@/lib/drupal/services/media-by-category.service';

export default async function IpInfringementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getIPInfringementPageData(locale);
  const messages = (await getMessages({ locale })) as any;
  const [newsItems, articleItems, videoItems] = await Promise.all([
    fetchNewsByCategory('IP Infringement', locale),
    fetchArticlesByCategory('IP Infringement', locale),
    fetchVideosByCategory('IP Infringement', locale),
  ]);

  const breadcrumbItems = [
    { label: messages.breadcrumbs.home, href: '/' },
    { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
    { label: messages.breadcrumbs.ipEnforcement },
    { label: messages.breadcrumbs.ipInfringement },
  ];

  return (
    <IpInfringementPageContent
      data={data}
      breadcrumbItems={breadcrumbItems}
      mediaItems={{
        news: newsItems,
        articles: articleItems,
        videos: videoItems,
      }}
    />
  );
}
