/**
 * Homepage Service
 * Functional API for fetching and transforming homepage content from Drupal
 */

import React from 'react';
import {
  fetchDrupal,
  getRelated,
  getImageUrl,
  getApiUrl,
  getProxyUrl,
  extractText,
  extractHtml,
  filterIncludedByLangcode,
} from '../utils';
import {
  DrupalNode,
  DrupalIncludedEntity,
  DrupalNewsItem,
  DrupalHighlightItem,
  DrupalTaxonomyEntity,
} from '../types';
import { ROUTES } from '@/lib/routes';

/**
 * Convert Western digits to Arabic-Indic digits
 */
function toArabicNumerals(str: string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Format timestamp to DD/MM/YYYY
 * @param locale - Optional locale for number formatting (ar for Arabic numerals)
 */
function formatDateToDDMMYYYY(timestamp: string | number, locale?: string): string {
  const date = new Date(
    typeof timestamp === 'string' ? parseInt(timestamp) * 1000 : timestamp * 1000,
  );
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formatted = `${day}/${month}/${year}`;

  // Convert to Arabic numerals if locale is 'ar'
  return locale === 'ar' ? toArabicNumerals(formatted) : formatted;
}

function getHighlightRoute(title: string): string | undefined {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('ip agents') || titleLower.includes('ip agent')) {
    return ROUTES.RESOURCES.IP_LICENSING.IP_AGENTS.ROOT;
  }
  if (titleLower.includes('ip academy') || titleLower.includes('academy')) {
    return ROUTES.SERVICES.IP_ACADEMY;
  }
  if (titleLower.includes('gazette')) {
    return ROUTES.RESOURCES.TOOLS_AND_RESEARCH.GAZZETE.ROOT;
  }

  return undefined;
}

// Types matching actual page.tsx component props
export interface HomepageData {
  hero: {
    heading: string;
    subheading: string;
    videos?: Array<{ id: string; url: string; title?: string }>;
    currentIndex?: number;
  };
  about: {
    heading: string;
    text: string;
    image: string;
  };
  services: {
    heading: string;
    text: string | React.ReactNode;
  };
  featuredNews: {
    title: string;
    text: string | React.ReactNode;
    buttonLabel?: string; // ✅ NEW: Editable button label from Drupal
    currentIndex?: number;
    items?: Array<{
      id: string;
      title: string;
      excerpt: string;
      image: string;
      publishData: string;
      categories: Array<{ id: string; name: string }>;
    }>;
  };
  highlights: {
    heading: string;
    text: string;
    highlights: Array<{
      id: string;
      title: string;
      description: string;
      icon: React.ReactElement;
      buttonHref?: string;
      url?: string;
    }>;
  };
  lastModifiedDate: string;
}

/**
 * Fetch homepage content (matches actual Drupal Content Type)
 */
export async function fetchHomepage(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // Include all valid relationship fields
  // Valid relationships: field_about_image, field_featured_news_items, field_hero_videos, field_highlight_items
  const includeFields = [
    'field_about_image',
    'field_about_image.field_media_image',
    'field_hero_videos',
    'field_hero_videos.field_media_video_file',
    'field_featured_news_items',
    'field_featured_news_items.field_image',
    'field_featured_news_items.field_image.field_media_image',
    'field_featured_news_items.field_news_categories',
    'field_highlight_items',
    'field_highlight_items.field_icon',
    'field_highlight_items.field_icon.field_media_image',
    'field_highlight_items.field_highlight_icon',
  ];

  // Build query string manually since fetchDrupal only takes endpoint string
  const includeString = includeFields.join(',');
  const searchParams = new URLSearchParams({
    'filter[status]': '1',
    include: includeString,
  });

  const endpoint = `/node/homepage?${searchParams.toString()}`;

  // Use fetchDrupal with complete endpoint URL
  const response = await fetchDrupal(endpoint, {}, locale);

  // Return both data and included for processing
  return { nodes: response.data, included: response.included || [] };
}

/**
 * Transform Drupal homepage node to HomepageData (matches page.tsx)
 */
export function transformHomepage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): HomepageData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  // Transform hero section
  const heroVideos = getRelated(rels, 'field_hero_videos', filteredIncluded) || [];

  // I don't know why but i got emojies from drupal
  const removeEmojis = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .trim();
  };

  const hero = {
    heading: removeEmojis(extractText(attrs.field_hero_heading) || ''),
    subheading: removeEmojis(extractText(attrs.field_hero_subheading) || ''),
    videos: Array.isArray(heroVideos)
      ? heroVideos.map((video: any, index: number) => {
          // Try different URL extraction methods for video
          const videoUrl =
            video.attributes?.uri?.url ||
            video.attributes?.field_media_video_file?.meta?.url ||
            video.attributes?.field_media_video_file?.data?.attributes?.uri?.url ||
            getImageUrl(
              getRelated(
                video.relationships || {},
                'field_media_video_file',
                filteredIncluded,
              ) as any,
              filteredIncluded,
            ) ||
            `/videos/hero-${index + 1}.mp4`;

          // Route video through proxy to avoid Mixed Content (HTTPS frontend + HTTP backend).
          // For /sites/default/files/ paths, use the proxy; otherwise build absolute URL.
          let finalVideoUrl: string;
          if (
            videoUrl.startsWith('/sites/default/files/') ||
            (videoUrl.startsWith('http') && videoUrl.includes('/sites/default/files/'))
          ) {
            finalVideoUrl = getProxyUrl(videoUrl.startsWith('/') ? videoUrl : videoUrl, 'view');
          } else if (videoUrl.startsWith('/')) {
            finalVideoUrl = `${getApiUrl().replace('/jsonapi', '')}${videoUrl}`;
          } else {
            finalVideoUrl = videoUrl;
          }

          return {
            id: `video-${index}`,
            url: finalVideoUrl,
            title: video.attributes?.title || '',
          };
        })
      : [],
  };

  // Transform about section
  // Use non-filtered 'included' to find media entity (media entities may not have langcode or be shared)
  const aboutImageRel = getRelated(rels, 'field_about_image', included); // Use full included, not filtered
  const aboutImageUrl = aboutImageRel
    ? getImageUrl(aboutImageRel as any, included) // Use non-filtered included for file entities
    : null;

  const about = {
    heading: attrs.field_about_heading || 'About SAIP',
    text:
      extractText(attrs.field_about_text) ||
      "SAIP aims to guide, protect, manage and enforce beneficiaries' IP in the Kingdom in line with international best practices.",
    image: aboutImageUrl && aboutImageUrl !== '' ? aboutImageUrl : '/images/photo-container.png',
  };

  // Transform services section (HTML allowed: line breaks, links, etc.)
  const services = {
    heading: attrs.field_services_heading || 'Main IP Services',
    text: extractHtml(attrs.field_services_text) || 'Main IP Services content',
  };

  // Transform featured news section
  const newsItems = getRelated(rels, 'field_featured_news_items', filteredIncluded) || [];

  const featuredNews = {
    title: attrs.field_news_title || 'Featured news',
    text: extractText(attrs.field_news_text) || 'Stay informed with the latest updates from SAIP',
    buttonLabel: extractText(attrs.field_featured_news_btn_label), // ✅ NEW: Button label (undefined = fallback to i18n)
    items: Array.isArray(newsItems)
      ? newsItems.map((item, index) => {
          const newsItem = item as DrupalNewsItem;

          // Get related categories and transform them
          const relatedCategories =
            getRelated(newsItem.relationships || {}, 'field_news_categories', filteredIncluded) ||
            [];

          const categories = Array.isArray(relatedCategories)
            ? relatedCategories.map((cat) => {
                const taxItem = cat as DrupalTaxonomyEntity;
                return {
                  id:
                    taxItem.attributes?.drupal_internal__tid?.toString() ||
                    Math.random().toString(),
                  name: taxItem.attributes?.name || '',
                };
              })
            : [];

          // Get image - use non-filtered 'included' because file entities don't have langcode
          const imageMedia = getRelated(
            newsItem.relationships || {},
            'field_image',
            included, // Use non-filtered included for media/file entities
          ) as any;

          const rawImageUrl = getImageUrl(imageMedia, included)?.trim();
          const looksLikeImage =
            rawImageUrl &&
            (rawImageUrl.startsWith('/') || rawImageUrl.startsWith('http')) &&
            (rawImageUrl.includes('/files/') ||
              rawImageUrl.includes('/sites/default/files/') ||
              rawImageUrl.includes('default/files') ||
              /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(rawImageUrl));
          const imageUrl = looksLikeImage ? rawImageUrl : '/images/photo-container.png';

          const transformedItem = {
            id: newsItem.attributes?.drupal_internal__nid?.toString() || Math.random().toString(),
            title: newsItem.attributes?.field_title || newsItem.attributes?.title || '',
            excerpt: extractText(newsItem.attributes?.field_excerpt) || '',
            image: imageUrl,
            publishData: newsItem.attributes?.field_publish_date || '',
            categories,
          };

          return transformedItem;
        })
      : [],
  };

  // Transform highlights section
  const highlightItems = getRelated(rels, 'field_highlight_items', filteredIncluded) || [];

  const highlights = {
    heading: attrs.field_highlights_heading || 'Highlights',
    text:
      extractText(attrs.field_highlights_text) ||
      'Discover key sections of the SAIP website and access essential services, regulations, and resources designed to support and protect IP',
    highlights: Array.isArray(highlightItems)
      ? highlightItems.map((item, index) => {
          const highlightItem = item as DrupalHighlightItem;

          // Priority: field_highlight_icon (file field) > field_icon (media field) > fallback
          let iconUrl: string | null = null;

          // 1. Try field_highlight_icon (direct file field)
          const fileRel = highlightItem.relationships?.field_highlight_icon;
          if (fileRel?.data) {
            const fileData = Array.isArray(fileRel.data) ? fileRel.data[0] : fileRel.data;
            if (fileData?.id) {
              const fileEntity = included.find(
                (inc) => inc.type === 'file--file' && inc.id === fileData.id,
              );
              if (fileEntity?.attributes) {
                const uri = (fileEntity.attributes as any).uri;
                if (uri?.url) {
                  iconUrl = getApiUrl() + uri.url;
                }
              }
            }
          }

          // 2. Fallback to field_icon (media field) - use non-filtered 'included' for files
          if (!iconUrl) {
            const iconData = getRelated(
              highlightItem.relationships || {},
              'field_icon',
              included, // Use non-filtered included for media/file entities
            );
            const iconMedia = Array.isArray(iconData) ? iconData[0] : iconData;
            iconUrl = getImageUrl(iconData as any, included); // Use non-filtered included for files
          }

          // Extract button href from Drupal field (string field type)
          const buttonHref = (highlightItem.attributes as any)?.field_button_href || '';
          // Remove 'internal:' prefix if present
          const cleanButtonHref = buttonHref.replace(/^internal:/, '');

          // Extract button label - use field_button_label if exists, otherwise use title
          const buttonLabel =
            (highlightItem.attributes as any)?.field_button_label ||
            highlightItem.attributes?.field_title ||
            highlightItem.attributes?.title ||
            '';

          const safeIconUrl = iconUrl ? getProxyUrl(iconUrl, 'view') : null;

          return {
            id: (highlightItem.attributes?.drupal_internal__nid || Math.random()).toString(),
            title: highlightItem.attributes?.field_title || highlightItem.attributes?.title || '',
            description: extractText(highlightItem.attributes?.field_description) || '',
            icon: (() => {
              // Return React element instead of string
              const effectiveIconUrl = safeIconUrl?.includes('/api/')
                ? '/icons/highlights/agent.svg'
                : safeIconUrl || '/icons/highlights/agent.svg';
              return React.createElement('img', {
                src: effectiveIconUrl,
                alt: '',
                className: 'w-6 h-6',
                'aria-hidden': 'true',
              });
            })(),
            buttonLabel: buttonLabel,
            // Use Drupal field_button_href if available, otherwise fallback to getHighlightRoute
            buttonHref:
              cleanButtonHref ||
              getHighlightRoute(
                highlightItem.attributes?.field_title || highlightItem.attributes?.title || '',
              ),
          };
        })
      : [],
  };

  // Format last modified date from changed timestamp
  const lastModifiedDate = attrs.changed
    ? formatDateToDDMMYYYY(attrs.changed, locale)
    : formatDateToDDMMYYYY(Date.now() / 1000, locale);

  return {
    hero,
    about,
    services,
    featuredNews,
    highlights,
    lastModifiedDate,
  };
}

/**
 * Get fallback data using existing dummyCms data
 */
export function getHomepageFallbackData(locale?: string): HomepageData {
  return {
    hero: {
      heading: '',
      subheading: '',
      videos: [
        {
          id: '1',
          url: '/videos/homepage.mp4',
          title: 'Saudi Authority for Intellectual Property',
        },
      ],
    },
    about: {
      heading: 'About SAIP',
      text: "SAIP aims to guide, protect, manage and enforce beneficiaries' IP in the Kingdom in line with international best practices.",
      image: '/images/photo-container.png',
    },
    services: {
      heading: 'Main IP Services',
      text: '<p>Intellectual property is the set of rights that protect human innovations and creations.</p><p>At SAIP, through a wide range of services, we take care of IPs in multiple stages from guidance, protection, management to enforcement.</p><p>Learn more about our Main IP Services:</p>',
    },
    featuredNews: {
      title: 'Featured news',
      text: 'Stay informed with the latest updates from the SAIP including key announcements, policy changes, initiatives, and developments in the IP sector.',
      items: [],
    },
    highlights: {
      heading: 'Highlights',
      text: 'Discover key sections of the SAIP website and access essential services, regulations, and resources designed to support and protect IP',
      highlights: [], // This will be filled from allHighlights in the page component
    },
    lastModifiedDate: formatDateToDDMMYYYY(Date.now() / 1000, locale),
  };
}

/**
 * Get complete homepage data (with fallback)
 */
export async function getHomepagePageData(locale?: string): Promise<HomepageData> {
  try {
    // FIRST: Try our main method with includes
    try {
      const homepageResult = await fetchHomepage(locale);
      const node = homepageResult.nodes[0];

      if (node) {
        const fieldAttrs = Object.keys(node.attributes || {}).filter((k) => k.startsWith('field_'));
        fieldAttrs.forEach((key) => {
          const value = (node.attributes as any)[key];
          if (value && value !== null) {
            void key;
          } else {
            void key;
          }
        });

        if (node.relationships) {
          Object.keys(node.relationships)
            .filter((k) => k.startsWith('field_'))
            .forEach((key) => {
              const rel = node.relationships![key];
              if (rel?.data) {
                if (Array.isArray(rel.data)) {
                  void key;
                } else {
                  void key;
                }
              } else {
                void key;
              }
            });
        }

        const includedTypes: Record<string, number> = {};
        homepageResult.included?.forEach((item) => {
          includedTypes[item.type] = (includedTypes[item.type] || 0) + 1;
        });

        // Pass the included entities to transform
        const result = transformHomepage(node, homepageResult.included, locale);
        return result;
      }
    } catch (error) {
      console.error('❌ [HOMEPAGE ERROR]:', error);
      // Continue to fallback logic
    }

    // FALLBACK: Try different content type names based on what exists in Drupal
    const possibleEndpoints = [
      '/node/homepage',
      '/node/home_page',
      '/node/page',
      '/node/article', // Use Article as homepage
      '/node/about_saip', // Use About SAIP as homepage
    ];

    let response;
    let lastError;

    for (const endpoint of possibleEndpoints) {
      try {
        response = await fetchDrupal(endpoint, {}, locale);
        break;
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    if (!response) {
      throw lastError || new Error('All endpoints failed');
    }

    const node = response.data?.[0];
    if (!node) {
      throw new Error('Homepage not found');
    }

    const result = transformHomepage(node, response.included || [], locale);
    return result;
  } catch (error) {
    // Return fallback data structure matching fallback data
    return getHomepageFallbackData(locale);
  }
}
