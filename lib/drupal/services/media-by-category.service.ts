import { fetchDrupal } from '../utils';
import { getImageWithAlt, getRelated, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface MediaItem {
  id: string;
  title: string;
  excerpt: string;
  date: string; // Formatted date like "10.03.2022"
  image?: string; // Image URL
  imageAlt?: string; // Image alt text
  href: string;
  type: 'news' | 'article' | 'video';
  videoUrl?: string; // For video items
  videoType?: 'local' | 'remote'; // For video items
  categories: Array<{
    id: string;
    name: string;
  }>;
}

function filterNodesByLangcode<T extends DrupalNode>(nodes: T[], locale?: string): T[] {
  if (!locale) return nodes;
  const normalizedLocale = locale.toLowerCase().split('-')[0];
  const filtered = nodes.filter((node) => {
    const langcode = (node as any)?.attributes?.langcode;
    if (!langcode) return true;
    return langcode.toLowerCase().startsWith(normalizedLocale);
  });
  return filtered.length > 0 ? filtered : nodes;
}

/**
 * Get IP Category taxonomy term ID by name
 */
const IP_CATEGORY_TIDS: Record<string, string> = {
  Patents: '324',
  Trademarks: '325',
  Copyrights: '326',
  Designs: '327',
  'Plant Varieties': '328',
  'Layout Designs': '329', // Topographic Designs in Drupal, but called Layout Designs in frontend
  'IP Licensing': '367',
  'IP Infringement': '384',
  'التعدي على الملكية الفكرية': '384',
};

/**
 * Fetch News by IP Category
 */
export async function fetchNewsByCategory(category: string, locale?: string): Promise<MediaItem[]> {
  const tid = IP_CATEGORY_TIDS[category];

  if (!tid) {
    console.warn(`❌ No TID found for category: ${category}`);
    return [];
  }

  const effectiveLocale = locale || 'en';
  const endpoint = `/node/news?filter[field_ip_categories.drupal_internal__tid]=${tid}&filter[status]=1&include=field_image.field_media_image,field_ip_categories&sort=-field_date`;

  try {
    const response = await fetchDrupal(endpoint, {}, effectiveLocale);

    const nodes = Array.isArray(response.data) ? response.data : [response.data];
    const localizedNodes = filterNodesByLangcode(nodes, effectiveLocale);
    const included = response.included || [];

    const result = localizedNodes
      .map((node: DrupalNode) => transformNewsNode(node, included))
      .filter(Boolean) as MediaItem[];

    return result;
  } catch (error) {
    console.error(`❌ Error fetching news for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch Articles by IP Category
 */
export async function fetchArticlesByCategory(
  category: string,
  locale?: string,
): Promise<MediaItem[]> {
  const tid = IP_CATEGORY_TIDS[category];

  if (!tid) {
    console.warn(`❌ No TID found for category: ${category}`);
    return [];
  }

  const effectiveLocale = locale || 'en';
  const endpoint = `/node/article?filter[field_ip_categories.drupal_internal__tid]=${tid}&filter[status]=1&include=field_image.field_media_image,field_ip_categories&sort=-field_date`;

  try {
    const response = await fetchDrupal(endpoint, {}, effectiveLocale);

    const nodes = Array.isArray(response.data) ? response.data : [response.data];
    const localizedNodes = filterNodesByLangcode(nodes, effectiveLocale);
    const included = response.included || [];

    const result = localizedNodes
      .map((node: DrupalNode) => transformArticleNode(node, included))
      .filter(Boolean) as MediaItem[];

    return result;
  } catch (error) {
    console.error(`❌ Error fetching articles for category ${category}:`, error);
    return [];
  }
}

/**
 * Transform News node to MediaItem
 */
function transformNewsNode(node: DrupalNode, included: DrupalIncludedEntity[]): MediaItem | null {
  if (!node) return null;

  const attrs = (node as any).attributes || {};
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

  // Format date
  let formattedDate = '';
  const rawDate = extractText(attrs.field_date) || extractText(attrs.created) || '';
  if (rawDate) {
    try {
      const date = new Date(rawDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      formattedDate = `${day}.${month}.${year}`;
    } catch {
      formattedDate = rawDate;
    }
  }

  // Get categories from field_ip_categories (already filtered by category)
  const categories: Array<{ id: string; name: string }> = [];
  const ipCategories = getRelated(relationships, 'field_ip_categories', included);
  if (ipCategories) {
    const catArray = Array.isArray(ipCategories) ? ipCategories : [ipCategories];
    catArray.forEach((cat: any) => {
      if (cat.attributes?.name) {
        categories.push({
          id: cat.id || 'cat',
          name: cat.attributes.name,
        });
      }
    });
  }

  return {
    id: String(nid),
    title: extractText(attrs.title) || extractText(attrs.field_title) || 'Untitled',
    excerpt: extractText(attrs.field_excerpt) || '',
    date: formattedDate,
    image: imageUrl,
    imageAlt,
    href: `/media-center/media-library/media-center/${nid}`,
    type: 'news',
    categories,
  };
}

/**
 * Transform Article node to MediaItem
 */
function transformArticleNode(
  node: DrupalNode,
  included: DrupalIncludedEntity[],
): MediaItem | null {
  if (!node) return null;

  const attrs = (node as any).attributes || {};
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

  // Format date
  let formattedDate = '';
  const rawDate = extractText(attrs.field_date) || extractText(attrs.created) || '';
  if (rawDate) {
    try {
      const date = new Date(rawDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      formattedDate = `${day}.${month}.${year}`;
    } catch {
      formattedDate = rawDate;
    }
  }

  // Get categories from field_ip_categories (already filtered by category)
  const categories: Array<{ id: string; name: string }> = [];
  const ipCategories = getRelated(relationships, 'field_ip_categories', included);
  if (ipCategories) {
    const catArray = Array.isArray(ipCategories) ? ipCategories : [ipCategories];
    catArray.forEach((cat: any) => {
      if (cat.attributes?.name) {
        categories.push({
          id: cat.id || 'cat',
          name: cat.attributes.name,
        });
      }
    });
  }

  return {
    id: String(nid),
    title: extractText(attrs.title) || extractText(attrs.field_title) || 'Untitled',
    excerpt:
      extractText(attrs.field_summary) ||
      extractText(attrs.field_excerpt) ||
      extractText(attrs.body) ||
      '',
    date: formattedDate,
    image: imageUrl,
    imageAlt,
    href: `/media-center/media-library/media-center/articles/${nid}`,
    type: 'article',
    categories,
  };
}

/**
 * Transform Video Node to MediaItem
 */
function transformVideoNode(node: DrupalNode, included: DrupalIncludedEntity[] = []): MediaItem {
  const attrs = node.attributes || {};
  const relationships = node.relationships || {};
  const nid = node.attributes?.drupal_internal__nid || node.id;

  // Get video media entity
  let videoUrl = '';
  let videoType: 'local' | 'remote' = 'local';

  const videoRel = getRelated(relationships, 'field_video', included);
  if (videoRel && !Array.isArray(videoRel)) {
    const videoAttrs = videoRel.attributes || {};
    const videoRelationships = videoRel.relationships || {};

    if (videoRel.type === 'media--remote_video') {
      videoType = 'remote';
      videoUrl = extractText(videoAttrs.field_media_oembed_video) || '';
    } else if (videoRel.type === 'media--video') {
      videoType = 'local';
      const fileRel = getRelated(videoRelationships, 'field_media_video_file', included);
      if (fileRel && !Array.isArray(fileRel)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileAttrs = (fileRel.attributes as any) || {};
        const fileUri = fileAttrs.uri?.url || '';
        videoUrl = fileUri.startsWith('/')
          ? `${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${fileUri}`
          : fileUri;
      }
    }
  }

  // Get thumbnail image
  let imageUrl = '/images/photo-container.png';
  let imageAlt = '';

  const imageRel = getRelated(relationships, 'field_image', included);
  if (imageRel && !Array.isArray(imageRel)) {
    const imageRelationships = imageRel.relationships || {};
    const imageFileRel = getRelated(imageRelationships, 'field_media_image', included);
    if (imageFileRel && !Array.isArray(imageFileRel)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageAttrs = (imageFileRel.attributes as any) || {};
      const imageUri = imageAttrs.uri?.url || '';
      imageUrl = imageUri.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_DRUPAL_API_URL}${imageUri}`
        : imageUri;
      imageAlt = extractText(imageAttrs.alt) || '';
    }
  }

  // Format date to DD.MM.YYYY
  let formattedDate = '';
  const rawDate = extractText((attrs as any).field_date) || extractText(attrs.created);
  if (rawDate) {
    try {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        formattedDate = `${day}.${month}.${year}`;
      } else {
        formattedDate = rawDate;
      }
    } catch {
      formattedDate = rawDate;
    }
  }

  // Get categories
  const categories: Array<{ id: string; name: string }> = [];
  const ipCategories = getRelated(relationships, 'field_ip_categories', included);
  if (ipCategories) {
    const catArray = Array.isArray(ipCategories) ? ipCategories : [ipCategories];
    catArray.forEach((cat: any) => {
      if (cat.attributes?.name) {
        categories.push({
          id: cat.id || 'cat',
          name: cat.attributes.name,
        });
      }
    });
  }

  return {
    id: String(nid),
    title: extractText(attrs.title) || 'Untitled Video',
    excerpt: extractText((attrs as any).field_excerpt) || extractText(attrs.body) || '',
    date: formattedDate,
    image: imageUrl,
    imageAlt,
    videoUrl,
    videoType,
    href: `/media-center/media-library/media-center/videos/${nid}`,
    type: 'video',
    categories,
  };
}

/**
 * Fetch Videos by IP Category
 */
export async function fetchVideosByCategory(
  category: string,
  locale?: string,
): Promise<MediaItem[]> {
  const tid = IP_CATEGORY_TIDS[category];

  if (!tid) {
    console.warn(`❌ No TID found for category: ${category}`);
    return [];
  }

  const effectiveLocale = locale || 'en';
  const endpoint = `/node/video?filter[field_ip_categories.drupal_internal__tid]=${tid}&filter[status]=1&include=field_video,field_video.field_media_video_file,field_image,field_image.field_media_image,field_ip_categories&sort=-field_date`;

  try {
    const response = await fetchDrupal(endpoint, {}, effectiveLocale);

    if (!response?.data) {
      console.warn('❌ No data in response');
      return [];
    }

    const videos = Array.isArray(response.data) ? response.data : [response.data];
    const localizedVideos = filterNodesByLangcode(videos, effectiveLocale);
    const included = response.included || [];

    const transformed = localizedVideos.map((video: DrupalNode) =>
      transformVideoNode(video, included),
    );

    return transformed;
  } catch (error) {
    console.error('❌ Error fetching videos by category:', error);
    return [];
  }
}
