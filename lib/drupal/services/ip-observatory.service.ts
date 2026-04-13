import { fetchDrupal } from '../utils';
import { getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Statistics item interface (matches StatisticsCardType)
export interface StatisticsItemData {
  label: string;
  value: number;
  chartType: 'line' | 'bar' | 'pie';
  chartData: { value: number }[];
  trend: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    description: string;
  };
}

// Statistics grouped by category and tab
export interface StatisticsData {
  ipServices: {
    application: StatisticsItemData[];
    certificates: StatisticsItemData[];
  };
  ipEnablement: {
    application: StatisticsItemData[];
    certificates: StatisticsItemData[];
  };
  ipEnforcement: {
    application: StatisticsItemData[];
    certificates: StatisticsItemData[];
  };
}

// Frontend interface for IP Observatory
export interface IPObservatoryData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  ipServices: {
    heading: string;
    description: string;
  };
  ipEnablement: {
    heading: string;
    description: string;
  };
  ipEnforcement: {
    heading: string;
    description: string;
  };
  statistics: StatisticsData;
  lastDataUpdate?: string;
}

// Drupal fetch functions - 2-step UUID fetch pattern
async function fetchIPObservatoryPageUuid(): Promise<string | null> {
  const endpoint = `/node/ip_observatory_page?filter[status]=1&fields[node--ip_observatory_page]=drupal_internal__nid`;
  const response = await fetchDrupal<DrupalNode>(endpoint);
  if (response.data && response.data.length > 0) {
    return response.data[0].id;
  }
  return null;
}

async function fetchIPObservatoryPageByUuid(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
  ];
  const endpoint = `/node/ip_observatory_page/${uuid}?include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Fetch statistics paragraphs directly (entity_reference_revisions don't work with include)
async function fetchStatisticsItems(
  nodeNid: string,
  locale?: string,
): Promise<(StatisticsItemData & { category: string; tabType: string })[]> {
  try {
    // Fetch ALL statistics_item paragraphs and filter client-side
    // JSON:API filtering on parent_id is unreliable
    const endpoint = `/paragraph/statistics_item`;
    const response = await fetchDrupal<DrupalIncludedEntity>(endpoint, {}, locale);

    if (!response.data || !Array.isArray(response.data)) {
      console.log(`📊 IP OBSERVATORY: No statistics paragraphs found`);
      return [];
    }

    console.log(
      `📊 IP OBSERVATORY: Total paragraphs: ${response.data.length}, filtering for parent_id=${nodeNid}`,
    );

    // Filter by parent_id
    const filteredData = response.data.filter((p) => {
      const attrs = p.attributes as any;
      return String(attrs.parent_id) === String(nodeNid);
    });

    console.log(`📊 IP OBSERVATORY: Found ${filteredData.length} matching paragraphs`);

    return filteredData.map((paragraph) => {
      const attrs = paragraph.attributes as any;

      // Parse chart data JSON
      let chartData: { value: number }[] = [];
      try {
        if (attrs.field_stat_chart_data) {
          chartData = JSON.parse(attrs.field_stat_chart_data);
        }
      } catch {
        chartData = [{ value: 0 }];
      }

      return {
        category: attrs.field_stat_category || 'ip_services',
        tabType: attrs.field_stat_tab_type || 'application',
        label: attrs.field_stat_label || 'Unknown',
        value: attrs.field_stat_value || 0,
        chartType: attrs.field_stat_chart_type || 'line',
        chartData,
        trend: {
          value: attrs.field_stat_trend_value || '0%',
          direction: attrs.field_stat_trend_direction || 'neutral',
          description: attrs.field_stat_trend_desc || '',
        },
      };
    });
  } catch (error) {
    console.error('Error fetching statistics items:', error);
    return [];
  }
}

export async function fetchIPObservatoryPage(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // No relationship fields available in Drupal for this content type
  const endpoint = `/node/ip_observatory_page?filter[status]=1`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Helper to transform a statistics paragraph into StatisticsItemData
function transformStatisticsItem(
  paragraph: DrupalIncludedEntity,
): StatisticsItemData & { category: string; tabType: string } {
  const attrs = paragraph.attributes as any;

  // Parse chart data JSON
  let chartData: { value: number }[] = [];
  try {
    if (attrs.field_stat_chart_data) {
      chartData = JSON.parse(attrs.field_stat_chart_data);
    }
  } catch {
    chartData = [{ value: 0 }];
  }

  return {
    category: attrs.field_stat_category || 'ip_services',
    tabType: attrs.field_stat_tab_type || 'application',
    label: attrs.field_stat_label || 'Unknown',
    value: attrs.field_stat_value || 0,
    chartType: attrs.field_stat_chart_type || 'line',
    chartData,
    trend: {
      value: attrs.field_stat_trend_value || '0%',
      direction: attrs.field_stat_trend_direction || 'neutral',
      description: attrs.field_stat_trend_desc || '',
    },
  };
}

// Get empty statistics structure
function getEmptyStatistics(): StatisticsData {
  return {
    ipServices: { application: [], certificates: [] },
    ipEnablement: { application: [], certificates: [] },
    ipEnforcement: { application: [], certificates: [] },
  };
}

// Transform function
export function transformIPObservatoryPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): IPObservatoryData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};
  const formatDateForDisplay = (value?: string) => {
    if (!value) return undefined;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return undefined;
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Get hero background image from relationships
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(rels, 'field_hero_background_image', included);
        if (imageRel && !Array.isArray(imageRel)) {
          const imageData = getImageWithAlt(imageRel, included);
          return imageData?.src ? imageData : null;
        }
        return null;
      })()
    : null;
  const heroImageUrl = heroImage?.src || '/images/observatory/hero.jpg';

  // Process statistics items from included paragraphs
  const statistics = getEmptyStatistics();
  const statsEntities = getRelated(rels, 'field_statistics_items', included);

  if (Array.isArray(statsEntities)) {
    for (const entity of statsEntities) {
      const item = transformStatisticsItem(entity);
      const { category, tabType, ...statData } = item;

      // Map category to statistics key
      const categoryMap: Record<string, keyof StatisticsData> = {
        ip_services: 'ipServices',
        ip_enablement: 'ipEnablement',
        ip_enforcement: 'ipEnforcement',
      };

      const categoryKey = categoryMap[category] || 'ipServices';
      const tabKey = tabType === 'certificates' ? 'certificates' : 'application';

      statistics[categoryKey][tabKey].push(statData);
    }
  }

  return {
    hero: {
      title: extractText(attrs.field_hero_heading) || 'IP Observatory',
      description:
        extractText(attrs.field_hero_subheading) ||
        'Monitor and analyze intellectual property trends, statistics, and insights.',
      backgroundImage: heroImageUrl,
    },
    overview: {
      heading: extractText(attrs.field_overview_heading) || 'IP Observatory Overview',
      description:
        extractText(attrs.field_overview_description) ||
        'The IP Observatory provides comprehensive data and analysis on intellectual property trends in Saudi Arabia and globally.',
    },
    ipServices: {
      heading: extractText(attrs.field_ip_services_heading) || 'IP Services',
      description:
        extractText(attrs.field_ip_services_desc) ||
        'Statistics and insights on IP services and registrations',
    },
    ipEnablement: {
      heading: extractText(attrs.field_ip_enablement_heading) || 'IP Enablement',
      description:
        extractText(attrs.field_ip_enablement_desc) ||
        'Data on IP education, awareness, and capacity building',
    },
    ipEnforcement: {
      heading: extractText(attrs.field_ip_enforcement_heading) || 'IP Enforcement',
      description:
        extractText(attrs.field_ip_enforcement_desc) ||
        'Information on IP rights enforcement and protection measures',
    },
    statistics,
    lastDataUpdate: formatDateForDisplay(
      attrs.field_last_data_update || attrs.changed || attrs.created,
    ),
  };
}

// Fallback data function
export function getIPObservatoryFallbackData(): IPObservatoryData {
  // Import fallback statistics from data file as temporary fallback
  return {
    ...transformIPObservatoryPage({ attributes: {}, relationships: {} } as DrupalNode, []),
    statistics: getEmptyStatistics(),
  };
}

// Main export function
export async function getIPObservatoryPageData(locale?: string): Promise<IPObservatoryData> {
  try {
    // Step 1: Get UUID without locale filter
    const uuid = await fetchIPObservatoryPageUuid();
    if (!uuid) {
      console.log(`🔴 IP OBSERVATORY: No content found, using fallback data (${locale || 'en'})`);
      return getIPObservatoryFallbackData();
    }

    // Step 2: Fetch node with locale for translated content
    const response = await fetchIPObservatoryPageByUuid(uuid, locale);
    const node = Array.isArray(response.data) ? response.data[0] : response.data;

    if (!node) {
      console.log(`🔴 IP OBSERVATORY: Node not found, using fallback data (${locale || 'en'})`);
      return getIPObservatoryFallbackData();
    }

    // Step 3: Get node's internal ID for fetching related paragraphs
    const nodeAttrs = node.attributes as any;
    const nodeId = nodeAttrs.drupal_internal__nid;

    // Step 4: Fetch statistics items separately (entity_reference_revisions don't work with include)
    const statisticsItems = await fetchStatisticsItems(String(nodeId), locale);

    // Step 5: Group statistics by category and tab
    const statistics = getEmptyStatistics();
    for (const item of statisticsItems) {
      const { category, tabType, ...statData } = item as StatisticsItemData & {
        category: string;
        tabType: string;
      };

      const categoryMap: Record<string, keyof StatisticsData> = {
        ip_services: 'ipServices',
        ip_enablement: 'ipEnablement',
        ip_enforcement: 'ipEnforcement',
      };

      const categoryKey = categoryMap[category] || 'ipServices';
      const tabKey = tabType === 'certificates' ? 'certificates' : 'application';

      statistics[categoryKey][tabKey].push(statData);
    }

    // Step 6: Transform node data
    const data = transformIPObservatoryPage(node, response.included || []);
    data.statistics = statistics;

    console.log(
      `✅ IP OBSERVATORY: Using Drupal data (${locale || 'en'}), stats: services=${data.statistics.ipServices.application.length}/${data.statistics.ipServices.certificates.length}`,
    );
    return data;
  } catch (error) {
    console.log(`🔴 IP OBSERVATORY: Using fallback data (${locale || 'en'})`);
    console.error('IP Observatory fetch error:', error);
    return getIPObservatoryFallbackData();
  }
}
