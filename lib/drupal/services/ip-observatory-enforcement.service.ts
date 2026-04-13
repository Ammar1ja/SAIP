import { fetchDrupal } from '../utils';
import { extractText, getRelated, getImageWithAlt } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { StatisticsCardData } from './common-types';

// Frontend interface for IP Observatory Enforcement
export interface IPObservatoryEnforcementData {
  hero: {
    title: string;
    description: string;
    backgroundImage?: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  tabs: string[];
  tabsData: Record<
    string,
    {
      id: string;
      title: string;
      description: string;
      statistics: StatisticsCardData[];
      lastUpdate?: string;
    }
  >;
  sampleChartData: Array<{
    month: string;
    value: number;
  }>;
}

// Transform statistics_item paragraph (standard format used across site)
export function transformStatisticsItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): StatisticsCardData {
  const attrs = (item as any).attributes || {};
  let chartData: Array<{ value: number }> = [];
  let trend: StatisticsCardData['trend'];
  let breakdown: StatisticsCardData['breakdown'];

  // Support both old (field_chart_data) and new (field_stat_chart_data) formats
  const chartDataField = attrs.field_stat_chart_data || attrs.field_chart_data;
  if (chartDataField) {
    try {
      const parsed =
        typeof chartDataField === 'string' ? JSON.parse(chartDataField) : chartDataField;
      if (Array.isArray(parsed)) {
        chartData = parsed.map((item: any) => ({
          value: typeof item === 'number' ? item : item.value || 0,
        }));
      }
    } catch (e) {
      console.warn('Failed to parse chart data:', e);
      chartData = [];
    }
  }

  // Handle trend data
  const trendValue = extractText(attrs.field_stat_trend_value);
  const trendDirection = extractText(attrs.field_stat_trend_direction) as 'up' | 'down' | 'neutral';
  const trendDescription = extractText(attrs.field_stat_trend_description);

  if (trendValue && trendDirection) {
    trend = {
      value: trendValue,
      direction: trendDirection || 'neutral',
      description: trendDescription || '',
    };
  }

  // Handle breakdown data
  const breakdownField = attrs.field_stat_breakdown;
  if (breakdownField) {
    try {
      const parsed =
        typeof breakdownField === 'string' ? JSON.parse(breakdownField) : breakdownField;
      if (Array.isArray(parsed)) {
        breakdown = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse breakdown data:', e);
    }
  }

  const chartType = (extractText(attrs.field_stat_chart_type) || 'line') as 'line' | 'bar' | 'pie';

  return {
    label: extractText(attrs.field_stat_label) || 'Statistic',
    value: parseInt(extractText(attrs.field_stat_value) || '0', 10),
    chartType,
    chartData,
    trend,
    breakdown,
  };
}

// Drupal fetch function
export async function fetchIPObservatoryEnforcementPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  // ✅ Enforcement uses vertical_tab_item which HAS field_statistics_items
  const includeFields =
    'field_hero_background_image,field_hero_background_image.field_media_image,field_statistics_items,field_tabs,field_tabs.field_image,field_tabs.field_image.field_media_image,field_tabs.field_statistics_items';
  const endpoint = `/node/ip_observatory_enforcement_page?filter[status]=1&include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformIPObservatoryEnforcementPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPObservatoryEnforcementData {
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

  // Get tabs from Drupal
  const tabsData = getRelated(rels, 'field_tabs', included) || [];
  const hasDrupalTabs = Array.isArray(tabsData) && tabsData.length > 0;

  const defaultTabs = ['IP Infringement', 'IP Committees'];
  const defaultTabsAr = ['انتهاك الملكية الفكرية', 'لجان الملكية الفكرية'];

  const tabs = hasDrupalTabs
    ? (tabsData as DrupalIncludedEntity[]).map(
        (tab) =>
          extractText((tab.attributes as any)?.title) ||
          extractText((tab.attributes as any)?.field_title) ||
          'Untitled',
      )
    : locale === 'ar'
      ? defaultTabsAr
      : defaultTabs;

  // Build tabsData from Drupal or use defaults
  const tabsDataObject: Record<string, any> = {};

  // Get current date for last update
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

  if (hasDrupalTabs) {
    (tabsData as DrupalIncludedEntity[]).forEach((tab, index: number) => {
      const tabAttrs = (tab.attributes as any) || {};
      const tabRels = (tab as any).relationships || {};
      const title = extractText(tabAttrs.title) || extractText(tabAttrs.field_title) || tabs[index];
      const description =
        extractText(tabAttrs.field_description) || extractText(tabAttrs.body) || '';
      const lastUpdate =
        formatDateForDisplay(
          extractText(tabAttrs.field_last_update) || tabAttrs.changed || tabAttrs.created,
        ) || formattedDate;

      // Get statistics items from tab (standard format used across site)
      const statisticsData = getRelated(tabRels, 'field_statistics_items', included) || [];

      // DEBUG: Log what we're getting
      const statistics = Array.isArray(statisticsData)
        ? statisticsData.map((item: DrupalIncludedEntity) =>
            transformStatisticsItem(item, included),
          )
        : [];

      tabsDataObject[title] = {
        id: `tab-${index}`,
        title,
        description,
        statistics,
        lastUpdate,
      };
    });
  } else {
    tabs.forEach((tabTitle, index) => {
      tabsDataObject[tabTitle] = {
        id: `tab-${index}`,
        title: tabTitle,
        description: locale === 'ar' ? 'وصف النص هنا' : 'Description text here',
        statistics: [],
        lastUpdate: formattedDate,
      };
    });
  }

  // If no statistics found, use defaults as fallback
  const hasAnyStatistics = Object.values(tabsDataObject).some(
    (tab: any) => tab.statistics && tab.statistics.length > 0,
  );

  if (!hasAnyStatistics) {
    const defaultStats: StatisticsCardData[] = [
      {
        label: locale === 'ar' ? 'عدد القضايا' : 'Number of cases',
        value: 1193,
        chartType: 'line',
        chartData: [
          { value: 950 },
          { value: 980 },
          { value: 1020 },
          { value: 1050 },
          { value: 1080 },
          { value: 1110 },
          { value: 1140 },
          { value: 1170 },
          { value: 1180 },
          { value: 1185 },
          { value: 1190 },
          { value: 1193 },
        ],
        trend: {
          value: '100%',
          direction: 'up' as const,
          description: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month',
        },
      },
      {
        label: locale === 'ar' ? 'عدد الإجراءات' : 'Number of actions',
        value: 758,
        chartType: 'line',
        chartData: [
          { value: 600 },
          { value: 620 },
          { value: 650 },
          { value: 670 },
          { value: 690 },
          { value: 700 },
          { value: 715 },
          { value: 730 },
          { value: 740 },
          { value: 745 },
          { value: 750 },
          { value: 758 },
        ],
        trend: {
          value: '100%',
          direction: 'up' as const,
          description: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month',
        },
      },
    ];

    Object.keys(tabsDataObject).forEach((key) => {
      tabsDataObject[key].statistics = defaultStats;
    });
  }

  // Get hero background image from relationships
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(rels, 'field_hero_background_image', included);
        return imageRel && !Array.isArray(imageRel) ? getImageWithAlt(imageRel, included) : null;
      })()
    : null;

  return {
    hero: {
      title:
        extractText(attrs.field_hero_heading) ||
        (locale === 'ar' ? 'إنفاذ الملكية الفكرية' : 'IP Enforcement'),
      description:
        extractText(attrs.field_hero_subheading) ||
        (locale === 'ar'
          ? 'معلومات عن إنفاذ حقوق الملكية الفكرية وتدابير الحماية'
          : 'Information on IP rights enforcement and protection measures'),
      backgroundImage: heroImage?.src,
    },
    overview: {
      heading:
        extractText((attrs as any).field_overview_heading) ||
        (locale === 'ar' ? 'نظرة عامة على إنفاذ الملكية الفكرية' : 'IP Enforcement Overview'),
      description:
        extractText((attrs as any).field_overview_description) ||
        (locale === 'ar'
          ? 'اكتشف مبادرات إنفاذ الملكية الفكرية وتدابير منع الانتهاك وأنشطة الحماية. يوفر هذا القسم رؤى حول إنفاذ الحقوق ومراقبة الامتثال والإجراءات القانونية المتخذة لحماية الملكية الفكرية.'
          : 'Discover our IP enforcement initiatives, infringement prevention measures, and protection activities. This section provides insights into rights enforcement, compliance monitoring, and legal actions taken to safeguard intellectual property.'),
    },
    tabs,
    tabsData: tabsDataObject,
    sampleChartData: [
      { month: 'Jan', value: 100 },
      { month: 'Feb', value: 150 },
      { month: 'Mar', value: 200 },
      { month: 'Apr', value: 250 },
      { month: 'May', value: 300 },
      { month: 'Jun', value: 350 },
      { month: 'Jul', value: 400 },
      { month: 'Aug', value: 450 },
      { month: 'Sep', value: 500 },
      { month: 'Oct', value: 550 },
      { month: 'Nov', value: 600 },
      { month: 'Dec', value: 1193 },
    ],
  };
}

// Fallback data function
export function getIPObservatoryEnforcementFallbackData(
  locale?: string,
): IPObservatoryEnforcementData {
  return transformIPObservatoryEnforcementPage(
    { attributes: {}, relationships: {} } as DrupalNode,
    [],
    locale,
  );
}

// Main export function
export async function getIPObservatoryEnforcementPageData(
  locale?: string,
): Promise<IPObservatoryEnforcementData> {
  try {
    console.log(`🔵 IP OBSERVATORY ENFORCEMENT: Fetching data from Drupal (${locale || 'en'})...`);

    const response = await fetchIPObservatoryEnforcementPage(locale);
    const nodes = response.data;
    const included = response.included || [];

    console.log(`📊 IP OBSERVATORY ENFORCEMENT: Found ${nodes.length} node(s)`);

    if (nodes.length === 0) {
      console.log(
        `🔴 IP OBSERVATORY ENFORCEMENT: Using fallback data ❌ (${locale || 'en'}) - No nodes found`,
      );
      return getIPObservatoryEnforcementFallbackData(locale);
    }

    const node = nodes[0];
    const data = transformIPObservatoryEnforcementPage(node, included, locale);

    console.log(`🟢 IP OBSERVATORY ENFORCEMENT: Using Drupal data ✅ (${locale || 'en'})`);
    console.log('Hero Title:', data.hero.title);
    console.log('Overview Heading:', data.overview.heading);
    console.log('Tabs:', data.tabs);
    console.log(
      'Statistics per tab:',
      Object.keys(data.tabsData).map(
        (key) => `${key}: ${data.tabsData[key].statistics.length} stats`,
      ),
    );

    return data;
  } catch (error) {
    console.log(`🔴 IP OBSERVATORY ENFORCEMENT: Using fallback data ❌ (${locale || 'en'})`);
    console.error('IP Observatory Enforcement fetch error:', error);
    return getIPObservatoryEnforcementFallbackData(locale);
  }
}
