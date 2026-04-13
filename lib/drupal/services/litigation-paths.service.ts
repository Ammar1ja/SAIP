import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interfaces
export interface PathwayNodeContent {
  id: string; // node_id from Drupal
  label: string;
  note?: string;
  button?: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
}

export interface PathwayData {
  type: string; // pathway_type
  title: string;
  nodes: Record<string, PathwayNodeContent>; // keyed by node_id
}

export interface LitigationPathsData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  section: {
    heading: string;
    description: string;
  };
  pathways: PathwayData[];
}

// Fetch by UUID (2-step pattern)
async function fetchLitigationPathsByUUID(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields =
    'field_hero_background_image.field_media_image,' +
    'field_litigation_pathways,' +
    'field_litigation_pathways.field_node_contents,' +
    'field_litigation_pathways.field_node_contents.field_node_image,' +
    'field_litigation_pathways.field_node_contents.field_node_image.field_media_image';
  const endpoint = `/node/litigation_paths_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformLitigationPathsPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): LitigationPathsData {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};

  // Filter included entities by language for paragraphs (they have langcode)
  // Media/files don't have langcode, so we keep them as-is
  const targetLangcode = locale === 'ar' ? 'ar' : 'en';
  const filteredIncluded = included.filter((entity: any) => {
    // Keep entities without langcode (media, files)
    if (!entity.attributes?.langcode) {
      return true;
    }
    // For entities with langcode (nodes, paragraphs), filter by target language
    return entity.attributes.langcode === targetLangcode;
  });

  // Get hero background image (use original included for media/files)
  let heroImageUrl = '/images/laws/litigation.jpg';
  const heroImageRel = getRelated(relationships, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  // Get pathways (use filtered included for translated content)
  const pathwaysRel = getRelated(relationships, 'field_litigation_pathways', filteredIncluded);
  const pathways: PathwayData[] = [];

  if (Array.isArray(pathwaysRel)) {
    for (const pathway of pathwaysRel) {
      const pathwayAttrs = pathway.attributes as any;
      const pathwayRels = (pathway as any).relationships || {};
      const pathwayType = extractText(pathwayAttrs.field_pathway_type) || '';
      const pathwayTitle = extractText(pathwayAttrs.title) || '';

      // Get node contents (paragraphs) - use filtered included for translated paragraphs
      const nodeContentsRel = getRelated(pathwayRels, 'field_node_contents', filteredIncluded);
      const nodes: Record<string, PathwayNodeContent> = {};

      if (Array.isArray(nodeContentsRel)) {
        for (const nodeContent of nodeContentsRel) {
          const nodeAttrs = nodeContent.attributes as any;
          const nodeRels = (nodeContent as any).relationships || {};

          // Extract translated content from paragraph
          const nodeId = extractText(nodeAttrs.field_node_id) || '';
          const label = extractText(nodeAttrs.field_node_label) || '';
          const note = extractText(nodeAttrs.field_node_note) || '';
          const buttonLabel = extractText(nodeAttrs.field_button_label) || '';
          const rawButtonHref = extractText(nodeAttrs.field_button_href) || '';
          const buttonHref = rawButtonHref ? rawButtonHref.replace(/^internal:/, '').trim() : '';

          // Get node image (use original included for media/files)
          let nodeImage: { src: string; alt: string } | undefined;
          const nodeImageRel = getRelated(nodeRels, 'field_node_image', included);
          if (nodeImageRel && !Array.isArray(nodeImageRel)) {
            const imageData = getImageWithAlt(nodeImageRel, included);
            if (imageData?.src) {
              nodeImage = imageData;
            }
          }

          nodes[nodeId] = {
            id: nodeId,
            label,
            note: note || undefined,
            button:
              buttonLabel && buttonHref
                ? {
                    label: buttonLabel,
                    href: buttonHref,
                  }
                : undefined,
            image: nodeImage,
          };
        }
      }

      pathways.push({
        type: pathwayType,
        title: pathwayTitle,
        nodes,
      });
    }
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'Litigation Paths',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Understanding the legal procedures for intellectual property disputes and enforcement.',
      backgroundImage: heroImageUrl,
    },
    section: {
      heading: extractText(attrs.field_section_heading) || 'The procedural path',
      description:
        extractText(attrs.field_section_description) ||
        'The first four flows concern trademarks and procedures related to appeal, objection, cancellation and infringement of trademark cases. The fifth flow deals with violation of copyrights while the sixth and final flow is a universal path of procedures for: patents, designs, topographic designs of IC and plant varieties.',
    },
    pathways,
  };
}

// Fallback data function
export function getLitigationPathsFallbackData(): LitigationPathsData {
  return transformLitigationPathsPage({ attributes: {}, relationships: {} } as DrupalNode, []);
}

// Main export function with 2-step UUID fetch
export async function getLitigationPathsPageData(locale?: string): Promise<LitigationPathsData> {
  try {
    // Step 1: Get UUID
    const listEndpoint = `/node/litigation_paths_page?filter[status]=1&fields[node--litigation_paths_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      console.log(`🔴 LITIGATION PATHS: Using fallback data ❌ (${locale || 'en'})`);
      return getLitigationPathsFallbackData();
    }

    const uuid = nodes[0].id;

    // Step 2: Fetch by UUID with locale
    const response = await fetchLitigationPathsByUUID(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const data = transformLitigationPathsPage(node, included, locale);
    console.log(`🟢 LITIGATION PATHS: Using Drupal data ✅ (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 LITIGATION PATHS: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Litigation Paths fetch error:', error);
    return getLitigationPathsFallbackData();
  }
}
