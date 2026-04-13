import { PageProps, GenerateMetadata } from '../../../../../types';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getArticleData } from '@/lib/drupal/services/articles.service';
import ArticlePageContent from './ArticlePageContent';
import { comments } from '../../data/comments.data';
import { getArticleComments } from '@/lib/drupal/services/article-comments.service';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { id, locale } = (await params) as { locale: string; id: string };
  const messages = await getMessages({ locale });
  const article = await getArticleData(id, locale);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const messages = await getMessages({ locale });
  const article = await getArticleData(id, locale);
  const articleComments = await getArticleComments(id, locale);

  if (!article) {
    notFound();
  }

  const breadcrumbs = (messages as any)?.breadcrumbs || {};
  const mediaCenter = (messages as any)?.mediaCenter || {};
  const articleDetail = mediaCenter?.articleDetail || {};
  const formStrings = articleDetail?.form || {};

  const strings = {
    backLabel: articleDetail?.backLabel || 'Go back to Articles',
    publicationDate: articleDetail?.publicationDate || 'Publication Date',
    commentsTitle: articleDetail?.commentsTitle || 'Comments',
    addCommentTitle: articleDetail?.addCommentTitle || 'Add comment',
    seeMore: articleDetail?.seeMore || 'See more',
    authorFallback: articleDetail?.authorFallback || 'A. Hamed bin Mohammed Fayez',
    form: {
      fullName: formStrings?.fullName || 'Full name',
      fullNamePlaceholder: formStrings?.fullNamePlaceholder || 'Type your full name',
      email: formStrings?.email || 'Email',
      emailPlaceholder: formStrings?.emailPlaceholder || 'Type your Email',
      phoneNumber: formStrings?.phoneNumber || 'Phone number',
      phoneNumberPlaceholder: formStrings?.phoneNumberPlaceholder || 'Type your phone number',
      comment: formStrings?.comment || 'Comment',
      commentPlaceholder: formStrings?.commentPlaceholder || 'Type your message',
      submit: formStrings?.submit || 'Send request',
      submitting: formStrings?.submitting || 'Sending...',
      success: formStrings?.success || 'Your comment has been submitted.',
      error: formStrings?.error || 'Failed to submit comment. Please try again.',
    },
  };

  const breadcrumbItems = [
    { label: breadcrumbs?.home || 'Home', href: '/' },
    { label: breadcrumbs?.mediaCenter || 'Media Center', href: '/media-center' },
    {
      label: breadcrumbs?.mediaLibrary || 'Media Library',
      href: '/media-center/media-library/media-center',
    },
    {
      label: mediaCenter?.articles?.title || 'Articles',
      href: '/media-center/media-library/media-center?tab=articles',
    },
    { label: article.title },
  ];

  return (
    <ArticlePageContent
      article={article}
      comments={articleComments.length > 0 ? articleComments : comments}
      breadcrumbs={breadcrumbItems}
      strings={strings}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    />
  );
}
