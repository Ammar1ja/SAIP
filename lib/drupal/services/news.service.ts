import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Types
export interface NewsArticle {
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
}

export interface NewsListData {
  articles: NewsArticle[];
  total: number;
  categories: Array<{ id: string; name: string }>;
}

function filterIncludedForLocale(
  included: DrupalIncludedEntity[],
  locale?: string,
): DrupalIncludedEntity[] {
  if (!locale) return included;
  return included.filter((entity) => {
    // Media/file entities can be shared across translations and often carry
    // langcode different from current locale (or no meaningful langcode).
    // Keep them to avoid losing image resolution on translated news.
    const entityType = entity.type || '';
    const isMediaOrFile = entityType.startsWith('media--') || entityType === 'file--file';
    if (isMediaOrFile) return true;

    const entityLangcode = (entity.attributes as any)?.langcode;
    return !entityLangcode || entityLangcode === locale;
  });
}

// Fetch all news categories from taxonomy
export async function fetchNewsCategories(
  locale?: string,
): Promise<Array<{ id: string; name: string }>> {
  try {
    // Fetch from all 3 vocabularies that news uses
    const vocabularies = ['partner_main_category', 'news_categories', 'ip_categories'];
    const allCategories: Array<{ id: string; name: string }> = [];

    for (const vocab of vocabularies) {
      const langFilter = locale ? `&filter[langcode][value]=${locale}` : '';
      const endpoint = `/taxonomy_term/${vocab}?sort=weight,name${langFilter}`;
      const response = await fetchDrupal(endpoint, {}, locale);

      if (response.data && Array.isArray(response.data)) {
        const categories = response.data
          .filter((term: any) => {
            if (!locale) return true;
            const termLang = term.attributes?.langcode;
            return !termLang || termLang === locale;
          })
          .map((term: any) => ({
            id: term.id,
            name: term.attributes?.name || '',
          }))
          .filter((cat) => cat.name);
        allCategories.push(...categories);
      }
    }

    // Remove duplicates by name (case-insensitive)
    const uniqueCategories = Array.from(
      new Map(allCategories.map((cat) => [cat.name.toLowerCase(), cat])).values(),
    );

    return uniqueCategories;
  } catch (error) {
    console.error('Failed to fetch news categories:', error);
    return [];
  }
}

// Fetch news list with pagination support
export async function fetchNewsList(
  locale?: string,
  limit: number = 200,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields =
    'field_image.field_media_image,field_main_category,field_tags,field_ip_categories';

  // IMPORTANT: Filter by langcode to show only articles in requested language
  const langFilter = locale ? `&filter[langcode][value]=${locale}` : '';

  // Drupal JSON:API has a hard-coded limit of 50 per page
  // We need to fetch multiple pages if we want more than 50 items
  const pageSize = 50;
  const totalPages = Math.ceil(limit / pageSize);

  let allNodes: DrupalNode[] = [];
  let allIncluded: DrupalIncludedEntity[] = [];

  for (let page = 0; page < totalPages; page++) {
    const endpoint = `/node/news?filter[status]=1${langFilter}&sort=-field_date,-created&page[limit]=${pageSize}&page[offset]=${page * pageSize}&include=${includeFields}`;

    try {
      const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        // No more data, break the loop
        break;
      }

      const nodes = Array.isArray(response.data) ? response.data : [response.data];
      allNodes = [...allNodes, ...nodes];

      if (response.included) {
        const pageIncluded = filterIncludedForLocale(response.included, locale);
        allIncluded = [...allIncluded, ...pageIncluded];
      }

      // If we got less than pageSize items, it's the last page
      if (nodes.length < pageSize) {
        break;
      }

      // If we've reached the desired limit, stop
      if (allNodes.length >= limit) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching news page ${page}:`, error);
      break;
    }
  }

  return {
    data: allNodes,
    included: allIncluded,
    jsonapi: {
      version: '1.0',
      meta: {
        links: {
          self: {
            href: 'http://jsonapi.org/format/1.0/',
          },
        },
      },
    },
  };
}

// Transform news node (exported for detail page)
export function transformNewsNode(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): NewsArticle {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};
  const nid = attrs.drupal_internal__nid || node.id;

  // Get image – only use API src when it looks like an image URL (avoids HTML/JSON showing as "image")
  const NEWS_PLACEHOLDER = '/images/photo-container.png';
  let imageUrl = NEWS_PLACEHOLDER;
  let imageAlt = '';
  const imageRel = getRelated(relationships, 'field_image', included);
  if (imageRel && !Array.isArray(imageRel)) {
    const imageData = getImageWithAlt(imageRel, included);
    const src = imageData?.src?.trim();
    const looksLikeImage =
      src &&
      (src.startsWith('/') || src.startsWith('http')) &&
      (src.includes('/files/') ||
        src.includes('/sites/default/files/') ||
        src.includes('default/files') ||
        /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(src));
    if (looksLikeImage) {
      imageUrl = src;
      imageAlt = imageData.alt || '';
    }
  }

  // Get categories from field_main_category, field_tags, and field_ip_categories
  const categories: Array<{ id: string; name: string }> = [];

  const mainCategory = getRelated(relationships, 'field_main_category', included);
  if (mainCategory && !Array.isArray(mainCategory)) {
    const catAttrs = (mainCategory as any).attributes;
    if (catAttrs?.name) {
      categories.push({
        id: (mainCategory as any).id || 'main',
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
  }

  // Get date - try field_date first, then created
  let publishDate = '';
  if (attrs.field_date) {
    publishDate = formatDate(attrs.field_date);
  } else if (attrs.created) {
    publishDate = formatDate(attrs.created);
  }

  return {
    id: String(nid),
    title: attrs.field_title || attrs.title || '',
    excerpt: extractText(attrs.field_excerpt) || '',
    publishDate,
    image: imageUrl,
    imageAlt,
    categories,
    href: `/media-center/media-library/media-center/${nid}`,
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

// Transform news list
export function transformNewsList(
  nodes: DrupalNode[],
  included: DrupalIncludedEntity[] = [],
): NewsListData {
  const articles = nodes.map((node) => transformNewsNode(node, included));

  return {
    articles,
    total: articles.length,
    categories: [], // Categories should be passed separately via fetchNewsCategories
  };
}

// Fallback data
export function getNewsFallbackData(): NewsListData {
  return {
    articles: [],
    total: 0,
    categories: [],
  };
}

// Fetch single news by ID
export async function getNewsById(
  id: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  const includeFields = 'field_image.field_media_image,field_main_category,field_tags';
  // Use filter query instead of direct ID access (JSON:API requires UUID for direct access)
  // IMPORTANT: Filter by langcode to only fetch article in requested language
  const langFilter = locale ? `&filter[langcode][value]=${locale}` : '';
  const endpoint = `/node/news?filter[drupal_internal__nid]=${id}&filter[status]=1${langFilter}&include=${includeFields}`;

  try {
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

    if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      console.warn(`🟡 NEWS BY ID: Article ${id} not found in ${locale || 'en'}`);
      return null;
    }

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included ? filterIncludedForLocale(response.included, locale) : [];
    return { node, included };
  } catch (error) {
    console.error(`🔴 NEWS BY ID: Error fetching ${id} in ${locale || 'en'}:`, error);
    return null;
  }
}

// Main export function
export async function getNewsListData(locale?: string, limit: number = 200): Promise<NewsListData> {
  try {
    // Fetch categories in parallel with news
    const categoriesPromise = fetchNewsCategories(locale);

    // Try primary locale first
    const response = await fetchNewsList(locale, limit);
    const nodes = response.data || [];
    const included = response.included || [];

    // DO NOT fallback to other language - show only articles in requested language
    // If no articles found, just return empty data
    if (nodes.length === 0) {
      const categories = await categoriesPromise;
      return { ...getNewsFallbackData(), categories };
    }

    const data = transformNewsList(nodes, included);
    const categories = await categoriesPromise;

    return { ...data, categories };
  } catch (error) {
    console.error('News fetch error:', error);
    return getNewsFallbackData();
  }
}
