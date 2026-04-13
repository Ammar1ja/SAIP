/**
 * Digital Guide Service
 * Handles Digital Guide pages and sections
 */

import { fetchDrupal, extractText, fetchContentType, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface DigitalGuideCard {
  title: string;
  description: string;
  href: string;
}

export interface DigitalGuidePageData {
  heroHeading: string;
  heroSubheading: string;
  cards: DigitalGuideCard[];
}

/**
 * Fetch digital guide page
 */
export async function fetchDigitalGuidePage(
  locale?: string,
): Promise<{ node: DrupalNode | null; included: DrupalIncludedEntity[] }> {
  try {
    // Use fetchContentType instead of direct endpoint
    const response = await fetchContentType(
      'digital_guide_page',
      {
        filter: { status: '1' },
      },
      locale,
    );

    return {
      node: response.data?.[0] || null,
      included: response.included || [],
    };
  } catch (error) {
    console.error('Failed to fetch digital guide page:', error);
    return { node: null, included: [] };
  }
}

/**
 * Transform Drupal node to frontend format
 */
export function transformDigitalGuidePage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): DigitalGuidePageData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get cards from field_cards (paragraphs)
  const cardsData = getRelated(rels, 'field_cards', included);
  const cards: DigitalGuideCard[] = Array.isArray(cardsData)
    ? cardsData
        .map((card: DrupalIncludedEntity) => {
          const cardAttrs = card.attributes as any;
          return {
            title: cardAttrs.field_card_title || '',
            description: extractText(cardAttrs.field_card_description) || '',
            href: cardAttrs.field_card_href || '',
          };
        })
        .filter((card) => card.title && card.href) // Filter out incomplete cards
    : [];

  return {
    heroHeading:
      attrs.field_hero_heading ||
      attrs.field_main_heading ||
      'Learn about intellectual property and its fields.',
    heroSubheading: extractText(attrs.field_hero_subheading) || '',
    cards: cards.length > 0 ? cards : getFallbackCards(), // Use Drupal cards if available, otherwise fallback
  };
}

/**
 * Fallback cards (from DigitalGuide.data.tsx)
 */
function getFallbackCards(): DigitalGuideCard[] {
  return [
    {
      title: 'IP rights',
      description: 'Learn about types, benefits and protections of IP rights.',
      href: '/resources/ip-information/digital-guide/ip-rights',
    },
    {
      title: 'IP category',
      description:
        'Discover patents, trademarks, copyrights, designs, plant varieties and topographic designs of integrated circuits.',
      href: '/resources/ip-information/digital-guide/ip-category',
    },
    {
      title: 'Check your idea',
      description: 'Find the best protection method for your idea or innovation.',
      href: '/resources/ip-information/digital-guide/check-your-idea',
    },
  ];
}

/**
 * Get digital guide page data with fallback
 */
export async function getDigitalGuidePageData(locale?: string): Promise<DigitalGuidePageData> {
  try {
    // Step 1: Fetch to get UUID (always in EN to ensure we get the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/digital_guide_page?filter[status][value]=1',
      {},
      'en',
    );

    if (!initialResponse.data || initialResponse.data.length === 0) {
      console.log(`🔴 DIGITAL GUIDE: No page found, using fallback (${locale})`);
      return {
        heroHeading: 'Learn about intellectual property and its fields.',
        heroSubheading: '',
        cards: getFallbackCards(),
      };
    }

    const nodeUuid = initialResponse.data[0].id;

    // Step 2: Fetch with UUID and locale to get translated content, including paragraphs
    const response = await fetchDrupal<DrupalNode>(
      `/node/digital_guide_page/${nodeUuid}?include=field_cards`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];
    const data = transformDigitalGuidePage(node, included);

    if (data.cards.length > 0 && data.cards !== getFallbackCards()) {
      console.log(
        `✅ DIGITAL GUIDE: Using Drupal data with ${data.cards.length} cards (${locale})`,
      );
    } else {
      console.log(`⚠️ DIGITAL GUIDE: Using fallback cards (${locale})`);
    }
    return data;
  } catch (error) {
    console.log(`🔴 DIGITAL GUIDE: Error, using fallback (${locale})`, error);
    return {
      heroHeading: 'Learn about intellectual property and its fields.',
      heroSubheading: '',
      cards: getFallbackCards(),
    };
  }
}
