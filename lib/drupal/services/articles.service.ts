import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Types
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  publishDate: string;
  image: string;
  imageAlt: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
  href: string;
  content?: string;
  author?: string;
}

export interface ArticlesListData {
  articles: Article[];
  total: number;
}

// Fetch articles list
export async function fetchArticlesList(
  locale?: string,
  limit: number = 200,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = 'field_image.field_media_image,field_ip_categories,field_author';
  const endpoint = `/node/article?filter[status]=1&sort=-created&page[limit]=${limit}&include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform article node (exported for detail page)
export function transformArticleNode(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): Article {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};
  const nid = attrs.drupal_internal__nid || node.id;

  // Get image
  let imageUrl = '/images/photo-container.png';
  let imageAlt = '';
  const imageRel = getRelated(relationships, 'field_image', included);
  if (imageRel && !Array.isArray(imageRel)) {
    const imageData = getImageWithAlt(imageRel, included);
    if (imageData?.src) {
      imageUrl = imageData.src;
      imageAlt = imageData.alt || '';
    }
  }

  // Get categories from field_ip_categories and field_tags
  const categories: Array<{ id: string; name: string }> = [];

  const ipCategories = getRelated(relationships, 'field_ip_categories', included);
  if (Array.isArray(ipCategories)) {
    ipCategories.forEach((cat: any) => {
      if (cat.attributes?.name) {
        categories.push({
          id: cat.id || String(categories.length),
          name: cat.attributes.name,
        });
      }
    });
  } else if (ipCategories) {
    const catAttrs = (ipCategories as any).attributes;
    if (catAttrs?.name) {
      categories.push({
        id: (ipCategories as any).id || 'ip-cat',
        name: catAttrs.name,
      });
    }
  }

  const tags = getRelated(relationships, 'field_tags', included);
  if (Array.isArray(tags)) {
    tags.forEach((tag: any) => {
      if (tag.attributes?.name) {
        categories.push({
          id: tag.id || String(categories.length),
          name: tag.attributes.name,
        });
      }
    });
  }

  // Get date - try field_date first, then created
  let publishDate = '';
  if (attrs.field_date) {
    publishDate = formatDate(attrs.field_date);
  } else if (attrs.created) {
    publishDate = formatDate(attrs.created);
  }

  // Get author
  const author = attrs.field_author || undefined;

  // Get content/body
  const content = extractText(attrs.body) || extractText(attrs.field_body) || '';

  return {
    id: String(nid),
    title: attrs.field_title || attrs.title || '',
    excerpt: extractText(attrs.field_excerpt) || extractText(attrs.field_summary) || '',
    publishDate: publishDate,
    image: imageUrl,
    imageAlt,
    categories,
    href: `/media-center/media-library/media-center/articles/${nid}`,
    content,
    author,
  };
}

// Helper to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}

// Transform articles list
export function transformArticlesList(
  nodes: DrupalNode[],
  included: DrupalIncludedEntity[] = [],
): ArticlesListData {
  const articles = nodes.map((node) => transformArticleNode(node, included));

  return {
    articles,
    total: articles.length,
  };
}

// Fallback data
export function getArticlesFallbackData(): ArticlesListData {
  return {
    articles: [],
    total: 0,
  };
}

// Fetch single article by ID
export async function getArticleById(id: string, locale?: string): Promise<DrupalNode | null> {
  const includeFields = 'field_image.field_media_image,field_ip_categories,field_author';
  // Use filter query instead of direct ID access (JSON:API requires UUID for direct access)
  const endpoint = `/node/article?filter[drupal_internal__nid]=${id}&filter[status]=1&include=${includeFields}`;

  // Try to fetch in requested locale
  try {
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

    if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      throw new Error('No data in response');
    }

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    return node;
  } catch (primaryError) {
    // Fallback: try other locale if primary fails
    const fallbackLocale = locale === 'ar' ? 'en' : 'ar';
    try {
      const response = await fetchDrupal<DrupalNode>(endpoint, {}, fallbackLocale);

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.warn(`🟡 ARTICLE BY ID: Article ${id} not found in any locale`);
        return null;
      }

      const node = Array.isArray(response.data) ? response.data[0] : response.data;
      return node;
    } catch (fallbackError) {
      console.warn(`🟡 ARTICLE BY ID: Error fetching ${id} in both locales:`, fallbackError);
      return null;
    }
  }
}

// Main export function
export async function getArticlesListData(
  locale?: string,
  limit: number = 200,
): Promise<ArticlesListData> {
  try {
    // Try primary locale first
    let response = await fetchArticlesList(locale, limit);
    let nodes = response.data || [];
    let included = response.included || [];

    // If no articles found, try fallback locale (EN ↔ AR)
    if (nodes.length === 0) {
      const fallbackLocale = locale === 'ar' ? 'en' : 'ar';
      try {
        response = await fetchArticlesList(fallbackLocale, limit);
        nodes = response.data || [];
        included = response.included || [];

        if (nodes.length > 0) {
          void nodes;
        } else {
          return getArticlesFallbackData();
        }
      } catch (fallbackError) {
        return getArticlesFallbackData();
      }
    }

    const data = transformArticlesList(nodes, included);
    return data;
  } catch (error) {
    console.error('Articles fetch error:', error);
    return getArticlesFallbackData();
  }
}

// Get article data by ID (for detail pages)
export async function getArticleData(id: string, locale?: string): Promise<Article | null> {
  try {
    const drupalNode = await getArticleById(id, locale);

    if (!drupalNode) {
      return null;
    }

    // Fetch full node with includes for transformation
    const includeFields = 'field_image.field_media_image,field_ip_categories,field_author';
    const endpoint = `/node/article?filter[drupal_internal__nid]=${id}&filter[status]=1&include=${includeFields}`;

    try {
      const fullResponse = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
      const node = Array.isArray(fullResponse.data) ? fullResponse.data[0] : fullResponse.data;
      const included = fullResponse.included || [];

      const article = transformArticleNode(node, included);
      return article;
    } catch (error) {
      console.error(`🔴 ARTICLE DATA: Error transforming article ${id}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`🔴 ARTICLE DATA: Error fetching article ${id}:`, error);
    return null;
  }
}
