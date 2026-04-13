'use client';

import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { NewsArticleCardCategorys } from './NewsArticleCardCategorys';
import { NewsArticleCardExcerpt } from './NewsArticleCardExcerpt';
import { NewsArticleCardPublishData } from './NewsArticleCardPublishData';
import { NewsArticleCardTitle } from './NewsArticleCardTitle';
import { Button } from '@/components/atoms/Button/Button';
import { useTranslations } from 'next-intl';

export {
  NewsArticleCardTitle,
  NewsArticleCardExcerpt,
  NewsArticleCardPublishData,
  NewsArticleCardCategorys,
};

const newsArticleCard = cva(
  [
    'w-full',
    'rounded-lg',
    'bg-white',
    'border',
    'border-[#D2D6DB]',
    'p-6',
    'flex',
    'flex-col',
    'gap-6',
    'md:flex-row',
    'md:items-stretch',
    'md:h-[308px]',
    'md:min-h-[308px]',
    'md:max-h-[308px]',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface NewsArticleCardProps extends VariantProps<typeof newsArticleCard> {
  className?: string;
  image?: string; // Legacy prop (deprecated)
  imageUrl?: string; // New prop name
  title: string;
  publishData?: string; // Legacy prop (deprecated)
  date?: string; // New prop name
  excerpt: string;
  categories: {
    id: string;
    name: string;
  }[];
  href?: string;
}

export const NewsArticleCard = ({
  className,
  title,
  publishData,
  date,
  excerpt,
  categories,
  image,
  imageUrl,
  href = '#',
}: NewsArticleCardProps) => {
  // Single canonical placeholder for news when no image or on load error
  const fallbackImage = '/images/photo-container.png';
  const finalImage = imageUrl || image || fallbackImage;
  const [imageLoadError, setImageLoadError] = useState(false);
  const rawDate = date || publishData || '';
  const t = useTranslations('buttons');
  const tCommon = useTranslations('common.labels');
  const imageSrc = imageLoadError || !finalImage ? fallbackImage : finalImage;

  // Format date deterministically to avoid hydration mismatches
  const formattedDate = rawDate
    ? (() => {
        // If date already has "Publication date:" prefix, use as-is (legacy format)
        if (rawDate.includes('Publication date:') || rawDate.includes('تاريخ النشر:')) {
          return rawDate;
        }
        // If date is already in DD.MM.YYYY format, use it directly
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(rawDate)) {
          return `${tCommon('publicationDate')}: ${rawDate}`;
        }
        // Otherwise, keep raw string to avoid locale differences
        return `${tCommon('publicationDate')}: ${rawDate}`;
      })()
    : '';

  return (
    <div className={twMerge(newsArticleCard({ className }))}>
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-[8px] md:h-full md:w-[280px]">
        <Image
          src={imageSrc}
          alt="News article card"
          fill
          className="object-cover rounded-[8px]"
          onError={() => setImageLoadError(true)}
        />
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 flex-grow">
          <NewsArticleCardTitle>{title}</NewsArticleCardTitle>
          <NewsArticleCardPublishData>{formattedDate}</NewsArticleCardPublishData>
          <NewsArticleCardExcerpt>{excerpt}</NewsArticleCardExcerpt>
        </div>
        <div className="mt-auto flex flex-col gap-6 pt-6">
          <NewsArticleCardCategorys categories={categories} />
          <div className="flex">
            <Button
              intent="primary"
              href={href}
              ariaLabel={t('readMore')}
              className="h-10 rounded-[4px] px-4 py-0 text-[14px] leading-5 font-medium w-full md:w-auto"
            >
              {t('readMore')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
