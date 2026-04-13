'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewsArticleCard } from '@/components/organisms/NewsArticleCard';
import { Button } from '@/components/atoms/Button/Button';
import ContentBlock from '@/components/molecules/ContentBlock';
import Section from '@/components/atoms/Section';
import { type ArticleCmsProps } from '@/lib/dummyCms/allArticles';
import { type LatestNewsProps } from './LatestNews.types';
import { useTranslations } from 'next-intl';

interface LatestNewsClientProps extends LatestNewsProps {
  articles: ArticleCmsProps[];
}

export const LatestNews = ({ title, text, articles, currentIndex = 0 }: LatestNewsClientProps) => {
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
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ContentBlock
          heading={title ?? 'Latest news'}
          text={text ?? ''}
          className="mb-0 max-w-[720px]"
          textClassName="mt-4 md:mt-6 lg:mt-12 text-[18px] leading-[28px] font-normal tracking-normal text-text-primary-paragraph"
        />
        {!isMobile && (
          <div className="w-full lg:w-auto lg:shrink-0">
            <Button
              intent="secondary"
              outline
              href="/media-center/media-library/media-center"
              ariaLabel={t('goToMedia')}
              className="w-full whitespace-nowrap lg:w-auto"
            >
              {t('goToMedia')}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {selectedArticles.map((article, index) => (
          <NewsArticleCard
            key={index}
            className="border border-border-natural-primary"
            title={article.title}
            excerpt={article.excerpt}
            date={article.publishData}
            categories={article.categories}
            imageUrl={article.image}
            href={`/media-center/media-library/media-center/${article.id}`}
          />
        ))}
      </div>
      {isMobile && (
        <div className="mt-6">
          <Button
            intent="secondary"
            outline
            href="/media-center/media-library/media-center"
            ariaLabel={t('goToMedia')}
            className="w-full"
          >
            {t('goToMedia')}
          </Button>
        </div>
      )}
    </Section>
  );
};
