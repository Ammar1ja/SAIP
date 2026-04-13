import { getMessages } from 'next-intl/server';
import { MediaCenterContent } from './MediaCenterContent';
import { GenerateMetadata, PageProps } from '../../../types';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { ROUTES } from '@/lib/routes';
import { getMediaLibraryPageData } from '@/lib/drupal/services/media-library.service';
import { getNewsListData, NewsArticle } from '@/lib/drupal/services/news.service';
import { getArticlesListData, Article } from '@/lib/drupal/services/articles.service';
import { fetchVideos } from '@/lib/drupal/services/videos.service';
import { fetchVideoFilterCategories } from '@/lib/drupal/services/video-filter-categories.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getMediaLibraryPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/media-center/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Media Center',
        },
      ],
    },
  };
};

const VALID_TABS = ['news', 'videos', 'articles'] as const;
type MediaCenterTab = (typeof VALID_TABS)[number];

const getInitialTab = (rawTab?: string | string[]): MediaCenterTab => {
  const tab = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  if (tab && VALID_TABS.includes(tab as MediaCenterTab)) {
    return tab as MediaCenterTab;
  }
  return 'news';
};

export default async function MediaCenterPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const messages = (await getMessages({ locale })) as any;
  const data = await getMediaLibraryPageData(locale);
  const newsData = await getNewsListData(locale, 1000);
  const articlesData = await getArticlesListData(locale, 200);
  const [videos, videoFilterCategories] = await Promise.all([
    fetchVideos(locale),
    fetchVideoFilterCategories(locale),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.mediaCenter || 'Media Center' },
    {
      label: messages.breadcrumbs?.mediaLibrary || 'Media Library',
    },
    { label: messages.breadcrumbs?.mediaCenterPage || 'Media Center' },
  ];

  return (
    <div>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        overlay={true}
        className="!h-[520px] !max-h-[520px]"
      />
      <div className="w-full bg-white">
        <MediaCenterContent
          newsArticles={newsData.articles}
          newsCategories={newsData.categories}
          articles={articlesData.articles}
          videos={videos}
          videoFilterCategories={videoFilterCategories}
          initialTab={getInitialTab(resolvedSearchParams?.tab)}
        />
        <FeedbackSection />
      </div>
    </div>
  );
}
