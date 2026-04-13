/**
 * Organisational Structure Service
 * Handles data fetching and transformation for organisational structure page
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  extractText,
  filterIncludedByLangcode,
} from '../utils';
import {
  DrupalNode,
  DrupalIncludedEntity,
  DrupalOrganisationalStructureNode,
  DrupalBoardMember,
  DrupalAdvisoryBoardMember,
  DrupalOrgChartPosition,
} from '../types';

// Frontend data interfaces
export interface OrganisationalStructureData {
  // Hero section
  title: string;
  description: string;
  heroImage?: {
    url: string;
    alt: string;
  };

  // Board section
  boardHeading: string;
  chairperson: {
    name: string;
    title: string;
    description: string;
    image: string;
  };
  boardMembers: Array<{
    name: string;
    title: string;
    image: string;
  }>;

  // Advisory section
  advisoryHeading: string;
  advisoryDescription: string;
  advisoryDescription2: string;
  advisoryMembers: Array<{
    name: string;
    title: string;
    image: string;
  }>;

  // Org chart section
  orgChartHeading: string;
  orgChartDescription: string;
  orgChartPositions: Array<{
    id: string;
    label: string;
    name: string;
    image: string;
    positionType: string;
    isCeo: boolean;
    isAudit: boolean;
    parentId?: string;
    children?: Array<{
      id: string;
      label: string;
    }>;
  }>;
}

/**
 * Fetch organisational structure data from Drupal
 */
export async function fetchOrganisationalStructure(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // Only include fields that exist as relationships in Drupal
  // Available: field_advisory_members, field_board_members, field_org_chart_positions, field_hero_background_image
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_board_members',
    'field_board_members.field_image',
    'field_board_members.field_image.field_media_image',
    'field_advisory_members',
    'field_advisory_members.field_image',
    'field_advisory_members.field_image.field_media_image',
    'field_org_chart_positions',
  ];

  // Use the correct content type that exists in Drupal
  const endpoint = `/node/organisational_structure?filter[status]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal(endpoint, {}, locale);

  if (response.data && response.data.length > 0) {
    return { nodes: response.data, included: response.included || [] };
  }

  throw new Error('No Organisational Structure content found');
}

/**
 * Transform Drupal data to frontend format
 */
export function transformOrganisationalStructure(
  node: DrupalOrganisationalStructureNode,
  included: DrupalIncludedEntity[],
): OrganisationalStructureData {
  const attrs = node.attributes as any;

  // ✅ CRITICAL FIX: Filter included entities to match node's langcode
  // API returns ALL language versions, we need only the correct one
  const nodeLangcode = attrs.langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  // Get hero image
  // ✅ For media (images), use original included - media has no langcode so it works for both languages
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          included,
        );

        if (imageRel && !Array.isArray(imageRel)) {
          const imageData = getImageWithAlt(imageRel, included);
          return imageData?.src ? imageData : undefined;
        }
        return undefined;
      })()
    : undefined;

  // Get board members
  // ✅ Use original included - board_member nodes might not have translations
  const boardMembersData = node.relationships?.field_board_members
    ? (() => {
        const members = getRelated(node.relationships, 'field_board_members', included);
        return Array.isArray(members) ? members : [];
      })()
    : [];

  // Find chairperson (first member with field_is_chairperson = true)
  const chairpersonData = boardMembersData.find(
    (member: any) => member.attributes?.field_is_chairperson,
  );

  // Filter out chairperson from board members list (they're shown separately)
  const boardMembers = boardMembersData
    .filter((member: any) => !member.attributes?.field_is_chairperson)
    .map((member: any) => {
      // ✅ For media (images), use original included - media has no langcode so it works for both languages
      const memberImage = getImageWithAlt(
        getRelated(member.relationships || {}, 'field_image', included) as any,
        included,
      );
      return {
        name: member.attributes?.title || '',
        title: member.attributes?.field_position || '',
        image: memberImage.src || '/images/placeholder-person.jpg',
      };
    });

  const chairperson = chairpersonData
    ? (() => {
        // ✅ For media (images), use original included - media has no langcode so it works for both languages
        const chairImage = getImageWithAlt(
          getRelated((chairpersonData as any).relationships || {}, 'field_image', included) as any,
          included,
        );
        return {
          name: (chairpersonData as any).attributes?.title || '',
          title: (chairpersonData as any).attributes?.field_position || '',
          description: extractText((chairpersonData as any).attributes?.field_description) || '',
          image: chairImage.src || '/images/placeholder-person.jpg',
        };
      })()
    : {
        name: 'H.E Shihana Saleh Alazzaz',
        title: 'Chairwoman of Board of Directors',
        description: '',
        image: '/images/board/alazzaz.jpg',
      };

  // Get advisory members
  // ✅ Use original included - advisory_member nodes might not have translations
  const advisoryMembersData = node.relationships?.field_advisory_members
    ? (() => {
        const members = getRelated(node.relationships, 'field_advisory_members', included);
        return Array.isArray(members) ? members : [];
      })()
    : [];

  const advisoryMembers = advisoryMembersData.map((member: any) => {
    // ✅ For media (images), use original included - media has no langcode so it works for both languages
    const memberImage = getImageWithAlt(
      getRelated(member.relationships || {}, 'field_image', included) as any,
      included,
    );
    return {
      name: member.attributes?.title || '',
      title: member.attributes?.field_position || '',
      image: memberImage.src || '/images/placeholder-person.jpg',
    };
  });

  // Get org chart positions
  const orgChartPositionsData = node.relationships?.field_org_chart_positions
    ? (() => {
        const positions = getRelated(
          node.relationships,
          'field_org_chart_positions',
          filteredIncluded,
        );
        return Array.isArray(positions) ? positions : [];
      })()
    : [];
  const orgChartPositions = orgChartPositionsData.map((position: any) => ({
    id: position.id,
    label: position.title,
    name: position.field_person_name || position.title,
    image: position.image?.src || '/images/placeholder-person.jpg',
    positionType: position.field_position_type || 'department',
    isCeo: position.field_is_ceo || false,
    isAudit: position.field_is_audit || false,
    parentId: position.field_parent_position?.data?.id,
  }));

  return {
    title: attrs.title,
    description:
      extractText(attrs.field_hero_heading) ||
      extractText(attrs.body) ||
      'Our organisational structure defines roles and responsibilities to ensure effective communication, collaboration, and decision-making within our teams.',
    heroImage:
      heroImage && heroImage.src
        ? { url: heroImage.src, alt: heroImage.alt || 'Organisational structure' }
        : undefined,
    boardHeading: attrs.field_board_heading || 'Board of directors',
    chairperson,
    boardMembers,
    advisoryHeading: attrs.field_advisory_heading || 'Advisory board',
    advisoryDescription:
      extractText(attrs.field_advisory_description) ||
      'The Advisory Board for SAIP for Intellectual Property was established by a decision from the Executive President. The Board aims to participate in developing the strategic objectives and priorities of SAIP, in line with its vision and mission.',
    advisoryDescription2:
      extractText(attrs.field_advisory_description_2) ||
      'It also evaluates outcomes and performance indicators. Furthermore, the Board provides advice on major issues and problems requested by the Executive President to be studied, encourages the discovery of new knowledge projects and programs, and reviews developmental policies to improve the services provided by SAIP.',
    advisoryMembers:
      advisoryMembers.length > 0
        ? advisoryMembers
        : [
            {
              name: 'Dr Nunu Carvalho',
              title: 'Role',
              image: '/images/advisory/1.jpg',
            },
            {
              name: 'Mr. Grant Philpott',
              title: 'Managing Director of the Safe Technology Network (TTN)',
              image: '/images/advisory/2.jpg',
            },
            {
              name: 'Dr Heinz Goder',
              title:
                'Patent and European trademark attorney, partner at Boehmert & Boehmert (Munich)',
              image: '/images/advisory/3.jpg',
            },
            {
              name: 'Dr Sara Al-Sayed',
              title: 'Professor, SABIC Chair for Polymer Catalysis, King Saud University',
              image: '/images/advisory/4.png',
            },
          ],
    orgChartHeading: attrs.field_org_chart_heading || 'Organisational structure',
    orgChartDescription:
      extractText(attrs.field_org_chart_description) ||
      'You can navigate through the chart by holding down the cursor and moving it up, down and sideways. More information appears by selecting the clickable elements.\n\nIn the upper right corner you will find navigation to help you know where you are.',
    orgChartPositions,
  };
}

/**
 * Get fallback data for organisational structure
 */
export function getOrganisationalStructureFallbackData(): OrganisationalStructureData {
  return {
    title: 'Organisational structure',
    description:
      'Our organisational structure defines roles and responsibilities to ensure effective communication, collaboration, and decision-making within our teams.',
    heroImage: {
      url: '/images/about/hero.jpg',
      alt: 'Organisational structure',
    },
    boardHeading: 'Board of directors',
    chairperson: {
      name: 'H.E Shihana Saleh Alazzaz',
      title: 'Chairwoman of Board of Directors',
      description: '',
      image: '/images/board/alazzaz.jpg',
    },
    boardMembers: [
      {
        name: 'Dr. Abdulaziz bin Mohammed AlSwailem',
        title: 'CEO of the Saudi Authority for Intellectual Property',
        image: '/images/about/ceo.jpeg',
      },
      {
        name: 'Eng. Osama Al-Zamil',
        title: 'Board Member',
        image: '/images/board/al-zamil.jpg',
      },
      {
        name: 'Eng. Haitham Abdulrahman AlOhali',
        title: 'Board Member',
        image: '/images/board/alohali.jpg',
      },
      {
        name: 'Bader Abdulrahman Al kadi',
        title: 'Board Member',
        image: '/images/board/al-kadi.png',
      },
      {
        name: 'Deemah AlYahya',
        title: 'Board Member',
        image: '/images/board/alyahya.jpg',
      },
      {
        name: 'Dr Mohammed Awaidh Alotaibi',
        title: 'Board Member',
        image: '/images/board/alotaibi.png',
      },
    ],
    advisoryHeading: 'Advisory board',
    advisoryDescription:
      'The Advisory Board for SAIP for Intellectual Property was established by a decision from the Executive President. The Board aims to participate in developing the strategic objectives and priorities of SAIP, in line with its vision and mission.',
    advisoryDescription2:
      'It also evaluates outcomes and performance indicators. Furthermore, the Board provides advice on major issues and problems requested by the Executive President to be studied, encourages the discovery of new knowledge projects and programs, and reviews developmental policies to improve the services provided by SAIP.',
    advisoryMembers: [
      {
        name: 'Dr Nunu Carvalho',
        title: 'Role',
        image: '/images/advisory/1.jpg',
      },
      {
        name: 'Mr. Grant Philpott',
        title: 'Managing Director of the Safe Technology Network (TTN)',
        image: '/images/advisory/2.jpg',
      },
      {
        name: 'Dr Heinz Goder',
        title: 'Patent and European trademark attorney, partner at Boehmert & Boehmert (Munich)',
        image: '/images/advisory/3.jpg',
      },
      {
        name: 'Dr Sara Al-Sayed',
        title: 'Professor, SABIC Chair for Polymer Catalysis, King Saud University',
        image: '/images/advisory/4.png',
      },
    ],
    orgChartHeading: 'Organisational structure',
    orgChartDescription:
      'You can navigate through the chart by holding down the cursor and moving it up, down and sideways. More information appears by selecting the clickable elements.\n\nIn the upper right corner you will find navigation to help you know where you are.',
    orgChartPositions: [
      {
        id: 'ceo',
        label: 'CEO',
        name: 'Dr Abdulaziz Mohammad',
        image: '/images/about/ceo.jpeg',
        positionType: 'ceo',
        isCeo: true,
        isAudit: false,
        children: [
          { id: 'ceo-office', label: 'CEO Office' },
          { id: 'quality', label: 'Quality and Organization Excellence' },
          { id: 'beneficiary', label: 'Beneficiary Affairs' },
          { id: 'nipst', label: 'NIPST' },
          { id: 'respect', label: 'IP Respect' },
          { id: 'enablement', label: 'IP Enablement' },
        ],
      },
      {
        id: 'audit',
        label: 'Internal Audit',
        name: 'Internal Audit',
        image: '/images/placeholder-person.jpg',
        positionType: 'audit',
        isCeo: false,
        isAudit: true,
      },
    ],
  };
}

/**
 * Main function to get organisational structure page data
 */
export async function getOrganisationalStructurePageData(
  locale?: string,
): Promise<OrganisationalStructureData> {
  try {
    const { nodes, included } = await fetchOrganisationalStructure(locale);

    if (nodes.length === 0) {
      return getOrganisationalStructureFallbackData();
    }

    const node = nodes[0] as DrupalOrganisationalStructureNode;
    const data = transformOrganisationalStructure(node, included);

    return data;
  } catch (_error) {
    return getOrganisationalStructureFallbackData();
  }
}
