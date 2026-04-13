/**
 * Articles & Policies Service
 * Handles articles policies listing page
 */

import { fetchContentType, extractText, getImageUrl, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface ArticlePolicyItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: Date;
  category: string;
}

export interface ArticlesPoliciesPageData {
  title: string;
  description: string;
  content?: any; // For compatibility with ArticlesPoliciesData
  articles: ArticlePolicyItem[];
}

/**
 * Fetch articles for policies page
 */
export async function fetchArticlesPolicies(locale?: string) {
  try {
    const response = await fetchContentType(
      'article',
      {
        filter: {
          status: '1',
          // You can add category filter if needed: field_category: 'policy'
        },
        include: ['field_image', 'field_image.field_media_image'],
        sort: '-created',
      },
      locale,
    );

    return {
      articles: response.data || [],
      included: response.included || [],
    };
  } catch (error) {
    console.error('Failed to fetch articles policies:', error);
    return { articles: [], included: [] };
  }
}

/**
 * Transform article to policy item
 */
export function transformArticlePolicy(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ArticlePolicyItem {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  const imageMedia = getRelated(rels, 'field_image', included) as any;
  const imageUrl = getImageUrl(imageMedia, included);

  return {
    id: attrs.drupal_internal__nid?.toString() || '',
    title: (attrs.field_title || attrs.title || '') as string,
    excerpt: (extractText(attrs.field_excerpt) ||
      extractText(attrs.body)?.substring(0, 150) ||
      '') as string,
    image: (imageUrl || '/images/articles/placeholder.jpg') as string,
    date: new Date(attrs.field_date || attrs.created),
    category: (attrs.field_category || 'Policy') as string,
  };
}

/**
 * Get articles policies page data with fallback
 */
export async function getArticlesPoliciesPageData(
  locale?: string,
): Promise<ArticlesPoliciesPageData> {
  try {
    const result = await fetchArticlesPolicies(locale);

    if (!result.articles || result.articles.length === 0) {
      console.log(`🔴 ARTICLES POLICIES: No Drupal data, using fallback (${locale})`);
      return {
        title: 'Articles & Policies',
        description: 'Explore SAIP articles, policies, and publications',
        articles: [],
      };
    }

    const articles = result.articles.map((node) => transformArticlePolicy(node, result.included));
    console.log(
      `✅ ARTICLES POLICIES: Using Drupal data (${articles.length} articles) (${locale})`,
    );

    return {
      title: 'Articles & Policies',
      description: 'Explore SAIP articles, policies, and publications',
      articles,
    };
  } catch (error) {
    console.log(`🔴 ARTICLES POLICIES: Error, using fallback (${locale})`, error);
    return {
      title: 'Articles & Policies',
      description: 'Explore SAIP articles, policies, and publications',
      articles: [],
    };
  }
}
