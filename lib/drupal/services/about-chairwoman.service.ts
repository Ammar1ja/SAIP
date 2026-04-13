import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

// Frontend interface
export interface AboutChairwomanData {
  title: string;
  positions: string[];
  image_src: string;
  paragraphs: Array<{
    id: number;
    text: string;
  }>;
}

// Step 1: Fetch UUID (without locale to get canonical)
async function fetchChairwomanUUID(): Promise<string | null> {
  try {
    const endpoint = `/node/about_chairwoman?filter[status]=1&fields[node--about_chairwoman]=drupal_internal__nid`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {});
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch chairwoman UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchChairwomanByUUID(
  uuid: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    const includeFields = 'field_image.field_media_image,field_hero_background_image.field_media_image';
    const endpoint = `/node/about_chairwoman/${uuid}?include=${includeFields}`;
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
    console.error(`Failed to fetch chairwoman by UUID (${locale}):`, error);
    return null;
  }
}

// Transform function
export function transformAboutChairwomanPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): AboutChairwomanData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get chairwoman image
  let imageUrl = '/images/board/alazzaz.jpg';
  const imageRel = getRelated(rels, 'field_image', included);
  if (imageRel && !Array.isArray(imageRel)) {
    const imageData = getImageWithAlt(imageRel, included);
    if (imageData?.src) {
      imageUrl = imageData.src;
    }
  }

  // Get positions
  const positions: string[] = [];
  if (attrs.field_position_1) {
    positions.push(extractText(attrs.field_position_1));
  }
  if (attrs.field_position_2) {
    positions.push(extractText(attrs.field_position_2));
  }

  // Get biography paragraphs from field_biography (split by double newlines)
  const paragraphs: Array<{ id: number; text: string }> = [];
  if (attrs.field_biography) {
    const biographyText = extractText(attrs.field_biography);
    if (biographyText) {
      const paragraphTexts = biographyText.split(/\n\n+/);
      paragraphTexts.forEach((text, index) => {
        if (text.trim()) {
          paragraphs.push({
            id: index + 1,
            text: text.trim(),
          });
        }
      });
    }
  }

  return {
    title: extractText(attrs.field_hero_heading) || attrs.title || 'H.E Shihana Saleh Alazzaz',
    positions: positions.length > 0 ? positions : ['Chairwoman of Board of Directors'],
    image_src: imageUrl,
    paragraphs,
  };
}

// Fallback data function
export function getAboutChairwomanFallbackData(): AboutChairwomanData {
  return {
    title: 'H.E Shihana Saleh Alazzaz',
    positions: ['Chairwoman of Board of Directors', 'Advisor at Royal Order issued'],
    image_src: '/images/board/alazzaz.jpg',
    paragraphs: [
      {
        id: 1,
        text: 'Her Excellency, Shihana Alazzaz, is appointed by a Royal Order issued by the Custodian of the Two Holy Mosques King Salman bin Abdulaziz Al Saud as an advisor at the Royal Court.',
      },
    ],
  };
}

// Main export function with 2-step UUID fetch
export async function getAboutChairwomanPageData(locale?: string): Promise<AboutChairwomanData> {
  try {
    // Step 1: Get UUID
    const uuid = await fetchChairwomanUUID();
    if (!uuid) {
      console.log(`🔴 ABOUT CHAIRWOMAN: No UUID found, using fallback ❌ (${locale || 'en'})`);
      return getAboutChairwomanFallbackData();
    }

    // Step 2: Fetch by UUID with locale
    const result = await fetchChairwomanByUUID(uuid, locale);
    if (!result) {
      console.log(`🔴 ABOUT CHAIRWOMAN: Failed to fetch by UUID, using fallback ❌ (${locale || 'en'})`);
      return getAboutChairwomanFallbackData();
    }

    const data = transformAboutChairwomanPage(result.node, result.included);
    console.log(`🟢 ABOUT CHAIRWOMAN: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 ABOUT CHAIRWOMAN: Using fallback data ❌ (${locale || 'en'})`);
    console.error('About Chairwoman fetch error:', error);
    return getAboutChairwomanFallbackData();
  }
}
