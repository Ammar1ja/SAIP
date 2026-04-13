/**
 * IP Glossary Service
 * Handles data fetching and transformation for IP Glossary page
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { getTranslations } from 'next-intl/server';

// Frontend data interfaces
export interface IPGlossaryData {
  heroHeading: string;
  heroSubheading: string;
  glossaryTerms: GlossaryTermData[];
  acronyms: AcronymData[];
}

export interface GlossaryTermData {
  english: string;
  arabic: string;
  description: string;
}

export interface AcronymData {
  acronym: string;
  englishName: string;
  arabicName: string;
}

// Drupal API functions - 2-step UUID fetch pattern (like FAQ service)
export async function fetchIPGlossaryPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode> | null> {
  console.log(`🔍 [IP GLOSSARY PAGE] Fetching page data for locale: ${locale || 'en'}`);

  // Step 1: Fetch to get UUID with locale filtering
  const initialResponse = await fetchDrupal<DrupalNode>(
    '/node/ip_glossary_page?filter[status][value]=1',
    {},
    locale,
  );

  console.log(
    `🔍 [IP GLOSSARY PAGE] Initial response - Found ${Array.isArray(initialResponse.data) ? initialResponse.data.length : 0} nodes`,
  );

  if (initialResponse.data.length === 0) {
    console.log(`⚠️ [IP GLOSSARY PAGE] No nodes found in initial response`);
    return null;
  }

  // ✅ CRITICAL FIX: Filter nodes to match target locale
  const targetLangcode = locale === 'ar' ? 'ar' : 'en';
  const filteredNodes = Array.isArray(initialResponse.data)
    ? initialResponse.data.filter((node: DrupalNode) => {
        const nodeLangcode = (node.attributes as any)?.langcode || 'en';
        const matches = nodeLangcode === targetLangcode;
        if (!matches) {
          console.log(
            `🔍 [IP GLOSSARY PAGE] Filtered out node - langcode: ${nodeLangcode}, target: ${targetLangcode}`,
          );
        }
        return matches;
      })
    : [];

  console.log(
    `🔍 [IP GLOSSARY PAGE] After filtering - Found ${filteredNodes.length} nodes for langcode ${targetLangcode}`,
  );

  if (filteredNodes.length === 0) {
    console.log(
      `⚠️ [IP GLOSSARY PAGE] No nodes found after filtering for langcode ${targetLangcode}`,
    );
    return null;
  }

  const nodeUuid = filteredNodes[0].id;
  const nodeAttrs = (filteredNodes[0] as any).attributes || {};
  console.log(
    `🔍 [IP GLOSSARY PAGE] Selected node UUID: ${nodeUuid}, langcode: ${nodeAttrs.langcode}, title: ${nodeAttrs.title}`,
  );

  // Step 2: Fetch with UUID and locale to get translated content
  // Note: ip_glossary_page only has hero_heading and hero_subheading fields
  // No background image or media fields needed
  const response = await fetchDrupal<DrupalNode>(`/node/ip_glossary_page/${nodeUuid}`, {}, locale);

  const finalNode = Array.isArray(response.data) ? response.data[0] : response.data;
  const finalNodeAttrs = (finalNode as any).attributes || {};

  return response;
}

// Fetch individual glossary terms
export async function fetchGlossaryTerms(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // ✅ FIX: Add page limit to fetch all terms (default is 50)
  const endpoint = `/node/glossary_term?filter[status]=1&page[limit]=300&sort=title`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Fetch individual acronyms
export async function fetchAcronyms(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // ✅ FIX: Add page limit to fetch all acronyms (default is 50)
  // Note: Content type is 'acronym_term' not 'acronym'
  const endpoint = `/node/acronym_term?filter[status]=1&page[limit]=50&sort=title`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformGlossaryTerm(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GlossaryTermData {
  const attrs = (item as any).attributes || {};

  return {
    english: attrs.field_english_term || attrs.field_title || attrs.title || '',
    arabic: attrs.field_arabic_term || '',
    description:
      extractText(attrs.field_term_definition) ||
      extractText(attrs.field_description) ||
      attrs.body?.value ||
      '',
  };
}

// ✅ NEW: Combine EN and AR translations into single term objects
export function combineGlossaryTranslations(
  enTerms: DrupalNode[],
  arTerms: DrupalNode[],
  targetLocale: string = 'en',
): GlossaryTermData[] {
  const combined: GlossaryTermData[] = [];

  // Create a map of AR terms by drupal_internal__nid for quick lookup
  const arTermsMap = new Map<number, DrupalNode>();
  arTerms.forEach((term) => {
    const nid = (term.attributes as any)?.drupal_internal__nid;
    if (nid) {
      arTermsMap.set(nid, term);
    }
  });

  // Combine EN terms with their AR translations
  enTerms.forEach((enTerm) => {
    const enAttrs = (enTerm.attributes as any) || {};
    const nid = enAttrs.drupal_internal__nid;
    const arTerm = nid ? arTermsMap.get(nid) : null;
    const arAttrs = arTerm ? (arTerm.attributes as any) || {} : {};

    combined.push({
      english: enAttrs.field_english_term || enAttrs.field_title || enAttrs.title || '',
      arabic: arAttrs.field_arabic_term || arAttrs.field_title || arAttrs.title || '',
      description:
        targetLocale === 'ar'
          ? extractText(arAttrs.field_term_definition) ||
            extractText(arAttrs.field_description) ||
            extractText(enAttrs.field_term_definition) ||
            extractText(enAttrs.field_description) ||
            ''
          : extractText(enAttrs.field_term_definition) ||
            extractText(enAttrs.field_description) ||
            '',
    });
  });

  return combined;
}

export function transformAcronym(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): AcronymData {
  const attrs = (item as any).attributes || {};

  return {
    acronym: attrs.field_acronym || attrs.title || '',
    englishName: attrs.field_english_name || attrs.field_title || attrs.title || '',
    arabicName: attrs.field_title || attrs.title || '',
  };
}

// ✅ NEW: Combine EN and AR acronym translations
export function combineAcronymTranslations(
  enAcronyms: DrupalNode[],
  arAcronyms: DrupalNode[],
  targetLocale: string = 'en',
): AcronymData[] {
  const combined: AcronymData[] = [];

  // Create a map of AR acronyms by drupal_internal__nid
  const arAcronymsMap = new Map<number, DrupalNode>();
  arAcronyms.forEach((acronym) => {
    const nid = (acronym.attributes as any)?.drupal_internal__nid;
    if (nid) {
      arAcronymsMap.set(nid, acronym);
    }
  });

  // Combine EN acronyms with their AR translations
  enAcronyms.forEach((enAcronym) => {
    const enAttrs = (enAcronym.attributes as any) || {};
    const nid = enAttrs.drupal_internal__nid;
    const arAcronym = nid ? arAcronymsMap.get(nid) : null;
    const arAttrs = arAcronym ? (arAcronym.attributes as any) || {} : {};

    combined.push({
      acronym: enAttrs.title || '',
      englishName: enAttrs.field_english_name || enAttrs.field_title || enAttrs.title || '',
      arabicName: arAttrs.field_title || arAttrs.title || '',
    });
  });

  return combined;
}

export function transformIPGlossaryPage(
  node: DrupalNode,
  glossaryTerms: GlossaryTermData[],
  acronyms: AcronymData[],
  heroTranslations?: { heading: string; subheading: string },
): IPGlossaryData {
  const attrs = node.attributes as any;

  const drupalHeading = extractText(attrs.field_hero_heading);
  const drupalSubheading = extractText(attrs.field_hero_subheading);

  return {
    heroHeading: drupalHeading || heroTranslations?.heading || 'IP Glossary',
    heroSubheading:
      drupalSubheading ||
      heroTranslations?.subheading ||
      'Comprehensive glossary of over 250 key terms in Arabic and English, including 85 annotated entries, highlighting IP regulations, treaties, and the importance of protecting rights and fostering innovation.',
    glossaryTerms,
    acronyms,
  };
}

export function getIPGlossaryFallbackData(): IPGlossaryData {
  return {
    heroHeading: 'IP Glossary',
    heroSubheading:
      'Comprehensive glossary of over 250 key terms in Arabic and English, including 85 annotated entries, highlighting IP regulations, treaties, and the importance of protecting rights and fostering innovation.',
    glossaryTerms: [
      {
        english: 'Applicant',
        arabic: 'مقدم الطلب',
        description: 'The person or legal entity applying for protection.',
      },
      {
        english: 'Copyright',
        arabic: 'حقوق النشر',
        description: 'A legal right granted to the creator of original work.',
      },
      {
        english: 'Patent',
        arabic: 'براءة اختراع',
        description: 'An exclusive right granted for an invention.',
      },
    ],
    acronyms: [
      {
        acronym: 'WIPO',
        englishName: 'World Intellectual Property Organization',
        arabicName: 'المنظمة العالمية للملكية الفكرية',
      },
      {
        acronym: 'WCT',
        englishName: 'World Copyright Treaty',
        arabicName: 'المعاهدة العالمية لحقوق المؤلف',
      },
    ],
  };
}

export async function getIPGlossaryPageData(locale?: string): Promise<IPGlossaryData> {
  try {
    console.log(`🌍 [IP GLOSSARY] Requested locale: "${locale}" (${typeof locale})`);

    // Get translations for hero section (used as fallback if Drupal data is empty)
    const t = await getTranslations({ locale: locale || 'en', namespace: 'ipGlossary' });
    const heroTranslations = {
      heading: t('heroHeading'),
      subheading: t('heroSubheading'),
    };

    // ✅ NEW APPROACH: Fetch BOTH EN and AR to combine translations
    const [enTermsResponse, arTermsResponse, enAcronymsResponse, arAcronymsResponse] =
      await Promise.all([
        fetchGlossaryTerms('en').catch(() => ({ data: [], included: [] })),
        fetchGlossaryTerms('ar').catch(() => ({ data: [], included: [] })),
        fetchAcronyms('en').catch(() => ({ data: [], included: [] })),
        fetchAcronyms('ar').catch(() => ({ data: [], included: [] })),
      ]);

    console.log(
      `🔍 [IP GLOSSARY] Raw data - EN terms: ${enTermsResponse.data.length}, AR terms: ${arTermsResponse.data.length}`,
    );
    console.log(
      `🔍 [IP GLOSSARY] Raw data - EN acronyms: ${enAcronymsResponse.data.length}, AR acronyms: ${arAcronymsResponse.data.length}`,
    );

    // Filter to get only published nodes
    const enTerms = enTermsResponse.data.filter(
      (node: DrupalNode) => (node.attributes as any)?.status === true,
    );
    const arTerms = arTermsResponse.data.filter(
      (node: DrupalNode) => (node.attributes as any)?.status === true,
    );
    const enAcronyms = enAcronymsResponse.data.filter(
      (node: DrupalNode) => (node.attributes as any)?.status === true,
    );
    const arAcronyms = arAcronymsResponse.data.filter(
      (node: DrupalNode) => (node.attributes as any)?.status === true,
    );

    // Combine EN and AR translations
    const glossaryTerms = combineGlossaryTranslations(enTerms, arTerms, locale);
    const acronyms = combineAcronymTranslations(enAcronyms, arAcronyms, locale);

    console.log(
      `✅ [IP GLOSSARY] Combined data - Glossary terms: ${glossaryTerms.length}, Acronyms: ${acronyms.length}`,
    );

    // Try to fetch page data for hero section using 2-step UUID pattern
    try {
      const pageResponse = await fetchIPGlossaryPage(locale);
      if (pageResponse && pageResponse.data) {
        const node = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;
        if (node) {
          const nodeAttrs = (node as any).attributes || {};
          console.log(
            `✅ IP GLOSSARY: Using Drupal data from page (${locale || 'en'}) - langcode: ${nodeAttrs.langcode}`,
          );
          console.log(
            `🔍 [IP GLOSSARY] Hero heading from Drupal: ${extractText(nodeAttrs.field_hero_heading)?.substring(0, 100) || 'EMPTY'}...`,
          );
          console.log(
            `🔍 [IP GLOSSARY] Hero subheading from Drupal: ${extractText(nodeAttrs.field_hero_subheading)?.substring(0, 100) || 'EMPTY'}...`,
          );
          return transformIPGlossaryPage(node, glossaryTerms, acronyms, heroTranslations);
        }
      } else {
        console.log(`⚠️ IP GLOSSARY: Page response is null or has no data (${locale || 'en'})`);
      }
    } catch (pageError) {
      console.log(`⚠️ IP GLOSSARY: Error fetching page data (${locale || 'en'}):`, pageError);
      // Continue with terms and acronyms only
    }

    // If we have terms or acronyms, return them with translated hero
    if (glossaryTerms.length > 0 || acronyms.length > 0) {
      console.log(`✅ IP GLOSSARY: Using Drupal data from individual items (${locale || 'en'})`);
      return {
        heroHeading: heroTranslations.heading,
        heroSubheading: heroTranslations.subheading,
        glossaryTerms,
        acronyms,
      };
    }

    console.log('🔴 IP GLOSSARY: No content found, using fallback data');
    return getIPGlossaryFallbackData();
  } catch (error) {
    console.log(`🔴 IP GLOSSARY: Error fetching data, using fallback data (${locale || 'en'})`);
    return getIPGlossaryFallbackData();
  }
}
