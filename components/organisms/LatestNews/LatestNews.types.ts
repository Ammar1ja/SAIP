import type { ReactNode } from 'react';
import type { ArticleCmsProps } from '@/lib/dummyCms/allArticles';

export interface LatestNewsProps {
  title?: string;
  text?: string | ReactNode;
  articles: ArticleCmsProps[];
  currentIndex?: number;
}
