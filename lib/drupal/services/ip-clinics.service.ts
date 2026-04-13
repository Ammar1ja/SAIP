/**
 * IP Clinics Service
 * Handles data fetching and transformation for IP Clinics page
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  extractText,
  getApiUrl,
  getProxyUrl,
} from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalStatisticsItemNode } from '../types';
import { DrupalResponse } from '../api-client';
import { StatisticsCardData } from './common-types';

// Frontend data interfaces
export interface IPClinicsData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    title: string;
    description: string;
    videoCard: {
      title: string;
      description: string;
      videoSrc: string;
      videoPoster: string;
    };
    servicesTitle: string;
    servicesDescription: string;
    serviceTabs: Array<{
      id: string;
      label: string;
    }>;
    serviceTabsData: Array<{
      id: string;
      title: string;
      description: string;
      image: {
        src: string;
        alt: string;
      };
      buttonLabel: string;
      buttonHref: string;
      buttonLabel2: string;
      buttonHref2: string;
    }>;
    statistics: StatisticsCardData[];
  };
  services: ServiceItemData[];
}

export interface ServiceItemData {
  title: string;
  labels: string[];
  description: string;
  href: string;
}

const parseLabels = (raw?: string): string[] => {
  if (!raw) return ['Guidance'];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
    if (typeof parsed === 'string' && parsed.trim()) {
      return [parsed.trim()];
    }
  } catch {
    return raw
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);
  }
  return ['Guidance'];
};

// Drupal API functions
export async function fetchIPClinicsPage(
  locale?: string,
  includeFieldsOverride?: string[],
): Promise<DrupalResponse<DrupalNode>> {
  // Include fields that exist as relationships in Drupal
  const includeFields = includeFieldsOverride || [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_overview_video_file',
    'field_overview_video_poster',
    'field_statistics_items',
    'field_services_nodes',
    'field_service_tabs',
    'field_service_tabs.field_image',
    'field_service_tabs.field_image.field_media_image',
    'field_service_tabs.field_button_file',
  ];

  // Use full filter syntax filter[status][value]=1
  const endpoint = `/node/ip_clinics_page?filter[status][value]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformStatisticsItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): StatisticsCardData {
  const attrs = (item as any).attributes || {};

  let chartData: Array<{ value: number }> = [];
  let trend: StatisticsCardData['trend'];
  let breakdown: StatisticsCardData['breakdown'];

  // Handle chart data - support both formats and JSON with series
  const chartDataField = attrs.field_stat_chart_data || attrs.field_chart_data;
  if (chartDataField) {
    try {
      if (typeof chartDataField === 'string') {
        const parsed = JSON.parse(chartDataField);
        if (parsed.series && Array.isArray(parsed.series)) {
          chartData = parsed.series.map((s: any) => ({
            value: s.value,
            date: s.date,
          }));
        } else if (Array.isArray(parsed)) {
          chartData = parsed;
        }
      } else if (chartDataField.series && Array.isArray(chartDataField.series)) {
        chartData = chartDataField.series.map((s: any) => ({
          value: s.value,
          date: s.date,
        }));
      } else if (Array.isArray(chartDataField)) {
        chartData = chartDataField;
      }
    } catch (e) {
      console.warn('Failed to parse chart data:', e);
    }
  }

  // Handle trend - support both field names
  const trendValue = attrs.field_stat_trend_value || attrs.field_trend_value;
  const trendDirection = attrs.field_stat_trend_direction || attrs.field_trend_direction;
  const trendDesc = attrs.field_stat_trend_desc || attrs.field_trend_description;
  if (trendValue && trendDirection) {
    trend = {
      value: trendValue,
      direction: trendDirection as 'up' | 'down' | 'neutral',
      description: trendDesc,
    };
  }

  // Handle breakdown data with by_region support
  if (attrs.field_breakdown) {
    try {
      let parsedBreakdown;
      if (typeof attrs.field_breakdown === 'string') {
        parsedBreakdown = JSON.parse(attrs.field_breakdown);
      } else {
        parsedBreakdown = attrs.field_breakdown;
      }

      if (parsedBreakdown.by_region && Array.isArray(parsedBreakdown.by_region)) {
        const total = parsedBreakdown.by_region.reduce(
          (sum: number, region: any) => sum + region.value,
          0,
        );
        breakdown = parsedBreakdown.by_region.map((region: any) => ({
          label: region.region,
          value: total > 0 ? (region.value / total) * 100 : 0,
          displayValue: `${region.value}`,
          color: '#388A5A',
        }));
      } else if (Array.isArray(parsedBreakdown)) {
        breakdown = parsedBreakdown;
      }
    } catch (e) {
      console.warn('Failed to parse breakdown data:', e);
    }
  }

  // Support multiple formats:
  // - statistics_item: field_stat_label, field_stat_value (new format)
  // - statistics_item: field_label, field_value (old format)
  // - content_item: field_title, field_content
  let label = attrs.field_stat_label || attrs.field_label || 'Untitled Statistic';
  let value = attrs.field_stat_value || attrs.field_value;

  // If using content_item format
  if (!attrs.field_label && attrs.field_title) {
    const numericMatch = String(attrs.field_title).match(/[\d,]+/);
    value = numericMatch ? parseInt(numericMatch[0].replace(/,/g, '')) : 0;
    label = attrs.field_content || attrs.field_title || 'Statistic';
  }

  return {
    label,
    value: value || 0,
    chartType: (attrs.field_stat_chart_type || attrs.field_chart_type || 'line') as
      | 'line'
      | 'pie'
      | 'bar',
    chartData: chartData.length > 0 ? chartData : [{ value: value || 0 }],
    trend,
    breakdown,
  };
}

export function transformIPClinicsPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): IPClinicsData {
  const attrs = node.attributes as any;
  const relationships = node.relationships || {};

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
  const heroImage = relationships.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(relationships, 'field_hero_background_image', included);
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get overview video poster
  const videoPoster = attrs.field_overview_video_poster
    ? (() => {
        const imageRel = getRelated(relationships, 'field_overview_video_poster', included);
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  const videoFileUrl = relationships.field_overview_video_file?.data
    ? (() => {
        const fileRel = getRelated(relationships, 'field_overview_video_file', included);
        if (fileRel && !Array.isArray(fileRel)) {
          const uri = (fileRel.attributes as any)?.uri?.url;
          if (uri) {
            return uri.startsWith('http') ? uri : `${getApiUrl().replace('/jsonapi', '')}${uri}`;
          }
        }
        return '';
      })()
    : '';

  // Get service tabs
  const serviceTabsData = node.relationships?.field_service_tabs
    ? getRelated(node.relationships, 'field_service_tabs', included) || []
    : [];
  const serviceTabs = Array.isArray(serviceTabsData)
    ? serviceTabsData.map((tab: DrupalIncludedEntity) => {
        const attrs = (tab as any).attributes || {};
        return {
          id: attrs.field_tab_id || 'tab',
          label: attrs.field_title || 'Untitled Tab',
        };
      })
    : [];

  const serviceTabsDataTransformed = Array.isArray(serviceTabsData)
    ? serviceTabsData.map((tab: DrupalIncludedEntity) => {
        const attrs = (tab as any).attributes || {};
        const tabImage = (() => {
          const imageRel = getRelated((tab as any).relationships || {}, 'field_image', included);
          return imageRel && !Array.isArray(imageRel)
            ? getImageWithAlt(imageRel, included)
            : undefined;
        })();

        const tabRelationships = (tab as any).relationships || {};
        const buttonFileUrl = tabRelationships.field_button_file?.data
          ? (() => {
              const fileRel = getRelated(tabRelationships, 'field_button_file', included);
              if (fileRel && !Array.isArray(fileRel)) {
                const uri = (fileRel.attributes as any)?.uri?.url;
                if (uri) {
                  return uri.startsWith('http')
                    ? uri
                    : `${getApiUrl().replace('/jsonapi', '')}${uri}`;
                }
              }
              return '';
            })()
          : '';

        const primaryHref = buttonFileUrl
          ? getProxyUrl(buttonFileUrl, 'download')
          : getProxyUrl(attrs.field_button_href, 'download');
        const secondaryHref = buttonFileUrl
          ? getProxyUrl(buttonFileUrl, 'view')
          : getProxyUrl(attrs.field_button_href_2, 'view');

        return {
          id: attrs.field_tab_id || 'tab',
          title: attrs.field_title || 'Untitled',
          description: extractText(attrs.field_description) || '',
          image: {
            src: tabImage?.src || '/images/placeholder.jpg',
            alt: tabImage?.alt || 'Service image',
          },
          buttonLabel: attrs.field_button_label || 'Download file',
          buttonHref: primaryHref || '#',
          buttonLabel2: attrs.field_button_label_2 || 'View file',
          buttonHref2: secondaryHref || '#',
        };
      })
    : [];

  // Get statistics items
  const statisticsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', included) || []
    : [];

  const statistics = Array.isArray(statisticsData)
    ? statisticsData.map((item: DrupalIncludedEntity) => transformStatisticsItem(item, included))
    : [];

  // Get services items
  // Get services from field_services_nodes (node references, not paragraphs)
  const servicesData = node.relationships?.field_services_nodes
    ? getRelated(node.relationships, 'field_services_nodes', included) || []
    : [];
  const services = Array.isArray(servicesData)
    ? servicesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          title: attrs.title || 'Untitled Service',
          labels: parseLabels(attrs.field_labels),
          description: extractText(attrs.field_description) || '',
          href: attrs.field_href || '#',
        };
      })
    : [];

  // Use field_hero_heading/subheading for overview title/description
  // as field_overview_title/description do NOT exist in Drupal
  const heroHeading = extractText(attrs.field_hero_heading) || 'IP Clinics overview';
  const heroSubheading =
    extractText(attrs.field_hero_subheading) ||
    'Consulting clinics provide guidance and advice to companies, small and medium enterprises, entrepreneurs and individuals.';

  return {
    heroHeading,
    heroSubheading,
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      title: heroHeading,
      description: heroSubheading,
      videoCard: {
        title: attrs.field_video_card_title || 'Information library',
        description:
          attrs.field_video_card_description || 'Watch the video and learn more about IP Clinics.',
        videoSrc: videoFileUrl || attrs.field_video_src || '',
        videoPoster: videoPoster?.src || '',
      },
      servicesTitle: attrs.field_services_title || 'Services of the IP Clinics',
      servicesDescription:
        extractText(attrs.field_services_description) ||
        'Intellectual Property Clinics provide specialized services.',
      serviceTabs,
      serviceTabsData: serviceTabsDataTransformed,
      statistics,
    },
    services,
  };
}

export function getIPClinicsFallbackData(): IPClinicsData {
  return {
    heroHeading: 'IP Clinics overview',
    heroSubheading:
      'Consulting clinics provide guidance and advice to companies, small and medium enterprises, entrepreneurs and individuals desiring to establish innovation-based projects.',
    heroImage: {
      src: '/images/ip-clinics/hero.jpg',
      alt: 'IP Clinics overview',
    },
    overview: {
      title: 'IP Clinics overview',
      description:
        'Consulting clinics provide guidance and advice to companies, small and medium enterprises, entrepreneurs and individuals desiring to establish innovation-based projects with the aim to contribute to the IP rights registration, use and utilization.',
      videoCard: {
        title: 'Information library',
        description: 'Watch the video and learn more about IP Clinics.',
        videoSrc: '',
        videoPoster: '',
      },
      servicesTitle: 'Services of the IP Clinics',
      servicesDescription:
        'Intellectual Property Clinics (IP Clinics) are part of IP enablement programs, providing specialized services across three main tracks:',
      serviceTabs: [
        { id: 'guidance', label: 'Guidance and Advisory Track' },
        { id: 'technical', label: 'Technical Services Track' },
        {
          id: 'ip-support-course',
          label: 'The course of the support program for IP-based enterprises',
        },
      ],
      serviceTabsData: [
        {
          id: 'guidance',
          title: 'Guidance and Advisory Track',
          description:
            'Experts provide essential guidance on how to protect ideas and innovations through the correct registration of IP rights and offer advice on IP strategies.',
          image: {
            src: '/images/services/ip-clinics/guidance.jpg',
            alt: 'Guidance and Advisory Track',
          },
          buttonLabel: 'Download file',
          buttonHref: '/ip-clinics/download-guidance',
          buttonLabel2: 'View file',
          buttonHref2: '/ip-clinics/view-guidance',
        },
        {
          id: 'technical',
          title: 'Technical Services Track',
          description:
            'This track includes specialized technical services such as analyzing and evaluating ideas, which helps in determining how to transform these ideas into marketable products.',
          image: {
            src: '/images/services/ip-clinics/technical.jpg',
            alt: 'Technical Services Track',
          },
          buttonLabel: 'Download file',
          buttonHref: '/ip-clinics/download-technical',
          buttonLabel2: 'View file',
          buttonHref2: '/ip-clinics/view-technical',
        },
        {
          id: 'ip-support-course',
          title: 'The course of the support program for IP-based enterprises',
          description:
            'This track supports businesses that rely on intellectual property for growth and development by offering technical, financial, and advisory support to accelerate the innovation process and achieve commercial success.',
          image: {
            src: '/images/services/ip-clinics/ip-support-course.jpg',
            alt: 'The course of the support program for IP-based enterprises',
          },
          buttonLabel: 'Download file',
          buttonHref: '/ip-clinics/download-ip-support-course',
          buttonLabel2: 'View file',
          buttonHref2: '/ip-clinics/view-ip-support-course',
        },
      ],
      statistics: [
        {
          label: 'Number of Beneficiaries',
          value: 1193,
          chartType: 'line',
          chartData: [
            { value: 100 },
            { value: 250 },
            { value: 400 },
            { value: 550 },
            { value: 700 },
            { value: 850 },
            { value: 1193 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: 'Number of counseling sessions',
          value: 758,
          chartType: 'line',
          chartData: [
            { value: 75 },
            { value: 150 },
            { value: 225 },
            { value: 325 },
            { value: 450 },
            { value: 575 },
            { value: 758 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
      ],
    },
    services: [
      {
        title: 'Services of the IP consultancy clinics',
        labels: ['Guidance'],
        description:
          'IP advisory clinics are one of the services offered by SAIP. It aims to provide guidance services in intellectual property fields through advice provided by experts in this field to both individuals and institutions.',
        href: '#',
      },
    ],
  };
}

export async function getIPClinicsPageData(locale?: string): Promise<IPClinicsData> {
  try {
    // Fetch IP Clinics page with locale support
    const listResponse = await fetchIPClinicsPage(locale).catch((error) => {
      console.warn('IP CLINICS: Primary include failed, retrying with base includes', error);
      return fetchIPClinicsPage(locale, [
        'field_hero_background_image',
        'field_hero_background_image.field_media_image',
        'field_overview_video_poster',
        'field_statistics_items',
        'field_services_nodes',
        'field_service_tabs',
        'field_service_tabs.field_image',
        'field_service_tabs.field_image.field_media_image',
      ]);
    });
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      return getIPClinicsFallbackData();
    }

    // CRITICAL: Get UUID from first response, then fetch by UUID with locale
    // JSON:API requires UUID, not node ID, to return translated content with locale prefix
    const nodeUuid = nodes[0].id; // This is UUID from JSON:API response

    // Second fetch: get node by UUID with all includes (this returns translated content)
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_file',
      'field_overview_video_poster',
      'field_statistics_items',
      'field_services_nodes',
      'field_service_tabs',
      'field_service_tabs.field_image',
      'field_service_tabs.field_image.field_media_image',
      'field_service_tabs.field_button_file',
    ];
    const response = await fetchDrupal<DrupalNode>(
      `/node/ip_clinics_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    ).catch((error) => {
      console.warn('IP CLINICS: Detail include failed, retrying with base includes', error);
      const fallbackIncludes = [
        'field_hero_background_image',
        'field_hero_background_image.field_media_image',
        'field_overview_video_poster',
        'field_statistics_items',
        'field_services_nodes',
        'field_service_tabs',
        'field_service_tabs.field_image',
        'field_service_tabs.field_image.field_media_image',
      ];
      return fetchDrupal<DrupalNode>(
        `/node/ip_clinics_page/${nodeUuid}?include=${fallbackIncludes.join(',')}`,
        {},
        locale,
      );
    });

    // JSON:API returns single object when fetching by UUID, not array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const data = transformIPClinicsPage(node, included);
    return data;
  } catch (error) {
    console.error(
      `🔴 IP CLINICS: Error fetching data, using fallback data (${locale || 'en'})`,
      error,
    );
    return getIPClinicsFallbackData();
  }
}
