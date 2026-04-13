/**
 * Public Consultations Service
 * Handles data fetching and transformation for Public Consultations page
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { getAllConsultationCards } from '@/app/[locale]/resources/tools-and-research/public-consultations/consultationData';

// Frontend data interfaces
export interface PublicConsultationsData {
  heroHeading: string;
  heroSubheading: string;
  sectionHeading: string;
  consultations: ConsultationCardData[];
}

export interface ConsultationCardData {
  id: string;
  title: string;
  durationDate: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
}

export interface ConsultationDetailData {
  id: string;
  title: string;
  closingDate: string;
  description: string;
  content: string;
}

// Drupal API functions

// Step 1: Fetch UUID without locale to ensure we get the node
async function fetchPublicConsultationsPageUuid(): Promise<string | null> {
  try {
    const endpoint = `/node/public_consultations_page?filter[status]=1`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, 'en');
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching public_consultations_page UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchPublicConsultationsPageByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_consultations',
  ];
  const endpoint = `/node/public_consultations_page/${uuid}?include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch individual consultations
export async function fetchConsultations(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const endpoint = `/node/consultation?filter[status]=1`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Fetch single consultation by ID (NID, UUID, or SLUG)
export async function fetchConsultationById(
  id: string,
  locale?: string,
): Promise<DrupalNode | null> {
  try {
    // Check if id is a UUID (8-4-4-4-12 format with hyphens)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    // Check if id is purely numeric (NID)
    const isNid = /^\d+$/.test(id);

    if (isUuid) {
      // Direct UUID lookup
      const endpoint = `/node/consultation/${id}`;
      const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } else if (isNid) {
      // NID lookup: first get UUID, then fetch with locale
      // Step 1: Fetch by NID (always in EN) to get UUID
      const nidEndpoint = `/node/consultation?filter[drupal_internal__nid]=${id}`;
      const nidResponse = await fetchDrupal<DrupalNode>(nidEndpoint, {}, 'en');

      if (!nidResponse.data || nidResponse.data.length === 0) {
        console.error(`Consultation NID ${id} not found`);
        return null;
      }

      const uuid = nidResponse.data[0].id;

      // Step 2: Fetch by UUID with correct locale
      const endpoint = `/node/consultation/${uuid}`;
      const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
      return Array.isArray(response.data) ? response.data[0] : response.data;
    } else {
      // SLUG lookup: first get UUID, then fetch with locale
      // Step 1: Fetch by slug (always in EN) to get UUID
      const slugEndpoint = `/node/consultation?filter[field_slug]=${id}`;
      const slugResponse = await fetchDrupal<DrupalNode>(slugEndpoint, {}, 'en');

      if (!slugResponse.data || slugResponse.data.length === 0) {
        console.error(`Consultation slug "${id}" not found`);
        return null;
      }

      const uuid = slugResponse.data[0].id;

      // Step 2: Fetch by UUID with correct locale
      const endpoint = `/node/consultation/${uuid}`;
      const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
      return Array.isArray(response.data) ? response.data[0] : response.data;
    }
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return null;
  }
}

// Transformation functions
export function transformConsultationCard(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): ConsultationCardData {
  const attrs = (item as any).attributes || {};
  const nid = attrs.drupal_internal__nid || item.id;

  // ✅ Use field_slug if available, otherwise fall back to NID
  const slug = attrs.field_slug || nid.toString();

  return {
    id: nid.toString(),
    title: attrs.title || 'Untitled Consultation',
    durationDate:
      attrs.field_duration_date ||
      `Date of closing public consultations: ${attrs.field_closing_date || 'TBD'}`,
    primaryButtonLabel: attrs.field_primary_button_label || 'Read more',
    primaryButtonHref:
      attrs.field_primary_button_href ||
      `/resources/tools-and-research/public-consultations/${slug}`,
  };
}

export function transformConsultationDetail(
  item: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ConsultationDetailData {
  const attrs = item.attributes;
  const nid = attrs.drupal_internal__nid || item.id;

  return {
    id: nid.toString(),
    title: attrs.title || 'Untitled Consultation',
    closingDate: attrs.field_closing_date || '',
    description:
      attrs.field_duration_date ||
      `Date of closing public consultations: ${attrs.field_closing_date || 'TBD'}`,
    content: extractText(attrs.body) || extractText(attrs.field_content) || '',
  };
}

export function getPublicConsultationsFallbackData(): PublicConsultationsData {
  const consultationCards = getAllConsultationCards();

  return {
    heroHeading: 'Public consultations',
    heroSubheading:
      'SAIP invites the public to participate in the formulation of regulations related to intellectual property. Consultations are open to all individuals and entities. SAIP is committed to reviewing all feedback received and will consider the responses received in the development of regulations.',
    sectionHeading: 'SAIP invites the distinguished public to express its views on:',
    consultations: consultationCards.map((card) => ({
      id: card.id,
      title: card.title,
      durationDate: card.durationDate,
      primaryButtonLabel: card.primaryButtonLabel,
      primaryButtonHref: card.primaryButtonHref,
    })),
  };
}

export async function getPublicConsultationsPageData(
  locale?: string,
): Promise<PublicConsultationsData> {
  try {
    // Step 1: Get UUID without locale
    const uuid = await fetchPublicConsultationsPageUuid();
    if (!uuid) {
      console.log(`🔴 PUBLIC CONSULTATIONS: No page found, using fallback (${locale || 'en'})`);
      return getPublicConsultationsFallbackData();
    }

    // Step 2: Fetch page data with locale (2-step UUID pattern)
    const pageResponse = await fetchPublicConsultationsPageByUuid(uuid, locale);
    const node = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;

    if (!node) {
      console.log(`🔴 PUBLIC CONSULTATIONS: Node not found by UUID (${locale || 'en'})`);
      return getPublicConsultationsFallbackData();
    }

    const attrs = node.attributes as any;

    // Step 3: Get consultations from field_consultations (curated list)
    const relationships = (node as any).relationships || {};
    const consultationsRel = relationships.field_consultations?.data;
    let consultations: ConsultationCardData[] = [];

    if (consultationsRel && Array.isArray(consultationsRel) && consultationsRel.length > 0) {
      // Use curated list from CMS
      const consultationNodes = consultationsRel
        .map((ref: any) => {
          return pageResponse.included?.find(
            (i) => i.type === 'node--consultation' && i.id === ref.id,
          );
        })
        .filter(Boolean);

      consultations = consultationNodes.map((item) =>
        transformConsultationCard(item as DrupalIncludedEntity, pageResponse.included || []),
      );

      console.log(`🟢 PUBLIC CONSULTATIONS: Using curated list from CMS ✅ (${locale || 'en'})`);
    } else {
      // Fallback: fetch all active consultations (backward compatibility)
      const consultationsResponse = await fetchConsultations(locale);
      consultations = consultationsResponse.data.map((item) =>
        transformConsultationCard(item, consultationsResponse.included || []),
      );

      console.log(
        `🟡 PUBLIC CONSULTATIONS: Using all active consultations (fallback) (${locale || 'en'})`,
      );
    }

    console.log(`  Hero: ${extractText(attrs.field_hero_heading)}`);
    console.log(`  Consultations: ${consultations.length}`);

    return {
      heroHeading: extractText(attrs.field_hero_heading) || 'Public consultations',
      heroSubheading:
        extractText(attrs.field_hero_subheading) ||
        'SAIP invites the public to participate in the formulation of regulations.',
      sectionHeading:
        extractText(attrs.field_section_heading) ||
        'SAIP invites the distinguished public to express its views on:',
      consultations,
    };
  } catch (error) {
    console.log(`🔴 PUBLIC CONSULTATIONS: Error fetching data, using fallback (${locale || 'en'})`);
    console.error(error);
    return getPublicConsultationsFallbackData();
  }
}

// Get single consultation detail
export async function getConsultationDetailData(
  id: string,
  locale?: string,
): Promise<ConsultationDetailData | null> {
  try {
    const consultation = await fetchConsultationById(id, locale);
    if (!consultation) {
      return null;
    }

    return transformConsultationDetail(consultation, []);
  } catch (error) {
    console.error('Error fetching consultation detail:', error);
    return null;
  }
}
