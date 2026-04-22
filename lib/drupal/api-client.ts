/**
 * Drupal JSON API Client for SAIP Project
 * Handles communication with Drupal backend
 */

import { drupalConfig, getApiUrl } from './config';

// Types for Drupal JSON API responses
export interface DrupalNode {
  id: string;
  type: string;
  attributes: {
    drupal_internal__nid: number;
    title: string;
    created: string;
    changed: string;
    status: boolean;
    promote?: boolean;
    sticky?: boolean;
    body?: {
      value: string;
      format: string;
      processed?: string;
    };
    // Add more fields as needed
  };
  relationships?: Record<string, any>;
}

export interface DrupalResponse<T = DrupalNode> {
  jsonapi: {
    version: string;
    meta: Record<string, any>;
  };
  data: T[];
  links?: Record<string, any>;
  included?: any[];
}

/**
 * Generic fetch wrapper for Drupal JSON API
 * CRITICAL: getApiUrl() called at runtime to respect environment variables
 */
async function drupalFetch<T = DrupalNode>(
  endpoint: string,
  options: RequestInit = {},
  locale?: string,
): Promise<DrupalResponse<T>> {
  // CRITICAL: Call getApiUrl() at runtime, not build time
  // This ensures APACHE_SERVER_NAME and branch detection work correctly
  const DRUPAL_BASE_URL = getApiUrl();

  // Drupal's multi-language config requires the language prefix in the path
  // even for English; without it JSON:API returns 404 HTML.
  const localePrefix = `/${(locale || 'en').toLowerCase()}`;
  const url = `${DRUPAL_BASE_URL}${localePrefix}${drupalConfig.jsonApiPath}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        ...options.headers,
      },
      // Disable Next.js cache for Drupal API calls to ensure fresh data
      cache: 'no-store' as RequestCache,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Drupal API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from Drupal API: ${url}`, error);
    throw error;
  }
}

/**
 * Fetch news articles
 */
export async function fetchNews(params?: {
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}): Promise<DrupalNode[]> {
  const searchParams = new URLSearchParams();

  if (params?.limit) {
    searchParams.append('page[limit]', params.limit.toString());
  }

  if (params?.sort) {
    searchParams.append('sort', params.sort);
  }

  // Default: get published news, sorted by creation date (newest first)
  searchParams.append('filter[status]', '1');
  if (!params?.sort) {
    searchParams.append('sort', '-created');
  }

  const endpoint = `/node/news?${searchParams.toString()}`;
  const response = await drupalFetch(endpoint);
  return response.data;
}

/**
 * Fetch about content
 */
export async function fetchAbout(): Promise<DrupalNode[]> {
  const endpoint = '/node/about?filter[status]=1';
  const response = await drupalFetch(endpoint);
  return response.data;
}

/**
 * Fetch services
 */
export async function fetchServices(params?: { limit?: number }): Promise<DrupalNode[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('filter[status]', '1');

  if (params?.limit) {
    searchParams.append('page[limit]', params.limit.toString());
  }

  const endpoint = `/node/service?${searchParams.toString()}`;
  const response = await drupalFetch(endpoint);
  return response.data;
}

/**
 * Fetch single node by ID
 */
export async function fetchNode(type: string, id: string): Promise<DrupalNode> {
  const endpoint = `/node/${type}/${id}`;
  const response = await drupalFetch(endpoint);
  return response.data[0]; // Single node response still comes as array
}

/**
 * Fetch any content type with custom filters
 */
export async function fetchContentType(
  contentType: string,
  params?: {
    limit?: number;
    sort?: string;
    filter?: Record<string, any>;
    include?: string[];
  },
): Promise<DrupalNode[]> {
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
    searchParams.append('include', params.include.join(','));
  }

  const endpoint = `/node/${contentType}?${searchParams.toString()}`;
  const response = await drupalFetch(endpoint);
  return response.data;
}

// Export default client object
export const drupalApi = {
  fetchNews,
  fetchAbout,
  fetchServices,
  fetchNode,
  fetchContentType,
};
