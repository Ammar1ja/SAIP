import { fetchDrupal, getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalEntitiesPartnersPageNode, DrupalPartner, DrupalIncludedEntity } from '../types';

// Frontend interfaces
export interface PartnerData {
  id: string;
  name: string;
  logo?: {
    url: string;
    alt: string;
  };
  website?: string;
  description?: string;
  type?: string;
}

export interface EntitiesPartnersData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    url: string;
    alt: string;
  };
  governmentPartners: PartnerData[];
  healthcarePartners: PartnerData[];
  academicPartners: PartnerData[];
  privatePartners: PartnerData[];
  internationalPartners: PartnerData[];
}

/**
 * Fetch entities & partners page data from Drupal
 */
export async function fetchEntitiesPartnersPage(
  locale?: string,
): Promise<DrupalEntitiesPartnersPageNode[]> {
  // Include all partner fields
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_government_partners',
    'field_healthcare_partners',
    'field_academic_partners',
    'field_private_partners',
    'field_international_partners',
  ];

  const includeString = includeFields.join(',');
  const endpoint = `/node/entities_partners_page?filter[status]=1&include=${includeString}`;

  const response = await fetchDrupal(endpoint, {}, locale);
  return response.data as DrupalEntitiesPartnersPageNode[];
}

/**
 * Transform Drupal partner data to frontend format
 */
export function transformPartner(
  partner: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): PartnerData {
  const attrs = (partner as any).attributes || {};
  const relationships = (partner as any).relationships || {};

  // Get logo - relationships need to be resolved first
  const logoFromAttrs = attrs.field_image
    ? getImageWithAlt(attrs.field_image, included)
    : undefined;
  const logoFromRels = relationships.field_image
    ? (() => {
        const imageRel = getRelated(relationships, 'field_image', included);
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;
  const logo = logoFromAttrs || logoFromRels;

  // Get category name
  const categoryTerm = relationships.field_main_category
    ? (() => {
        const term = getRelated(relationships, 'field_main_category', included);
        return term && !Array.isArray(term) ? term : null;
      })()
    : null;
  const categoryName = categoryTerm?.attributes?.name || '';

  // Extract website URL from Drupal link field
  let websiteUrl: string | undefined;
  if (attrs.field_website_url) {
    if (typeof attrs.field_website_url === 'string') {
      websiteUrl = attrs.field_website_url;
    } else if (attrs.field_website_url.uri) {
      websiteUrl = attrs.field_website_url.uri;
    }
  }

  return {
    id: partner.id,
    name: attrs.title || 'Untitled Partner',
    logo: logo ? { url: logo.src, alt: logo.alt } : undefined,
    website: websiteUrl,
    description: extractText(attrs.body),
    type: attrs.field_partner_type || undefined,
  };
}

/**
 * Transform Drupal entities & partners page data to frontend format
 */
export function transformEntitiesPartnersPage(
  node: DrupalEntitiesPartnersPageNode,
  included: DrupalIncludedEntity[] = [],
): EntitiesPartnersData {
  const attrs = node.attributes as any;

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
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

  // Debug relationships
  console.log('🔍 ENTITIES PARTNERS DEBUG:', {
    nodeId: node.id,
    nodeTitle: attrs.title,
    field_government_partners_attrs: attrs.field_government_partners,
    field_healthcare_partners_attrs: attrs.field_healthcare_partners,
    field_government_partners_rels: node.relationships?.field_government_partners,
    field_healthcare_partners_rels: node.relationships?.field_healthcare_partners,
    relationships: Object.keys(node.relationships || {}),
    includedCount: included.length,
    includedTypes: included.map((entity) => entity.type),
  });

  // Get government partners - relationships are in node.relationships, not attrs
  const governmentPartnersData = node.relationships?.field_government_partners
    ? (() => {
        const partners = getRelated(node.relationships, 'field_government_partners', included);
        return Array.isArray(partners) ? partners : [];
      })()
    : [];
  const governmentPartners = governmentPartnersData.map((partner: DrupalIncludedEntity) =>
    transformPartner(partner as DrupalPartner, included),
  );

  // Get healthcare partners - relationships are in node.relationships, not attrs
  const healthcarePartnersData = node.relationships?.field_healthcare_partners
    ? (() => {
        const partners = getRelated(node.relationships, 'field_healthcare_partners', included);
        return Array.isArray(partners) ? partners : [];
      })()
    : [];
  const healthcarePartners = healthcarePartnersData.map((partner: DrupalIncludedEntity) =>
    transformPartner(partner as DrupalPartner, included),
  );

  // Get academic partners
  const academicPartnersData = node.relationships?.field_academic_partners
    ? (() => {
        const partners = getRelated(node.relationships, 'field_academic_partners', included);
        return Array.isArray(partners) ? partners : [];
      })()
    : [];
  const academicPartners = academicPartnersData.map((partner: DrupalIncludedEntity) =>
    transformPartner(partner as DrupalPartner, included),
  );

  // Get private partners
  const privatePartnersData = node.relationships?.field_private_partners
    ? (() => {
        const partners = getRelated(node.relationships, 'field_private_partners', included);
        return Array.isArray(partners) ? partners : [];
      })()
    : [];
  const privatePartners = privatePartnersData.map((partner: DrupalIncludedEntity) =>
    transformPartner(partner as DrupalPartner, included),
  );

  // Get international partners
  const internationalPartnersData = node.relationships?.field_international_partners
    ? (() => {
        const partners = getRelated(node.relationships, 'field_international_partners', included);
        return Array.isArray(partners) ? partners : [];
      })()
    : [];
  const internationalPartners = internationalPartnersData.map((partner: DrupalIncludedEntity) =>
    transformPartner(partner as DrupalPartner, included),
  );

  console.log('🔍 PARTNERS DEBUG:', {
    governmentPartnersData: governmentPartnersData.length,
    healthcarePartnersData: healthcarePartnersData.length,
    academicPartnersData: academicPartnersData.length,
    privatePartnersData: privatePartnersData.length,
    internationalPartnersData: internationalPartnersData.length,
  });

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Entities & Partners',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'SAIP is proud to partner with many local and international entities.',
    heroImage: heroImage ? { url: heroImage.src, alt: heroImage.alt } : undefined,
    governmentPartners,
    healthcarePartners,
    academicPartners,
    privatePartners,
    internationalPartners,
  };
}

/**
 * Get entities & partners page data with fallback
 */
export async function getEntitiesPartnersPageData(locale?: string): Promise<EntitiesPartnersData> {
  try {
    const nodes = await fetchEntitiesPartnersPage(locale);

    if (nodes.length === 0) {
      console.log('🔴 ENTITIES PARTNERS: No content found, using fallback data');
      return getEntitiesPartnersFallbackData();
    }

    const node = nodes[0] as DrupalEntitiesPartnersPageNode;
    const response = await fetchDrupal(
      `/node/entities_partners_page/${node.id}?include=${[
        'field_hero_background_image',
        'field_hero_background_image.field_media_image',
        'field_government_partners',
        'field_government_partners.field_image',
        'field_government_partners.field_image.field_media_image',
        'field_government_partners.field_main_category',
        'field_healthcare_partners',
        'field_healthcare_partners.field_image',
        'field_healthcare_partners.field_image.field_media_image',
        'field_healthcare_partners.field_main_category',
        'field_academic_partners',
        'field_academic_partners.field_image',
        'field_academic_partners.field_image.field_media_image',
        'field_academic_partners.field_main_category',
        'field_private_partners',
        'field_private_partners.field_image',
        'field_private_partners.field_image.field_media_image',
        'field_private_partners.field_main_category',
        'field_international_partners',
        'field_international_partners.field_image',
        'field_international_partners.field_image.field_media_image',
        'field_international_partners.field_main_category',
      ].join(',')}`,
      {},
      locale,
    );

    // ✅ FIX: response.data to array, bierzemy pierwszy element
    const nodeWithRelationships = response.data as any as DrupalEntitiesPartnersPageNode;
    const transformedData = transformEntitiesPartnersPage(
      nodeWithRelationships,
      response.included || [],
    );
    console.log(`🟢 ENTITIES PARTNERS: Using Drupal data ✅ (${locale || 'en'})`);
    console.log('Government Partners:', transformedData.governmentPartners?.length);
    console.log('Healthcare Partners:', transformedData.healthcarePartners?.length);
    console.log('Academic Partners:', transformedData.academicPartners?.length);
    console.log('Private Partners:', transformedData.privatePartners?.length);
    console.log('International Partners:', transformedData.internationalPartners?.length);
    return transformedData;
  } catch (error) {
    console.log(
      '🔴 ENTITIES PARTNERS: Failed to fetch data, using fallback:',
      (error as Error).message,
    );
    return getEntitiesPartnersFallbackData();
  }
}

/**
 * Fallback data for entities & partners page
 */
export function getEntitiesPartnersFallbackData(): EntitiesPartnersData {
  return {
    heroHeading: 'Entities & Partners',
    heroSubheading: 'SAIP is proud to partner with many local and international entities.',
    heroImage: {
      url: '/images/national-ip-strategy/hero.jpg',
      alt: 'Entities & Partners',
    },
    governmentPartners: [
      {
        id: 'fallback-1',
        name: 'Communications, Space and Technology Commission',
        logo: {
          url: '/images/partners/cstc.png',
          alt: 'Communications, Space and Technology Commission',
        },
        website: 'https://www.cst.gov.sa/',
        description:
          "Leading Saudi Arabia's digital transformation and space technology initiatives",
        type: 'Government Agency',
      },
      {
        id: 'fallback-2',
        name: 'Saudi Digital Library',
        logo: {
          url: '/images/partners/sdl.png',
          alt: 'Saudi Digital Library',
        },
        website: 'https://sdl.edu.sa/',
        description: 'National digital library providing access to academic resources',
        type: 'Government Agency',
      },
      {
        id: 'fallback-3',
        name: 'Ministry of Commerce',
        logo: {
          url: '/images/partners/moc.png',
          alt: 'Ministry of Commerce',
        },
        website: 'https://moc.gov.sa/',
        description: 'Regulating and developing commercial activities in Saudi Arabia',
        type: 'Government Agency',
      },
      {
        id: 'fallback-4',
        name: 'Saudi Standards, Metrology and Quality Organization',
        logo: {
          url: '/images/partners/saso.png',
          alt: 'Saudi Standards, Metrology and Quality Organization',
        },
        website: 'https://www.saso.gov.sa/',
        description: 'Developing and maintaining national standards and quality assurance',
        type: 'Government Agency',
      },
      {
        id: 'fallback-5',
        name: 'King Abdulaziz City for Science and Technology',
        logo: {
          url: '/images/partners/kacst.png',
          alt: 'King Abdulaziz City for Science and Technology',
        },
        website: 'https://www.kacst.gov.sa/',
        description: 'Advancing scientific research and technological development',
        type: 'Government Agency',
      },
      {
        id: 'fallback-6',
        name: 'Saudi Authority for Intellectual Property',
        logo: {
          url: '/images/partners/saip.png',
          alt: 'Saudi Authority for Intellectual Property',
        },
        website: 'https://saip.gov.sa/',
        description: 'Protecting and promoting intellectual property rights',
        type: 'Government Agency',
      },
      {
        id: 'fallback-7',
        name: 'Ministry of Investment',
        logo: {
          url: '/images/partners/misa.png',
          alt: 'Ministry of Investment',
        },
        website: 'https://www.misa.gov.sa/',
        description: 'Promoting and facilitating investment opportunities',
        type: 'Government Agency',
      },
      {
        id: 'fallback-8',
        name: 'Saudi Export Development Authority',
        logo: {
          url: '/images/partners/seda.png',
          alt: 'Saudi Export Development Authority',
        },
        website: 'https://www.seda.gov.sa/',
        description: 'Supporting and developing Saudi exports',
        type: 'Government Agency',
      },
    ],
    healthcarePartners: [
      {
        id: 'fallback-9',
        name: 'King Fahad Medical City',
        logo: {
          url: '/images/partners/kfmc.png',
          alt: 'King Fahad Medical City',
        },
        website: 'https://www.kfmc.med.sa/',
        description: 'Premier medical complex providing specialized healthcare services',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-10',
        name: 'King Faisal Specialist Hospital & Research Centre',
        logo: {
          url: '/images/partners/kfshrc.png',
          alt: 'King Faisal Specialist Hospital & Research Centre',
        },
        website: 'https://www.kfshrc.edu.sa/',
        description: 'Leading healthcare institution providing specialized medical care',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-11',
        name: 'King Saud University Medical City',
        logo: {
          url: '/images/partners/ksumc.png',
          alt: 'King Saud University Medical City',
        },
        website: 'https://ksumc.ksu.edu.sa/',
        description: 'Academic medical center providing healthcare and medical education',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-12',
        name: 'King Abdulaziz Medical City',
        logo: {
          url: '/images/partners/kamc.png',
          alt: 'King Abdulaziz Medical City',
        },
        website: 'https://www.ngha.med.sa/',
        description: 'Comprehensive healthcare facility serving the National Guard',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-13',
        name: 'Saudi German Hospital',
        logo: {
          url: '/images/partners/sgh.png',
          alt: 'Saudi German Hospital',
        },
        website: 'https://www.sghgroup.net/',
        description: 'Private healthcare provider offering advanced medical services',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-14',
        name: 'Dr. Sulaiman Al Habib Medical Group',
        logo: {
          url: '/images/partners/hmg.png',
          alt: 'Dr. Sulaiman Al Habib Medical Group',
        },
        website: 'https://www.hmg.com.sa/',
        description: 'Leading private healthcare network in Saudi Arabia',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-15',
        name: 'King Fahd Hospital',
        logo: {
          url: '/images/partners/kfh.png',
          alt: 'King Fahd Hospital',
        },
        website: 'https://www.kfh.med.sa/',
        description: 'Major public hospital providing comprehensive healthcare services',
        type: 'Medical Institution',
      },
      {
        id: 'fallback-16',
        name: 'Al Mouwasat Medical Services',
        logo: {
          url: '/images/partners/ams.png',
          alt: 'Al Mouwasat Medical Services',
        },
        website: 'https://www.almouwasat.com/',
        description: 'Private healthcare provider with multiple facilities',
        type: 'Medical Institution',
      },
    ],
    academicPartners: [],
    privatePartners: [],
    internationalPartners: [],
  };
}
