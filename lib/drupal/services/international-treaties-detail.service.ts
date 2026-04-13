/**
 * International Treaties Detail Service
 * For fetching individual treaty details
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface InternationalTreatyDetail {
  id: string;
  title: string;
  shortName: string;
  description: string;
  content: string;
  organization: string;
  status: string;
  signedDate?: string;
  effectiveDate?: string;
  publicationDate?: string;
  image?: string;
}

/**
 * Fetch single international treaty by slug or ID
 */
export async function fetchInternationalTreatyBySlug(
  slug: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    // Try to find by short_name (slug)
    const endpoint = `/node/international_treaty?filter[status]=1&filter[field_treaty_short_name]=${slug}`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      return {
        node: response.data[0],
        included: response.included || [],
      };
    }

    // If not found by slug, try by ID
    const byIdEndpoint = `/node/international_treaty/${slug}`;
    const byIdResponse = await fetchDrupal(byIdEndpoint, {}, locale);

    if (byIdResponse.data) {
      const node = Array.isArray(byIdResponse.data) ? byIdResponse.data[0] : byIdResponse.data;
      return {
        node,
        included: byIdResponse.included || [],
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch treaty ${slug}:`, error);
    return null;
  }
}

/**
 * Transform Drupal treaty node to frontend format
 */
export function transformInternationalTreaty(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): InternationalTreatyDetail {
  const attrs = node.attributes as any;

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title: attrs.field_treaty_title || attrs.title || 'International Treaty',
    shortName: attrs.field_treaty_short_name || '',
    description: extractText(attrs.field_treaty_description) || '',
    content: extractText(attrs.field_treaty_description) || '', // Use description as content for now
    organization: attrs.field_treaty_organization || 'WIPO',
    status: attrs.field_treaty_status || 'active',
    signedDate: attrs.field_treaty_date_signed || '',
    effectiveDate: attrs.field_treaty_date_effective || '',
    publicationDate: attrs.field_treaty_date_effective || attrs.created || '',
    image: '/images/laws/treaties.jpg',
  };
}

/**
 * Get treaty detail with fallback
 */
export async function getInternationalTreatyDetail(
  slug: string,
  locale?: string,
): Promise<InternationalTreatyDetail | null> {
  try {
    const result = await fetchInternationalTreatyBySlug(slug, locale);

    if (!result || !result.node) {
      console.log(`🔴 TREATY DETAIL: Not found for slug ${slug}`);
      return null;
    }

    const treaty = transformInternationalTreaty(result.node, result.included);
    console.log(`✅ TREATY DETAIL: Using Drupal for slug ${slug} (${locale})`);
    return treaty;
  } catch (error) {
    console.log(`🔴 TREATY DETAIL: Error for slug ${slug}`, error);
    return null;
  }
}
