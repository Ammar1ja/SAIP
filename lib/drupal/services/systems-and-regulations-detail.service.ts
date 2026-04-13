import { fetchDrupal, extractText, getRelated, getProxyUrl, getApiUrl } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { RegulationItem } from './systems-and-regulations.service';
import { systemsRegulationsData } from '@/app/[locale]/resources/lows-and-regulations/systems-and-regulations/SystemsAndRegulationsSection.data';

export interface RegulationDetail extends RegulationItem {
  id: string;
  description: string;
  content?: string;
  lastUpdated?: string;
  fullText?: string;
}

export async function fetchRegulationBySlug(
  slug: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    // Try to find by publication number or title
    const endpoint = `/node/systems_regulation?filter[status]=1&filter[field_regulation_number]=${slug}`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      return {
        node: response.data[0],
        included: response.included || [],
      };
    }

    // If not found by number, try by ID
    const byIdEndpoint = `/node/systems_regulation/${slug}`;
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
    console.error(`Failed to fetch regulation ${slug}:`, error);
    return null;
  }
}

export function transformRegulationDetail(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): RegulationDetail {
  const attrs = node.attributes as Record<string, unknown>;
  const rels = node.relationships || {};

  // Get file URL
  let fileUrl: string | undefined;
  if (rels.field_secondary_button_file) {
    const fileEntity = getRelated(rels, 'field_secondary_button_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as { uri?: { url?: string } })?.uri?.url;
      if (uri) {
        const drupalBaseUrl = getApiUrl().replace('/jsonapi', '');
        fileUrl = uri.startsWith('http') ? uri : `${drupalBaseUrl}${uri}`;
      }
    }
  }

  // Parse labels
  let labelsRaw = attrs.field_labels || [];
  if (typeof labelsRaw === 'string') {
    try {
      labelsRaw = JSON.parse(labelsRaw);
    } catch {
      labelsRaw = [labelsRaw];
    }
  }

  const labels = Array.isArray(labelsRaw)
    ? labelsRaw.map((item: string | { value?: string }) =>
        typeof item === 'string' ? item : item.value || '',
      )
    : [];

  const title =
    extractText(attrs.field_regulation_title) || extractText(attrs.title) || 'Untitled Regulation';
  const number = extractText(attrs.field_regulation_number) || '';
  const date = typeof attrs.field_regulation_date === 'string' ? attrs.field_regulation_date : '';

  const typeFromLabels = labels.find(
    (label) =>
      label.toLowerCase().includes('system') ||
      label.toLowerCase().includes('regulation') ||
      label.toLowerCase().includes('نظام') ||
      label.toLowerCase().includes('لائحة'),
  );
  let type = typeFromLabels || '';
  if (!type && attrs.field_type) {
    const fieldType = Array.isArray(attrs.field_type) ? attrs.field_type[0] : attrs.field_type;
    type = typeof fieldType === 'string' ? fieldType : extractText(fieldType) || '';
  }

  if (type) {
    const typeLower = type.toLowerCase();
    type =
      typeLower.includes('system') || typeLower.includes('نظام')
        ? locale === 'ar'
          ? 'نظام'
          : 'System'
        : locale === 'ar'
          ? 'لائحة'
          : 'Regulation';
  }

  const category =
    labels.find(
      (label) =>
        !label.toLowerCase().includes('system') &&
        !label.toLowerCase().includes('regulation') &&
        !label.toLowerCase().includes('نظام') &&
        !label.toLowerCase().includes('لائحة'),
    ) ||
    labels[0] ||
    '';

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title,
    publicationNumber: number,
    durationDate:
      date && typeof date === 'string'
        ? new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
        : '',
    description:
      extractText(attrs.field_regulation_description) ||
      extractText(attrs.field_regulation_title) ||
      '',
    content: extractText(attrs.field_regulation_description) || '',
    labels,
    type,
    category,
    lastUpdated:
      typeof attrs.changed === 'string'
        ? attrs.changed
        : typeof attrs.created === 'string'
          ? attrs.created
          : undefined,
    primaryButtonLabel: locale === 'ar' ? 'تحميل' : 'Download',
    primaryButtonHref: getProxyUrl(fileUrl, 'download'),
    secondaryButtonLabel: locale === 'ar' ? 'عرض' : 'View',
    secondaryButtonHref: getProxyUrl(fileUrl, 'view'),
  };
}

export async function getRegulationDetail(
  slug: string,
  locale?: string,
): Promise<RegulationDetail | null> {
  try {
    const result = await fetchRegulationBySlug(slug, locale);

    if (!result || !result.node) {
      // Try fallback data
      console.log(`🔴 REGULATION DETAIL: Not found in Drupal, trying fallback for slug ${slug}`);
      return getRegulationDetailFallback(slug, locale);
    }

    const regulation = transformRegulationDetail(result.node, result.included, locale);
    console.log(`🟢 REGULATION DETAIL: Using Drupal data ✅ (${locale || 'en'})`);
    return regulation;
  } catch (error) {
    console.log(`🔴 REGULATION DETAIL: Error, using fallback ❌ (${locale || 'en'})`);
    console.error('Regulation detail fetch error:', error);
    return getRegulationDetailFallback(slug, locale);
  }
}

function getRegulationDetailFallback(slug: string, locale?: string): RegulationDetail | null {
  // Find by publication number or create slug from title
  const regulation = systemsRegulationsData.find(
    (item: { publicationNumber: string; title: string }) =>
      item.publicationNumber === slug ||
      item.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase(),
  );

  if (!regulation) {
    return null;
  }

  const typeFromLabels = regulation.labels?.find(
    (label: string) =>
      label.toLowerCase().includes('system') ||
      label.toLowerCase().includes('regulation') ||
      label.toLowerCase().includes('نظام') ||
      label.toLowerCase().includes('لائحة'),
  );
  let type = typeFromLabels || '';
  if (type) {
    const typeLower = type.toLowerCase();
    type =
      typeLower.includes('system') || typeLower.includes('نظام')
        ? locale === 'ar'
          ? 'نظام'
          : 'System'
        : locale === 'ar'
          ? 'لائحة'
          : 'Regulation';
  }

  const category =
    regulation.labels?.find(
      (label: string) =>
        !label.toLowerCase().includes('system') &&
        !label.toLowerCase().includes('regulation') &&
        !label.toLowerCase().includes('نظام') &&
        !label.toLowerCase().includes('لائحة'),
    ) ||
    regulation.labels?.[0] ||
    '';

  return {
    id: regulation.publicationNumber,
    title: regulation.title,
    publicationNumber: regulation.publicationNumber,
    durationDate: regulation.durationDate,
    description: regulation.title,
    content: regulation.title,
    labels: regulation.labels || [],
    type,
    category,
    primaryButtonLabel: regulation.primaryButtonLabel || (locale === 'ar' ? 'تحميل' : 'Download'),
    primaryButtonHref: regulation.primaryButtonHref,
    secondaryButtonLabel: regulation.secondaryButtonLabel || (locale === 'ar' ? 'عرض' : 'View'),
    secondaryButtonHref: regulation.secondaryButtonHref,
  };
}
