/**
 * Guidelines Service
 * Handles data fetching and transformation for Guidelines page
 * Reuses GuideItemNode from patents/trademarks services
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  extractText,
  getImageUrl,
  getProxyUrl,
} from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalGuideItemNode } from '../types';
import { DrupalResponse } from '../api-client';
import { getApiUrl } from '../config';

// Frontend data interfaces
export interface GuidelinesData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  guidelines: GuidelineItemData[];
  categoryOptions: Array<{ label: string; value: string }>;
}

export interface GuidelineItemData {
  title: string;
  description: string;
  labels: string[];
  category: string;
  reportType?: string; // Type of document (Regulation, System, Law, etc.)
  publicationDate: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  titleBg?: 'default' | 'green';
  imageUrl?: string;
  [key: string]: unknown;
}

// Drupal API functions
export async function fetchGuidelinesPage(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_guidelines_items',
    'field_guidelines_items.field_guide_category',
    'field_guidelines_items.field_guide_image',
    'field_guidelines_items.field_guide_image.field_media_image',
    'field_guidelines_items.field_secondary_button_file',
  ];
  const endpoint = `/node/guidelines_page?filter[status]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Fetch individual guideline items
export async function fetchGuidelines(
  locale?: string,
): Promise<DrupalResponse<DrupalGuideItemNode>> {
  const includeFields = [
    'field_guide_category',
    'field_guide_image',
    'field_guide_image.field_media_image',
    'field_secondary_button_file',
  ];

  const endpoint = `/node/guide_item?filter[status]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalGuideItemNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformGuidelineItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GuidelineItemData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Get category from relationship (using field_guide_category)
  const categoryTerm = relationships.field_guide_category
    ? (() => {
        const term = getRelated(relationships, 'field_guide_category', included);
        return term && !Array.isArray(term) ? term : null;
      })()
    : null;
  const categoryName = (categoryTerm?.attributes?.name as string) || 'General';

  // Parse labels - can be JSON array, comma-separated string, or single value
  let labels: string[] = [];
  if (attrs.field_labels) {
    // Check if it's already an array
    if (Array.isArray(attrs.field_labels)) {
      labels = attrs.field_labels;
    } else if (typeof attrs.field_labels === 'string') {
      try {
        // Try to parse as JSON
        labels = JSON.parse(attrs.field_labels);
      } catch {
        // Not JSON, treat as comma-separated or single value
        labels = attrs.field_labels.split(',').map((l: string) => l.trim());
      }
    }
  }

  // Fallback to category if no labels
  if (labels.length === 0) {
    labels = [categoryName || 'General'];
  }

  // Get image from field_guide_image (media reference)
  const imageData = relationships.field_guide_image
    ? getRelated(relationships, 'field_guide_image', included)
    : null;
  const imageUrl = getImageUrl(imageData as any, included);

  // Get file URL from field_secondary_button_file (direct file reference, not media)
  let fileUrl: string | undefined;
  if (relationships.field_secondary_button_file) {
    const fileEntity = getRelated(relationships, 'field_secondary_button_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        fileUrl = uri.startsWith('http') ? uri : `${getApiUrl()}${uri}`;
        console.log('📄 [GUIDELINES] File URL:', fileUrl);
      }
    }
  }

  // Debug: Log manual hrefs if no file uploaded
  if (!fileUrl) {
    console.log('⚠️ [GUIDELINES] No uploaded file, using manual hrefs:', {
      primary: attrs.field_primary_button_href,
      secondary: attrs.field_secondary_button_href,
    });
  }

  // Use uploaded file URL if available, otherwise use manual href
  const finalPrimaryHref = getProxyUrl(fileUrl || attrs.field_primary_button_href, 'download');
  const finalSecondaryHref = getProxyUrl(fileUrl || attrs.field_secondary_button_href, 'view');

  return {
    title: attrs.title || 'Untitled Guide',
    description: extractText(attrs.field_description) || '',
    labels,
    category: categoryName || 'Uncategorized',
    reportType: extractText(attrs.field_guide_type) || undefined,
    publicationDate: attrs.field_publication_date || '',
    primaryButtonLabel: attrs.field_primary_button_label || 'Download',
    primaryButtonHref: finalPrimaryHref,
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View',
    secondaryButtonHref: finalSecondaryHref,
    titleBg: (attrs.field_title_bg as 'default' | 'green') || undefined,
    imageUrl: imageUrl || undefined,
  };
}

export function transformGuidelinesPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): GuidelinesData {
  const attrs = node.attributes as any;

  // Get hero image from relationships (not attrs)
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

  // Get guidelines items
  const guidelinesData = node.relationships?.field_guidelines_items
    ? getRelated(node.relationships, 'field_guidelines_items', included) || []
    : [];
  const guidelines = Array.isArray(guidelinesData)
    ? guidelinesData.map((item: DrupalIncludedEntity) => transformGuidelineItem(item, included))
    : [];

  // Extract unique categories
  const categories = [...new Set(guidelines.map((g) => g.category))].filter(Boolean);
  const categoryOptions = [
    { label: 'All', value: 'all' },
    ...categories.map((cat) => ({ label: cat, value: cat.toLowerCase() })),
  ];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Guidelines',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Explore comprehensive guidelines for intellectual property protection and management.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    guidelines,
    categoryOptions,
  };
}

export function getGuidelinesFallbackData(): GuidelinesData {
  return {
    heroHeading: 'Guidelines',
    heroSubheading:
      'Explore comprehensive guidelines for intellectual property protection and management.',
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Guidelines',
    },
    guidelines: [
      {
        title: 'Saudi design classification 1',
        description: 'Locarno Classification Guide (14th Edition)',
        labels: ['Designs'],
        category: 'Designs',
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View',
        secondaryButtonHref: '/',
      },
      {
        title: 'Software copyright protection guide 1',
        description: 'Guidelines for Protecting Copyright in Software',
        labels: ['Copyrights'],
        category: 'Copyrights',
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View',
        secondaryButtonHref: '/',
      },
      {
        title: 'Guide to patent application content 1',
        description: 'The content of the patent application necessary for filing',
        labels: ['Patents'],
        category: 'Patents',
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download',
        primaryButtonHref: '/',
        secondaryButtonLabel: 'View',
        secondaryButtonHref: '/',
      },
    ],
    categoryOptions: [
      { label: 'All', value: 'all' },
      { label: 'General', value: 'general' },
      { label: 'Trademarks', value: 'trademarks' },
      { label: 'Patents', value: 'patents' },
      { label: 'Copyrights', value: 'copyrights' },
      { label: 'Designs', value: 'designs' },
    ],
  };
}

export async function getGuidelinesPageData(locale?: string): Promise<GuidelinesData> {
  try {
    // Step 1: Get UUID from EN version (always find the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/guidelines_page?filter[status][value]=1',
      {},
      'en',
    );

    const nodes = Array.isArray(initialResponse.data)
      ? initialResponse.data
      : [initialResponse.data];

    if (nodes.length === 0 || !nodes[0]) {
      console.log('🔴 GUIDELINES: No page content found, trying individual items');
      // Try fetching individual guideline items
      try {
        const itemsResponse = await fetchGuidelines(locale);
        const items = itemsResponse.data;
        const itemsIncluded = itemsResponse.included || [];

        if (items.length === 0) {
          console.log('🔴 GUIDELINES: No items found, using fallback data');
          return getGuidelinesFallbackData();
        }

        // Transform items to guidelines data
        const guidelines = items.map((item: DrupalGuideItemNode) =>
          transformGuidelineItem(item, itemsIncluded),
        );
        const categories = [...new Set(guidelines.map((g) => g.category))].filter(Boolean);
        const categoryOptions = [
          { label: 'All', value: 'all' },
          ...categories.map((cat) => ({ label: cat, value: cat.toLowerCase() })),
        ];

        console.log(`✅ GUIDELINES: Using Drupal data from individual items (${locale || 'en'})`);
        return {
          heroHeading: 'Guidelines',
          heroSubheading:
            'Explore comprehensive guidelines for intellectual property protection and management.',
          heroImage: {
            src: '/images/about/hero.jpg',
            alt: 'Guidelines',
          },
          guidelines,
          categoryOptions,
        };
      } catch (itemsError) {
        console.error(`🔴 GUIDELINES: Error fetching items:`, itemsError);
        console.log(`🔴 GUIDELINES: Using fallback data (${locale || 'en'})`);
        return getGuidelinesFallbackData();
      }
    }

    const nodeUuid = nodes[0].id;

    // Step 2: Fetch with UUID and locale to get translated content with includes
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_guidelines_items',
      'field_guidelines_items.field_guide_category',
      'field_guidelines_items.field_guide_image',
      'field_guidelines_items.field_guide_image.field_media_image',
      'field_guidelines_items.field_secondary_button_file',
    ];
    const response = await fetchDrupal<DrupalNode>(
      `/node/guidelines_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // When fetching by UUID, response.data is a single object, not an array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const data = transformGuidelinesPage(node, response.included || []);

    console.log(`✅ GUIDELINES: Using Drupal data from page (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.error(`🔴 GUIDELINES: Error fetching data:`, error);
    console.log(`🔴 GUIDELINES: Using fallback data (${locale || 'en'})`);
    return getGuidelinesFallbackData();
  }
}
