/**
 * IP Academy Service
 * Handles training programs, qualifications, and education projects
 */

import { fetchContentType, extractText, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface AcademyProgramDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  language: string;
  location: string;
  startDate?: string;
  fees: string;
  forWhom: string;
  courseFormat?: string;
  whatYouWillLearn?: string[];
  courseMaterials?: string[];
  faqHref?: string;
  registerHref?: string;
}

/**
 * Fetch training program by ID
 */
export async function fetchTrainingProgram(id: string, locale?: string) {
  try {
    const response = await fetchContentType(
      'training_program',
      {
        filter: {
          drupal_internal__nid: id,
          status: '1',
        },
      },
      locale,
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch training program (${id}):`, error);
    return null;
  }
}

/**
 * Fetch qualification by ID
 */
export async function fetchQualification(id: string, locale?: string) {
  try {
    const response = await fetchContentType(
      'qualification',
      {
        filter: {
          drupal_internal__nid: id,
          status: '1',
        },
        include: ['field_chapters', 'field_requirements'],
      },
      locale,
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch qualification (${id}):`, error);
    return null;
  }
}

/**
 * Transform training program node
 */
export function transformTrainingProgram(node: DrupalNode): AcademyProgramDetail {
  const attrs = node.attributes as any;

  // Parse "what you will learn" list
  const whatYouWillLearn = extractText(attrs.field_what_you_will_learn)
    ?.split(/\n|<li>|•/)
    .map((item) => item.replace(/<[^>]+>/g, '').trim())
    .filter((item) => item.length > 3);

  // Parse course materials
  const courseMaterials = extractText(attrs.field_course_materials)
    ?.split(/\n|<li>|•/)
    .map((item) => item.replace(/<[^>]+>/g, '').trim())
    .filter((item) => item.length > 3);

  return {
    id: attrs.drupal_internal__nid?.toString() || '',
    title: attrs.title || '',
    description: extractText(attrs.field_description) || extractText(attrs.field_details) || '',
    duration: attrs.field_duration || 'N/A',
    language: attrs.field_language || 'English',
    location: attrs.field_location || 'Online',
    startDate: attrs.field_start_date,
    fees: attrs.field_fees || 'Free',
    forWhom: extractText(attrs.field_for_whom) || 'General public',
    courseFormat: attrs.field_course_format,
    whatYouWillLearn,
    courseMaterials,
    faqHref: attrs.field_faq_href?.uri || '/resources/ip-information/faq',
    registerHref: attrs.field_register_href?.uri || 'https://saip.gov.sa',
  };
}

/**
 * Transform qualification node
 */
export function transformQualification(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): AcademyProgramDetail {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get chapters/requirements
  const chapters = getRelated(rels, 'field_chapters', included) || [];
  const requirements = getRelated(rels, 'field_requirements', included) || [];

  const chaptersText = Array.isArray(chapters)
    ? chapters.map((ch: any) => ch.attributes?.title || '').filter(Boolean)
    : [];

  const requirementsText = Array.isArray(requirements)
    ? requirements.map((req: any) => extractText(req.attributes?.field_text) || '').filter(Boolean)
    : [];

  return {
    id: attrs.drupal_internal__nid?.toString() || '',
    title: attrs.title || '',
    description: extractText(attrs.field_description) || extractText(attrs.field_details) || '',
    duration: attrs.field_duration || 'N/A',
    language: attrs.field_language || 'English',
    location: attrs.field_location || 'Online',
    fees: attrs.field_fees || 'Free',
    forWhom: extractText(attrs.field_for_whom) || 'General public',
    whatYouWillLearn: chaptersText,
    courseMaterials: requirementsText,
    faqHref: attrs.field_faq_href?.uri || '/resources/ip-information/faq',
    registerHref: attrs.field_register_href?.uri || 'https://saip.gov.sa',
  };
}

/**
 * Get training program details with fallback
 */
export async function getTrainingProgramData(
  id: string,
  locale?: string,
): Promise<AcademyProgramDetail | null> {
  try {
    const node = await fetchTrainingProgram(id, locale);

    if (!node) {
      console.log(`🔴 ACADEMY: No training program found for ID ${id}, using fallback (${locale})`);
      return {
        id,
        title: `Training Program ${id}`,
        description: 'Training program details are being updated.',
        duration: 'N/A',
        language: 'English',
        location: 'Online',
        fees: 'Free',
        forWhom: 'General public',
        faqHref: '/resources/ip-information/faq',
        registerHref: 'https://saip.gov.sa',
      };
    }

    const data = transformTrainingProgram(node);
    console.log(`✅ ACADEMY: Using Drupal data for training program ${id} (${locale})`);
    return data;
  } catch (error) {
    console.log(`🔴 ACADEMY: Error for training program ${id}, using fallback (${locale})`, error);
    return {
      id,
      title: `Training Program ${id}`,
      description: 'Training program details are being updated.',
      duration: 'N/A',
      language: 'English',
      location: 'Online',
      fees: 'Free',
      forWhom: 'General public',
      faqHref: '/resources/ip-information/faq',
      registerHref: 'https://saip.gov.sa',
    };
  }
}

/**
 * Get qualification details with fallback
 */
export async function getQualificationData(
  id: string,
  locale?: string,
): Promise<AcademyProgramDetail | null> {
  try {
    const node = await fetchQualification(id, locale);

    if (!node) {
      console.log(`🔴 ACADEMY: No qualification found for ID ${id}, using fallback (${locale})`);
      return {
        id,
        title: `Qualification ${id}`,
        description: 'Qualification details are being updated.',
        duration: 'N/A',
        language: 'English',
        location: 'Online',
        fees: 'Free',
        forWhom: 'General public',
        faqHref: '/resources/ip-information/faq',
        registerHref: 'https://saip.gov.sa',
      };
    }

    const data = transformQualification(node);
    console.log(`✅ ACADEMY: Using Drupal data for qualification ${id} (${locale})`);
    return data;
  } catch (error) {
    console.log(`🔴 ACADEMY: Error for qualification ${id}, using fallback (${locale})`, error);
    return {
      id,
      title: `Qualification ${id}`,
      description: 'Qualification details are being updated.',
      duration: 'N/A',
      language: 'English',
      location: 'Online',
      fees: 'Free',
      forWhom: 'General public',
      faqHref: '/resources/ip-information/faq',
      registerHref: 'https://saip.gov.sa',
    };
  }
}
