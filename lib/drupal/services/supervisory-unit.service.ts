import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalRelationship } from '../types';
import { DrupalResponse } from '../api-client';

// Types
export interface TargetArea {
  id: string;
  title: string;
  icon: string;
}

export interface ObjectiveItem {
  id: string;
  text: string;
}

export interface CivilAssociation {
  id: string;
  title: string;
  classification: string;
  email: string;
  location: string;
  website: string;
}

export interface SupervisoryUnitData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  overview: {
    heading: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
  };
  targetAreas: {
    heading: string;
    items: TargetArea[];
  };
  objectives: {
    heading: string;
    items: ObjectiveItem[];
  };
  associations: {
    heading: string;
  };
  contact: {
    heading: string;
    description: string;
    email: string;
    image?: {
      src: string;
      alt: string;
    };
  };
}

// Fetch supervisory unit page by UUID (2-step pattern)
async function fetchSupervisoryUnitByUUID(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image.field_media_image',
    'field_overview_image.field_media_image',
    'field_target_areas',
    'field_objectives',
    'field_civil_associations',
    'field_contact_image.field_media_image',
  ].join(',');

  const endpoint = `/node/supervisory_unit_page/${uuid}?include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch civil associations
export async function fetchCivilAssociations(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const endpoint = `/node/civil_association?filter[status]=1&sort=title`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform target area paragraph
function transformTargetArea(paragraph: DrupalIncludedEntity): TargetArea {
  const attrs = paragraph.attributes as any;
  return {
    id: paragraph.id,
    title: extractText(attrs.field_target_area_title) || '',
    icon: attrs.field_target_area_icon || 'user',
  };
}

// Transform objective paragraph
function transformObjective(paragraph: DrupalIncludedEntity): ObjectiveItem {
  const attrs = paragraph.attributes as any;
  return {
    id: paragraph.id,
    text: extractText(attrs.field_objective_text) || '',
  };
}

// Transform civil association node
function transformCivilAssociation(node: DrupalNode): CivilAssociation {
  const attrs = node.attributes as any;
  const website = attrs.field_website?.uri || attrs.field_website || '';

  return {
    id: node.id,
    title: attrs.title || '',
    classification: attrs.field_classification || '',
    email: attrs.field_association_email || '',
    location: attrs.field_association_location || '',
    website: website,
  };
}

// Transform page function
export function transformSupervisoryUnitPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): SupervisoryUnitData & { civilAssociations: CivilAssociation[] } {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};

  // Get hero background image
  let heroImageUrl = '/images/ip-licensing/supervisory.jpg';
  const heroImageRel = getRelated(relationships, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  // Get overview image
  let overviewImage: { src: string; alt: string } | undefined;
  const overviewImageRel = getRelated(relationships, 'field_overview_image', included);
  if (overviewImageRel && !Array.isArray(overviewImageRel)) {
    const imageData = getImageWithAlt(overviewImageRel, included);
    if (imageData?.src) {
      overviewImage = imageData;
    }
  }

  // Transform target areas
  const targetAreasItems: TargetArea[] = [];
  const targetAreasRel = relationships.field_target_areas?.data;
  if (Array.isArray(targetAreasRel)) {
    targetAreasRel.forEach((ref: any) => {
      const paragraph = included.find(
        (i) => i.id === ref.id && i.type === 'paragraph--target_area',
      );
      if (paragraph) {
        targetAreasItems.push(transformTargetArea(paragraph));
      }
    });
  }

  // Transform objectives
  const objectivesItems: ObjectiveItem[] = [];
  const objectivesRel = relationships.field_objectives?.data;
  if (Array.isArray(objectivesRel)) {
    objectivesRel.forEach((ref: any) => {
      const paragraph = included.find(
        (i) => i.id === ref.id && i.type === 'paragraph--objective_item',
      );
      if (paragraph) {
        objectivesItems.push(transformObjective(paragraph));
      }
    });
  }

  // Transform civil associations from field_civil_associations
  const civilAssociations: CivilAssociation[] = [];
  const civilAssociationsRel = relationships.field_civil_associations?.data;
  if (Array.isArray(civilAssociationsRel)) {
    civilAssociationsRel.forEach((ref: any) => {
      const associationNode = included.find(
        (i) => i.id === ref.id && i.type === 'node--civil_association',
      );
      if (associationNode) {
        civilAssociations.push(transformCivilAssociation(associationNode as DrupalNode));
      }
    });
  }

  // Get contact image
  let contactImage: { src: string; alt: string } | undefined;
  const contactImageRel = getRelated(relationships, 'field_contact_image', included);
  if (contactImageRel && !Array.isArray(contactImageRel)) {
    const imageData = getImageWithAlt(contactImageRel, included);
    if (imageData?.src) {
      contactImage = imageData;
    }
  }

  return {
    hero: {
      title:
        extractText(attrs.field_hero_heading) ||
        'Supervisory unit for non-profit sector organizations',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Technical supervision over non-profit sector organizations to achieve the goals of the Kingdom Vision 2030',
      backgroundImage: heroImageUrl,
    },
    overview: {
      heading: extractText(attrs.field_overview_heading) || 'About supervisory unit',
      description:
        extractText(attrs.field_overview_description) ||
        'It activates the role of technical supervision over non-profit sector organizations whose activities fall within its jurisdiction.',
      image: overviewImage,
    },
    targetAreas: {
      heading: extractText(attrs.field_target_areas_heading) || 'Target areas',
      items: targetAreasItems,
    },
    objectives: {
      heading: extractText(attrs.field_objectives_heading) || 'Objectives of the supervisory unit',
      items: objectivesItems,
    },
    associations: {
      heading:
        extractText(attrs.field_associations_heading) ||
        'Civil associations under the technical supervision of SAIP',
    },
    contact: {
      heading: extractText(attrs.field_contact_heading) || 'Contact',
      description:
        extractText(attrs.field_contact_description) || 'Contact to the supervisory unit at SAIP',
      email: attrs.field_contact_email || 'licensing@saip.gov.sa',
      image: contactImage,
    },
    civilAssociations,
  };
}

// Fallback data
export function getSupervisoryUnitFallbackData(): SupervisoryUnitData & {
  civilAssociations: CivilAssociation[];
} {
  return {
    hero: {
      title: 'Supervisory unit for non-profit sector organizations',
      description:
        'Technical supervision over non-profit sector organizations to achieve the goals of the Kingdom Vision 2030',
      backgroundImage: '/images/ip-licensing/supervisory.jpg',
    },
    overview: {
      heading: 'About supervisory unit',
      description:
        'It activates the role of technical supervision over non-profit sector organizations.',
    },
    targetAreas: {
      heading: 'Target areas',
      items: [],
    },
    objectives: {
      heading: 'Objectives of the supervisory unit',
      items: [],
    },
    associations: {
      heading: 'Civil associations under the technical supervision of SAIP',
    },
    contact: {
      heading: 'Contact',
      description: 'Contact to the supervisory unit at SAIP',
      email: 'licensing@saip.gov.sa',
    },
    civilAssociations: [],
  };
}

// Main export function with 2-step UUID fetch
export async function getSupervisoryUnitPageData(
  locale?: string,
): Promise<SupervisoryUnitData & { civilAssociations: CivilAssociation[] }> {
  try {
    // Step 1: Get UUID from default language
    const listEndpoint = `/node/supervisory_unit_page?filter[status]=1&fields[node--supervisory_unit_page]=drupal_internal__nid`;
    const listResponse = await fetchDrupal<DrupalNode>(listEndpoint, {});
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      console.log(`🔴 SUPERVISORY UNIT: Using fallback data ❌ (${locale || 'en'})`);
      return getSupervisoryUnitFallbackData();
    }

    const uuid = nodes[0].id;

    // Step 2: Fetch by UUID with locale
    const response = await fetchSupervisoryUnitByUUID(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const pageData = transformSupervisoryUnitPage(node, included);

    console.log(`🟢 SUPERVISORY UNIT: Using Drupal data ✅ (${locale || 'en'})`);
    console.log(`  - Civil Associations: ${pageData.civilAssociations.length}`);

    // If no Civil Associations selected, fetch all as fallback
    if (pageData.civilAssociations.length === 0) {
      console.log('  ℹ️ No Civil Associations selected, fetching all...');
      const associationsResponse = await fetchCivilAssociations(locale);
      pageData.civilAssociations = associationsResponse.data.map(transformCivilAssociation);
    }

    return pageData;
  } catch (error) {
    console.log(`🔴 SUPERVISORY UNIT: Using fallback data ❌ (${locale || 'en'})`);
    console.error('Supervisory Unit fetch error:', error);
    return getSupervisoryUnitFallbackData();
  }
}
