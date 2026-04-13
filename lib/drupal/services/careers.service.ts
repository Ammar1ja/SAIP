import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractHtml, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

// Frontend interface
export interface CareersData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  saipCareers: {
    heading: string;
    description: string;
    image: { src: string; alt: string };
    buttonHref: string;
  };
  wipoCareers: {
    heading: string;
    description: string;
    image: { src: string; alt: string };
    buttonHref: string;
  };
}

// Step 1: Fetch UUID (without locale to get canonical)
async function fetchCareersUUID(): Promise<string | null> {
  try {
    const endpoint = `/node/careers_page?filter[status]=1&fields[node--careers_page]=drupal_internal__nid`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {});
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch careers UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchCareersByUUID(
  uuid: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    const includeFields =
      'field_hero_background_image.field_media_image,field_saip_image.field_media_image,field_wipo_image.field_media_image';
    const endpoint = `/node/careers_page/${uuid}?include=${includeFields}`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

    if (!response.data) {
      return null;
    }

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    return {
      node,
      included: response.included || [],
    };
  } catch (error) {
    console.error(`Failed to fetch careers by UUID (${locale}):`, error);
    return null;
  }
}

// Transform function
export function transformCareersPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): CareersData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  const normalizeLineBreaks = (value: string): string => {
    if (!value) return '';
    if (value.includes('<')) {
      return value;
    }
    return value.replace(/\r?\n/g, '<br />');
  };

  // Get hero background image
  let heroImageUrl = '/images/careers/hero.jpg';
  const heroImageRel = getRelated(rels, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  // Get SAIP image
  let saipImageUrl = '/images/careers/saip-careers.jpg';
  const saipImageRel = getRelated(rels, 'field_saip_image', included);
  if (saipImageRel && !Array.isArray(saipImageRel)) {
    const imageData = getImageWithAlt(saipImageRel, included);
    if (imageData?.src) {
      saipImageUrl = imageData.src;
    }
  }

  // Get WIPO image
  let wipoImageUrl = '/images/careers/wipo-careers.jpg';
  const wipoImageRel = getRelated(rels, 'field_wipo_image', included);
  if (wipoImageRel && !Array.isArray(wipoImageRel)) {
    const imageData = getImageWithAlt(wipoImageRel, included);
    if (imageData?.src) {
      wipoImageUrl = imageData.src;
    }
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Careers',
      description: extractText(attrs.field_hero_subheading) || '',
      backgroundImage: heroImageUrl,
    },
    saipCareers: {
      heading: extractText(attrs.field_saip_heading) || 'SAIP careers',
      description: normalizeLineBreaks(extractHtml(attrs.field_saip_description) || ''),
      image: { src: saipImageUrl, alt: 'SAIP Careers' },
      buttonHref: extractText(attrs.field_saip_button_link) || 'https://careers.saip.gov.sa',
    },
    wipoCareers: {
      heading: extractText(attrs.field_wipo_heading) || 'Careers at WIPO',
      description: normalizeLineBreaks(extractHtml(attrs.field_wipo_description) || ''),
      image: { src: wipoImageUrl, alt: 'WIPO Careers' },
      buttonHref: extractText(attrs.field_wipo_button_link) || 'https://www.wipo.int/careers',
    },
  };
}

// Fallback data function
export function getCareersFallbackData(): CareersData {
  return {
    hero: {
      title: 'Careers',
      description: 'Join our team and help shape the future of intellectual property.',
      backgroundImage: '/images/careers/hero.jpg',
    },
    saipCareers: {
      heading: 'SAIP Careers',
      description: 'Explore career opportunities at SAIP.',
      image: { src: '/images/careers/saip-careers.jpg', alt: 'SAIP Careers' },
      buttonHref: 'https://careers.saip.gov.sa',
    },
    wipoCareers: {
      heading: 'WIPO Careers',
      description: 'Explore international career opportunities with WIPO.',
      image: { src: '/images/careers/wipo-careers.jpg', alt: 'WIPO Careers' },
      buttonHref: 'https://www.wipo.int/careers',
    },
  };
}

// Main export function with 2-step UUID fetch
export async function getCareersPageData(locale?: string): Promise<CareersData> {
  try {
    // Step 1: Get UUID
    const uuid = await fetchCareersUUID();
    if (!uuid) {
      console.log(`🔴 CAREERS: No UUID found, using fallback ❌ (${locale || 'en'})`);
      return getCareersFallbackData();
    }

    // Step 2: Fetch by UUID with locale
    const result = await fetchCareersByUUID(uuid, locale);
    if (!result) {
      console.log(`🔴 CAREERS: Failed to fetch by UUID, using fallback ❌ (${locale || 'en'})`);
      return getCareersFallbackData();
    }

    const data = transformCareersPage(result.node, result.included);
    console.log(`🟢 CAREERS: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 CAREERS: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Careers fetch error:', error);
    return getCareersFallbackData();
  }
}
