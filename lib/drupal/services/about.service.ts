/**
 * About SAIP Service
 * Functional API for fetching and transforming About SAIP content from Drupal
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  getImageUrl,
  extractText,
  filterIncludedByLangcode,
} from '../utils';
import {
  DrupalNode,
  DrupalIncludedEntity,
  DrupalValueItem,
  DrupalRoleItem,
  DrupalPillarItem,
} from '../types';

// Types matching actual about page component props
export interface AboutPageData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  mission: {
    title?: string; // ✅ NEW: Editable title from Drupal
    text: string;
  };
  vision: {
    title?: string; // ✅ NEW: Editable title from Drupal
    text: string;
  };
  values: {
    heading: string;
    text: string;
    items?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  ceoSpeech: {
    title: string;
    quote: string;
    image: {
      src: string;
      alt: string;
    };
    caption: string;
    captionHighlight: string;
    description: string[];
  };
  roles: {
    heading: string;
    text: string;
    items?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  pillars: {
    heading: string;
    text: string;
    pillars: Array<{
      id: string;
      title: string;
      description: string;
      number: number;
    }>;
  };
}

/**
 * Fetch About content with includes for related entities
 */
export async function fetchAbout(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // INCLUDE RELATED ENTITIES for complete data
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_image', // CEO image
    'field_image.field_media_image',
    'field_values_items', // Values items
    'field_values_items.field_icon', // Values icons
    'field_values_items.field_icon.field_media_image',
    'field_roles_items', // Roles items
    'field_roles_items.field_icon', // Roles icons
    'field_roles_items.field_icon.field_media_image',
    'field_pillars_items',
  ];

  const includeString = includeFields.join(',');
  const searchParams = new URLSearchParams({
    'filter[status]': '1',
    include: includeString,
  });

  const endpoint = `/node/about?${searchParams.toString()}`;

  console.log('🔍 [ABOUT FETCH DEBUG] Request:', {
    endpoint: endpoint.substring(0, 100) + '...',
    includeFieldsCount: includeFields.length,
  });

  const response = await fetchDrupal(endpoint, {}, locale);

  console.log('🔍 [ABOUT FETCH DEBUG] Response:', {
    dataCount: response.data?.length || 0,
    includedCount: response.included?.length || 0,
  });

  if (response.data && response.data.length > 0) {
    return { nodes: response.data, included: response.included || [] };
  }

  throw new Error('No About content found');
}

/**
 * Transform Drupal about node to AboutPageData
 */
export function transformAbout(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): AboutPageData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // ✅ CRITICAL FIX: Filter included entities to match node's langcode
  // API returns ALL language versions, we need only the correct one
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  console.log(
    '🌍 [TRANSFORM] Node langcode:',
    nodeLangcode,
    '| Filtered included:',
    filteredIncluded.length,
    '/',
    included.length,
  );

  // Transform hero section
  // ✅ For media (images), use original included - media has no langcode so it works for both languages
  const heroImageUrl = getImageUrl(
    getRelated(rels, 'field_hero_background_image', included) as DrupalIncludedEntity,
    included,
  );
  const hero = {
    title: extractText(attrs.field_hero_heading) || 'About SAIP',
    description:
      extractText(attrs.field_description) ||
      'SAIP aims to regulate, support, develop, sponsor, protect, enforce and upgrade the fields of intellectual property in Saudi Arabia in accordance with international best practices.',
    backgroundImage: heroImageUrl || '/images/about/hero.jpg',
  };

  // Transform mission & vision
  // ✅ NEW: Include title fields (translatable, editable in CMS)
  const mission = {
    title: extractText(attrs.field_mission_title), // Can be undefined (fallback to i18n)
    text: extractText(attrs.field_mission_text) || 'Our mission from Drupal...',
  };

  const vision = {
    title: extractText(attrs.field_vision_title), // Can be undefined (fallback to i18n)
    text: extractText(attrs.field_vision_text) || 'Our vision from Drupal...',
  };

  // Transform values section
  // ✅ FIX: For value_items, use original included (not filtered) to support fallback
  // If AR translation doesn't exist, fall back to EN version
  const valuesItemsRaw = getRelated(rels, 'field_values_items', included) || [];
  const valuesItems = Array.isArray(valuesItemsRaw)
    ? valuesItemsRaw.map((item) => {
        const itemLangcode = (item as any).attributes?.langcode;
        // If item langcode matches target, use it; otherwise try to find translated version
        if (itemLangcode !== nodeLangcode) {
          // Try to find translated version by NID
          const nid = (item as any).attributes?.drupal_internal__nid;
          if (nid) {
            const translatedVersion = included.find(
              (inc) =>
                inc.type === 'node--value_item' &&
                (inc.attributes as any)?.drupal_internal__nid === nid &&
                (inc.attributes as any)?.langcode === nodeLangcode,
            );
            if (translatedVersion) return translatedVersion;
          }
        }
        return item; // Use original if no translation found (fallback)
      })
    : [];

  const values = {
    heading: attrs.field_values_heading || 'Our Values',
    text: extractText(attrs.field_values_text) || 'Our core values guide everything we do.',
    items: Array.isArray(valuesItems)
      ? valuesItems.map((item) => {
          // ✅ For media (icons), use original included - media has no langcode so it works for both languages
          const iconUrl = getImageUrl(
            getRelated((item as any).relationships || {}, 'field_icon', included) as any,
            included,
          );
          const itemAttrs = (item as any).attributes || {};

          const description =
            extractText(itemAttrs.body) ||
            extractText(itemAttrs.field_description) ||
            extractText(itemAttrs.field_text) ||
            '';

          return {
            id: (itemAttrs.drupal_internal__nid || Math.random()).toString(),
            title: itemAttrs.title || '',
            description: description,
            icon: iconUrl || '/icons/highlights/agent.svg',
          };
        })
      : [],
  };

  // Transform CEO speech
  // ✅ For media (images), use original included - media has no langcode so it works for both languages
  const ceoImage = getImageWithAlt(getRelated(rels, 'field_image', included) as any, included);

  // ✅ FIX: Split CEO description into paragraphs
  // field_ceo_description is HTML field, need to split by <p> tags
  const ceoDescriptionRaw = attrs.field_ceo_description;
  let ceoDescriptionParagraphs: string[] = [];

  if (ceoDescriptionRaw) {
    // Check if it's Drupal text field format (array with processed/value)
    if (Array.isArray(ceoDescriptionRaw) && ceoDescriptionRaw[0]) {
      const htmlContent = ceoDescriptionRaw[0].processed || ceoDescriptionRaw[0].value || '';

      // Split by <p> tags and clean up (use [\s\S] instead of . with s flag for ES5 compatibility)
      const paragraphMatches = htmlContent.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
      if (paragraphMatches && paragraphMatches.length > 0) {
        ceoDescriptionParagraphs = paragraphMatches
          .map((p: string) =>
            p
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .trim(),
          )
          .filter((p: string) => p.length > 0); // Remove empty paragraphs
      } else {
        // Fallback: split by double newlines
        const plainText = extractText(ceoDescriptionRaw);
        ceoDescriptionParagraphs = plainText
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
      }
    } else if (typeof ceoDescriptionRaw === 'string') {
      // Plain string - split by double newlines
      ceoDescriptionParagraphs = ceoDescriptionRaw
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }
  }

  // Fallback if no paragraphs found
  if (ceoDescriptionParagraphs.length === 0) {
    ceoDescriptionParagraphs = [
      extractText(attrs.field_ceo_description) || 'CEO description from Drupal...',
    ];
  }

  const ceoSpeech = {
    title: attrs.field_ceo_title || 'CEO Speech',
    quote: extractText(attrs.field_ceo_quote) || 'Leadership quote from Drupal...',
    image: {
      src: ceoImage.src || '/images/ceo-speech.png',
      alt: ceoImage.alt || 'CEO Image',
    },
    caption: attrs.field_ceo_caption || 'Dr. Abdulaziz Al-Swailem',
    captionHighlight: attrs.field_ceo_caption_highlight || 'CEO of SAIP',
    description: ceoDescriptionParagraphs,
  };

  // Transform roles section
  const rolesItems = getRelated(rels, 'field_roles_items', filteredIncluded) || [];
  const roles = {
    heading: attrs.field_roles_heading || 'Our Roles',
    text: extractText(attrs.field_roles_text) || 'Our key roles and responsibilities.',
    items: Array.isArray(rolesItems)
      ? rolesItems.map((item) => {
          const roleAttrs = (item as any).attributes || {};
          // ✅ For media (icons), use original included - media has no langcode so it works for both languages
          const iconMedia = getRelated(
            (item as any).relationships || {},
            'field_icon',
            included,
          ) as any;
          const iconUrl = getImageUrl(iconMedia, included);

          return {
            id: (roleAttrs.drupal_internal__nid || Math.random()).toString(),
            // Use title as description if body is empty (common for role items)
            title: roleAttrs.title || '',
            description: extractText(roleAttrs.body) || roleAttrs.title || '',
            icon: iconUrl || '/icons/highlights/agent.svg',
          };
        })
      : [],
  };

  // Transform pillars section
  const pillarsItems = getRelated(rels, 'field_pillars_items', filteredIncluded) || [];
  const pillars = {
    heading: attrs.field_pillars_heading || 'Our Pillars',
    text:
      extractText(attrs.field_pillars_text) ||
      'Empowering a vital system for IP locally and globally.',
    pillars: Array.isArray(pillarsItems)
      ? pillarsItems.map((item) => ({
          id: ((item as any).attributes?.drupal_internal__nid || Math.random()).toString(),
          title: (item as any).attributes?.title || '',
          description: extractText((item as any).attributes?.body) || '',
          number: (item as any).attributes?.field_number || Math.random(),
        }))
      : [],
  };

  return {
    hero,
    mission,
    vision,
    values,
    ceoSpeech,
    roles,
    pillars,
  };
}

/**
 * Get fallback data using existing static data structure
 */
export function getAboutFallbackData(): AboutPageData {
  return {
    hero: {
      title: 'About SAIP',
      description:
        'SAIP aims to regulate, support, develop, sponsor, protect, enforce and upgrade the fields of intellectual property in Saudi Arabia in accordance with international best practices, and it is organizationally linked to the Prime Minister.',
      backgroundImage: '/images/about/hero.jpg',
    },
    mission: {
      title: undefined, // Will fallback to i18n 'Mission'
      text: 'Our mission is to regulate and support intellectual property development in Saudi Arabia.',
    },
    vision: {
      title: undefined, // Will fallback to i18n 'Vision'
      text: 'Our vision is to become a leading authority in intellectual property protection globally.',
    },
    values: {
      heading: 'Our Values',
      text: 'Our core values guide everything we do at SAIP.',
      items: [], // Will be filled from component data
    },
    ceoSpeech: {
      title: 'CEO Speech',
      quote: 'Leading innovation and protecting intellectual property for a prosperous future.',
      image: {
        src: '/images/ceo-speech.png',
        alt: 'CEO of SAIP',
      },
      caption: 'Dr. Abdulaziz Al-Swailem',
      captionHighlight: 'CEO of SAIP',
      description: [
        'Under the leadership of our CEO, SAIP continues to drive innovation and excellence in intellectual property protection.',
      ],
    },
    roles: {
      heading: 'Our Roles',
      text: 'We play crucial roles in developing and protecting intellectual property ecosystem.',
      items: [], // Will be filled from component data
    },
    pillars: {
      heading: 'Our Pillars',
      text: 'Empowering a vital system for IP locally and globally.',
      pillars: [], // Will be filled from existing pillarsData
    },
  };
}

/**
 * Get complete About page data (with fallback)
 */
export async function getAboutPageData(locale?: string): Promise<AboutPageData> {
  try {
    try {
      const aboutResult = await fetchAbout(locale);

      // ✅ FIX: Find node by langcode instead of taking first one
      const targetLocale = locale || 'en';
      const node =
        aboutResult.nodes?.find((n) => n.attributes?.langcode === targetLocale) ||
        aboutResult.nodes?.[0];

      console.log('🔍 [ABOUT DEBUG] =================================');
      console.log('📦 Raw API Response:');
      console.log('  - Nodes count:', aboutResult.nodes?.length || 0);
      console.log('  - Included count:', aboutResult.included?.length || 0);
      console.log('  - Target locale:', targetLocale);

      if (node) {
        console.log('📄 Node Details:');
        console.log('  - Title:', node.attributes?.title);
        console.log('  - Langcode:', (node.attributes as any).langcode);
        console.log('  - NID:', node.attributes?.drupal_internal__nid);
        console.log('  - Type:', node.type);

        console.log('🎯 Node Attributes (fields):');
        const fieldAttrs = Object.keys(node.attributes || {}).filter((k) => k.startsWith('field_'));
        fieldAttrs.forEach((key) => {
          const value = (node.attributes as any)[key];
          if (value && value !== null) {
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
        aboutResult.included?.forEach((item) => {
          includedTypes[item.type] = (includedTypes[item.type] || 0) + 1;
        });
        Object.entries(includedTypes).forEach(([type, count]) => {
          console.log(`  - ${type}: ${count} items`);
        });

        const result = transformAbout(node, aboutResult.included);

        console.log('✅ Transformed Result:');
        console.log('  - Hero title:', result.hero.title);
        console.log('  - Hero background:', result.hero.backgroundImage?.substring(0, 50));
        console.log('  - Mission text:', result.mission.text?.substring(0, 50));
        console.log('  - Vision text:', result.vision.text?.substring(0, 50));
        console.log('  - Values heading:', result.values.heading);
        console.log('  - Values items:', result.values.items?.length || 0);
        console.log('  - CEO title:', result.ceoSpeech.title);
        console.log('  - CEO image:', result.ceoSpeech.image?.src?.substring(0, 50));
        console.log('  - Roles items:', result.roles.items?.length || 0);
        console.log('  - Pillars items:', result.pillars.pillars?.length || 0);
        console.log('🔍 [ABOUT DEBUG END] ===========================');

        console.log(`🟢 ABOUT: Using Drupal data (${locale || 'en'}) ✅`);
        return result;
      }
    } catch (error) {
      console.error('❌ [ABOUT ERROR]:', error);
    }

    throw new Error('About content not found');
  } catch (error) {
    console.log(`🔴 ABOUT: Using fallback data (${locale || 'en'}) ❌`);
    // Return fallback data structure matching current static data
    return getAboutFallbackData();
  }
}
