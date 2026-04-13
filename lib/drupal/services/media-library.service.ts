import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for Media Library
export interface MediaLibraryData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
    overlay?: boolean;
  };
}

// Fetch page by UUID (2-step pattern)
async function fetchPageByUUID(uuid: string, locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const endpoint = `/node/media_library_page/${uuid}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformMediaLibraryPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): MediaLibraryData {
  const attrs = node.attributes as any;

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Media Center',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Here you can find news, videos, articles and events on various categories of IP.',
      backgroundImage: '/images/media-center/hero.jpg',
      overlay: attrs.field_hero_overlay ?? true,
    },
  };
}

// Fallback data function
export function getMediaLibraryFallbackData(): MediaLibraryData {
  return {
    hero: {
      title: 'Media Center',
      description:
        'Here you can find news, videos, articles and events on various categories of IP.',
      backgroundImage: '/images/media-center/hero.jpg',
      overlay: true,
    },
  };
}

// Main export function with 2-step UUID fetch
export async function getMediaLibraryPageData(locale?: string): Promise<MediaLibraryData> {
  try {
    // Step 1: Get UUID
    const listEndpoint = `/node/media_library_page?filter[status]=1&fields[node--media_library_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});
    const nodes = listResponse.data || [];

    if (nodes.length === 0) {
      console.log(`🔴 MEDIA LIBRARY: Using fallback data ❌ (${locale || 'en'})`);
      return getMediaLibraryFallbackData();
    }

    // Step 2: Fetch with locale
    const uuid = nodes[0].id;
    const response = await fetchPageByUUID(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const data = transformMediaLibraryPage(node, included);
    console.log(`🟢 MEDIA LIBRARY: Using Drupal data ✅ (${locale || 'en'})`);

    return data;
  } catch (error) {
    console.log(`🔴 MEDIA LIBRARY: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Media Library fetch error:', error);
    return getMediaLibraryFallbackData();
  }
}
