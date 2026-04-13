import { fetchDrupal, getRelated, getImageWithAlt } from '../utils';
import { extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for Resources Overview
export interface ResourcesOverviewData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  sections: {
    ipInfo: {
      title: string;
      description: string;
      items: Array<{ title: string; href: string }>;
    };
    tools: {
      title: string;
      description: string;
      items: Array<{ title: string; href: string }>;
    };
    laws: {
      title: string;
      description: string;
      items: Array<{ title: string; href: string }>;
    };
    licensing: {
      title: string;
      description: string;
      items: Array<{ title: string; href: string }>;
    };
  };
}

// Helper to extract card items from paragraph relationships
function extractCardItems(
  node: DrupalNode,
  fieldName: string,
  included: DrupalIncludedEntity[],
): Array<{ title: string; href: string }> {
  if (!node.relationships?.[fieldName]?.data) {
    return [];
  }

  const paragraphs = getRelated(node.relationships, fieldName, included);
  const paragraphArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];

  return paragraphArray
    .filter((p): p is DrupalIncludedEntity => p !== null && p !== undefined)
    .map((paragraph) => {
      const attrs = paragraph.attributes as Record<string, unknown>;
      return {
        title: extractText(attrs.field_card_title) || '',
        href: extractText(attrs.field_card_href) || '#',
      };
    })
    .filter((item) => item.title && item.href);
}

// Transform function
export function transformResourcesOverviewPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ResourcesOverviewData {
  const attrs = node.attributes as Record<string, unknown>;

  // Get hero background image from relationships
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          included,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Resources',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Access comprehensive resources, guides, and tools for intellectual property.',
      backgroundImage: heroImage?.src || '/images/resources/hero.jpg',
    },
    sections: {
      ipInfo: {
        title: extractText(attrs.field_ip_info_heading) || 'IP Information',
        description:
          extractText(attrs.field_ip_info_description) ||
          'Essential information and guides about intellectual property.',
        items: extractCardItems(node, 'field_ip_info_items', included),
      },
      tools: {
        title: extractText(attrs.field_tools_heading) || 'Tools & Research',
        description:
          extractText(attrs.field_tools_description) ||
          'Professional tools and research materials for innovators, researchers, and IP professionals.',
        items: extractCardItems(node, 'field_tools_items', included),
      },
      laws: {
        title: extractText(attrs.field_laws_heading) || 'Laws & Regulations',
        description:
          extractText(attrs.field_laws_description) ||
          'Legal framework and regulatory information that governs intellectual property rights.',
        items: extractCardItems(node, 'field_laws_items', included),
      },
      licensing: {
        title: extractText(attrs.field_licensing_heading) || 'IP Licensing',
        description:
          extractText(attrs.field_licensing_description) ||
          'Licensing information and agent services for intellectual property.',
        items: extractCardItems(node, 'field_licensing_items', included),
      },
    },
  };
}

// Fallback data function
export function getResourcesOverviewFallbackData(): ResourcesOverviewData {
  return {
    hero: {
      title: 'Resources',
      description: 'Access comprehensive resources, guides, and tools for intellectual property.',
      backgroundImage: '/images/resources/hero.jpg',
    },
    sections: {
      ipInfo: {
        title: 'IP Information',
        description: 'Essential information and guides about intellectual property.',
        items: [
          { title: 'FAQ', href: '/resources/ip-information/faq' },
          { title: 'Guidelines', href: '/resources/ip-information/guidelines' },
          { title: 'IP Glossary', href: '/resources/ip-information/ip-glossary' },
          { title: 'Reports', href: '/resources/ip-information/reports' },
          { title: 'Digital Guide', href: '/resources/ip-information/digital-guide' },
        ],
      },
      tools: {
        title: 'Tools & Research',
        description:
          'Professional tools and research materials for innovators, researchers, and IP professionals.',
        items: [
          { title: 'Publications', href: '/resources/tools-and-research/publications' },
          {
            title: 'Public Consultations',
            href: '/resources/tools-and-research/public-consultations',
          },
          { title: 'Gazette', href: '/resources/tools-and-research/gazette' },
          { title: 'IP Observatory', href: '/resources/tools-and-research/ip-observatory' },
          { title: 'IP Search Engine', href: '/resources/tools-and-research/ip-search-engine' },
          { title: 'Open Data', href: '/resources/tools-and-research/open-data' },
        ],
      },
      laws: {
        title: 'Laws & Regulations',
        description:
          'Legal framework and regulatory information that governs intellectual property rights.',
        items: [
          {
            title: 'International Treaties',
            href: '/resources/lows-and-regulations/international-treaties',
          },
          {
            title: 'Systems and Regulations',
            href: '/resources/lows-and-regulations/systems-and-regulations',
          },
          { title: 'Litigation Paths', href: '/resources/lows-and-regulations/litigation-paths' },
        ],
      },
      licensing: {
        title: 'IP Licensing',
        description: 'Licensing information and agent services for intellectual property.',
        items: [
          { title: 'IP Agents', href: '/resources/ip-licensing/ip-agents' },
          { title: 'Supervisory Unit', href: '/resources/ip-licensing/supervisory-unit' },
        ],
      },
    },
  };
}

// Main export function
export async function getResourcesOverviewPageData(
  locale?: string,
): Promise<ResourcesOverviewData> {
  try {
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_ip_info_items',
      'field_tools_items',
      'field_laws_items',
      'field_licensing_items',
    ];

    // Step 1: Get UUID from EN version (always find the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      `/node/resources_overview_page?filter[status]=1&include=${includeFields.join(',')}`,
      {},
      'en',
    );

    const nodes = Array.isArray(initialResponse.data)
      ? initialResponse.data
      : [initialResponse.data];

    if (nodes.length === 0 || !nodes[0]) {
      console.log(`🔴 RESOURCES OVERVIEW: Using fallback data ❌ (${locale || 'en'}) - No nodes`);
      return getResourcesOverviewFallbackData();
    }

    const nodeUuid = nodes[0].id;

    // Step 2: Fetch with UUID and locale to get translated content
    const response = await fetchDrupal<DrupalNode>(
      `/node/resources_overview_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // When fetching by UUID, response.data is a single object, not an array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const data = transformResourcesOverviewPage(node, response.included || []);
    console.log(`🟢 RESOURCES OVERVIEW: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 RESOURCES OVERVIEW: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Resources Overview fetch error:', error);
    return getResourcesOverviewFallbackData();
  }
}
