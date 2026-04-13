import { fetchDrupal, getRelated, getImageUrl, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface
export interface MovablesPlatformHero {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface MovablesPlatformTable {
  number: number;
  movable_name: string;
  posting_duration: string;
  posting_date: string;
  status: string;
  comm_officer: string;
  phone_number: string;
  email: string;
  details: string;
}

export interface MovablesPlatformData {
  hero: MovablesPlatformHero;
  tableData: MovablesPlatformTable[];
}

// Fetch page by UUID (2-step pattern)
async function fetchPageByUUID(uuid: string, locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = 'field_hero_background_image.field_media_image';
  const endpoint = `/node/movables_platform_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch movables items (using 'movables' content type)
export async function fetchMovablesItems(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = ['field_movables_details', 'field_movables_details.field_media_document'];
  const endpoint = `/node/movables?filter[status]=1&sort=-created&include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform page function
export function transformMovablesPlatformPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): MovablesPlatformHero {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero background image from relationships
  const heroImageEntity = getRelated(rels, 'field_hero_background_image', included);
  const heroImageUrl =
    heroImageEntity && !Array.isArray(heroImageEntity)
      ? getImageUrl(heroImageEntity, included)
      : '/images/movables-platform/hero.jpg';

  return {
    title: extractText(attrs.field_hero_heading) || attrs.title || 'Movables Platform',
    description:
      extractText(attrs.field_hero_subheading) ||
      "Discover SAIP's catalog of movables, now available for government agencies to utilize before public sale.",
    backgroundImage: heroImageUrl,
  };
}

// Helper to format date
function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr;
  }
}

// Transform movables items function
export function transformMovablesItems(
  nodes: DrupalNode[],
  included: DrupalIncludedEntity[] = [],
): MovablesPlatformTable[] {
  return nodes.map((node, index) => {
    const attrs = node.attributes as any;
    const relationships = node.relationships || {};
    const getDetailsUrl = (): string | undefined => {
      if (!relationships.field_movables_details) return undefined;

      const mediaEntity = getRelated(relationships, 'field_movables_details', included);
      if (!mediaEntity || Array.isArray(mediaEntity)) return undefined;

      const mediaRels = (mediaEntity as any).relationships || {};
      const fileEntity = getRelated(mediaRels, 'field_media_document', included);
      if (!fileEntity || Array.isArray(fileEntity)) return undefined;

      const fileAttrs = (fileEntity as any).attributes || {};
      return fileAttrs.uri?.url || undefined;
    };

    const detailsUrl = getDetailsUrl();

    return {
      number: index + 1,
      movable_name: attrs.title || 'Unknown',
      posting_duration: attrs.field_advertisement_duration || 'N/A',
      posting_date: formatDate(attrs.field_advertisement_start_date),
      status: attrs.field_movables_type || 'Open',
      comm_officer: attrs.field_communication_officer || 'N/A',
      phone_number: attrs.field_contact_number || 'N/A',
      email: attrs.field_email || 'N/A',
      details: detailsUrl || '',
    };
  });
}

// Fallback data function
export function getMovablesPlatformFallbackData(): MovablesPlatformData {
  // Generate sample data for testing pagination
  const generateSampleData = (count: number): MovablesPlatformTable[] => {
    const statuses = ['Open', 'Closed', 'Awarded'];
    const sampleData: MovablesPlatformTable[] = [];

    for (let i = 1; i <= count; i++) {
      const status = statuses[i % 3];
      const date = new Date();
      date.setDate(date.getDate() - i);

      sampleData.push({
        number: i,
        movable_name: `Movable Item ${i}`,
        posting_duration: `${30 + (i % 10)} days`,
        posting_date: formatDate(date.toISOString()),
        status: status,
        comm_officer: `Officer ${i}`,
        phone_number: `+966 50 ${String(1000000 + i).slice(-7)}`,
        email: `officer${i}@saip.gov.sa`,
        details: 'View details',
      });
    }

    return sampleData;
  };

  return {
    hero: {
      title: 'Movables Platform',
      description:
        "Discover SAIP's catalog of movables, now available for government agencies to utilize before public sale.",
      backgroundImage: '/images/movables-platform/hero.jpg',
    },
    tableData: generateSampleData(25),
  };
}

// Main export function with 2-step UUID fetch
export async function getMovablesPlatformPageData(locale?: string): Promise<MovablesPlatformData> {
  try {
    // Step 1: Get UUID
    const listEndpoint = `/node/movables_platform_page?filter[status]=1&fields[node--movables_platform_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});
    const pageNodes = listResponse.data || [];

    let hero: MovablesPlatformHero;

    if (pageNodes.length > 0) {
      // Step 2: Fetch with locale
      const uuid = pageNodes[0].id;
      const response = await fetchPageByUUID(uuid, locale);
      const node = Array.isArray(response.data) ? response.data[0] : response.data;
      const included = response.included || [];
      hero = transformMovablesPlatformPage(node, included);
      console.log(`🟢 MOVABLES PLATFORM (Hero): Using Drupal data ✅ (${locale || 'en'})`);
    } else {
      hero = getMovablesPlatformFallbackData().hero;
      console.log(`🔴 MOVABLES PLATFORM (Hero): Using fallback data ❌ (${locale || 'en'})`);
    }

    // Fetch movables items
    let tableData: MovablesPlatformTable[];
    try {
      const itemsResponse = await fetchMovablesItems(locale);
      const itemNodes = itemsResponse.data || [];

      if (itemNodes.length > 0) {
        tableData = transformMovablesItems(itemNodes, itemsResponse.included || []);
        console.log(
          `🟢 MOVABLES PLATFORM (Items): Using Drupal data ✅ (${locale || 'en'}) - ${itemNodes.length} items`,
        );
      } else {
        tableData = [];
        console.log(`⚠️ MOVABLES PLATFORM (Items): No items found (${locale || 'en'})`);
      }
    } catch (itemsError) {
      tableData = [];
      console.log(`🔴 MOVABLES PLATFORM (Items): Error fetching items (${locale || 'en'})`);
    }

    return {
      hero,
      tableData,
    };
  } catch (error) {
    console.log(`🔴 MOVABLES PLATFORM: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Movables Platform fetch error:', error);
    return getMovablesPlatformFallbackData();
  }
}
