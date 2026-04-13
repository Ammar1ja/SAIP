'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewsArticleCard } from '@/components/organisms/NewsArticleCard';
import { Button } from '@/components/atoms/Button/Button';
import ContentBlock from '@/components/molecules/ContentBlock';
import Section from '@/components/atoms/Section';
import { type ArticleCmsProps } from '@/lib/dummyCms/allArticles';
import { type FeaturedNewsProps } from './FeaturedNews.types';
import { useTranslations } from 'next-intl';

interface FeaturedNewsClientProps extends FeaturedNewsProps {
  articles: ArticleCmsProps[];
}

export const FeaturedNewsClient = ({
  title,
  text,
  buttonLabel, // ✅ NEW: Editable button label from Drupal
  currentIndex = 0,
  articles,
}: FeaturedNewsClientProps) => {
  const t = useTranslations('buttons');
  const isMobile = useIsMobile();
  const visibleArticles = isMobile ? 1 : 2;

  const startIndex = currentIndex % articles.length;
  const endIndex = (startIndex + visibleArticles) % articles.length;

  const selectedArticles =
    endIndex > startIndex
      ? articles.slice(startIndex, endIndex)
      : [...articles.slice(startIndex), ...articles.slice(0, endIndex)];

  return (
    <Section
      background="white"
      className="mx-auto max-w-screen-xl px-4 py-2 md:px-8 md:py-4 lg:px-0 lg:py-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <ContentBlock
          heading={title ?? 'Featured news'}
          text={text ?? ''}
          className="mb-0 md:w-3/5 max-w-[720px]"
        />
        <div className="hidden lg:block w-full md:w-auto">
          <Button
            intent="secondary"
            outline
            href="/media-center/media-library/media-center"
            ariaLabel={buttonLabel || t('goToMedia')}
            className="w-full md:w-auto"
          >
            {buttonLabel || t('goToMedia')}{' '}
            {/* ✅ Use Drupal label if available, fallback to i18n */}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {selectedArticles.map((article, index) => (
          <NewsArticleCard
            key={index}
            className="border border-border-natural-primary"
            title={article.title}
            excerpt={article.excerpt}
            publishData={article.publishData}
            categories={article.categories}
            image={article.image}
            href={`/media-center/media-library/media-center/${article.id}`}
          />
        ))}
      </div>
      <div className="mt-6 lg:hidden">
        <Button
          intent="secondary"
          outline
          href="/media-center/media-library/media-center"
          ariaLabel={buttonLabel || t('goToMedia')}
          className="w-full"
        >
          {buttonLabel || t('goToMedia')}
        </Button>
      </div>
    </Section>
  );
};
