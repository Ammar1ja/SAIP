/**
 * Universal Service Details Service
 * Handles ALL service detail pages by slug
 * Maps existing Drupal fields to frontend requirements
 *
 * Supported slugs:
 * - pct, pph, patent-application (Patents)
 * - copyright-complaint, trademark-complaint (IP Infringement)
 * - ip-licensing-registration (IP Licensing)
 * - consultancy-services (IP Clinics)
 * - education-projects, training-programs, qualifications (IP Academy)
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode } from '../types';

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;

  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;

  steps: Array<{
    number: number;
    title: string;
    icon?: string;
    details: string[];
  }>;

  requirements: string[];
}

// Fallback data for each service
const FALLBACK_DATA: Record<string, Partial<ServiceDetail>> = {
  pct: {
    title: 'Patent Cooperation Treaty (PCT)',
    description:
      'File a single international patent application to seek protection in multiple countries.',
    category: 'Patents',
    executionTime: 'Within 30 months from priority date',
    serviceFee: 'Variable (depends on application type)',
    platformHref: 'https://saip.gov.sa',
  },
  pph: {
    title: 'Patent Prosecution Highway (PPH)',
    description: 'Accelerate patent examination through international cooperation.',
    category: 'Patents',
    executionTime: '6-12 months',
    serviceFee: 'Standard patent fees apply',
  },
  'patent-application': {
    title: 'Patent Application',
    description: 'Apply for a patent to protect your invention.',
    category: 'Patents',
    executionTime: '18-24 months',
    serviceFee: 'Varies by type',
  },
  'copyright-complaint': {
    title: 'Complaint of Copyright Infringement',
    description: 'Report copyright infringement and protect your rights.',
    category: 'IP Infringement',
    executionTime: '5-10 business days',
    serviceFee: 'Free',
  },
  'trademark-complaint': {
    title: 'Complaint of Trademark Infringement',
    description: 'Report trademark infringement and protect your brand.',
    category: 'IP Infringement',
    executionTime: '5-10 business days',
    serviceFee: 'Free',
  },
  'ip-licensing-registration': {
    title: 'IP Licensing Registration',
    description: 'Register your IP licensing agreement.',
    category: 'IP Licensing',
    executionTime: '10-15 business days',
    serviceFee: 'Registration fee applies',
  },
  'consultancy-services': {
    title: 'IP Consultancy Services',
    description: 'Get expert advice on intellectual property matters.',
    category: 'IP Clinics',
    executionTime: 'Varies by consultation',
    serviceFee: 'Free for eligible applicants',
  },
};

/**
 * Fetch service detail from Drupal by slug or title
 */
export async function fetchServiceDetailBySlug(
  slug: string,
  locale?: string,
): Promise<DrupalNode | null> {
  try {
    // Map slug to potential titles
    const titleSearches = [
      slug.replace(/-/g, ' '),
      slug.toUpperCase(),
      FALLBACK_DATA[slug]?.title || '',
    ];

    // Try different content types
    const contentTypes = ['service_item', 'pct', 'patent_short_path', 'infringement_service_item'];

    for (const contentType of contentTypes) {
      for (const searchTitle of titleSearches) {
        if (!searchTitle) continue;

        try {
          const endpoint = `/node/${contentType}?filter[title][operator]=CONTAINS&filter[title][value]=${encodeURIComponent(searchTitle)}&filter[status]=1&sort=-changed`;
          const response = await fetchDrupal(endpoint, {}, locale);

          if (response.data && response.data.length > 0) {
            console.log(`✅ Found service '${slug}' in ${contentType}`);
            return response.data[0];
          }
        } catch (error) {
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch service detail for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Transform Drupal node to ServiceDetail
 */
export function transformServiceDetail(node: DrupalNode, slug: string): ServiceDetail {
  const attrs = node.attributes as any;

  // Parse application_process into steps
  const processText = extractText(attrs.field_application_process) || '';
  const steps = parseProcessIntoSteps(processText);

  // Parse requirements
  const requirementsText = extractText(attrs.field_requirements) || extractText(attrs.body) || '';
  const requirements = parseRequirements(requirementsText);

  const fallback = FALLBACK_DATA[slug] || {};

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    slug,
    title: attrs.title || fallback.title || 'Service',
    description:
      extractText(attrs.field_description) || extractText(attrs.body) || fallback.description || '',
    category: fallback.category || 'Services',

    executionTime: attrs.field_duration || fallback.executionTime || '5-10 business days',
    serviceFee: attrs.field_cost || fallback.serviceFee || 'Contact for pricing',
    targetGroup: extractText(attrs.field_target_group) || 'All users',
    serviceChannel: 'Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: attrs.field_external_link?.uri || fallback.platformHref || 'https://saip.gov.sa',

    steps: steps.length > 0 ? steps : getDefaultSteps(),
    requirements: requirements.length > 0 ? requirements : getDefaultRequirements(),
  };
}

/**
 * Parse text into structured steps
 */
function parseProcessIntoSteps(
  text: string,
): Array<{ number: number; title: string; details: string[] }> {
  if (!text) return [];

  const stepPattern = /(?:^|\n)(?:Step\s+)?(\d+)[.):\s-]+([^\n]+)/gi;
  const steps: Array<{ number: number; title: string; details: string[] }> = [];

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
 * Default steps for fallback
 */
function getDefaultSteps() {
  return [
    {
      number: 1,
      title: 'Log in to SAIP platform',
      details: ['Access the SAIP platform and log in with your credentials.'],
    },
    {
      number: 2,
      title: 'Select service',
      details: ['Navigate to the service you want to apply for.'],
    },
    {
      number: 3,
      title: 'Fill application',
      details: ['Complete all required fields in the application form.'],
    },
    {
      number: 4,
      title: 'Submit and pay',
      details: ['Submit your application and pay any applicable fees.'],
    },
  ];
}

/**
 * Default requirements for fallback
 */
function getDefaultRequirements() {
  return [
    'Valid identification documents',
    'Completed application form',
    'Supporting documents',
    'Payment confirmation',
  ];
}

/**
 * Get service detail by slug with fallback
 */
export async function getServiceDetailBySlug(
  slug: string,
  locale?: string,
): Promise<ServiceDetail> {
  try {
    const node = await fetchServiceDetailBySlug(slug, locale);

    if (!node) {
      console.log(`🔴 SERVICE DETAIL: Not found for '${slug}', using fallback (${locale})`);
      return {
        id: slug,
        slug,
        ...FALLBACK_DATA[slug],
        title: FALLBACK_DATA[slug]?.title || 'Service',
        description: FALLBACK_DATA[slug]?.description || '',
        executionTime: FALLBACK_DATA[slug]?.executionTime || '5-10 business days',
        serviceFee: FALLBACK_DATA[slug]?.serviceFee || 'Contact for pricing',
        targetGroup: 'All users',
        serviceChannel: 'Digital',
        faqHref: '/resources/ip-information/faq',
        platformHref: FALLBACK_DATA[slug]?.platformHref || 'https://saip.gov.sa',
        steps: getDefaultSteps(),
        requirements: getDefaultRequirements(),
      } as ServiceDetail;
    }

    const detail = transformServiceDetail(node, slug);
    console.log(`✅ SERVICE DETAIL: Using Drupal for '${slug}' (${locale})`);
    return detail;
  } catch (error) {
    console.log(`🔴 SERVICE DETAIL: Error for '${slug}', using fallback (${locale})`, error);
    return {
      id: slug,
      slug,
      ...FALLBACK_DATA[slug],
      title: FALLBACK_DATA[slug]?.title || 'Service',
      description: FALLBACK_DATA[slug]?.description || '',
      executionTime: FALLBACK_DATA[slug]?.executionTime || '5-10 business days',
      serviceFee: FALLBACK_DATA[slug]?.serviceFee || 'Contact for pricing',
      targetGroup: 'All users',
      serviceChannel: 'Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: FALLBACK_DATA[slug]?.platformHref || 'https://saip.gov.sa',
      steps: getDefaultSteps(),
      requirements: getDefaultRequirements(),
    } as ServiceDetail;
  }
}
