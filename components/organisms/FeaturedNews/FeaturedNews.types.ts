import type React from 'react';
import type { ArticleCmsProps } from '@/lib/dummyCms/allArticles';

export interface FeaturedNewsProps {
  title?: string;
  text?: React.ReactNode | string;
  buttonLabel?: string; // ✅ NEW: Editable button label from Drupal
  currentIndex?: number;
  items?: ArticleCmsProps[];
}
