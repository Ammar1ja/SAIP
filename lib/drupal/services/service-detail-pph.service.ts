/**
 * PPH Service Detail Service
 * Fetches Fast Track Examination (PPH) from Drupal service_item
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode } from '../types';

export interface PPHServiceDetail {
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
 * Fetch PPH service from Drupal
 */
export async function fetchPPHService(locale?: string): Promise<DrupalNode | null> {
  try {
    // Search for "Fast Track Examination (PPH)" in service_item
    const endpoint = `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=Fast Track&filter[status]=1`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      console.log('✅ Found PPH in service_item');
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch PPH service:', error);
    return null;
  }
}

/**
 * Transform Drupal node to PPHServiceDetail
 */
export function transformPPHService(node: DrupalNode): PPHServiceDetail {
  const attrs = node.attributes as any;

  // Parse application_process into steps
  const processText = extractText(attrs.field_application_process) || '';
  const steps = parseProcessIntoSteps(processText);

  // Parse requirements into array
  const requirementsText = extractText(attrs.field_requirements) || extractText(attrs.body) || '';
  const requirements = parseRequirements(requirementsText);

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title: attrs.title || 'Fast Track Examination (PPH)',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',

    executionTime: attrs.field_duration || '6-12 months',
    serviceFee: attrs.field_cost || 'Standard patent fees',
    targetGroup: extractText(attrs.field_target_group) || 'Individuals, Enterprises',
    serviceChannel: 'Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: attrs.field_external_link?.uri || 'https://services.saip.gov.sa',

    steps: steps.length > 0 ? steps : getFallbackSteps(),
    requirements: requirements.length > 0 ? requirements : getFallbackRequirements(),
  };
}

/**
 * Parse text into structured steps
 */
function parseProcessIntoSteps(
  text: string,
): Array<{ number: number; title: string; icon?: string; details: string[] }> {
  if (!text) return [];

  const stepPattern = /(?:^|\n)(?:Step\s+)?(\d+)[.):\s]+([^\n]+)/gi;
  const steps: Array<{ number: number; title: string; icon?: string; details: string[] }> = [];

  let match;
  while ((match = stepPattern.exec(text)) !== null) {
    const number = parseInt(match[1]);
    const title = match[2].trim();

    steps.push({
      number,
      title,
      details: [title],
    });
  }

  return steps;
}

/**
 * Parse requirements text into array
 */
function parseRequirements(text: string): string[] {
  if (!text) return [];

  const cleanText = text.replace(/<[^>]*>/g, '');

  const lines = cleanText
    .split(/\n|•|[-*]|\d+\./)
    .map((line) => line.trim())
    .filter((line) => line.length > 5);

  return lines;
}

/**
 * Fallback steps
 */
function getFallbackSteps() {
  return [
    {
      number: 1,
      title: 'Obtain positive result',
      icon: 'check-circle',
      details: ['Receive positive examination result from participating office.'],
    },
    {
      number: 2,
      title: 'Submit PPH request',
      icon: 'file-text',
      details: ['File PPH request with SAIP.'],
    },
    {
      number: 3,
      title: 'Provide documentation',
      icon: 'upload',
      details: ['Submit required documents.'],
    },
    {
      number: 4,
      title: 'Fast track processing',
      icon: 'zap',
      details: ['Your application will be prioritized.'],
    },
    {
      number: 5,
      title: 'Receive decision',
      icon: 'award',
      details: ['Get expedited examination decision.'],
    },
  ];
}

/**
 * Fallback requirements
 */
function getFallbackRequirements(): string[] {
  return [
    'Positive examination result from a participating patent office',
    'Pending Saudi patent application',
    'Same priority date as foreign application',
    'Claims corresponding to those allowed in foreign office',
    'Translation of allowed documents',
    'Completed PPH request form',
  ];
}

/**
 * Fetch related Patent services
 */
export async function fetchRelatedPatentServices(locale?: string): Promise<any[]> {
  try {
    const endpoint = `/node/service_item?filter[field_ip_category.entity.name][value]=Patents&filter[status]=1&page[limit]=10`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      return response.data
        .filter((node: any) => {
          const title = node.attributes?.title || '';
          // Exclude "Fast Track" - it's the current page
          return !title.includes('Fast Track') && !title.includes('PPH');
        })
        .map((node: any) => ({
          id: node.id,
          title: node.attributes?.title || '',
          description: extractText(node.attributes?.field_description) || '',
          href: `/services/patents/${node.attributes?.title?.toLowerCase().replace(/\s+/g, '-')}`,
          category: 'Patents',
        }))
        .slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch related Patent services:', error);
    return [];
  }
}

/**
 * Main function: Get PPH service detail data
 */
export async function getPPHServiceDetail(locale?: string): Promise<PPHServiceDetail> {
  try {
    const node = await fetchPPHService(locale);

    if (!node) {
      console.log(`⚠️ PPH: Using fallback data (${locale || 'en'}) - No node found`);
      return {
        id: 'fallback',
        title: 'Fast Track Examination (PPH)',
        description:
          'Under the PPH agreement, patent offices participating in the Program have agreed that when an applicant receives a positive decision from a participating office, they can request expedited examination in other participating offices.',
        executionTime: '6-12 months',
        serviceFee: 'Standard patent fees',
        targetGroup: 'Individuals, Enterprises',
        serviceChannel: 'Digital',
        faqHref: '/resources/ip-information/faq',
        platformHref: 'https://services.saip.gov.sa',
        steps: getFallbackSteps(),
        requirements: getFallbackRequirements(),
      };
    }

    const data = transformPPHService(node);

    console.log(`✅ PPH: Loaded from Drupal (${locale || 'en'}) - Node ${data.id}`);

    return data;
  } catch (error) {
    console.error('PPH service error:', error);
    return {
      id: 'fallback-error',
      title: 'Fast Track Examination (PPH)',
      description:
        'Under the PPH agreement, patent offices can expedite examination for applications with positive results from participating offices.',
      executionTime: '6-12 months',
      serviceFee: 'Standard patent fees',
      targetGroup: 'Individuals, Enterprises',
      serviceChannel: 'Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: 'https://services.saip.gov.sa',
      steps: getFallbackSteps(),
      requirements: getFallbackRequirements(),
    };
  }
}
