/**
 * IP Infringement Service
 * Handles data fetching and transformation for IP Infringement page
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  extractText,
  extractHtml,
  getProxyUrl,
} from '../utils';
import {
  DrupalNode,
  DrupalIncludedEntity,
  DrupalStatisticsItemNode,
  DrupalGuideItemNode,
} from '../types';
import { DrupalResponse } from '../api-client';
import { StatisticsCardData, GuideCardData } from './common-types';
import { getApiUrl } from '../config';

// Frontend data interfaces
export interface IPInfringementData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    video: {
      videoSrc: string;
      videoPoster: string;
      description: string;
    };
    guide: {
      guideTitle: string;
      ctaLabel: string;
      ctaHref: string;
      guideCards: GuideCardData[];
    };
    statistics: StatisticsCardData[];
    relatedPages?: Array<{ title: string; href: string }>;
  };
  services: InfringementServiceData[];
  media: {
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    tabs: Array<{ id: string; label: string }>;
    content: Record<string, { title: string; description: string }>;
    filterFields: Array<{
      id: string;
      label: string;
      type: string;
      placeholder: string;
      variant?: 'single' | 'range';
    }>;
    badgeLabel: string;
  };
}

export interface InfringementServiceData {
  id: string;
  title: string;
  description: string;
  category: string;
  labels: string[];
  href: string;
  [key: string]: unknown; // Added to satisfy FilterableItem interface
}

// Drupal API functions
export async function fetchIPInfringementPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  // Include hero background image, video poster, guide items with files, and related pages
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_overview_video_file',
    'field_overview_video_poster',
    'field_guide_items',
    'field_guide_items.field_secondary_button_file',
    'field_services_items',
    'field_statistics_items',
    'field_related_page_items',
  ];

  const endpoint = `/node/ip_infringement_page?filter[status][value]=1&sort=-changed&page[limit]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformGuideItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GuideCardData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Get file URL from field_secondary_button_file (direct file reference)
  let fileUrl: string | undefined;
  if (relationships.field_secondary_button_file) {
    const fileEntity = getRelated(relationships, 'field_secondary_button_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        fileUrl = uri.startsWith('http') ? uri : `${getApiUrl()}${uri}`;
      }
    }
  }

  // Use uploaded file URL if available, otherwise use manual href
  const finalPrimaryHref = getProxyUrl(fileUrl || attrs.field_primary_button_href, 'download');
  const finalSecondaryHref = getProxyUrl(fileUrl || attrs.field_secondary_button_href, 'view');

  // Parse labels safely
  let labels: string[] = ['IP infringement'];
  if (attrs.field_labels) {
    if (Array.isArray(attrs.field_labels)) {
      // Already parsed as array
      labels = attrs.field_labels;
    } else if (typeof attrs.field_labels === 'string') {
      try {
        // Try to parse as JSON
        labels = JSON.parse(attrs.field_labels);
      } catch (e) {
        // If parsing fails, treat as comma-separated or single value
        labels = attrs.field_labels.split(',').map((l: string) => l.trim());
      }
    }
  }

  return {
    title: attrs.field_title || attrs.title || 'Untitled Guide',
    description: extractText(attrs.field_description) || '',
    labels,
    publicationDate: attrs.field_publication_date || '',
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref: finalPrimaryHref,
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref: finalSecondaryHref,
    titleBg: (attrs.field_title_bg as 'default' | 'green') || 'green',
  };
}

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
      chartData = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse chart data:', e);
    }
  }

  // Handle trend - support both old and new field names
  const trendValue = attrs.field_stat_trend_value || attrs.field_trend_value;
  const trendDirection = attrs.field_stat_trend_direction || attrs.field_trend_direction;
  const trendDesc = attrs.field_stat_trend_desc || attrs.field_trend_description;
  if (trendValue && trendDirection) {
    trend = {
      value: trendValue,
      direction: trendDirection as 'up' | 'down' | 'neutral',
      description: trendDesc || '',
    };
  }

  if (attrs.field_breakdown) {
    try {
      breakdown = JSON.parse(attrs.field_breakdown);
    } catch (e) {
      console.warn('Failed to parse breakdown data:', e);
    }
  }

  // Support multiple label/value formats
  const label = attrs.field_stat_label || attrs.field_label || 'Untitled Statistic';
  const value = attrs.field_stat_value || attrs.field_value;
  const chartType = (attrs.field_stat_chart_type || attrs.field_chart_type || 'line') as
    | 'line'
    | 'pie'
    | 'bar';

  // For pie charts, if no breakdown but chartData exists, use chartData as breakdown
  if (chartType === 'pie' && !breakdown && chartData.length > 0) {
    // Check if chartData has the breakdown structure (label, value, color)
    if (chartData[0] && 'label' in chartData[0]) {
      breakdown = chartData as any;
      chartData = []; // Clear chartData for pie charts
    }
  }

  return {
    label,
    value: value !== null && value !== undefined && value !== '' ? value : undefined, // Allow undefined for pie charts without main value
    chartType,
    chartData,
    trend,
    breakdown,
  };
}

export function transformIPInfringementPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPInfringementData {
  const attrs = node.attributes as any;
  const relationships = node.relationships || {};
  const appendVersionParam = (url: string, version?: string): string => {
    if (!url || !version || url === '#') return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(version)}`;
  };

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

  // Get overview video poster - field_overview_video_poster is an entity reference, so it's in relationships
  const videoPoster = relationships.field_overview_video_poster?.data
    ? (() => {
        const imageRel = getRelated(relationships, 'field_overview_video_poster', included);
        if (imageRel && !Array.isArray(imageRel)) {
          const imageData = getImageWithAlt(imageRel, included);
          return imageData?.src ? imageData : null;
        }
        return null;
      })()
    : null;

  const videoFileUrl = relationships.field_overview_video_file?.data
    ? (() => {
        const fileRel = getRelated(relationships, 'field_overview_video_file', included);
        if (fileRel && !Array.isArray(fileRel)) {
          const uri = (fileRel.attributes as any)?.uri?.url;
          const fileChanged = (fileRel.attributes as any)?.changed || attrs.changed;
          if (uri) {
            // Route through proxy to avoid Mixed Content (HTTPS frontend + HTTP backend)
            if (
              uri.startsWith('/sites/default/files/') ||
              (uri.startsWith('http') && uri.includes('/sites/default/files/'))
            ) {
              const proxiedUrl = getProxyUrl(uri, 'view');
              return appendVersionParam(proxiedUrl, fileChanged);
            }
            const absoluteUrl = uri.startsWith('http')
              ? uri
              : `${getApiUrl().replace('/jsonapi', '')}${uri}`;
            return appendVersionParam(absoluteUrl, fileChanged);
          }
        }
        return '';
      })()
    : '';
  const fallbackVideoSrc = extractText(attrs.field_video_src) || '';

  // Get guide items
  const guideItemsData = node.relationships?.field_guide_items
    ? getRelated(node.relationships, 'field_guide_items', included) || []
    : [];
  const guideItems = Array.isArray(guideItemsData)
    ? guideItemsData.map((item: DrupalIncludedEntity) => transformGuideItem(item, included))
    : [];

  // Get statistics items
  const statisticsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', included) || []
    : [];
  const statistics = Array.isArray(statisticsData)
    ? statisticsData.map((item: DrupalIncludedEntity) => transformStatisticsItem(item, included))
    : [];

  // Get services items
  const servicesData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', included) || []
    : [];
  const normalizeHref = (value?: string) => {
    if (!value || value === '#') return '';
    if (locale === 'ar' && value.startsWith('/') && !value.startsWith('/ar')) {
      return `/ar${value}`;
    }
    return value;
  };
  const buildServiceHref = (serviceAttrs: any) => {
    const explicitHref = normalizeHref(serviceAttrs.field_href);
    if (explicitHref) return explicitHref;
    const slug =
      serviceAttrs.field_slug ||
      (serviceAttrs.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    if (!slug) return '#';
    return normalizeHref(`/services/ip-infringement/${slug}`);
  };
  const parseLabels = (value?: string) => {
    if (!value) return ['Protection'];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return ['Protection'];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value
        .split(',')
        .map((label) => label.trim())
        .filter(Boolean);
    }
  };
  const services = Array.isArray(servicesData)
    ? servicesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          id: item.id,
          title: attrs.title || 'Untitled Service',
          description: extractText(attrs.field_description) || '',
          category: attrs.field_category || 'Protection',
          labels: parseLabels(attrs.field_labels),
          href: buildServiceHref(attrs) || '#',
        };
      })
    : [];

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', included) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => {
        const attrs = (tab as any).attributes || {};
        return {
          id: attrs.field_tab_id || 'tab',
          label: attrs.title || 'Untitled Tab',
        };
      })
    : [];

  // Get related pages
  const relatedPagesData = node.relationships?.field_related_page_items
    ? getRelated(node.relationships, 'field_related_page_items', included) || []
    : [];
  const relatedPages = Array.isArray(relatedPagesData)
    ? relatedPagesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        const linkField = attrs.field_link || {};
        return {
          title: attrs.field_title || linkField.title || 'Untitled Page',
          href: linkField.uri?.replace('internal:', '') || '#',
        };
      })
    : [];

  const normalizeLineBreaks = (value: string): string => {
    if (!value) return '';
    if (value.includes('<')) return value;
    return value.replace(/\r?\n/g, '<br />');
  };

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'IP infringement overview',
    heroSubheading:
      normalizeLineBreaks(extractHtml(attrs.field_hero_subheading)) ||
      "To ensures compliance with Saudi Arabia's IP laws, protecting the rights of creators, innovators, and businesses.",
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      video: {
        videoSrc: videoFileUrl || fallbackVideoSrc || 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoPoster: videoPoster?.src || '/images/services/infringement.jpg',
        description:
          extractText(attrs.field_video_description) ||
          'Watch the video and learn more about IP Infringement',
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'IP infringement guide',
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: attrs.field_guide_cta_href || '/resources/ip-information/guidelines',
        guideCards: guideItems,
      },
      statistics,
      relatedPages: relatedPages.length > 0 ? relatedPages : undefined,
    },
    services,
    media: {
      heroTitle: extractText(attrs.field_media_hero_title) || 'Media for IP infringement',
      heroDescription:
        extractText(attrs.field_media_hero_description) ||
        'Here you can find news related to IP infringement.',
      heroImage: '/images/services/infringement.jpg',
      tabs:
        mediaTabs.length > 0
          ? mediaTabs
          : [
              { id: 'news', label: 'News' },
              { id: 'videos', label: 'Videos' },
              { id: 'articles', label: 'Articles' },
            ],
      content: {
        news: {
          title: 'News',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Get the latest information on IP infringement.',
        },
        videos: {
          title: 'Videos',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Explore the latest updates on IP infringement through our video collection.',
        },
        articles: {
          title: 'Articles',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses on IP infringement.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'IP Infringement',
    },
  };
}

export function getIPInfringementFallbackData(): IPInfringementData {
  return {
    heroHeading: 'IP infringement overview',
    heroSubheading:
      "To ensures compliance with Saudi Arabia's IP laws, protecting the rights of creators, innovators, and businesses. Cases of infringement are handled promptly and fairly, safeguarding IP and supporting a transparent and innovative ecosystem.",
    heroImage: {
      src: '/images/services/infringement.jpg',
      alt: 'IP Infringement overview',
    },
    overview: {
      video: {
        videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoPoster: '/images/services/infringement.jpg',
        description: 'Watch the video and learn more about IP Infringement',
      },
      guide: {
        guideTitle: 'IP infringement guide',
        ctaLabel: 'Go to Guidelines',
        ctaHref: '/resources/ip-information/guidelines',
        guideCards: [
          {
            title: 'Beneficiary Guide IP Infringement Complaint',
            description: 'Guide for beneficiaries on filing IP infringement complaints',
            labels: ['IP infringement'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: getProxyUrl(
              '/files/beneficiary-guide-ip-infringement.pdf',
              'download',
            ),
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: getProxyUrl(
              '/files/beneficiary-guide-ip-infringement.pdf',
              'view',
            ),
            titleBg: 'green',
          },
        ],
      },
      statistics: [
        {
          label: 'Number of IP infringement cases in 2023',
          value: 4076,
          chartType: 'line',
          chartData: [
            { value: 800 },
            { value: 1200 },
            { value: 1800 },
            { value: 2400 },
            { value: 3000 },
            { value: 3600 },
            { value: 4076 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: 'Number of resolved cases in 2023',
          value: 4011,
          chartType: 'line',
          chartData: [
            { value: 750 },
            { value: 1100 },
            { value: 1650 },
            { value: 2200 },
            { value: 2800 },
            { value: 3400 },
            { value: 4011 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: `Applicant's type`,
          chartType: 'pie',
          breakdown: [
            { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#388A5A' },
            { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#1C6846' },
          ],
        },
      ],
    },
    services: [
      {
        id: 'trademark-infringement',
        title: 'Complaint of trademark infringement',
        description: 'A service that allows the user to file an industrial model application.',
        category: 'Protection',
        labels: ['Protection'],
        href: '/services/ip-infringement/trademark-complaint',
      },
      {
        id: 'copyright-infringement',
        title: 'Complaint of copyright infringement',
        description:
          'A service that allows the user to modify the specifications "No substantial change may be made".',
        category: 'Protection',
        labels: ['Protection'],
        href: '/services/ip-infringement/copyright-complaint',
      },
    ],
    media: {
      heroTitle: 'Media for IP infringement',
      heroDescription: 'Here you can find news related to IP infringement.',
      heroImage: '/images/services/infringement.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
        { id: 'articles', label: 'Articles' },
      ],
      content: {
        news: {
          title: 'News',
          description: 'Get the latest information on IP infringement.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on IP infringement through our video collection.',
        },
        articles: {
          title: 'Articles',
          description:
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses on IP infringement. Stay informed with expert insights, industry trends, and key developments shaping IP today.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'IP Infringement',
    },
  };
}

export async function getIPInfringementPageData(locale?: string): Promise<IPInfringementData> {
  try {
    // Step 1: Fetch to get UUID (without locale to ensure we get the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/ip_infringement_page?filter[status][value]=1&sort=-changed&page[limit]=1',
      {},
      'en',
    );

    if (!initialResponse.data || initialResponse.data.length === 0) {
      console.log('🔴 IP INFRINGEMENT: No content found, using fallback data');
      return getIPInfringementFallbackData();
    }

    const nodeUuid = initialResponse.data[0].id;

    // Step 2: Fetch with UUID and locale to get translated content
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_file',
      'field_overview_video_poster',
      'field_overview_video_poster.field_media_image',
      'field_guide_items',
      'field_guide_items.field_secondary_button_file',
      'field_statistics_items',
      'field_services_items',
      'field_related_page_items',
    ];

    const response = await fetchDrupal<DrupalNode>(
      `/node/ip_infringement_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    console.log(`🟢 IP INFRINGEMENT: Fetched node with ${included.length} included entities`);
    console.log('📦 Included entity types:', {
      media: included.filter((inc) => inc.type === 'media--image').length,
      file: included.filter((inc) => inc.type === 'file--file').length,
      paragraph: included.filter((inc) => inc.type?.startsWith('paragraph--')).length,
      other: included.filter(
        (inc) =>
          inc.type !== 'media--image' &&
          inc.type !== 'file--file' &&
          !inc.type?.startsWith('paragraph--'),
      ).length,
    });
    console.log(
      '📋 All included entities:',
      included.map((inc) => ({
        type: inc.type,
        id: inc.id,
        attributesKeys: Object.keys(inc.attributes || {}),
      })),
    );

    const data = transformIPInfringementPage(node, included, locale);

    const nodeNid = (node.attributes as any).drupal_internal__nid;
    try {
      const allParagraphsResponse = await fetchDrupal<DrupalIncludedEntity>(
        `/paragraph/statistics_item`,
        {},
        locale,
      );
      const allStatisticsParagraphs = Array.isArray(allParagraphsResponse.data)
        ? allParagraphsResponse.data
        : [];
      const matchingParagraphs = allStatisticsParagraphs.filter((p: any) => {
        const parentId = p.attributes?.parent_id;
        return (
          (parentId === String(nodeNid) || parentId === nodeNid) &&
          p.attributes?.parent_field_name === 'field_statistics_items'
        );
      });
      console.log(
        `📊 IP INFRINGEMENT: Stats paragraphs: ${matchingParagraphs.length} (parent_id=${nodeNid})`,
      );
      if (matchingParagraphs.length > 0) {
        data.overview.statistics = matchingParagraphs.map((p: DrupalIncludedEntity) =>
          transformStatisticsItem(p, []),
        );
      }
    } catch (statsError) {
      console.log(`⚠️ IP INFRINGEMENT: Could not fetch statistics paragraphs`);
    }

    console.log(`✅ IP INFRINGEMENT: Using Drupal data (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(
      `🔴 IP INFRINGEMENT: Error fetching data, using fallback data (${locale || 'en'})`,
      error,
    );
    return getIPInfringementFallbackData();
  }
}
