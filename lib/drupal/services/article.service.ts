import { fetchDrupal } from '../utils';
import { extractText, getImageUrl, getRelated } from '../utils';
import { DrupalNode } from '../types';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  publishData: string;
  categories: Array<{ id: string; name: string }>;
}

export async function getArticleById(id: string, locale?: string): Promise<DrupalNode | null> {
  try {
    const includeFields = 'field_image,field_image.field_media_image';
    const langFilter = locale ? `&filter[langcode][value]=${locale}` : '';
    const endpoint = `/node/article?filter[drupal_internal__nid]=${id}&filter[status]=1${langFilter}&include=${includeFields}`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    return data || null;
  } catch (error) {
    console.warn(`Article ${id} not found in requested locale`, error);
    return null;
  }
}

export function transformArticleNode(node: DrupalNode, included: any[] = []): Article {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get image
  const imageData = getRelated(rels, 'field_image', included);
  const imageUrl = imageData
    ? getImageUrl(imageData as any, included)
    : '/images/photo-container.png';

  // Get field_date
  const date = attrs.field_date || attrs.created || '';
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US') : '';

  return {
    id: node.id,
    title: attrs.title || '',
    excerpt: extractText(attrs.field_summary) || extractText(attrs.body) || '',
    content: extractText(attrs.body) || '',
    image: imageUrl,
    publishData: formattedDate,
    categories: [
      {
        id: '1',
        name: extractText(attrs.field_category) || 'News',
      },
    ],
  };
}
