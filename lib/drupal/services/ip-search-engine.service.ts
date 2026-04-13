import { fetchDrupal, getRelated, getImageUrl, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for IP Search Engine
export interface AudienceItem {
  title: string;
  description: string;
  iconName: string;
}

/** Figma hero subheading when Drupal `field_hero_subheading` is empty. */
const HERO_DESCRIPTION_FALLBACK_EN =
  'IP Search Engine is an advanced tool for accessing intellectual property data, empowering innovators, businesses, institutions, and governments to protect rights, analyze markets, and make strategic decisions.';

const HERO_DESCRIPTION_FALLBACK_AR =
  'محرك بحث الملكية الفكرية أداة متقدمة للوصول إلى بيانات الملكية الفكرية، يمكّن المبتكرين والشركات والمؤسسات والحكومات من حماية الحقوق وتحليل الأسواق واتخاذ قرارات استراتيجية.';

export interface IPSearchEngineData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  searchSection: {
    title: string;
    buttonLabel: string;
    toolUrl: string;
    toolImage: string;
  };
  audienceSection: {
    heading: string;
    items: AudienceItem[];
  };
}

// Fetch paragraph by UUID with locale
async function fetchParagraphByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalIncludedEntity | null> {
  try {
    const endpoint = `/paragraph/audience_item/${uuid}`;
    const response = await fetchDrupal<DrupalIncludedEntity>(endpoint, {}, locale);
    return Array.isArray(response.data) ? response.data[0] : response.data;
  } catch {
    return null;
  }
}

// 2-step UUID fetch for proper locale support
async function fetchIPSearchEngineByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_search_tool_image',
    'field_search_tool_image.field_media_image',
    'field_audience_items',
  ].join(',');

  const endpoint = `/node/ip_search_engine_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformIPSearchEnginePage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  translatedAudienceItems?: AudienceItem[],
  locale?: string,
): IPSearchEngineData {
  const attrs = node.attributes as Record<string, unknown>;
  const rels = node.relationships || {};

  // Get hero background image
  const heroImageEntity = getRelated(rels, 'field_hero_background_image', included);
  const heroImageUrl =
    heroImageEntity && !Array.isArray(heroImageEntity)
      ? getImageUrl(heroImageEntity, included)
      : '/images/ip-search-engine/hero.png';

  // Get search tool image
  const toolImageEntity = getRelated(rels, 'field_search_tool_image', included);
  const toolImageUrl =
    toolImageEntity && !Array.isArray(toolImageEntity)
      ? getImageUrl(toolImageEntity, included)
      : '/images/ip-search-engine/ip-search-engine.png';

  // Use translated audience items if provided, otherwise get from included
  const audienceItems: AudienceItem[] = translatedAudienceItems || [];

  if (audienceItems.length === 0) {
    const audienceEntities = getRelated(rels, 'field_audience_items', included);
    if (Array.isArray(audienceEntities)) {
      for (const entity of audienceEntities) {
        const itemAttrs = entity.attributes as Record<string, unknown>;
        audienceItems.push({
          title: extractText(itemAttrs.field_title) || '',
          description: extractText(itemAttrs.field_description) || '',
          iconName: (itemAttrs.field_icon_name as string) || 'Search',
        });
      }
    }
  }

  // Fallback audience items if none from Drupal
  const defaultAudienceItems: AudienceItem[] = [
    {
      title: 'For Innovators and Researchers',
      description:
        'To verify the uniqueness of inventions and identify existing technologies before filing patents.',
      iconName: 'Search',
    },
    {
      title: 'For IP Enforcement and Litigation',
      description:
        'To detect IP infringement and support legal disputes with validity assessments.',
      iconName: 'Scale',
    },
    {
      title: 'For Government and Policymakers',
      description:
        'To leverage IP data for policy-making, national strategies, and collaborative opportunities.',
      iconName: 'Landmark',
    },
    {
      title: 'For Businesses',
      description:
        'To ensure products, trademarks, and designs do not infringe on existing rights.',
      iconName: 'Briefcase',
    },
    {
      title: 'For Strategic Market Insights',
      description:
        'To analyze competitor filings and explore innovation trends for R&D and strategy.',
      iconName: 'BarChart2',
    },
  ];

  const heroDescriptionFallback =
    locale === 'ar' ? HERO_DESCRIPTION_FALLBACK_AR : HERO_DESCRIPTION_FALLBACK_EN;

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'IP Search Engine',
      description: extractText(attrs.field_hero_subheading) || heroDescriptionFallback,
      backgroundImage: heroImageUrl,
    },
    searchSection: {
      title:
        extractText(attrs.field_section_title) ||
        'Here you can find link to the <strong>IP search engine</strong>',
      buttonLabel: extractText(attrs.field_button_label) || 'Go to IP search engine',
      toolUrl: (attrs.field_search_tool_url as string) || 'https://ipsearch.saip.gov.sa',
      toolImage: toolImageUrl,
    },
    audienceSection: {
      heading:
        extractText(attrs.field_audience_heading) || 'Who and when can use IP search engine?',
      items: audienceItems.length > 0 ? audienceItems : defaultAudienceItems,
    },
  };
}

// Fallback data function
export function getIPSearchEngineFallbackData(locale?: string): IPSearchEngineData {
  return transformIPSearchEnginePage(
    { attributes: {}, relationships: {} } as DrupalNode,
    [],
    undefined,
    locale,
  );
}

// Main export function with 2-step UUID fetch
export async function getIPSearchEnginePageData(locale?: string): Promise<IPSearchEngineData> {
  try {
    // Step 1: Get node UUID (without locale filter for status=1)
    const listEndpoint = `/node/ip_search_engine_page?filter[status]=1&fields[node--ip_search_engine_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});

    if (!listResponse.data || listResponse.data.length === 0) {
      console.log(`🔴 IP SEARCH ENGINE: No node found, using fallback ❌`);
      return getIPSearchEngineFallbackData(locale);
    }

    const uuid = listResponse.data[0].id;

    // Step 2: Fetch full node with locale
    const response = await fetchIPSearchEngineByUuid(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    if (!node) {
      console.log(`🔴 IP SEARCH ENGINE: Using fallback data ❌ (${locale || 'en'})`);
      return getIPSearchEngineFallbackData(locale);
    }

    // Step 3: Fetch audience items with proper locale
    const translatedAudienceItems: AudienceItem[] = [];
    const rels = node.relationships || {};
    const audienceRefs = rels.field_audience_items?.data;

    if (Array.isArray(audienceRefs)) {
      for (const ref of audienceRefs) {
        const paragraphUuid = ref.id;
        const paragraph = await fetchParagraphByUuid(paragraphUuid, locale);
        if (paragraph) {
          const itemAttrs = paragraph.attributes as Record<string, unknown>;
          translatedAudienceItems.push({
            title: extractText(itemAttrs.field_title) || '',
            description: extractText(itemAttrs.field_description) || '',
            iconName: (itemAttrs.field_icon_name as string) || 'Search',
          });
        }
      }
    }

    const data = transformIPSearchEnginePage(node, included, translatedAudienceItems, locale);
    console.log(`🟢 IP SEARCH ENGINE: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 IP SEARCH ENGINE: Using fallback data ❌ (${locale || 'en'})`);
    console.error('IP Search Engine fetch error:', error);
    return getIPSearchEngineFallbackData(locale);
  }
}
