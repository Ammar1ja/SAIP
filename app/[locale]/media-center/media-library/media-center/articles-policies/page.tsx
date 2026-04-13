import { getMessages } from 'next-intl/server';
import { ArticlesPoliciesContent } from './ArticlesPoliciesContent';
import { getArticlesPoliciesPageData } from '@/lib/drupal/services/articles-policies.service';
import { GenerateMetadata, PageProps } from '@/app/[locale]/types';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getArticlesPoliciesPageData(locale);

  return {
    title: messages.articlesPolicies?.pageTitle || data.title,
    description: messages.articlesPolicies?.pageDescription || data.description,
    openGraph: {
      title: messages.articlesPolicies?.pageTitle || data.title,
      description: messages.articlesPolicies?.pageDescription || data.description,
      images: [
        {
          url: '/images/articles-policies/hero.jpg',
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
  };
};

export default async function ArticlesPoliciesPage({ params }: PageProps) {
  const { locale } = await params;
  const data = await getArticlesPoliciesPageData(locale);

  return <ArticlesPoliciesContent data={data as any} />;
}
