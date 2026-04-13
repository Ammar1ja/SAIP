/**
 * Gazette Service
 * Handles data fetching and transformation for Gazette page
 */

import { fetchDrupal, getRelated, getImageWithAlt, extractText, extractHtml } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend data interfaces
export interface GazetteData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  ipGazette: {
    heading: string;
    text: string;
    buttonText: string;
    buttonHref: string;
    imageSrc: string;
    imageAlt: string;
  };
  ipNewspaper: {
    heading: string;
    text: string;
    buttonText: string;
    buttonHref: string;
    imageSrc: string;
    imageAlt: string;
  };
}

function extractLinkHref(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const maybe = value as { uri?: string; url?: string; value?: string };
    return maybe.uri || maybe.url || maybe.value;
  }
  return undefined;
}

function stripDownloadParams(href: string): string {
  if (!href.includes('?') && !href.includes('&')) return href;
  let cleaned = href
    .replace(/([?&])download=1(&|$)/gi, '$1')
    .replace(/([?&])action=download(&|$)/gi, '$1');
  cleaned = cleaned.replace(/[?&]$/, '');
  cleaned = cleaned.replace(/\?&/g, '?').replace(/&&/g, '&');
  return cleaned;
}

function normalizeGazetteButtonHref(rawHref: string | undefined, fallbackHref: string): string {
  if (!rawHref) return fallbackHref;
  const href = rawHref.trim();
  if (!href) return fallbackHref;

  const looksLikeFile =
    href.includes('/api/proxy-file') ||
    href.includes('/sites/default/files') ||
    /\.(pdf|docx?|xlsx?|pptx?|zip)$/i.test(href);

  if (looksLikeFile) {
    return fallbackHref;
  }

  return stripDownloadParams(href);
}

// Drupal API functions - 2-step UUID fetch pattern
async function fetchGazetteUuid(): Promise<string | null> {
  const endpoint = `/node/gazette_page?filter[status]=1&fields[node--gazette_page]=drupal_internal__nid`;
  const response = await fetchDrupal<DrupalNode>(endpoint);
  if (response.data && response.data.length > 0) {
    return response.data[0].id;
  }
  return null;
}

async function fetchGazetteByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_ip_gazette_image',
    'field_ip_gazette_image.field_media_image',
    'field_ip_newspaper_image',
    'field_ip_newspaper_image.field_media_image',
  ].join(',');

  const endpoint = `/node/gazette_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transformation functions
export function transformGazettePage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): GazetteData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero image from relationships
  const heroImageRel = getRelated(rels, 'field_hero_background_image', included);
  const heroImage =
    heroImageRel && !Array.isArray(heroImageRel)
      ? getImageWithAlt(heroImageRel, included)
      : undefined;

  // Get IP Gazette image from media entity reference
  const ipGazetteImageRel = getRelated(rels, 'field_ip_gazette_image', included);
  const ipGazetteImage =
    ipGazetteImageRel && !Array.isArray(ipGazetteImageRel)
      ? getImageWithAlt(ipGazetteImageRel, included)
      : undefined;

  // Get IP Newspaper image from media entity reference
  const ipNewspaperImageRel = getRelated(rels, 'field_ip_newspaper_image', included);
  const ipNewspaperImage =
    ipNewspaperImageRel && !Array.isArray(ipNewspaperImageRel)
      ? getImageWithAlt(ipNewspaperImageRel, included)
      : undefined;

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Gazette',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'This is the place to check for the latest updates on intellectual property in Saudi Arabia.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    ipGazette: {
      heading: attrs.field_ip_gazette_heading || 'IP gazette',
      text:
        extractHtml(attrs.field_ip_gazette_text) ||
        'The IP Gazette is your trusted source for all trademark-related updates.',
      buttonText: attrs.field_ip_gazette_button_text || 'Go to IP Gazette',
      buttonHref: normalizeGazetteButtonHref(
        extractLinkHref(attrs.field_ip_gazette_button_href),
        '/gazette/search-ip-gazette',
      ),
      imageSrc: ipGazetteImage?.src || '/images/gazette/ip-gazette.png',
      imageAlt: ipGazetteImage?.alt || 'Go to IP Gazette',
    },
    ipNewspaper: {
      heading: attrs.field_ip_newspaper_heading || 'IP newspaper',
      text:
        extractHtml(attrs.field_ip_newspaper_text) ||
        'The IP Newspaper provides comprehensive details of trademark applications.',
      buttonText: attrs.field_ip_newspaper_button_text || 'Go to IP Newspaper',
      buttonHref: normalizeGazetteButtonHref(
        extractLinkHref(attrs.field_ip_newspaper_button_href),
        '/gazette/search-ip-newspaper',
      ),
      imageSrc: ipNewspaperImage?.src || '/images/gazette/ip-newspaper.png',
      imageAlt: ipNewspaperImage?.alt || 'Go to IP Newspaper',
    },
  };
}

export function getGazetteFallbackData(): GazetteData {
  return {
    heroHeading: 'Gazette',
    heroSubheading:
      'This is the place to check for the latest updates on intellectual property in Saudi Arabia. Gazette gives you the opportunity to publish any changes to your IP.',
    heroImage: {
      src: '/images/gazette/hero.jpg',
      alt: 'Gazette',
    },
    ipGazette: {
      heading: 'IP gazette',
      text:
        'The IP Gazette is your trusted source for all trademark-related updates. ' +
        'Here, you will find details of trademark applications submitted on or after 19/12/2023, ' +
        "along with any subsequent changes to these records. Whether it's renewals, ownership " +
        'transfers, or modifications, the Gazette ensures you stay informed with the latest and ' +
        'most accurate trademark information.',
      buttonText: 'Go to IP Gazette',
      buttonHref: '/gazette/search-ip-gazette',
      imageSrc: '/images/gazette/ip-gazette.png',
      imageAlt: 'Go to IP Gazette',
    },
    ipNewspaper: {
      heading: 'IP newspaper',
      text:
        'The IP Newspaper provides comprehensive details of trademark applications submitted ' +
        'prior to 19/12/2023, along with any subsequent updates to these records. From renewals ' +
        'and ownership transfers to modifications, the IP Newspaper keeps you informed with the ' +
        'most accurate and up-to-date trademark information.',
      buttonText: 'Go to IP Newspaper',
      buttonHref: '/gazette/search-ip-newspaper',
      imageSrc: '/images/gazette/ip-newspaper.png',
      imageAlt: 'Go to IP Newspaper',
    },
  };
}

export async function getGazettePageData(locale?: string): Promise<GazetteData> {
  try {
    // Step 1: Get UUID without locale filter
    const uuid = await fetchGazetteUuid();
    if (!uuid) {
      console.log('🔴 GAZETTE: No content found, using fallback data');
      return getGazetteFallbackData();
    }

    // Step 2: Fetch with locale for translated content
    const response = await fetchGazetteByUuid(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    if (!node) {
      console.log('🔴 GAZETTE: Node not found, using fallback data');
      return getGazetteFallbackData();
    }

    const data = transformGazettePage(node, included);
    console.log(`✅ GAZETTE: Using Drupal data (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 GAZETTE: Error fetching data, using fallback data (${locale || 'en'})`);
    return getGazetteFallbackData();
  }
}
