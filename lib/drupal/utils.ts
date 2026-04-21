/**
 * Drupal API Utilities
 * Shared functionality for Drupal API operations
 */

import {
  DrupalNode,
  DrupalResponse,
  DrupalIncludedEntity,
  DrupalMediaEntity,
  DrupalFileEntity,
  DrupalRelationship,
} from './types';
import { drupalConfig, getApiUrl } from './config';
import { buildDrupalUrl } from './locale-helper';

export interface FetchParams {
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  include?: string[];
}

/**
 * Core fetch function for Drupal JSON:API.
 * Uses getApiUrl() at runtime so environment and overrides are respected.
 */
export async function fetchDrupal<T = DrupalNode>(
  endpoint: string,
  options: RequestInit = {},
  locale?: string,
): Promise<DrupalResponse<T>> {
  const DRUPAL_BASE_URL = getApiUrl();
  const url = buildDrupalUrl(DRUPAL_BASE_URL, drupalConfig.jsonApiPath, endpoint, locale);
  const method = (options.method || 'GET').toUpperCase();
  const requestOptions: RequestInit = {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...(locale && { 'Accept-Language': locale }),
      ...options.headers,
    },
    ...options,
  };

  const hasExplicitCacheConfig =
    typeof options.cache !== 'undefined' || typeof (options as any).next !== 'undefined';

  if (!hasExplicitCacheConfig) {
    if (method === 'GET' && drupalConfig.revalidateTime > 0) {
      const endpointTag = `drupal:${
        endpoint
          .split('?')[0]
          .replace(/[^a-zA-Z0-9/_-]/g, '')
          .replace(/^\/+/, '')
          .replace(/\/+/g, ':') || 'unknown'
      }`;

      (requestOptions as any).next = {
        revalidate: drupalConfig.revalidateTime,
        tags: [endpointTag, 'drupal:global'],
      };
    } else {
      requestOptions.cache = 'no-store';
    }
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Drupal API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const jsonData = await response.json();
  return jsonData;
}

/**
 * Build URL parameters for Drupal API
 */
export function buildParams(params?: FetchParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Default: only published content
  searchParams.append('filter[status]', '1');

  if (params?.limit) {
    searchParams.append('page[limit]', params.limit.toString());
  }

  if (params?.sort) {
    searchParams.append('sort', params.sort);
  }

  if (params?.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      searchParams.append(`filter[${key}]`, value.toString());
    });
  }

  if (params?.include?.length) {
    const includeString = params.include.join(',');
    searchParams.append('include', includeString);
  }

  return searchParams;
}

/**
 * Fetch content by content type
 */
export async function fetchContentType(
  contentType: string,
  params?: FetchParams,
  locale?: string,
): Promise<{ data: DrupalNode[]; included: DrupalIncludedEntity[] }> {
  const searchParams = buildParams(params);
  const endpoint = `/node/${contentType}?${searchParams.toString()}`;

  const response = await fetchDrupal(endpoint, {}, locale);
  return {
    data: response.data || [],
    included: response.included || [],
  };
}

/**
 * Filter included entities to match a specific langcode
 * API returns ALL language versions - we need only one
 * Media/file entities are always kept (they are shared assets across languages)
 * Taxonomy terms are always kept (they have their own translation handling)
 */
export function filterIncludedByLangcode(
  included: DrupalIncludedEntity[],
  targetLangcode: string = 'en',
): DrupalIncludedEntity[] {
  return included.filter((entity) => {
    const entityLangcode = (entity.attributes as any)?.langcode;
    const isTaxonomy = entity.type?.startsWith('taxonomy_term');
    const isMedia = entity.type?.startsWith('media');
    const isFile = entity.type?.startsWith('file');
    // Keep: entities without langcode, taxonomy terms, media, files,
    // and entities matching target language
    return !entityLangcode || isTaxonomy || isMedia || isFile || entityLangcode === targetLangcode;
  });
}

export function normalizeServiceTypeKey(value?: string): string | null {
  if (!value) return null;
  const normalized = value.toLowerCase().trim();
  const keyPrefix = 'common.filters.servicetypeoptions.';
  const cleaned = normalized.startsWith(keyPrefix)
    ? normalized.slice(keyPrefix.length).trim()
    : normalized;

  const map: Record<string, string> = {
    protection: 'protection',
    الحماية: 'protection',
    management: 'management',
    الإدارة: 'management',
    guidance: 'guidance',
    enablement: 'guidance',
    الإرشاد: 'guidance',
    enforcement: 'enforcement',
    الإنفاذ: 'enforcement',
  };

  const mapped = map[cleaned] || map[normalized];
  if (mapped) return mapped;
  if (['protection', 'management', 'guidance', 'enforcement'].includes(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * Transform relationship data to get referenced entity
 */
export function getRelated(
  relationships: Record<string, DrupalRelationship>,
  fieldName: string,
  included: DrupalIncludedEntity[] = [],
): DrupalIncludedEntity | DrupalIncludedEntity[] | null {
  const relData = relationships?.[fieldName]?.data;

  if (!relData) return null;

  if (Array.isArray(relData)) {
    const results = relData
      .map((item) => included.find((inc) => inc.type === item.type && inc.id === item.id))
      .filter((item): item is DrupalIncludedEntity => item !== undefined);
    return results;
  } else {
    return included.find((inc) => inc.type === relData.type && inc.id === relData.id) || null;
  }
}

/**
 * Re-export getApiUrl from config for backward compatibility and convenience
 * Uses runtime detection to respect APACHE_SERVER_NAME and environment variables
 */
export { getApiUrl };

/**
 * Transform media reference to image with URL and alt text
 */
export function getImageWithAlt(
  relationshipData: DrupalIncludedEntity | null,
  included: DrupalIncludedEntity[] = [],
): { src: string; alt: string } {
  if (!relationshipData) return { src: '', alt: '' };

  let src = '';
  let alt = '';

  // Special handling for media--image entities
  if (relationshipData.type === 'media--image') {
    const mediaEntity = relationshipData as DrupalMediaEntity;
    // Get alt text from media entity
    alt =
      (mediaEntity.attributes?.field_media_image as any)?.alt || mediaEntity.attributes?.name || '';

    // Find related file--file entity through field_media_image relationship
    const fileEntity = getRelated(mediaEntity.relationships || {}, 'field_media_image', included);

    if (fileEntity && !Array.isArray(fileEntity)) {
      const fileData = fileEntity as DrupalFileEntity;
      const uriAttr = fileData.attributes?.uri;
      const fileUrl =
        (typeof uriAttr === 'object' && uriAttr !== null && (uriAttr as any).url) ||
        (typeof uriAttr === 'string' ? uriAttr : '');
      if (fileUrl) {
        const normalized = fileUrl.startsWith('public://')
          ? `/sites/default/files/${fileUrl.replace(/^public:\/\//, '')}`
          : fileUrl;
        if (normalized.startsWith('/')) {
          src = `${getApiUrl().replace('/jsonapi', '')}${normalized}`;
        } else {
          src = normalized;
        }
      }
    }
  } else if (
    relationshipData.type === 'media--file' ||
    relationshipData.type === 'media--document'
  ) {
    // Handle non-image media (e.g., SVG uploaded as file/document)
    const mediaEntity = relationshipData as DrupalMediaEntity;
    alt = mediaEntity.attributes?.name || '';

    const fileEntity =
      getRelated(mediaEntity.relationships || {}, 'field_media_file', included) ||
      getRelated(mediaEntity.relationships || {}, 'field_media_document', included);

    if (fileEntity && !Array.isArray(fileEntity)) {
      const fileData = fileEntity as DrupalFileEntity;
      const uriAttr = fileData.attributes?.uri;
      const fileUrl =
        (typeof uriAttr === 'object' && uriAttr !== null && (uriAttr as any).url) ||
        (typeof uriAttr === 'string' ? uriAttr : '');
      if (fileUrl) {
        const normalized = fileUrl.startsWith('public://')
          ? `/sites/default/files/${fileUrl.replace(/^public:\/\//, '')}`
          : fileUrl;
        if (normalized.startsWith('/')) {
          src = `${getApiUrl().replace('/jsonapi', '')}${normalized}`;
        } else {
          src = normalized;
        }
      }
    }
  } else {
    // Fallback: Try different URL extraction paths for other entity types
    const attrs = relationshipData.attributes as any;
    const possibleUrls = [
      attrs?.uri?.url,
      attrs?.field_media_image?.meta?.url,
      attrs?.field_media_image?.data?.attributes?.uri?.url,
      attrs?.thumbnail?.meta?.url,
      attrs?.field_media_image?.uri?.url,
    ];

    for (const url of possibleUrls) {
      if (url) {
        src = url;
        break;
      }
    }

    // Try to get alt from various paths
    alt = attrs?.alt || attrs?.title || '';
  }

  return { src, alt };
}

/**
 * Transform media reference to image URL (convenience function)
 */
export function getImageUrl(
  relationshipData: DrupalIncludedEntity | null,
  included: DrupalIncludedEntity[] = [],
): string {
  const imageData = getImageWithAlt(relationshipData, included);
  return imageData.src;
}

/**
 * Extract and sanitize text from DrupalTextField
 * Removes HTML tags and decodes HTML entities
 */
export function extractText(field: any): string {
  if (!field) return '';

  // ✅ Handle empty arrays (Drupal sometimes returns [] for empty fields)
  if (Array.isArray(field) && field.length === 0) {
    return '';
  }

  // ✅ Handle arrays with objects (Drupal text_long returns [{value, format, processed}])
  if (Array.isArray(field) && field.length > 0) {
    const firstItem = field[0];
    if (typeof firstItem === 'string') {
      return firstItem;
    }
    if (firstItem && typeof firstItem === 'object' && (firstItem.processed || firstItem.value)) {
      // ✅ FIX: Use value if processed is empty string or null
      const htmlContent =
        firstItem.processed && firstItem.processed.trim() ? firstItem.processed : firstItem.value;
      return htmlContent
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();
    }
  }

  if (typeof field === 'string') {
    // If it's already a string, check if it contains HTML and sanitize it
    if (field.includes('<')) {
      return field
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&amp;/g, '&') // Decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();
    }
    return field;
  }

  // Handle Drupal text field object
  if (field && typeof field === 'object' && (field.processed || field.value)) {
    // ✅ FIX: Use value if processed is empty string or null
    const htmlContent = field.processed && field.processed.trim() ? field.processed : field.value;
    return htmlContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Decode HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  // ✅ Handle numbers (convert to string)
  if (typeof field === 'number') {
    return String(field);
  }

  return '';
}

/**
 * Extract HTML from DrupalTextField for rendering with dangerouslySetInnerHTML.
 * Preserves HTML (value/processed from formatted text fields).
 */
export function extractHtml(field: any): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field) && field.length > 0) {
    const first = field[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      const raw = first.processed && first.processed.trim() ? first.processed : first.value;
      return typeof raw === 'string' ? raw : '';
    }
  }
  if (field && typeof field === 'object' && (field.processed != null || field.value != null)) {
    const raw = field.processed && String(field.processed).trim() ? field.processed : field.value;
    return typeof raw === 'string' ? raw : '';
  }
  return '';
}

/**
 * Create proxy URL for Drupal files to handle CORS and download issues
 * Returns '#' if URL is invalid/undefined
 *
 * SECURITY: Uses path-based approach to prevent open proxy vulnerabilities
 * Only proxies files from /sites/default/files/ directory
 */
export function getProxyUrl(url: string | undefined, action: 'download' | 'view'): string {
  // Return # if URL is undefined, null, empty, or whitespace
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '#';
  }

  // Extract path from URL (support both relative and absolute URLs)
  let filePath: string;

  if (url.startsWith('/sites/default/files/')) {
    // Already a relative path - perfect!
    filePath = url;
  } else if (url.startsWith('http')) {
    // Absolute URL - extract path
    try {
      const urlObj = new URL(url);
      filePath = urlObj.pathname;

      // SECURITY: Only allow /sites/default/files/ paths
      if (!filePath.startsWith('/sites/default/files/')) {
        return url; // Return original for external URLs
      }
    } catch (error) {
      return '#';
    }
  } else {
    // Not a valid file path
    return url;
  }

  // SECURITY: Encode path to prevent injection attacks
  const encodedPath = encodeURIComponent(filePath);
  const proxyUrl = `/api/proxy-file?path=${encodedPath}&action=${action}`;

  return proxyUrl;
}
