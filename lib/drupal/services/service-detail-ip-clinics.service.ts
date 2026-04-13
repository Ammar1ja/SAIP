/**
 * IP Clinics Consultancy Service Detail Service
 * Fetches IP consultancy clinics services from Drupal service_item
 */

import { fetchDrupal, extractText, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalTaxonomyEntity } from '../types';

export interface IPClinicsServiceDetail {
  id: string;
  title: string;
  description: string;
  labels: string[];

  // Sidebar
  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;

  // Steps & Requirements
  steps: Array<{
    number: number;
    title: string;
    icon?: string;
    details: string[];
  }>;

  requirements: string[];
}

function extractTaxonomyLabels(
  rels: any,
  included: DrupalIncludedEntity[],
  fieldName: string,
): string[] {
  const related = getRelated(rels, fieldName, included);
  if (!related) return [];

  const items = Array.isArray(related) ? related : [related];
  return items
    .map((item: any) => (item as DrupalTaxonomyEntity)?.attributes?.name)
    .filter((name: string | undefined) => Boolean(name));
}

function dedupeLabels(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Transform Drupal node to IPClinicsServiceDetail
 */
export function transformIPClinicsService(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): IPClinicsServiceDetail {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  const processText = extractText(attrs.field_application_process) || '';
  const steps = parseProcessIntoSteps(processText);

  const requirementsText = extractText(attrs.field_requirements) || extractText(attrs.body) || '';
  const requirements = parseRequirements(requirementsText);

  const labels = dedupeLabels([
    ...extractTaxonomyLabels(rels, included, 'field_ip_category'),
    ...extractTaxonomyLabels(rels, included, 'field_type'),
    ...extractTaxonomyLabels(rels, included, 'field_label'),
  ]);

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title: attrs.title || 'Services of the IP consultancy clinics',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',
    labels,

    executionTime: attrs.field_duration || 'Ongoing',
    serviceFee: attrs.field_cost || 'Free',
    targetGroup: extractText(attrs.field_target_group) || 'Individuals, SMEs, Startups',
    serviceChannel: 'On-site / Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: attrs.field_external_link?.uri || 'https://services.saip.gov.sa',
    secondaryButtonLabel: attrs.field_secondary_button_label || '',
    secondaryButtonHref: attrs.field_secondary_button_href || '',

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
      title: 'Book an appointment',
      icon: 'calendar',
      details: ['Book an appointment online or by phone with IP consultancy clinic.'],
    },
    {
      number: 2,
      title: 'Prepare materials',
      icon: 'file-text',
      details: ['Gather relevant documents and prepare your questions about IP matters.'],
    },
    {
      number: 3,
      title: 'Attend consultation',
      icon: 'users',
      details: ['Attend your scheduled consultation session with IP experts.'],
    },
    {
      number: 4,
      title: 'Receive recommendations',
      icon: 'check-circle',
      details: ['Get expert recommendations and next steps for protecting your IP.'],
    },
  ];
}

/**
 * Fallback requirements
 */
function getFallbackRequirements(): string[] {
  return [
    'Basic registration online',
    'Brief description of your project or innovation',
    'Relevant documents (optional)',
    'Pre-booked appointment',
  ];
}

/**
 * Fetch related IP Clinics services
 */
export async function fetchRelatedIPClinicsServices(locale?: string): Promise<any[]> {
  try {
    const endpoint = `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=clinic&filter[status]=1&page[limit]=10`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      return response.data
        .filter((node: any) => {
          const title = node.attributes?.title || '';
          return !title.includes('consultancy');
        })
        .map((node: any) => ({
          id: node.id,
          title: node.attributes?.title || '',
          description: extractText(node.attributes?.field_description) || '',
          href: `/services/ip-clinics/${node.attributes?.title?.toLowerCase().replace(/\s+/g, '-')}`,
          category: 'IP Clinics',
        }))
        .slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch related IP Clinics services:', error);
    return [];
  }
}

/**
 * Main function: Get IP Clinics Consultancy service detail data
 */
export async function getIPClinicsServiceDetail(locale?: string): Promise<IPClinicsServiceDetail> {
  try {
    const response = await fetchDrupal(
      `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=consultancy clinics&filter[status]=1&include=field_label,field_type,field_ip_category`,
      {},
      locale,
    );
    const node = response.data?.[0] || null;
    const included = response.included || [];

    if (!node) {
      console.log(`⚠️ IP CLINICS: Using fallback data (${locale || 'en'}) - No node found`);
      return {
        id: 'fallback',
        title: 'Services of the IP consultancy clinics',
        description:
          'IP consultancy clinics provide free specialized consultancy services for individuals, startups, and SMEs on intellectual property rights, protection, and management.',
        labels: ['IP Clinics', 'Guidance'],
        executionTime: 'Ongoing',
        serviceFee: 'Free',
        targetGroup: 'Individuals, SMEs, Startups',
        serviceChannel: 'On-site / Digital',
        faqHref: '/resources/ip-information/faq',
        platformHref: 'https://services.saip.gov.sa',
        secondaryButtonLabel: '',
        secondaryButtonHref: '',
        steps: getFallbackSteps(),
        requirements: getFallbackRequirements(),
      };
    }

    const data = transformIPClinicsService(node, included);

    console.log(`✅ IP CLINICS: Loaded from Drupal (${locale || 'en'}) - Node ${data.id}`);

    return data;
  } catch (error) {
    console.error('IP Clinics service error:', error);
    return {
      id: 'fallback-error',
      title: 'Services of the IP consultancy clinics',
      description:
        'Free IP consultancy services for individuals and businesses to help protect and manage their intellectual property.',
      labels: ['IP Clinics', 'Guidance'],
      executionTime: 'Ongoing',
      serviceFee: 'Free',
      targetGroup: 'Individuals, SMEs, Startups',
      serviceChannel: 'On-site / Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: 'https://services.saip.gov.sa',
      secondaryButtonLabel: '',
      secondaryButtonHref: '',
      steps: getFallbackSteps(),
      requirements: getFallbackRequirements(),
    };
  }
}
