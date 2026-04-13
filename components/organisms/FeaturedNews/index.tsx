import React from 'react';
import { allArticles, type ArticleCmsProps } from '@/lib/dummyCms/allArticles';
import { type FeaturedNewsProps } from './FeaturedNews.types';
import { FeaturedNewsClient } from './FeaturedNewsClients';

const FEATURED_ARTICLE_IDS = ['1', '2', '4'];
const getFeaturedNews = async (): Promise<string[]> => FEATURED_ARTICLE_IDS;
const getArticle = async (id: string): Promise<ArticleCmsProps | undefined> =>
  allArticles.find((article) => article.id === id);

export const FeaturedNews = async ({
  title,
  text,
  buttonLabel,
  currentIndex = 0,
  items,
}: FeaturedNewsProps) => {
  // Use Drupal items if available, otherwise fallback to CMS data
  let articles: ArticleCmsProps[];

  if (items && items.length > 0) {
    articles = items;
  } else {
    const featuredArticlesIds = await getFeaturedNews();
    const articlesPromises = featuredArticlesIds.map((id) => getArticle(id));
    articles = (await Promise.all(articlesPromises)).filter(
      (article): article is ArticleCmsProps => article !== undefined,
    );
  }

  return (
    <FeaturedNewsClient
      title={title}
      text={text}
      buttonLabel={buttonLabel}
      currentIndex={currentIndex}
      articles={articles}
    />
  );
};
