/**
 * PCT Service Detail Service
 * Maps existing Drupal fields to frontend requirements
 *
 * DRUPAL FIELDS (current):
 * - field_duration → executionTime
 * - field_cost → serviceFee
 * - field_target_group → targetGroup
 * - field_application_process → steps (parse from text)
 * - field_requirements → requirements (parse from text)
 * - field_external_link → platformHref
 *
 * TODO LATER: Add structured fields (field_steps paragraphs, etc.)
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode } from '../types';

export interface PCTServiceDetail {
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
    details: string[];
  }>;

  requirements: string[];
}

/**
 * Fetch PCT service from Drupal
 */
export async function fetchPCTService(locale?: string): Promise<DrupalNode | null> {
  try {
    // Try PCT content type first
    let endpoint = `/node/pct?filter[status]=1&sort=-changed`;
    let response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      console.log('✅ Found PCT in pct content type');
      return response.data[0];
    }

    // Try service_item with title matching
    endpoint = `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=PCT&filter[status]=1`;
    response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      console.log('✅ Found PCT in service_item');
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch PCT service:', error);
    return null;
  }
}

/**
 * Transform Drupal node to PCTServiceDetail
 */
export function transformPCTService(node: DrupalNode): PCTServiceDetail {
  const attrs = node.attributes as any;

  // Parse application_process into steps
  const processText = extractText(attrs.field_application_process) || '';
  const steps = parseProcessIntoSteps(processText);

  // Parse requirements into array
  const requirementsText = extractText(attrs.field_requirements) || extractText(attrs.body) || '';
  const requirements = parseRequirements(requirementsText);

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title: attrs.title || 'Patent Cooperation Treaty (PCT)',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',

    executionTime: attrs.field_duration || 'Within 30 months from priority date',
    serviceFee: attrs.field_cost || 'Variable (depends on application type)',
    targetGroup: extractText(attrs.field_target_group) || 'Individuals, Enterprises',
    serviceChannel: 'Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: attrs.field_external_link?.uri || 'https://saip.gov.sa',

    steps: steps.length > 0 ? steps : getFallbackSteps(),
    requirements: requirements.length > 0 ? requirements : getFallbackRequirements(),
  };
}

/**
 * Parse text into structured steps
 * Looks for patterns like "1.", "Step 1:", "1)", etc.
 */
function parseProcessIntoSteps(
  text: string,
): Array<{ number: number; title: string; icon?: string; details: string[] }> {
  if (!text) return [];

  // Split by step markers
  const stepPattern = /(?:^|\n)(?:Step\s+)?(\d+)[.):\s]+([^\n]+)/gi;
  const steps: Array<{ number: number; title: string; icon?: string; details: string[] }> = [];

  let match;
  while ((match = stepPattern.exec(text)) !== null) {
    const number = parseInt(match[1]);
    const title = match[2].trim();

    steps.push({
      number,
      title,
      details: [title], // Default: title as first detail
    });
  }

  return steps;
}

/**
 * Parse requirements text into array
 * Splits by newlines, bullet points, or numbered lists
 */
function parseRequirements(text: string): string[] {
  if (!text) return [];

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');

  // Split by newlines, bullets, or numbers
  const lines = cleanText
    .split(/\n|•|[-*]|\d+\./)
    .map((line) => line.trim())
    .filter((line) => line.length > 5); // Filter out short/empty lines

  return lines;
}

/**
 * Fallback steps (from PCT.data.ts)
 */
function getFallbackSteps() {
  return [
    {
      number: 1,
      title: 'Log in',
      icon: 'user',
      details: ['Login to the SAIP platform, select Services, and click on Patent Service.'],
    },
    {
      number: 2,
      title: 'Select PCT application',
      icon: 'user-plus',
      details: [
        'Navigate to Patent Cooperation Treaty (PCT) section.',
        'Select the type of PCT application you want to file.',
      ],
    },
    {
      number: 3,
      title: 'Prepare application documents',
      icon: 'clipboard-plus',
      details: [
        'Download PCT application templates.',
        'Prepare the request form, description, claims, abstract, and drawings.',
        'Ensure all documents meet PCT requirements.',
      ],
    },
    {
      number: 4,
      title: 'Submit application',
      icon: 'key-round',
      details: [
        'Fill in all required information.',
        'Upload all necessary documents.',
        'Review your application before submission.',
      ],
    },
    {
      number: 5,
      title: 'Pay fees and receive confirmation',
      icon: 'send',
      details: [
        'Pay the required PCT filing fees.',
        'Receive your international application number and filing date.',
      ],
    },
  ];
}

/**
 * Fallback requirements (from PCT.data.ts)
 */
function getFallbackRequirements() {
  return [
    'Valid patent application or priority claim',
    'Completed PCT request form',
    'Description of the invention in Arabic or English',
    'Claims defining the scope of protection',
    'Abstract (not exceeding 150 words)',
    'Drawings (if necessary for understanding the invention)',
    'Payment of international filing fee',
    'Power of attorney (if using an agent)',
  ];
}

/**
 * Get PCTfallback data from messages (multilingual)
 */
async function getPCTFallbackData(locale?: string): Promise<PCTServiceDetail> {
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale: locale || 'en', namespace: 'services.pct' });

  return {
    id: 'pct',
    title: t('title'),
    description: t('description'),
    executionTime: t('executionTime'),
    serviceFee: t('serviceFee'),
    targetGroup: t('targetGroup'),
    serviceChannel: 'Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: 'https://saip.gov.sa',
    steps: [
      {
        number: 1,
        title: t('steps.1.title'),
        icon: 'user',
        details: t.raw('steps.1.details'),
      },
      {
        number: 2,
        title: t('steps.2.title'),
        icon: 'user-plus',
        details: t.raw('steps.2.details'),
      },
      {
        number: 3,
        title: t('steps.3.title'),
        icon: 'clipboard-plus',
        details: t.raw('steps.3.details'),
      },
      {
        number: 4,
        title: t('steps.4.title'),
        icon: 'key-round',
        details: t.raw('steps.4.details'),
      },
      {
        number: 5,
        title: t('steps.5.title'),
        icon: 'send',
        details: t.raw('steps.5.details'),
      },
    ],
    requirements: t.raw('requirements'),
  };
}

/**
 * Get PCT service detail with fallback
 */
export async function getPCTServiceDetail(locale?: string): Promise<PCTServiceDetail> {
  try {
    const node = await fetchPCTService(locale);

    if (!node) {
      console.log(`🔴 PCT SERVICE: Not found in Drupal, using fallback (${locale})`);
      return await getPCTFallbackData(locale);
    }

    const detail = transformPCTService(node);
    console.log(`✅ PCT SERVICE: Using Drupal data (${locale})`);
    return detail;
  } catch (error) {
    console.log(`🔴 PCT SERVICE: Error, using fallback (${locale})`, error);
    return await getPCTFallbackData(locale);
  }
}
