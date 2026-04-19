'use client';

import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { NewsArticle } from './newsArticles.data';

interface NewsArticleDetailProps {
  article: NewsArticle;
}

export function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  const t = useTranslations('mediaCenter.news');

  return (
    <div className="min-h-screen w-full bg-white">
      <LayoutWrapper className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 relative z-10">
            {article.image && (
              <div className="mb-8">
                <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="px-0 md:px-[40px] xl:px-[108px]">
              {article.excerpt && (
                <div className="mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed">{article.excerpt}</p>
                </div>
              )}

              {/* ✅ Content - Render HTML from Drupal */}
              {article.content && (
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              )}
            </div>

            <div className="mt-8 pt-6">
              <p className="text-sm p-[16px] bg-[#F3FCF6] text-[#384250] rounded-[4px]">
                {t('source') || 'Source'}:{' '}
                <span className="font-semibold text-[#1F2A37]">{'SAIP'}</span>
              </p>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
