import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { ROUTES } from '@/lib/routes';
import { NewsArticleDetail } from './NewsArticleDetail';
import { GenerateMetadata } from '@/app/[locale]/types';
import { getNewsById, transformNewsNode } from '@/lib/drupal/services/news.service';
import { getArticleById as getArticleByIdMock } from './newsArticles.data';
import { getHomepageData } from '@/lib/drupal/homepage.integration';

async function getHomepageFeaturedItemById(id: string, locale: string) {
  const homepage = await getHomepageData(locale);
  const featuredItems = homepage.featuredNews?.items || [];
  return featuredItems.find((item) => String(item.id) === id) || null;
}

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { id, locale } = (await params) as { locale: string; id: string };
  const mockArticle = getArticleByIdMock(id);

  // This route is primarily for news details, so resolve News first.
  let newsResult = await getNewsById(id, locale);

  if (!newsResult && locale !== 'en') {
    newsResult = await getNewsById(id, 'en');
  }

  if (newsResult) {
    const { node: drupalNode, included } = newsResult;
    const news = transformNewsNode(drupalNode, included);
    return {
      title: news.title,
      description: news.excerpt.substring(0, 160),
      openGraph: {
        title: news.title,
        description: news.excerpt.substring(0, 160),
        images: [
          {
            url: news.image || '/images/photo-container.png',
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
      },
    };
  }

  // If we have local mock content for this ID, use it directly
  if (mockArticle) {
    return {
      title: mockArticle.title,
      description: mockArticle.excerpt.substring(0, 160),
      openGraph: {
        title: mockArticle.title,
        description: mockArticle.excerpt.substring(0, 160),
        images: [
          {
            url: mockArticle.image || '/images/photo-container.png',
            width: 1200,
            height: 630,
            alt: mockArticle.title,
          },
        ],
      },
    };
  }

  // Fallback: try homepage featured news item by the same ID
  let homepageItem = await getHomepageFeaturedItemById(id, locale);
  if (!homepageItem && locale !== 'en') {
    homepageItem = await getHomepageFeaturedItemById(id, 'en');
  }
  if (homepageItem) {
    return {
      title: homepageItem.title,
      description: homepageItem.excerpt.substring(0, 160),
      openGraph: {
        title: homepageItem.title,
        description: homepageItem.excerpt.substring(0, 160),
        images: [
          {
            url: homepageItem.image || '/images/photo-container.png',
            width: 1200,
            height: 630,
            alt: homepageItem.title,
          },
        ],
      },
    };
  }

  // Fallback to mock data
  const article = getArticleByIdMock(id);
  return {
    title: article?.title || 'News Article',
    description: article?.excerpt || 'Read the full news article',
    openGraph: {
      title: article?.title || 'News Article',
      description: article?.excerpt || 'Read the full news article',
      images: [
        {
          url: article?.image || '/images/photo-container.png',
          width: 1200,
          height: 630,
          alt: article?.title || 'News Article',
        },
      ],
    },
  };
};

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const mockArticle = getArticleByIdMock(id);

  let article;
  let isUsingFallbackLocale = false;

  // ✅ Resolve News first (homepage/featured/latest flow points here).
  let newsResult = await getNewsById(id, locale);
  if (!newsResult && locale !== 'en') {
    console.log(`⚠️  News ${id} not found in ${locale}, trying English fallback`);
    newsResult = await getNewsById(id, 'en');
    if (newsResult) {
      isUsingFallbackLocale = true;
    }
  }

  if (newsResult) {
    const { node: drupalNode, included: newsIncluded } = newsResult;
    const transformedNews = transformNewsNode(drupalNode, newsIncluded);

    article = {
      id,
      title: transformedNews.title || drupalNode.attributes.title,
      excerpt:
        transformedNews.excerpt || drupalNode.attributes.body?.processed?.substring(0, 200) || '',
      image: transformedNews.image || '/images/photo-container.png',
      publishData:
        transformedNews.publishDate ||
        new Date(drupalNode.attributes.created).toISOString().split('T')[0],
      categories: transformedNews.categories || [],
      content: drupalNode.attributes.body?.processed || drupalNode.attributes.body?.value || '',
    };
  } else if (mockArticle) {
    article = mockArticle;
  } else {
    // Secondary fallback: resolve from homepage featured news list by the same ID.
    let homepageItem = await getHomepageFeaturedItemById(id, locale);
    if (!homepageItem && locale !== 'en') {
      homepageItem = await getHomepageFeaturedItemById(id, 'en');
      if (homepageItem) {
        isUsingFallbackLocale = true;
      }
    }

    if (homepageItem) {
      article = {
        id: homepageItem.id,
        title: homepageItem.title,
        excerpt: homepageItem.excerpt,
        image: homepageItem.image || '/images/photo-container.png',
        publishData: homepageItem.publishData,
        categories: homepageItem.categories || [],
        // Homepage items usually have summary fields, not full body.
        content: homepageItem.excerpt || '',
      };
    }
  }

  if (!article) {
    const messages = await getMessages({ locale });
    const notFoundMessages = (messages.mediaCenter as any)?.notFound;

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {notFoundMessages?.title || 'Article not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {notFoundMessages?.description ||
              "The article you're looking for doesn't exist or has been removed."}
          </p>
          <a
            href="/media-center/media-library/media-center"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {notFoundMessages?.backButton || 'Go back to Media Center'}
          </a>
        </div>
      </div>
    );
  }

  const messages = await getMessages({ locale });
  const fallbackMessages = (messages.mediaCenter as any)?.fallbackLocale;
  const tNews = (messages.mediaCenter as any)?.news;
  const tBreadcrumbs = messages.breadcrumbs as any;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: tBreadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: tBreadcrumbs?.mediaCenter || 'Media Center' },
    {
      label: tBreadcrumbs?.mediaLibrary || 'Media Library',
    },
    { label: article.title },
  ];

  return (
    <div>
      {isUsingFallbackLocale && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-4">
          <div className="max-w-screen-xl mx-auto flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              {fallbackMessages?.message ||
                'This content is not available in your language. Showing English version.'}
            </p>
          </div>
        </div>
      )}
      <HeroStatic
        title={article.title}
        description=""
        backgroundColor="bg-primary-50"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        backHref="/media-center/media-library/media-center"
        backLabel={tNews?.goBackToNews || 'Go back to News'}
        overlay={false}
        textColor="dark"
        titleSize="small"
        variant="article"
        publicationDate={article.publishData}
        categories={article.categories}
      />
      <NewsArticleDetail article={article as any} />
    </div>
  );
}
