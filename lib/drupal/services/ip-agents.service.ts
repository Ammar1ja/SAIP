import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for IP Agents
export interface IPAgentItem {
  id: string;
  name: string;
  licenseNumber: string;
  location: string;
  categories: string[];
  email: string;
  phone: string;
  status: 'active' | 'suspended';
}

export interface IPAgentsData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  agentsList: IPAgentItem[];
}

// Step 1: Fetch UUID without locale
async function fetchIPAgentsPageUuid(): Promise<string | null> {
  try {
    const endpoint = `/node/ip_agents_page?filter[status]=1`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, 'en');
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching ip_agents_page UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchIPAgentsPageByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_ip_agents',
    'field_ip_agents.field_agent_specialization',
    'field_ip_agents.field_agent_location_term',
  ];
  const endpoint = `/node/ip_agents_page/${uuid}?include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch all IP agents
async function fetchIPAgents(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = ['field_agent_specialization', 'field_agent_location_term'];
  const endpoint = `/node/ip_agent?filter[status]=1&include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform agent node
function transformIPAgent(node: DrupalNode, included: DrupalIncludedEntity[] = []): IPAgentItem {
  const attrs = node.attributes as any;

  // Get specialization terms
  const specRelationship = (node as any).relationships?.field_agent_specialization?.data;
  let categories: string[] = [];

  if (specRelationship) {
    const specData = Array.isArray(specRelationship) ? specRelationship : [specRelationship];
    categories = specData
      .map((ref: any) => {
        const term = included.find(
          (i) => i.type === 'taxonomy_term--ip_categories' && i.id === ref.id,
        );
        return term ? (term.attributes as any).name : null;
      })
      .filter(Boolean);
  }

  // Get location from taxonomy term if present
  const locationRelationship = (node as any).relationships?.field_agent_location_term?.data;
  let location = attrs.field_agent_location || '';

  if (locationRelationship) {
    const locationRef = Array.isArray(locationRelationship)
      ? locationRelationship[0]
      : locationRelationship;
    const locationTerm = included.find(
      (i) => i.type === 'taxonomy_term--region_city' && i.id === locationRef.id,
    );
    if (locationTerm) {
      const termAttrs = locationTerm.attributes as any;
      location = termAttrs?.name || termAttrs?.field_name_en || location;
    }
  }

  return {
    id: node.id,
    name: attrs.field_agent_name || attrs.title || 'Unknown Agent',
    licenseNumber: attrs.field_agent_license_number || '',
    location,
    categories,
    email: attrs.field_agent_contact_email || '',
    phone: attrs.field_agent_contact_phone || '',
    status: attrs.field_agent_status === 'active' ? 'active' : 'suspended',
  };
}

// Transform page function
export function transformIPAgentsPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): Omit<IPAgentsData, 'agentsList'> {
  const attrs = node.attributes as any;
  const relationships = (node as any).relationships || {};

  // Get hero background image
  let heroImageUrl = '/images/ip-licensing/agents.jpg';
  const heroImageRel = getRelated(relationships, 'field_hero_background_image', included);
  if (heroImageRel && !Array.isArray(heroImageRel)) {
    const imageData = getImageWithAlt(heroImageRel, included);
    if (imageData?.src) {
      heroImageUrl = imageData.src;
    }
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'IP Agents',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Find licensed IP agents to assist with your intellectual property needs.',
      backgroundImage: heroImageUrl,
    },
    overview: {
      heading: extractText(attrs.field_overview_heading) || 'Licensed IP Agents Directory',
      description:
        extractText(attrs.field_overview_description) ||
        'Browse our directory of licensed intellectual property agents authorized to practice in Saudi Arabia.',
    },
  };
}

// Fallback data function
export function getIPAgentsFallbackData(): IPAgentsData {
  return {
    hero: {
      title: 'IP Agents',
      description: 'Find licensed IP agents to assist with your intellectual property needs.',
      backgroundImage: '/images/ip-licensing/agents.jpg',
    },
    overview: {
      heading: 'Licensed IP Agents Directory',
      description:
        'Browse our directory of licensed intellectual property agents authorized to practice in Saudi Arabia.',
    },
    agentsList: [],
  };
}

// Main export function
export async function getIPAgentsPageData(locale?: string): Promise<IPAgentsData> {
  try {
    // Step 1: Get UUID
    const uuid = await fetchIPAgentsPageUuid();
    if (!uuid) {
      console.log(`🔴 IP AGENTS: No page found, using fallback (${locale || 'en'})`);
      return getIPAgentsFallbackData();
    }

    // Step 2: Fetch page with locale (2-step UUID pattern)
    const pageResponse = await fetchIPAgentsPageByUuid(uuid, locale);
    const node = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;

    if (!node) {
      console.log(`🔴 IP AGENTS: Node not found by UUID (${locale || 'en'})`);
      return getIPAgentsFallbackData();
    }

    const pageData = transformIPAgentsPage(node, pageResponse.included || []);

    // Step 3: Get agents from field_ip_agents (curated list)
    const relationships = (node as any).relationships || {};
    const agentsRel = relationships.field_ip_agents?.data;
    let agentsList: IPAgentItem[] = [];

    if (agentsRel && Array.isArray(agentsRel) && agentsRel.length > 0) {
      // Use curated list from CMS
      const agentNodes = agentsRel
        .map((ref: any) => {
          return pageResponse.included?.find((i) => i.type === 'node--ip_agent' && i.id === ref.id);
        })
        .filter(Boolean);

      agentsList = agentNodes.map((agentNode) =>
        transformIPAgent(agentNode as DrupalNode, pageResponse.included || []),
      );

      console.log(`🟢 IP AGENTS: Using curated list from CMS ✅ (${locale || 'en'})`);
    } else {
      // Fallback: fetch all active agents (backward compatibility)
      const agentsResponse = await fetchIPAgents(locale);
      agentsList = agentsResponse.data.map((agentNode) =>
        transformIPAgent(agentNode, agentsResponse.included || []),
      );

      console.log(`🟡 IP AGENTS: Using all active agents (fallback) (${locale || 'en'})`);
    }

    console.log(`  Hero: ${pageData.hero.title}`);
    console.log(`  Agents: ${agentsList.length}`);

    return {
      ...pageData,
      agentsList,
    };
  } catch (error) {
    console.log(`🔴 IP AGENTS: Using fallback data ❌ (${locale || 'en'})`);
    console.error('IP Agents fetch error:', error);
    return getIPAgentsFallbackData();
  }
}
