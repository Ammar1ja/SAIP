/**
 * IP Licensing Registration Service Detail Service
 * Fetches IP Agent License Registration from Drupal service_item
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode } from '../types';

export interface IPLicensingServiceDetail {
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
 * Fetch IP Licensing Registration service from Drupal
 */
export async function fetchIPLicensingService(locale?: string): Promise<DrupalNode | null> {
  try {
    // Search for "IP Agent License Registration" in service_item
    const endpoint = `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=IP Agent License Registration&filter[status]=1`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      console.log('✅ Found IP Licensing Registration in service_item');
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch IP Licensing service:', error);
    return null;
  }
}

/**
 * Transform Drupal node to IPLicensingServiceDetail
 */
export function transformIPLicensingService(node: DrupalNode): IPLicensingServiceDetail {
  const attrs = node.attributes as any;

  // Parse application_process into steps
  const processText = extractText(attrs.field_application_process) || '';
  const steps = parseProcessIntoSteps(processText);

  // Parse requirements into array
  const requirementsText = extractText(attrs.field_requirements) || extractText(attrs.body) || '';
  const requirements = parseRequirements(requirementsText);

  return {
    id: attrs.drupal_internal__nid?.toString() || node.id,
    title: attrs.title || 'IP Agent License Registration',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',

    executionTime: attrs.field_duration || 'Up to 30 days',
    serviceFee: attrs.field_cost || 'Free',
    targetGroup: extractText(attrs.field_target_group) || 'Individuals, Legal professionals',
    serviceChannel: 'Digital',
    faqHref: '/resources/ip-information/faq',
    platformHref: attrs.field_external_link?.uri || 'https://saip.gov.sa',

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
 * Fallback steps from Registration.data.ts
 */
function getFallbackSteps() {
  return [
    {
      number: 1,
      title: 'Create an account',
      icon: 'user-plus',
      details: [
        'Visit the SAIP platform',
        'Register for an account if you do not have one',
        'Provide your personal and professional information',
      ],
    },
    {
      number: 2,
      title: 'Submit application',
      icon: 'clipboard-plus',
      details: [
        'Navigate to IP Agent License section',
        'Fill in the application form with required information',
        'Upload necessary documents and credentials',
      ],
    },
    {
      number: 3,
      title: 'Pay application fees',
      icon: 'key-round',
      details: [
        'Review your application',
        'Proceed to payment',
        'Pay the required license application fees',
      ],
    },
    {
      number: 4,
      title: 'Application review',
      icon: 'send',
      details: [
        'SAIP will review your application and credentials',
        'Additional information may be requested if needed',
        'Review process typically takes up to 30 days',
      ],
    },
    {
      number: 5,
      title: 'Receive license',
      icon: 'check-circle',
      details: [
        'Upon approval, you will receive your IP Agent License',
        'License certificate will be available on the platform',
        'You can now practice as a certified IP Agent',
      ],
    },
  ];
}

/**
 * Fallback requirements from Registration.data.ts
 */
function getFallbackRequirements(): string[] {
  return [
    'Saudi national or GCC citizen',
    `Bachelor's degree in law, engineering, or related field`,
    'At least 3 years of experience in IP matters',
    'Pass the IP Agent examination',
    'Good conduct certificate',
    'No criminal record related to IP violations',
    'Professional liability insurance',
  ];
}

/**
 * Fetch related IP Licensing services
 */
export async function fetchRelatedIPLicensingServices(locale?: string): Promise<any[]> {
  try {
    const endpoint = `/node/service_item?filter[title][operator]=CONTAINS&filter[title][value]=IP Agent License&filter[status]=1&page[limit]=10`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (response.data && response.data.length > 0) {
      return response.data
        .filter((node: any) => {
          const title = node.attributes?.title || '';
          // Exclude "Registration" - it's the current page
          return !title.includes('Registration');
        })
        .map((node: any) => ({
          id: node.id,
          title: node.attributes?.title || '',
          description: extractText(node.attributes?.field_description) || '',
          href: `/services/ip-licensing/${node.attributes?.title?.toLowerCase().replace(/\s+/g, '-')}`,
          category: 'IP Licensing',
        }))
        .slice(0, 3); // Limit to 3 related services
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch related IP Licensing services:', error);
    return [];
  }
}

/**
 * Main function: Get IP Licensing Registration service detail data
 */
export async function getIPLicensingServiceDetail(
  locale?: string,
): Promise<IPLicensingServiceDetail> {
  try {
    const node = await fetchIPLicensingService(locale);

    if (!node) {
      console.log(
        `⚠️ IP LICENSING REGISTRATION: Using fallback data (${locale || 'en'}) - No node found`,
      );
      return {
        id: 'fallback',
        title: 'IP Agent License Registration',
        description:
          'Become a certified IP Agent and represent clients in Intellectual Property matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia.',
        executionTime: 'Up to 30 days',
        serviceFee: 'Free',
        targetGroup: 'Individuals, Legal professionals',
        serviceChannel: 'Digital',
        faqHref: '/resources/ip-information/faq',
        platformHref: 'https://saip.gov.sa',
        steps: getFallbackSteps(),
        requirements: getFallbackRequirements(),
      };
    }

    const data = transformIPLicensingService(node);

    console.log(
      `✅ IP LICENSING REGISTRATION: Loaded from Drupal (${locale || 'en'}) - Node ${data.id}`,
    );

    return data;
  } catch (error) {
    console.error('IP Licensing Registration service error:', error);
    // Return fallback on error
    return {
      id: 'fallback-error',
      title: 'IP Agent License Registration',
      description:
        'Become a certified IP Agent and represent clients in Intellectual Property matters.',
      executionTime: 'Up to 30 days',
      serviceFee: 'Free',
      targetGroup: 'Individuals, Legal professionals',
      serviceChannel: 'Digital',
      faqHref: '/resources/ip-information/faq',
      platformHref: 'https://saip.gov.sa',
      steps: getFallbackSteps(),
      requirements: getFallbackRequirements(),
    };
  }
}
