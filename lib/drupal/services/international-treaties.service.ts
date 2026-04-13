import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Types
export interface TreatyCard {
  id: string;
  title: string;
  shortName: string;
  description: string;
  organization: string;
  status: string;
  href: string;
}

export interface InternationalTreatiesData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  treaties: TreatyCard[];
}

// Fetch page by UUID (2-step pattern)
async function fetchPageByUUID(uuid: string, locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = 'field_hero_background_image.field_media_image';
  const endpoint = `/node/international_treaties_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch treaties
export async function fetchTreaties(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const endpoint = `/node/international_treaty?filter[status]=1&sort=title`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform treaty node
function transformTreaty(node: DrupalNode): TreatyCard {
  const attrs = node.attributes as any;
  const id = attrs.drupal_internal__nid || node.id;
  const shortName = attrs.field_treaty_short_name || '';

  // Generate href based on short name (slug)
  const slug = shortName.toLowerCase().replace(/\s+/g, '-');

  return {
    id: String(id),
    title: attrs.field_treaty_title || attrs.title || '',
    shortName: shortName,
    description: extractText(attrs.field_treaty_description) || '',
    organization: attrs.field_treaty_organization || 'WIPO',
    status: attrs.field_treaty_status || 'active',
    href: `/resources/lows-and-regulations/international-treaties/${slug || id}`,
  };
}

// Transform page function
export function transformInternationalTreatiesPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): Omit<InternationalTreatiesData, 'treaties'> {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};

  // Get hero background image
  let heroImageUrl = '/images/laws/treaties.jpg';
  const heroImageRel = getRelated(relationships, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'International Treaties & Agreements',
      description:
        extractText(attrs.field_hero_subheading) ||
        "Saudi Arabia's participation in international intellectual property agreements and conventions.",
      backgroundImage: heroImageUrl,
    },
  };
}

// Fallback data
export function getInternationalTreatiesFallbackData(): InternationalTreatiesData {
  return {
    hero: {
      title: 'International Treaties & Agreements',
      description:
        "Saudi Arabia's participation in international intellectual property agreements and conventions.",
      backgroundImage: '/images/laws/treaties.jpg',
    },
    treaties: [],
  };
}

// Main export function with 2-step UUID fetch
export async function getInternationalTreatiesPageData(
  locale?: string,
): Promise<InternationalTreatiesData> {
  try {
    // Step 1: Get UUID
    const listEndpoint = `/node/international_treaties_page?filter[status]=1&fields[node--international_treaties_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});
    const nodes = listResponse.data || [];

    let pageData: Omit<InternationalTreatiesData, 'treaties'>;

    if (nodes.length === 0) {
      console.log(`⚠️ INTERNATIONAL TREATIES PAGE: No page node found, using defaults`);
      pageData = {
        hero: {
          title: 'International Treaties & Agreements',
          description:
            "Saudi Arabia's participation in international intellectual property agreements and conventions.",
          backgroundImage: '/images/laws/treaties.jpg',
        },
      };
    } else {
      const uuid = nodes[0].id;
      const response = await fetchPageByUUID(uuid, locale);
      const node = Array.isArray(response.data) ? response.data[0] : response.data;
      const included = response.included || [];
      pageData = transformInternationalTreatiesPage(node, included);
    }

    // Fetch treaties separately
    const treatiesResponse = await fetchTreaties(locale);
    const treatiesData = treatiesResponse.data || [];
    console.log(`📋 TREATIES: Found ${treatiesData.length} treaties for locale ${locale || 'en'}`);

    const treaties = treatiesData.map(transformTreaty);

    console.log(
      `🟢 INTERNATIONAL TREATIES: Using Drupal data ✅ (${locale || 'en'}) - ${treaties.length} treaties`,
    );

    return {
      ...pageData,
      treaties,
    };
  } catch (error) {
    console.log(`🔴 INTERNATIONAL TREATIES: Using fallback data ❌ (${locale || 'en'})`);
    console.error('International Treaties fetch error:', error);
    return getInternationalTreatiesFallbackData();
  }
}
