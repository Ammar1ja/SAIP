import { fetchDrupal } from '../utils';
import {
  extractText,
  getRelated,
  getImageUrl,
  getImageWithAlt,
  filterIncludedByLangcode,
} from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend interface for IP Observatory Enablement
export interface IPObservatoryEnablementData {
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
      statistics: Array<{
        label: string;
        value: string;
        trend: {
          value: string;
          direction: 'up' | 'down';
          description: string;
        };
        chartData?: Array<{ value: number }>;
      }>;
      lastUpdate?: string; // Date of last data update
    }
  >;
  sampleChartData: Array<{
    month: string;
    value: number;
  }>;
}

// Drupal fetch function
export async function fetchIPObservatoryEnablementPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  // ✅ Enablement uses vertical_tab_item which HAS field_statistics_items
  const includeFields =
    'field_hero_background_image,field_hero_background_image.field_media_image,field_statistics_items,field_tabs,field_tabs.field_image,field_tabs.field_image.field_media_image,field_tabs.field_statistics_items';
  const endpoint = `/node/ip_observatory_enablement_page?filter[status]=1&include=${includeFields}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformIPObservatoryEnablementPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPObservatoryEnablementData {
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

  // Default fallback data for tabs
  const defaultTabs = ['IP Clinics', 'National network of IP support centers', 'IP Academy'];
  const defaultTabsAr = [
    'عيادات الملكية الفكرية',
    'الشبكة الوطنية لمراكز دعم الملكية الفكرية',
    'أكاديمية الملكية الفكرية',
  ];

  const normalizeTabKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  const tabKeyAliases: Record<string, string> = {};
  const registerAliases = (canonicalKey: string, aliases: string[]) => {
    aliases.forEach((alias) => {
      tabKeyAliases[normalizeTabKey(alias)] = canonicalKey;
    });
  };
  registerAliases('ip clinics', ['IP Clinics', 'عيادات الملكية الفكرية']);
  registerAliases('national network of ip support centers', [
    'National network of IP support centers',
    'الشبكة الوطنية لمراكز دعم الملكية الفكرية',
  ]);
  registerAliases('ip academy', ['IP Academy', 'أكاديمية الملكية الفكرية']);
  const baseTrend = (localeValue?: string) => ({
    value: '100%',
    direction: 'up' as const,
    description: localeValue === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month',
  });

  const fallbackStatsByLocale: Record<
    string,
    Record<string, IPObservatoryEnablementData['tabsData'][string]['statistics']>
  > = {
    en: {
      'ip clinics': [
        { label: 'Number of clinics', value: '1193', trend: baseTrend('en') },
        { label: 'Number of consultations', value: '758', trend: baseTrend('en') },
        { label: 'Number of beneficiaries', value: '1193', trend: baseTrend('en') },
        { label: 'Satisfaction rate', value: '758', trend: baseTrend('en') },
      ],
      'national network of ip support centers': [
        { label: 'Number of IP support centers', value: '1193', trend: baseTrend('en') },
        { label: 'Number of network scope', value: '758', trend: baseTrend('en') },
        { label: 'Number of services', value: '1193', trend: baseTrend('en') },
        { label: 'Number of beneficiaries', value: '758', trend: baseTrend('en') },
      ],
      'ip academy': [
        { label: 'Number of courses', value: '1193', trend: baseTrend('en') },
        { label: 'Number of courses for companies', value: '758', trend: baseTrend('en') },
        { label: 'Number of trainees', value: '1193', trend: baseTrend('en') },
        {
          label: 'Number of entities with which cooperation has been achieved',
          value: '758',
          trend: baseTrend('en'),
        },
      ],
    },
    ar: {
      'ip clinics': [
        { label: 'عدد العيادات', value: '1193', trend: baseTrend('ar') },
        { label: 'عدد الاستشارات', value: '758', trend: baseTrend('ar') },
        { label: 'عدد المستفيدين', value: '1193', trend: baseTrend('ar') },
        { label: 'معدل الرضا', value: '758', trend: baseTrend('ar') },
      ],
      'national network of ip support centers': [
        { label: 'عدد مراكز دعم الملكية الفكرية', value: '1193', trend: baseTrend('ar') },
        { label: 'عدد نطاق الشبكة', value: '758', trend: baseTrend('ar') },
        { label: 'عدد الخدمات', value: '1193', trend: baseTrend('ar') },
        { label: 'عدد المستفيدين', value: '758', trend: baseTrend('ar') },
      ],
      'ip academy': [
        { label: 'عدد الدورات', value: '1193', trend: baseTrend('ar') },
        { label: 'عدد الدورات للشركات', value: '758', trend: baseTrend('ar') },
        { label: 'عدد المتدربين', value: '1193', trend: baseTrend('ar') },
        { label: 'عدد الجهات التي تم التعاون معها', value: '758', trend: baseTrend('ar') },
      ],
    },
  };

  const resolveFallbackStats = (title: string) => {
    const normalized = normalizeTabKey(title);
    const key = tabKeyAliases[normalized] || normalized;
    const localeKey = locale === 'ar' ? 'ar' : 'en';
    const map = fallbackStatsByLocale[localeKey];
    return map?.[key] || [];
  };

  const tabs = hasDrupalTabs
    ? (tabsData as any[]).map(
        (tab: any) =>
          extractText(tab.attributes?.title) ||
          extractText(tab.attributes?.field_title) ||
          'Untitled',
      )
    : locale === 'ar'
      ? defaultTabsAr
      : defaultTabs;

  // Get current date for last update
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

  // Build tabsData from Drupal or use defaults
  const tabsDataObject: Record<string, any> = {};

  if (hasDrupalTabs) {
    (tabsData as any[]).forEach((tab: any, index: number) => {
      const tabAttrs = tab.attributes || {};
      const tabRels = tab.relationships || {};
      const title = extractText(tabAttrs.title) || extractText(tabAttrs.field_title) || tabs[index];
      const description =
        extractText(tabAttrs.field_description) || extractText(tabAttrs.body) || '';
      const lastUpdate =
        formatDateForDisplay(
          extractText(tabAttrs.field_last_update) || tabAttrs.changed || tabAttrs.created,
        ) || formattedDate;

      // Get statistics items for this tab
      const statisticsItems = getRelated(tabRels, 'field_statistics_items', included) || [];
      const statistics = Array.isArray(statisticsItems)
        ? statisticsItems.map((stat: any) => {
            const statAttrs = stat.attributes || {};
            // Parse chart data from Drupal
            let chartData: Array<{ value: number }> | undefined;
            const chartDataRaw =
              extractText(statAttrs.field_stat_chart_data) ||
              extractText(statAttrs.field_chart_data);
            if (chartDataRaw) {
              try {
                chartData = JSON.parse(chartDataRaw);
              } catch (e) {
                console.error('Failed to parse chart data:', e);
              }
            }

            return {
              label:
                extractText(statAttrs.field_stat_label) ||
                extractText(statAttrs.field_label) ||
                extractText(statAttrs.field_title) ||
                '',
              value:
                extractText(statAttrs.field_stat_value) ||
                extractText(statAttrs.field_value) ||
                '0',
              trend: {
                value:
                  extractText(statAttrs.field_stat_trend_value) ||
                  extractText(statAttrs.field_trend_value) ||
                  '0%',
                direction: (extractText(statAttrs.field_stat_trend_direction) ||
                  extractText(statAttrs.field_trend_direction) ||
                  'up') as 'up' | 'down',
                description:
                  extractText(statAttrs.field_stat_trend_desc) ||
                  extractText(statAttrs.field_trend_description) ||
                  '',
              },
              chartData,
            };
          })
        : [];
      const fallbackStats = resolveFallbackStats(title);
      const finalStatistics = statistics.length > 0 ? statistics : fallbackStats;

      tabsDataObject[title] = {
        id: `tab-${index}`,
        title,
        description,
        statistics: finalStatistics,
        lastUpdate,
      };
    });
  } else {
    // Fallback data
    tabs.forEach((tabTitle, index) => {
      const fallbackStats = resolveFallbackStats(tabTitle);
      tabsDataObject[tabTitle] = {
        id: `tab-${index}`,
        title: tabTitle,
        description: locale === 'ar' ? 'وصف النص هنا' : 'Description text here',
        statistics: fallbackStats,
        lastUpdate: formattedDate,
      };
    });
  }

  // Statistics are now fetched from Drupal field_statistics_items on each vertical_tab_item

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
        (locale === 'ar' ? 'تمكين الملكية الفكرية' : 'IP Enablement'),
      description:
        extractText(attrs.field_hero_subheading) ||
        (locale === 'ar'
          ? 'بيانات عن التعليم والتوعية وبناء القدرات في مجال الملكية الفكرية'
          : 'Data on IP education, awareness, and capacity building'),
      backgroundImage: heroImage?.src,
    },
    overview: {
      heading:
        extractText(attrs.field_overview_heading) ||
        (locale === 'ar' ? 'نظرة عامة على تمكين الملكية الفكرية' : 'IP Enablement Overview'),
      description:
        extractText(attrs.field_overview_description) ||
        (locale === 'ar'
          ? 'استكشف برامج تمكين الملكية الفكرية الشاملة لدينا بما في ذلك المبادرات التعليمية وحملات التوعية وبناء القدرات وأنشطة الدعم المصممة لتعزيز معرفة وقدرات الملكية الفكرية.'
          : 'Explore our comprehensive IP enablement programs including educational initiatives, awareness campaigns, capacity building, and support activities designed to strengthen intellectual property knowledge and capabilities.'),
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
export function getIPObservatoryEnablementFallbackData(
  locale?: string,
): IPObservatoryEnablementData {
  return transformIPObservatoryEnablementPage(
    { attributes: {}, relationships: {} } as DrupalNode,
    [],
    locale,
  );
}

// Main export function
export async function getIPObservatoryEnablementPageData(
  locale?: string,
): Promise<IPObservatoryEnablementData> {
  try {
    console.log(`🔵 IP OBSERVATORY ENABLEMENT: Fetching data from Drupal (${locale || 'en'})...`);

    const response = await fetchIPObservatoryEnablementPage(locale);
    const nodes = response.data;
    const includedRaw = response.included || [];
    const included = filterIncludedByLangcode(includedRaw, locale || 'en');

    console.log(`📊 IP OBSERVATORY ENABLEMENT: Found ${nodes.length} node(s)`);

    if (nodes.length === 0) {
      console.log(
        `🔴 IP OBSERVATORY ENABLEMENT: Using fallback data ❌ (${locale || 'en'}) - No nodes found`,
      );
      return getIPObservatoryEnablementFallbackData(locale);
    }

    const node = nodes[0];
    const data = transformIPObservatoryEnablementPage(node, included, locale);

    console.log(`🟢 IP OBSERVATORY ENABLEMENT: Using Drupal data ✅ (${locale || 'en'})`);
    console.log('Hero Title:', data.hero.title);
    console.log('Overview Heading:', data.overview.heading);

    return data;
  } catch (error) {
    console.log(`🔴 IP OBSERVATORY ENABLEMENT: Using fallback data ❌ (${locale || 'en'})`);
    console.error('IP Observatory Enablement fetch error:', error);
    return getIPObservatoryEnablementFallbackData(locale);
  }
}
