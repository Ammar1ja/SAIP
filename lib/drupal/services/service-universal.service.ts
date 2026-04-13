/**
 * UNIVERSAL Service Detail Service
 * Works for ALL service detail pages using service_item CT
 *
 * DRUPAL FIELDS:
 * - field_title / title → title
 * - field_description → description
 * - field_duration → executionTime
 * - field_cost → serviceFee
 * - field_target_group → targetGroup (taxonomy)
 * - field_application_process → steps (parsed from text/HTML)
 * - field_requirements / field_documents_required → requirements
 * - field_external_link → platformHref
 */

import { fetchContentType, fetchDrupal, extractText, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalTaxonomyEntity } from '../types';
import { getTranslations } from 'next-intl/server';

export interface ServiceDetailData {
  id: string;
  title: string;
  description: string;

  // Sidebar
  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;

  // Steps & Requirements
  steps: Array<{
    number: number;
    title: string;
    icon?: string;
    details: Array<
      | {
          label: string;
          href: string;
          external?: boolean;
          variant?: 'link' | 'button';
        }
      | string
    >;
  }>;

  requirements: string[];
}

// Known slug to NID mapping for services created in Drupal
const SLUG_TO_NID: Record<string, string> = {
  pct: '425',
  pph: '426',
  'fast-track-examination': '426',
  'patent-application': '66',
  'patent-cooperation-treaty': '425',
  'trademark-complaint': '536',
  'copyright-complaint': '537',
  // New dedicated services
  'design-application': '751',
  'design-renewal': '752',
  'design-search': '753',
  'plant-variety-application': '754',
  'plant-variety-renewal': '755',
  'plant-variety-search': '756',
  'ic-layout-registration': '757',
  'ic-layout-management': '758',
  'ic-layout-search': '759',
  'ip-agent-registration': '760',
  'ip-consultancy-services': '761',
};

/**
 * Fetch service by slug or title
 */
export async function fetchServiceBySlug(slug: string, locale?: string) {
  try {
    // First try exact nid match (if slug is numeric)
    if (/^\d+$/.test(slug)) {
      const response = await fetchContentType(
        'service_item',
        {
          filter: {
            drupal_internal__nid: slug,
          },
          include: ['field_target_group', 'field_steps'],
        },
        locale,
      );

      if (response.data?.[0]) {
        return {
          node: response.data[0],
          included: response.included || [],
        };
      }
    }

    // Try known slug mapping
    const knownNid = SLUG_TO_NID[slug.toLowerCase()];
    if (knownNid) {
      // CRITICAL: Fetch by NID first to get UUID (filter ignores locale)
      const enResponse = await fetchContentType(
        'service_item',
        {
          filter: {
            drupal_internal__nid: knownNid,
          },
          include: [],
        },
        'en', // Always fetch EN to get UUID
      );

      if (enResponse.data?.[0]) {
        const uuid = enResponse.data[0].id;

        // Then fetch by UUID with correct locale (UUID respects locale prefix)
        const response = await fetchDrupal<DrupalNode>(
          `/node/service_item/${uuid}?include=field_target_group,field_steps`,
          {},
          locale,
        );

        console.log(`✅ SERVICE: Found ${slug} via NID→UUID (${knownNid}→${uuid}) [${locale}]`);
        return {
          node: response.data as unknown as DrupalNode,
          included: response.included || [],
        };
      }
    }

    // Fallback: Search all services and find best match
    const response = await fetchContentType(
      'service_item',
      {
        filter: { status: '1' },
        include: ['field_target_group', 'field_steps'],
      },
      locale,
    );

    if (response.data && response.data.length > 0) {
      // Try to find by title match
      const slugUpper = slug.toUpperCase();
      const titleSearch = slug.replace(/-/g, ' ').toLowerCase();

      const match = response.data.find((node: DrupalNode) => {
        const title = node.attributes.title?.toLowerCase() || '';
        return title.includes(slugUpper.toLowerCase()) || title.includes(titleSearch);
      });

      if (match) {
        console.log(`✅ SERVICE: Found ${slug} via title search`);
        return {
          node: match,
          included: response.included || [],
        };
      }
    }

    return {
      node: null,
      included: [],
    };
  } catch (error) {
    console.error(`Failed to fetch service (${slug}):`, error);
    return { node: null, included: [] };
  }
}

/**
 * Parse HTML/text steps into structured format
 */
function parseSteps(text: string): ServiceDetailData['steps'] {
  if (!text) return [];

  // Try to parse numbered steps from HTML or plain text
  const steps: ServiceDetailData['steps'] = [];

  // Pattern: "1. Title" or "<h3>1. Title</h3>" or "Step 1: Title"
  const stepRegex = /(?:Step\s*)?(\d+)[:.]\s*([^\n<]+)/gi;
  let match;

  while ((match = stepRegex.exec(text)) !== null) {
    const number = parseInt(match[1]);
    const title = match[2].trim();

    // Try to find details following this step
    const detailsStart = match.index + match[0].length;
    const nextMatch = stepRegex.exec(text);
    const detailsEnd = nextMatch ? nextMatch.index : text.length;
    stepRegex.lastIndex = nextMatch ? nextMatch.index : text.length;

    const detailsText = text.substring(detailsStart, detailsEnd).trim();
    const details = detailsText
      .split(/\n|<br\s*\/?>/i)
      .map((d) => d.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
      .slice(0, 5); // Max 5 details per step

    steps.push({
      number,
      title,
      icon: getIconForStep(number),
      details: details.length > 0 ? details : [title],
    });
  }

  return steps.length > 0 ? steps : [];
}

/**
 * Get icon name based on step number
 */
function getIconForStep(stepNum: number): string {
  const icons = ['user', 'user-plus', 'clipboard-plus', 'key-round', 'send', 'check'];
  return icons[stepNum - 1] || 'circle';
}

/**
 * Parse requirements/documents list
 */
function parseRequirements(text: string): string[] {
  if (!text) return [];

  // Split by newlines, list markers, or <li> tags
  return text
    .split(/\n|<li>|•|-\s/i)
    .map((r) => r.replace(/<[^>]+>/g, '').trim())
    .filter((r) => r.length > 3) // Ignore very short items
    .slice(0, 15); // Max 15 requirements
}

/**
 * Transform Drupal node to ServiceDetailData
 */
export function transformServiceItem(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ServiceDetailData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Target group from taxonomy
  const targetGroupTerms = getRelated(rels, 'field_target_group', included) || [];
  const targetGroup = Array.isArray(targetGroupTerms)
    ? targetGroupTerms
        .map((term: any) => term.attributes?.name)
        .filter(Boolean)
        .join(', ')
    : 'General public';

  // Parse steps (from paragraphs or text)
  let steps: ServiceDetailData['steps'] = [];

  // Try paragraphs first (new services)
  const stepParagraphs = getRelated(rels, 'field_steps', included);
  if (stepParagraphs && Array.isArray(stepParagraphs) && stepParagraphs.length > 0) {
    steps = stepParagraphs
      .map((para: any) => {
        const detailsText = extractText(para.attributes?.field_step_details) || '';
        const details: ServiceDetailData['steps'][number]['details'] = detailsText
          ? [detailsText]
          : [];
        const buttonLabel = para.attributes?.field_step_button_label;
        const rawButtonLink = para.attributes?.field_step_button_link?.uri;
        const buttonLink =
          typeof rawButtonLink === 'string' && rawButtonLink.startsWith('internal:')
            ? rawButtonLink.replace('internal:', '')
            : rawButtonLink;

        if (buttonLabel && buttonLink) {
          const isExternal = typeof buttonLink === 'string' && /^https?:\/\//i.test(buttonLink);
          details.push({
            label: buttonLabel,
            href: buttonLink,
            external: isExternal,
            variant: 'button',
          });
        }

        return {
          number: para.attributes?.field_step_number || 0,
          title: para.attributes?.field_step_title || '',
          details,
        };
      })
      .filter((step) => step.title || step.details.length > 0)
      .sort((a, b) => a.number - b.number);
  } else {
    // Fallback to text field (old services)
    const processText = extractText(attrs.field_application_process) || '';
    steps = parseSteps(processText);
  }

  // Parse requirements
  const requirementsText =
    extractText(attrs.field_requirements) || extractText(attrs.field_documents_required) || '';
  const requirements = parseRequirements(requirementsText);

  return {
    id: attrs.drupal_internal__nid?.toString() || '',
    title: attrs.field_title || attrs.title || '',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',
    executionTime: attrs.field_duration || 'N/A',
    serviceFee: attrs.field_cost || 'N/A',
    targetGroup,
    serviceChannel: attrs.field_service_channel || 'Digital',
    faqHref: attrs.field_faq_link?.uri || '/resources/ip-information/faq',
    platformHref:
      attrs.field_platform_link?.uri || attrs.field_external_link?.uri || 'https://saip.gov.sa',
    steps,
    requirements,
  };
}

/**
 * Get fallback data from translations
 */
async function getServiceFallbackData(slug: string, locale?: string): Promise<ServiceDetailData> {
  try {
    const t = await getTranslations({
      locale: locale || 'en',
      namespace: `services.${slug}` as `services.${string}`,
    });

    // Try to get translated fallback
    return {
      id: slug,
      title: t('title') || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      description: t('description') || '',
      executionTime: t('executionTime') || 'N/A',
      serviceFee: t('serviceFee') || 'N/A',
      targetGroup: t('targetGroup') || 'General public',
      serviceChannel: 'Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: 'https://saip.gov.sa',
      steps: [],
      requirements: [],
    };
  } catch {
    // If translation namespace doesn't exist, return basic fallback
    return {
      id: slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      description: `Information about ${slug.replace(/-/g, ' ')} service.`,
      executionTime: 'N/A',
      serviceFee: 'N/A',
      targetGroup: 'General public',
      serviceChannel: 'Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: 'https://saip.gov.sa',
      steps: [],
      requirements: [],
    };
  }
}

/**
 * Get service detail data with fallback
 */
export async function getServiceDetailData(
  slug: string,
  locale?: string,
): Promise<ServiceDetailData> {
  try {
    const result = await fetchServiceBySlug(slug, locale);

    if (!result.node) {
      console.log(`🔴 SERVICE: No Drupal data for ${slug}, using fallback (${locale})`);
      return await getServiceFallbackData(slug, locale);
    }

    const data = transformServiceItem(result.node, result.included);
    console.log(`✅ SERVICE: Using Drupal data for ${slug} (${locale})`);
    return data;
  } catch (error) {
    console.log(`🔴 SERVICE: Error for ${slug}, using fallback (${locale})`, error);
    return await getServiceFallbackData(slug, locale);
  }
}
