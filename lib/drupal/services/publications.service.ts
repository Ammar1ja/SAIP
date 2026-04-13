/**
 * Publications Service
 * Handles data fetching and transformation for Publications page
 * Reuses PublicationItemNode from patents/trademarks services
 */

import { fetchDrupal, getRelated, getImageWithAlt, extractText, getProxyUrl } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalPublicationItemNode } from '../types';
import { DrupalResponse } from '../api-client';
import { getApiUrl } from '../config';

// Frontend data interfaces
export interface PublicationsData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  publications: PublicationItemData[];
}

export interface PublicationItemData {
  title: string;
  publicationNumber?: string;
  durationDate?: string;
  description?: string;
  labels?: string[];
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  [key: string]: unknown; // Added to satisfy FilterableItem interface
}

// Drupal API functions - 2-step UUID fetch pattern
async function fetchPublicationsPageUuid(): Promise<string | null> {
  const endpoint = `/node/publications_page?filter[status]=1&fields[node--publications_page]=drupal_internal__nid`;
  const response = await fetchDrupal<DrupalNode>(endpoint);
  if (response.data && response.data.length > 0) {
    return response.data[0].id;
  }
  return null;
}

async function fetchPublicationsPageByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_publications_items',
    'field_publications_items.field_secondary_button_file', // Include uploaded files
  ].join(',');

  const endpoint = `/node/publications_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

export async function fetchPublicationsPage(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // Only include fields that exist as relationships in Drupal
  // Available: field_publications_items
  const includeFields = [
    'field_publications_items',
    'field_publications_items.field_secondary_button_file',
  ];

  // Use full filter syntax filter[status][value]=1 instead of filter[status]=1
  // The shorthand doesn't work for all content types
  const endpoint = `/node/publications_page?filter[status][value]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Fetch individual publication items
export async function fetchPublications(
  locale?: string,
): Promise<DrupalResponse<DrupalPublicationItemNode>> {
  // Use full filter syntax filter[status][value]=1
  const endpoint = `/node/publication_item?filter[status][value]=1`;
  const response = await fetchDrupal<DrupalPublicationItemNode>(endpoint, {}, locale);
  return response;
}

// Helper function to format date range
function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return '';

  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    // Format: DD.MM - DD.MM.YYYY
    const formatDay = (d: Date) => d.getDate().toString().padStart(2, '0');
    const formatMonth = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
    const formatYear = (d: Date) => d.getFullYear().toString();

    const startStr = `${formatDay(start)}.${formatMonth(start)}`;

    if (end) {
      const endStr = `${formatDay(end)}.${formatMonth(end)}.${formatYear(end)}`;
      return `${startStr} - ${endStr}`;
    }

    return `${startStr}.${formatYear(start)}`;
  } catch {
    return startDate || '';
  }
}

// Transformation functions
export function transformPublicationItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): PublicationItemData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attrs = (item.attributes || {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relationships = ((item as DrupalNode).relationships || {}) as any;

  // ✅ Extract datetime values from Drupal datetime fields
  // Datetime fields return objects like { value: "2024-11-04T00:00:00" }
  const startDateValue =
    typeof attrs.field_duration_date === 'object' && attrs.field_duration_date?.value
      ? attrs.field_duration_date.value
      : attrs.field_duration_date;
  const endDateValue =
    typeof attrs.field_duration_end_date === 'object' && attrs.field_duration_end_date?.value
      ? attrs.field_duration_end_date.value
      : attrs.field_duration_end_date;

  // Format duration date from start/end dates
  const durationDate = formatDateRange(startDateValue, endDateValue);

  // Get file URL from file field if available
  // Logic: One uploaded file is used for BOTH View and Download buttons
  // If no file uploaded, use manual URLs (field_primary_button_href, field_secondary_button_href)
  const getFileUrl = (): string | null => {
    if (!relationships.field_secondary_button_file) {
      return null;
    }

    const fileRel = getRelated(relationships, 'field_secondary_button_file', included);
    if (!fileRel || Array.isArray(fileRel)) return null;

    // Get file URL from file entity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileAttrs = (fileRel.attributes || {}) as any;
    if (fileAttrs.uri?.url) {
      // ✅ CRITICAL: Use getApiUrl() from drupal/config.ts instead of process.env
      // This ensures correct URL in all environments (localhost, test, prod)
      const drupalBaseUrl = getApiUrl();
      const fileUrl = fileAttrs.uri.url.startsWith('/')
        ? fileAttrs.uri.url
        : `/${fileAttrs.uri.url}`;
      const fullUrl = `${drupalBaseUrl}${fileUrl}`;
      console.log(`📄 [PUBLICATIONS] File URL: ${fullUrl}`);
      return fullUrl;
    }

    return null;
  };

  // Get uploaded file URL (if exists)
  const uploadedFileUrl = getFileUrl();

  // Primary button href - prefer uploaded file, fallback to manual URL
  // SECURITY: Use proxy for all backend files
  const primaryButtonHref = getProxyUrl(
    uploadedFileUrl || attrs.field_primary_button_href,
    'download',
  );

  // Secondary button href - same file as primary (for View), fallback to manual URL
  // SECURITY: Use proxy for all backend files
  const secondaryButtonHref = getProxyUrl(
    uploadedFileUrl || attrs.field_secondary_button_href,
    'view',
  );

  // ✅ Extract description from text_long field (has {value, format} structure)
  const description = extractText(attrs.field_description);

  // ✅ Get labels array (field_labels is multi-value string field)
  const labels = attrs.field_labels
    ? Array.isArray(attrs.field_labels)
      ? attrs.field_labels.filter((l: any) => typeof l === 'string' && l.trim() !== '')
      : typeof attrs.field_labels === 'string'
        ? [attrs.field_labels]
        : undefined
    : undefined;

  return {
    title: attrs.title || 'Untitled Publication',
    publicationNumber: attrs.field_publication_number || '',
    durationDate,
    description: description || undefined,
    labels,
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref,
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref,
  };
}

export function transformPublicationsPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): PublicationsData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attrs = node.attributes as any;

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          included,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get publications items
  const publicationsData = node.relationships?.field_publications_items
    ? getRelated(node.relationships, 'field_publications_items', included) || []
    : [];
  const publications = Array.isArray(publicationsData)
    ? publicationsData.map((item: DrupalIncludedEntity) => transformPublicationItem(item, included))
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Publications',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Access the latest patent publications and gazette updates.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    publications,
  };
}

export function getPublicationsFallbackData(): PublicationsData {
  return {
    heroHeading: 'Publications',
    heroSubheading: 'Access the latest patent publications and gazette updates.',
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Publications',
    },
    publications: [
      {
        title: 'Patent publication 6261',
        publicationNumber: '6261',
        durationDate: '11.09 - 11.11.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/',
      },
      {
        title: 'Patent publication 6262',
        publicationNumber: '6262',
        durationDate: '12.01 - 12.03.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/',
      },
      {
        title: 'Patent publication 6263',
        publicationNumber: '6263',
        durationDate: '01.15 - 01.17.2025',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/',
      },
    ],
  };
}

export async function getPublicationsPageData(locale?: string): Promise<PublicationsData> {
  try {
    // Step 1: Get UUID without locale filter
    const uuid = await fetchPublicationsPageUuid();
    if (!uuid) {
      console.log('🔴 PUBLICATIONS: No page content found, trying individual items');
      // Try fetching individual publication items
      try {
        const itemsResponse = await fetchPublications(locale);
        const items = itemsResponse.data;
        const itemsIncluded = itemsResponse.included || [];

        if (items.length === 0) {
          console.log('🔴 PUBLICATIONS: No items found, using fallback data');
          return getPublicationsFallbackData();
        }

        // Transform items to publications data
        const publications = items.map((item: DrupalPublicationItemNode) =>
          transformPublicationItem(item, itemsIncluded),
        );

        console.log(`✅ PUBLICATIONS: Using Drupal data from individual items (${locale || 'en'})`);
        return {
          heroHeading: 'Publications',
          heroSubheading: 'Access the latest patent publications and gazette updates.',
          heroImage: {
            src: '/images/about/hero.jpg',
            alt: 'Publications',
          },
          publications,
        };
      } catch (itemsError) {
        console.log(
          `🔴 PUBLICATIONS: Error fetching items, using fallback data (${locale || 'en'})`,
        );
        return getPublicationsFallbackData();
      }
    }

    // Step 2: Fetch with locale for translated content
    const pageResponse = await fetchPublicationsPageByUuid(uuid, locale);
    const node = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;
    const pageIncluded = pageResponse.included || [];

    if (!node) {
      console.log('🔴 PUBLICATIONS: Node not found, using fallback data');
      return getPublicationsFallbackData();
    }

    const data = transformPublicationsPage(node, pageIncluded);
    console.log(`✅ PUBLICATIONS: Using Drupal data (${locale || 'en'})`);
    return data;
  } catch {
    console.log(`🔴 PUBLICATIONS: Error fetching data, using fallback data (${locale || 'en'})`);
    return getPublicationsFallbackData();
  }
}
