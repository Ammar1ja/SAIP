/**
 * National IP Strategy Service
 * Handles data fetching and transformation for National IP Strategy page
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  getImageUrl,
  extractText,
  filterIncludedByLangcode,
  getProxyUrl,
  getApiUrl,
} from '../utils';
import {
  DrupalNode,
  DrupalIncludedEntity,
  DrupalStrategyObjectiveItem,
  DrupalNationalPillarItem,
} from '../types';

// Frontend interfaces
export interface NationalIPStrategyData {
  hero: {
    heading: string;
    subheading: string;
    backgroundImage: string;
  };
  about: {
    heading: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
  };
  objectives: {
    heading: string;
    text: string;
    items: Array<{
      id: string;
      description: string;
      icon: string;
    }>;
  };
  pillars: {
    heading: string;
    text: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      image: {
        src: string;
        alt: string;
      };
    }>;
  };
  document: {
    heading: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
    buttons: Array<{
      label: string;
      href: string;
      ariaLabel: string;
      icon: string;
      intent: 'primary' | 'secondary';
      download?: boolean | string;
      target?: string;
    }>;
  };
  news: {
    heading: string;
    text: string;
    articles: any[]; // Will be filled from news service
  };
}

/**
 * Fetch National IP Strategy content
 */
export async function fetchNationalIPStrategy(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // ✅ FIXED: Use actual field names from Drupal API
  // Based on API error: Possible values: field_document_file, field_document_image,
  // field_image, field_national_ip_pillars, field_strategy_objectives
  const includeFields = [
    'field_hero_background_image', // ✅ Hero background image
    'field_hero_background_image.field_media_image', // ✅ Nested image file
    'field_image', // ✅ About image
    'field_image.field_media_image',
    'field_strategy_objectives', // ✅ EXISTS in API!
    'field_strategy_objectives.field_icon', // ✅ Objective icons (media reference)
    'field_strategy_objectives.field_icon.field_media_image', // ✅ Nested image file
    'field_national_ip_pillars', // ✅ EXISTS in API
    'field_national_ip_pillars.field_image',
    'field_national_ip_pillars.field_image.field_media_image',
    'field_document_image',
    'field_document_image.field_media_image',
    'field_secondary_button_file', // ✅ Direct file reference (like Guide Items)
    'field_news_items', // ✅ Latest news items
    'field_news_items.field_image',
    'field_news_items.field_image.field_media_image',
  ];

  const includeString = includeFields.join(',');
  const searchParams = new URLSearchParams({
    'filter[status]': '1',
    include: includeString,
  });

  const endpoint = `/node/national_ip_strategy?${searchParams.toString()}`;

  console.log('🔍 [NAT-IP FETCH DEBUG] Request:', {
    endpoint: endpoint.substring(0, 120) + '...',
    includeFieldsCount: includeFields.length,
  });

  const response = await fetchDrupal(endpoint, {}, locale);

  console.log('🔍 [NAT-IP FETCH DEBUG] Response:', {
    dataCount: response.data?.length || 0,
    includedCount: response.included?.length || 0,
  });

  if (response.data && response.data.length > 0) {
    return { nodes: response.data, included: response.included || [] };
  }

  throw new Error('No National IP Strategy content found');
}

/**
 * Transform Drupal data to frontend format
 */
export function transformNationalIPStrategy(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): NationalIPStrategyData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // ✅ Filter included entities by langcode to get correct translations
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  // ⚠️ For articles/news, use filtered. For everything else (pillars, objectives, images), use original.
  // This is because pillars may not have translations, and we want to show EN as fallback.
  const effectiveIncludedForNews = filteredIncluded.length > 0 ? filteredIncluded : included;

  console.log(
    `🔍 NATIONAL IP STRATEGY TRANSFORM: nodeLangcode=${nodeLangcode}, filtered=${filteredIncluded.length}, original=${included.length}`,
  );

  // Hero section
  // ✅ FIXED: field_hero_background_image now included in API fetch
  const heroImageUrl =
    getImageUrl(
      getRelated(rels, 'field_hero_background_image', included) as DrupalIncludedEntity,
      included,
    ) || '/images/national-ip-strategy/about-nipst.jpg'; // Fallback if not set in CMS

  // About section
  // ✅ FIXED: was field_about_image
  const aboutImage = getImageWithAlt(getRelated(rels, 'field_image', included) as any, included);

  // Objectives
  // ✅ field_strategy_objectives EXISTS in API!
  const objectivesItems = getRelated(rels, 'field_strategy_objectives', included) || [];
  const objectives = Array.isArray(objectivesItems)
    ? objectivesItems.map((item) => {
        const objItem = item as DrupalStrategyObjectiveItem;

        // Get icon from media entity (not from attributes!)
        const iconData = getRelated((objItem as any).relationships || {}, 'field_icon', included);
        const iconUrl = iconData ? getImageUrl(iconData as any, included) : undefined;
        const safeIconUrl = iconUrl ? getProxyUrl(iconUrl, 'view') : undefined;

        return {
          id: (objItem.attributes?.drupal_internal__nid || Math.random()).toString(),
          description:
            extractText(objItem.attributes?.field_description) ||
            extractText(objItem.attributes?.body) ||
            '',
          icon: safeIconUrl || '/icons/objectives/innovation.svg', // Fallback to hardcoded icon
        };
      })
    : [];

  // Pillars
  // ✅ field_national_ip_pillars EXISTS in API!
  const pillarsItems = getRelated(rels, 'field_national_ip_pillars', included) || [];
  const pillars = Array.isArray(pillarsItems)
    ? pillarsItems.map((item) => {
        const pillarItem = item as DrupalNationalPillarItem;
        const pillarImage = getImageWithAlt(
          getRelated((pillarItem as any).relationships || {}, 'field_image', included) as any,
          included,
        );

        return {
          id: (pillarItem.attributes?.drupal_internal__nid || Math.random()).toString(),
          title: pillarItem.attributes?.field_title || pillarItem.attributes?.title || '',
          description:
            extractText(pillarItem.attributes?.field_description) ||
            extractText(pillarItem.attributes?.body) ||
            '',
          image: {
            src: pillarImage.src || '/images/national-ip-strategy/photo-container.jpg',
            alt: pillarImage.alt || 'Pillar illustration',
          },
        };
      })
    : [];

  // Document section
  const documentImage = getImageWithAlt(
    getRelated(rels, 'field_document_image', included) as any,
    included,
  );

  // Get file URL from field_secondary_button_file (direct file reference, like Guide Items)
  let rawFileUrl: string | undefined;
  if (rels.field_secondary_button_file) {
    const fileEntity = getRelated(rels, 'field_secondary_button_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        // ✅ CRITICAL FIX: Use getApiUrl() instead of process.env for correct environment URLs
        const drupalBaseUrl = getApiUrl().replace('/jsonapi', '');
        rawFileUrl = uri.startsWith('http') ? uri : `${drupalBaseUrl}${uri}`;
        console.log(`📄 [NATIONAL-IP-STRATEGY] File URL: ${rawFileUrl}`);
      }
    }
  }

  // Show file: use PROXY URL with action=view (opens inline in browser)
  const viewUrl = getProxyUrl(rawFileUrl, 'view');
  // Download file: use PROXY URL with action=download (forces download)
  const downloadUrl = getProxyUrl(rawFileUrl, 'download');

  return {
    hero: {
      heading: extractText(attrs.field_hero_heading) || 'National IP Strategy',
      subheading:
        extractText(attrs.field_hero_subheading) ||
        'The National IP Strategy is a comprehensive plan that aims to foster innovation.',
      backgroundImage: heroImageUrl, // Fallback already applied above
    },
    about: {
      heading: attrs.field_about_heading || 'About NIPST',
      description:
        extractText(attrs.field_about_text || attrs.field_about_description) ||
        'In line with Vision 2030 directions.',
      image: {
        src: aboutImage.src || '/images/national-ip-strategy/about-nipst.jpg',
        alt: aboutImage.alt || 'About NIPST',
      },
    },
    objectives: {
      heading: attrs.field_objectives_heading || 'National strategy objectives',
      text: extractText(attrs.field_objectives_text) || '',
      items: objectives,
    },
    pillars: {
      heading: attrs.field_pillars_heading_strategy || 'National pillars',
      text: extractText(attrs.field_pillars_text_strategy) || '',
      items: pillars,
    },
    document: {
      heading: attrs.field_document_heading || 'National IP strategy document',
      description: extractText(attrs.field_document_description) || '',
      image: {
        src: documentImage.src || '/images/national-ip-strategy/ip-document.jpg',
        alt: documentImage.alt || 'National IP Strategy document',
      },
      buttons: [
        {
          label: 'Show file',
          href: viewUrl, // RAW URL - browser can display preview
          ariaLabel: 'View National IP Strategy document',
          icon: '/icons/eye.svg',
          intent: 'secondary',
          target: '_blank', // Open in new tab for preview
        },
        {
          label: 'Download file',
          href: downloadUrl, // PROXY URL - forces download via Content-Disposition header
          ariaLabel: 'Download National IP Strategy document',
          icon: '/icons/download.svg',
          intent: 'primary',
          download: true, // Additional download hint (proxy already forces it)
        },
      ],
    },
    news: {
      heading: attrs.field_news_heading || 'Latest news',
      text:
        extractText(attrs.field_news_text) ||
        'Stay informed with the latest updates from the SAIP.',
      articles: (() => {
        // Get news items from relationships (use filtered for correct language)
        const newsItems = getRelated(rels, 'field_news_items', effectiveIncludedForNews) || [];
        if (!Array.isArray(newsItems)) return [];

        console.log(`📰 NEWS ITEMS: found ${newsItems.length} articles (locale: ${nodeLangcode})`);

        return newsItems.map((item: any) => {
          const newsAttrs = item.attributes || {};
          const newsRels = item.relationships || {};

          // Get image - use non-filtered 'included' because media/file entities don't have langcode
          const imageMedia = getRelated(newsRels, 'field_image', included) as any;
          const imageUrl = imageMedia
            ? getImageUrl(imageMedia, included) // Use non-filtered included for file entities
            : undefined;

          const rawDate = newsAttrs.field_date || newsAttrs.created || '';

          // Get category with locale fallback
          const itemLangcode = newsAttrs.langcode || nodeLangcode;
          let categoryName = extractText(newsAttrs.field_category);

          // If field_category is empty, use locale-specific fallback based on title keywords
          if (!categoryName) {
            const title = (newsAttrs.title || '').toLowerCase();
            if (itemLangcode === 'ar') {
              // Arabic fallback
              categoryName =
                title.includes('إرشادات') || title.includes('دليل') ? 'إعلان' : 'أخبار';
            } else {
              // English fallback
              categoryName =
                title.includes('guideline') || title.includes('guide') ? 'Announcement' : 'News';
            }
            console.log(
              `📝 Article ${item.id}: Using fallback category "${categoryName}" for locale ${itemLangcode}`,
            );
          }

          return {
            // Use NID for routing to /media-center/.../[id] pages.
            id:
              newsAttrs.drupal_internal__nid?.toString() ||
              newsAttrs.nid?.toString() ||
              item.id ||
              String(Math.random()),
            title: newsAttrs.title || '',
            excerpt: extractText(newsAttrs.field_summary) || extractText(newsAttrs.body) || '',
            publishData: rawDate, // ✅ Return raw date, format in component with i18n
            categories: [
              {
                id: '1',
                name: categoryName,
              },
            ],
            image: imageUrl || '/images/photo-container.png',
          };
        });
      })(),
    },
  };
}

/**
 * Get National IP Strategy data with fallback
 */
export async function getNationalIPStrategyData(locale?: string): Promise<NationalIPStrategyData> {
  try {
    try {
      const { nodes, included } = await fetchNationalIPStrategy(locale);

      console.log('🔍 [NAT-IP DEBUG] =================================');
      console.log('📦 Raw API Response:');
      console.log('  - Nodes count:', nodes?.length || 0);
      console.log('  - Included count:', included?.length || 0);

      if (nodes.length === 0) {
        throw new Error('No National IP Strategy content found');
      }

      const node = nodes[0];

      console.log('📄 Node Details:');
      console.log('  - Title:', node.attributes?.title);
      console.log('  - NID:', node.attributes?.drupal_internal__nid);
      console.log('  - Type:', node.type);

      console.log('🎯 Node Attributes (fields):');
      const fieldAttrs = Object.keys(node.attributes || {}).filter((k) => k.startsWith('field_'));
      fieldAttrs.forEach((key) => {
        const value = (node.attributes as any)[key];
        if (
          value &&
          value !== null &&
          value !== '' &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          console.log(
            `  - ${key}:`,
            typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value,
          );
        } else {
          console.log(`  - ${key}: NULL/EMPTY`);
        }
      });

      console.log('🔗 Relationships:');
      if (node.relationships) {
        Object.keys(node.relationships)
          .filter((k) => k.startsWith('field_'))
          .forEach((key) => {
            const rel = node.relationships![key];
            if (rel?.data) {
              if (Array.isArray(rel.data)) {
                console.log(`  - ${key}: ${rel.data.length} items`);
              } else {
                console.log(`  - ${key}: ${rel.data.type}`);
              }
            } else {
              console.log(`  - ${key}: NULL/EMPTY`);
            }
          });
      }

      console.log('📦 Included Entities:');
      const includedTypes: Record<string, number> = {};
      included?.forEach((item) => {
        includedTypes[item.type] = (includedTypes[item.type] || 0) + 1;
      });
      Object.entries(includedTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} items`);
      });

      const result = transformNationalIPStrategy(node, included);

      console.log('✅ Transformed Result:');
      console.log('  - Hero heading:', result.hero.heading);
      console.log('  - Hero background:', result.hero.backgroundImage?.substring(0, 50));
      console.log('  - About heading:', result.about.heading);
      console.log('  - About image:', result.about.image?.src?.substring(0, 50));
      console.log('  - Objectives items:', result.objectives.items?.length || 0);
      console.log('  - Pillars items:', result.pillars.items?.length || 0);
      console.log('  - Document image:', result.document.image?.src?.substring(0, 50));
      console.log('🔍 [NAT-IP DEBUG END] ===========================');

      console.log(`✅ NATIONAL IP STRATEGY: Using Drupal data (${locale || 'en'})`);
      return result;
    } catch (error) {
      console.error('❌ [NAT-IP ERROR]:', error);
      throw error;
    }
  } catch (error) {
    console.log(
      `🔴 NATIONAL IP STRATEGY: Error (${locale || 'en'}), using fallback in integration layer`,
    );
    throw error; // Let integration layer handle fallback
  }
}
