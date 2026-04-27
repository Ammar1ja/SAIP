import { fetchDrupal } from '../utils';
import {
  getRelated,
  getImageWithAlt,
  extractText,
  filterIncludedByLangcode,
  getProxyUrl, // ✅ FIX: Added for transformGuideItem
  getApiUrl, // ✅ FIX: Added for file URL construction
  normalizeServiceTypeKey,
} from '../utils';
import { getInformationLibraryTitle } from '../utils/translations';
import {
  DrupalIPCategoryPageNode,
  DrupalIncludedEntity,
  DrupalGuideItemNode,
  DrupalPublicationItemNode,
  DrupalStatisticsItemNode,
  DrupalJourneySectionNode,
  DrupalMediaTabNode,
} from '../types';
import { DrupalResponse } from '../api-client';
import { ROUTES } from '@/lib/routes';
import {
  JourneySectionData,
  buildJourneySectionsHierarchy,
  buildJourneyTocItems,
} from './common-types';
import { getStatisticsForCategory, isStatisticsApiConfigured } from '@/lib/statistics-api';

// Frontend interfaces (reusing from patents with minor differences)
export interface TrademarksData {
  dataSource?: 'drupal' | 'fallback';
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    header: {
      title: string;
      description: string;
      videoSrc?: string;
      videoPoster?: {
        src: string;
        alt: string;
      };
    };
    guide: {
      guideTitle: string;
      guideCards: GuideCardData[];
      ctaLabel?: string;
      ctaHref?: string;
    };
    publications: {
      publications: PublicationCardData[];
      publicationsTitle: string;
      publicationsDescription: string;
      publicationsCtaLabel: string;
      publicationsCtaHref: string;
    };
    statistics: {
      statistics: StatisticsCardData[];
      statisticsTitle: string;
      statisticsCtaLabel: string;
      statisticsCtaHref: string;
    };
    gazette?: {
      heading: string;
      text: string;
      buttonText: string;
      buttonHref: string;
      imageSrc: string;
      imageAlt: string;
    };
  };
  journey: {
    sectionIds: string[];
    sections: Record<string, JourneySectionData>;
    tocItems: TOCItemData[];
    tocAriaLabel: string;
  };
  services: {
    title: string;
    services: ServiceItemData[];
    serviceTypeOptions: ServiceOptionData[];
    targetGroupOptions: ServiceOptionData[];
  };
  media: {
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    tabs: MediaTabData[];
    content: Record<string, MediaContentData>;
    filterFields: FilterFieldData[];
    badgeLabel: string;
  };
  relatedPages: {
    title: string;
    pages: Array<{ title: string; href: string }>;
  };
}

export interface GuideCardData {
  title: string;
  description: string;
  labels: string[];
  publicationDate: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  titleBg: 'default' | 'green';
}

export interface PublicationCardData {
  title: string;
  description: string;
  labels: string[];
  publicationNumber?: string;
  durationDate?: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  titleBg: 'default' | 'green';
}

export interface StatisticsCardData {
  label: string;
  value?: number;
  chartType: 'line' | 'pie' | 'bar';
  chartData?: Array<{ value: number }>;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    description?: string;
  };
  breakdown?: Array<{
    label: string;
    value: number;
    displayValue: string;
    color: string;
  }>;
}

// JourneySectionData is now imported from common-types

export interface TOCItemData {
  id: string;
  label: string;
  subItems?: TOCItemData[];
}

export interface ServiceItemData {
  title: string;
  labels: string[];
  description: string;
  href: string;
  primaryButtonLabel?: string;
}

export interface ServiceOptionData {
  value: string;
  label: string;
}

export interface MediaTabData {
  id: string;
  label: string;
}

export interface MediaContentData {
  title: string;
  description: string;
}

export interface FilterFieldData {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  variant?: 'single' | 'range';
}

// Drupal API functions
export async function fetchTrademarksPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  // Lightweight lookup used only to resolve the page UUID for the locale.
  // Heavy includes are fetched in the second request (by UUID).
  try {
    const endpoint = '/node/trademarks_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  } catch (error) {
    // Fallback to old content type
    const endpoint = '/node/ip_category_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  }
}

// Use extractText from utils for consistent HTML sanitization

// Transformation functions (reusing from patents)
export function transformGuideItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GuideCardData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // ✅ FIX: Get file URL from field_secondary_button_file (like patents.service.ts)
  let fileUrl: string | undefined;
  if (relationships.field_secondary_button_file) {
    const fileEntity = getRelated(relationships, 'field_secondary_button_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        const drupalBaseUrl = getApiUrl().replace('/jsonapi', '');
        fileUrl = uri.startsWith('http') ? uri : `${drupalBaseUrl}${uri}`;
      }
    }
  }

  // Get labels from Drupal field_labels (string field)
  let labels: string[] = ['Trademarks']; // fallback

  if (attrs.field_labels) {
    // Ensure field_labels is a string
    const labelsValue =
      typeof attrs.field_labels === 'string'
        ? attrs.field_labels
        : JSON.stringify(attrs.field_labels);

    try {
      // Try parsing as JSON array
      const parsed = JSON.parse(labelsValue);
      labels = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      // If not JSON, treat as comma-separated or single value
      labels = labelsValue
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (labels.length === 0) {
        labels = [labelsValue];
      }
    }
  }

  return {
    title: attrs.title || 'Untitled Guide',
    description: extractText(attrs.field_description) || extractText(attrs.field_content) || '',
    labels,
    publicationDate: formatDate(attrs.field_publication_date),
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref: getProxyUrl(fileUrl || attrs.field_primary_button_href, 'download'), // ✅ FIX: Use proxy
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref: getProxyUrl(fileUrl || attrs.field_secondary_button_href, 'view'), // ✅ FIX: Use proxy
    titleBg: (attrs.field_title_bg as 'default' | 'green') || 'green',
  };
}

export function transformPublicationItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): PublicationCardData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Get labels from Drupal (field_labels taxonomy or field_category)
  const labelTerms = relationships.field_labels
    ? getRelated(relationships, 'field_labels', included)
    : relationships.field_category
      ? getRelated(relationships, 'field_category', included)
      : null;

  const labels = labelTerms
    ? Array.isArray(labelTerms)
      ? labelTerms.map((term: any) => term?.attributes?.name || '').filter(Boolean)
      : [(labelTerms as any)?.attributes?.name || ''].filter(Boolean)
    : ['Trademarks']; // fallback

  return {
    title: attrs.title || 'Untitled Publication',
    description: extractText(attrs.field_description) || extractText(attrs.field_content) || '',
    labels,
    publicationNumber: attrs.field_publication_number,
    durationDate: attrs.field_duration_date,
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref: attrs.field_primary_button_href || '#',
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref: attrs.field_secondary_button_href || '#',
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

  // Handle trend - support both old and new field names
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
  if (!attrs.field_stat_label && !attrs.field_label && attrs.field_title) {
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

// Helper function to transform journey_item paragraph with nested structures
function transformJourneyItem(item: any, included: DrupalIncludedEntity[] = []): any {
  const itemAttrs = item.attributes || {};
  const itemRels = item.relationships || {};
  const normalizeKey = (value?: string): string | undefined => {
    if (!value) return undefined;
    return String(value).trim().toLowerCase().replace(/\s+/g, '-');
  };

  const result: any = {
    title: itemAttrs.field_title || '',
    description: extractText(itemAttrs.field_description) || '',
  };

  // Category (for Content Switcher filtering)
  if (itemAttrs.field_category) {
    result.category = normalizeKey(itemAttrs.field_category);
  }

  if (itemAttrs.field_button_label) {
    result.buttonLabel = itemAttrs.field_button_label;
  }

  if (itemAttrs.field_button_href) {
    result.buttonHref = itemAttrs.field_button_href;
  }

  // Sections (structured content)
  const sectionsRel = getRelated(itemRels, 'field_sections', included);
  if (sectionsRel && Array.isArray(sectionsRel)) {
    result.sections = sectionsRel
      .map((section: any) => {
        const sectionAttrs = section.attributes || {};
        const content = extractText(sectionAttrs.field_content) || '';
        const isNumbered = sectionAttrs.field_is_numbered || false;

        // Parse content as array if it contains newlines
        let parsedContent: string | string[] = content;
        if (content && content.includes('\n')) {
          const lines = content.split('\n').filter((line) => line.trim());
          if (lines.length > 1 || isNumbered) {
            parsedContent = lines;
          }
        }

        return {
          heading: sectionAttrs.field_heading || '',
          content: parsedContent,
          isNumbered,
        };
      })
      .filter((s: any) => s.heading || s.content);
  }

  // Example (nested accordion)
  const exampleRel = getRelated(itemRels, 'field_example', included);
  if (exampleRel && !Array.isArray(exampleRel)) {
    const exampleRels = (exampleRel as any).relationships || {};
    const exampleItemsRel = getRelated(exampleRels, 'field_example_items', included);

    if (exampleItemsRel && Array.isArray(exampleItemsRel)) {
      result.example = {
        items: exampleItemsRel
          .map((exItem: any) => {
            const exItemAttrs = exItem.attributes || {};
            return extractText(exItemAttrs.field_text) || '';
          })
          .filter((text: string) => text),
      };
    }
  }

  return result;
}

export function transformJourneySection(
  section: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): JourneySectionData {
  const attrs = (section as any).attributes || {};
  const rels = (section as any).relationships || {};

  // Parse items using transformJourneyItem
  let items: any[] = [];
  const itemsRel = getRelated(rels, 'field_items', included);

  if (itemsRel && Array.isArray(itemsRel)) {
    items = itemsRel
      .map((item: any) => transformJourneyItem(item, included))
      .filter((item: any) => item.title);
  }

  // Get parent section reference
  const parentSectionId = (() => {
    const parentRel = getRelated(rels, 'field_parent_section', included);
    if (parentRel && !Array.isArray(parentRel)) {
      return (parentRel as any).attributes?.field_section_id || null;
    }
    return null;
  })();

  // Display type and additional fields
  const displayType = attrs.field_display_type || 'default';
  const subtitle = attrs.field_subtitle || undefined;
  const showContentSwitcher = attrs.field_show_content_switcher || false;

  let contentSwitcherItems: Array<{ id: string; label: string }> | undefined;
  const switcherRel = getRelated(rels, 'field_content_switcher_items', included);
  if (switcherRel && Array.isArray(switcherRel)) {
    contentSwitcherItems = switcherRel
      .map((switcher: any) => {
        const switcherAttrs = switcher.attributes || {};
        const rawId = switcherAttrs.field_id || switcherAttrs.field_switcher_id || '';
        const id = rawId ? String(rawId).trim().toLowerCase().replace(/\s+/g, '-') : '';
        const label = switcherAttrs.field_label || '';
        return { id, label };
      })
      .filter((s: any) => s.id && s.label);
  }
  const shouldShowSwitcher = showContentSwitcher || (contentSwitcherItems?.length || 0) > 0;

  const result: JourneySectionData = {
    title: attrs.title || 'Untitled Section',
    description: extractText(attrs.field_description) || extractText(attrs.field_content) || '',
    buttonLabel: attrs.field_button_label,
    buttonHref: attrs.field_button_href,
    items,
    parentSectionId,
    displayType,
  };

  if (subtitle) result.subtitle = subtitle;
  if (shouldShowSwitcher && contentSwitcherItems) {
    result.showContentSwitcher = true;
    result.contentSwitcherItems = contentSwitcherItems;
  }

  return result;
}

export function transformMediaTab(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): MediaTabData {
  const attrs = (tab as any).attributes || {};

  const cleanTabId = (id: string): string => {
    if (!id) return 'tab';
    return id.replace(/['"]/g, '').toLowerCase();
  };

  return {
    id: cleanTabId(attrs.field_tab_id),
    label: attrs.title || 'Untitled Tab',
  };
}

export function transformTrademarksPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
  viewDetailsLabel?: string,
  gazetteTranslations?: {
    heading: string;
    text: string;
    buttonText: string;
  },
): TrademarksData {
  const attrs = node.attributes as any;

  // ✅ CRITICAL FIX: Filter included entities to match node's langcode
  // API returns ALL language versions, we need only the correct one
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          filteredIncluded,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get overview video poster
  const videoPoster = attrs.field_overview_video_poster
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_overview_video_poster',
          filteredIncluded,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get overview video file (uploaded media)
  let overviewVideoFileUrl: string | undefined;
  const overviewVideoRel = getRelated(
    node.relationships || {},
    'field_overview_video_file',
    included,
  );
  if (overviewVideoRel && !Array.isArray(overviewVideoRel)) {
    const uri = (overviewVideoRel as any)?.attributes?.uri?.url;
    if (uri) {
      const absoluteUrl = uri.startsWith('http') ? uri : `${getApiUrl()}${uri}`;
      overviewVideoFileUrl = getProxyUrl(absoluteUrl, 'view');
    }
  }

  // Get guide items
  const guideItemsData = node.relationships?.field_guide_items
    ? getRelated(node.relationships, 'field_guide_items', filteredIncluded) || []
    : [];
  const guideItems = Array.isArray(guideItemsData)
    ? guideItemsData.map((item: DrupalIncludedEntity) => transformGuideItem(item, filteredIncluded))
    : [];

  // Get publication items
  const publicationItemsData = node.relationships?.field_publications_items
    ? getRelated(node.relationships, 'field_publications_items', filteredIncluded) || []
    : [];
  const publicationItems = Array.isArray(publicationItemsData)
    ? publicationItemsData.map((item: DrupalIncludedEntity) =>
        transformPublicationItem(item, filteredIncluded),
      )
    : [];

  // Get statistics items
  const statisticsItemsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', filteredIncluded) || []
    : [];
  const statisticsItems = Array.isArray(statisticsItemsData)
    ? statisticsItemsData.map((item: DrupalIncludedEntity) =>
        transformStatisticsItem(item, filteredIncluded),
      )
    : [];

  // Get all journey_section nodes from included
  const allJourneySections = filteredIncluded.filter(
    (item: any) => item.type === 'node--journey_section',
  );

  // Get Level 1 section IDs (directly linked to Trademarks Page)
  const level1SectionIds = node.relationships?.field_journey_sections?.data
    ? (Array.isArray(node.relationships.field_journey_sections.data)
        ? node.relationships.field_journey_sections.data
        : [node.relationships.field_journey_sections.data]
      )
        .map((ref: any) => {
          const section = allJourneySections.find((s: any) => s.id === ref.id);
          return section ? (section as any).attributes?.field_section_id : null;
        })
        .filter(Boolean)
    : [];

  // Transform ALL sections (including subsections)
  const transformedSections = allJourneySections.map((section: DrupalIncludedEntity) => {
    const transformed = transformJourneySection(section, filteredIncluded);
    const sectionId = (section as any).attributes?.field_section_id || 'section';
    return { id: sectionId, section: transformed };
  });

  // Build hierarchy using helper function
  const { sections: journeySections, sectionIds } =
    buildJourneySectionsHierarchy(transformedSections);

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', filteredIncluded) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => transformMediaTab(tab, filteredIncluded))
    : [];

  // Get services items
  const servicesItemsData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', filteredIncluded) || []
    : [];
  const servicesItems = Array.isArray(servicesItemsData)
    ? servicesItemsData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        const relationships = (item as any).relationships || {};

        // Get service type (Protection, Management, etc.) from taxonomy
        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', filteredIncluded) ||
            getRelated(relationships, 'field_type', included) ||
            []
          : [];
        const serviceTypeEntity = Array.isArray(serviceTypeTerms)
          ? serviceTypeTerms[0]
          : serviceTypeTerms;
        const serviceType = (serviceTypeEntity as any)?.attributes?.name || '';

        const serviceTypeKey = normalizeServiceTypeKey(serviceType);
        const labels = serviceTypeKey ? [serviceTypeKey] : serviceType ? [serviceType] : [];

        const targetGroupTerms = relationships.field_target_group
          ? getRelated(relationships, 'field_target_group', filteredIncluded) || []
          : [];
        const targetGroups = Array.isArray(targetGroupTerms)
          ? targetGroupTerms.map((term: any) => term.attributes?.name || '').filter(Boolean)
          : !Array.isArray(targetGroupTerms) && targetGroupTerms
            ? [(targetGroupTerms as any).attributes?.name || ''].filter(Boolean)
            : [];

        return {
          title: attrs.title || attrs.field_title || 'Untitled Service',
          labels,
          description:
            extractText(attrs.field_description) ||
            extractText(attrs.field_content) ||
            extractText(attrs.body) ||
            '',
          href: attrs.field_href || '#',
          primaryButtonLabel:
            attrs.field_primary_button_label || viewDetailsLabel || 'View details',
          targetGroups,
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Trademarks overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Find out what a trademark is, how to register it, and what services are available for trademark owners.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title:
          extractText(attrs.field_overview_header_title) ||
          getInformationLibraryTitle(locale || nodeLangcode),
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) || 'Watch the video and learn the key steps involved in trademarks.',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'Trademarks guide',
        guideCards: guideItems,
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle: extractText(attrs.field_publications_title) || 'IP Gazette',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          'Official publication of trademark information and updates.',
        publicationsCtaLabel:
          extractText(attrs.field_publications_cta_label) || 'View all gazettes',
        publicationsCtaHref: attrs.field_publications_cta_href || '/resources/gazettes',
      },
      statistics: {
        statistics: statisticsItems,
        statisticsTitle: extractText(attrs.field_statistics_title) || 'Statistics',
        statisticsCtaLabel: extractText(attrs.field_statistics_cta_label) || 'View more statistics',
        statisticsCtaHref: attrs.field_statistics_cta_href || '/resources/statistics',
      },
      gazette: (() => {
        // Get gazette image from Drupal
        const gazetteImageRel = getRelated(
          node.relationships || {},
          'field_gazette_image',
          included,
        );
        const gazetteImageMedia = Array.isArray(gazetteImageRel)
          ? gazetteImageRel[0]
          : gazetteImageRel;
        const gazetteImage = gazetteImageMedia
          ? getImageWithAlt(gazetteImageMedia, included)
          : null;

        return {
          heading: extractText(attrs.field_publications_title) || 'IP Gazette',
          text:
            extractText(attrs.field_gazette_description) ||
            "<p>The IP Gazette is your trusted source for all trademark-related updates. Here, you will find details of trademark applications submitted on or after 19/12/2023, along with any subsequent changes to these records.</p><p>Whether it's renewals, ownership transfers, or modifications, the Gazette ensures you stay informed with the latest and most accurate trademark information.</p>",
          buttonText: extractText(attrs.field_publications_cta_label) || 'Go to IP Gazette',
          buttonHref: attrs.field_publications_cta_href || '/resources/tools-and-research/gazette',
          imageSrc: gazetteImage?.src || '/images/photo-container.png',
          imageAlt: gazetteImage?.alt || 'IP Gazette',
        };
      })(),
    },
    journey: {
      // Include all sections (parents + subsections) in sectionIds for rendering
      sectionIds,
      sections: journeySections,
      tocItems: buildJourneyTocItems(journeySections),
      tocAriaLabel: 'Trademarks journey navigation',
    },
    services: {
      title: extractText(attrs.field_services_title) || 'Trademarks services',
      services: servicesItems,
      serviceTypeOptions: [
        { value: 'registration', label: 'Registration' },
        { value: 'management', label: 'Management' },
        { value: 'enforcement', label: 'Enforcement' },
      ],
      targetGroupOptions: [
        { value: 'individuals', label: 'Individuals' },
        { value: 'enterprises', label: 'Enterprises' },
      ],
    },
    media: {
      heroTitle: 'Media for trademarks',
      heroDescription:
        'Here you can find news, videos, articles and events on various categories of IP.',
      heroImage: '/images/trademarks/hero.jpg',
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
            'Get the latest information on trademarks in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about trademarks.',
        },
        articles: {
          title: 'Articles',
          description:
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses to stay ahead in the world of intellectual property.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'Trademarks',
    },
    relatedPages: {
      title: (attrs as any).field_related_links_title || 'Related pages',
      pages: (() => {
        const relatedLinksData = (node.relationships as any)?.field_related_links
          ? getRelated(node.relationships as any, 'field_related_links', included) || []
          : [];
        const paragraphs = Array.isArray(relatedLinksData) ? relatedLinksData : [];
        return paragraphs.map((p: any) => {
          const pAttrs = p?.attributes || {};
          const link = pAttrs.field_link || {};
          return {
            title: pAttrs.field_title || link.title || 'Untitled',
            href: (link.uri || '').replace('internal:', '') || '#',
          };
        });
      })(),
    },
  };
}

export async function getTrademarksFallbackData(locale?: string): Promise<TrademarksData> {
  const { getTranslations } = await import('next-intl/server');
  const tButtons = await getTranslations({ locale: locale || 'en', namespace: 'common.buttons' });
  const viewDetailsLabel = tButtons('viewDetails');

  const tGazette = await getTranslations({ locale: locale || 'en', namespace: 'common.gazette' });
  const gazetteTranslations = {
    heading: tGazette('heading'),
    text: tGazette.raw('text'),
    buttonText: tGazette('buttonText'),
  };
  return {
    dataSource: 'fallback',
    heroHeading: 'Trademarks overview',
    heroSubheading:
      'Find out what a trademark is, how to register it, and what services are available for trademark owners.',
    heroImage: {
      src: '/images/trademarks/hero.jpg',
      alt: 'Trademarks overview',
    },
    overview: {
      header: {
        title: getInformationLibraryTitle(locale),
        description: 'Watch the video and learn the key steps involved in trademarks.',
        videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoPoster: {
          src: '/images/trademarks/overview.jpg',
          alt: 'Trademarks overview video',
        },
      },
      guide: {
        guideTitle: 'Trademarks guide',
        ctaLabel: 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
        guideCards: [
          {
            title: 'Saudi Design Classification',
            description: 'Locarno Classification Guide (14th Edition)',
            labels: ['Trademarks'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/saudi-design-classification.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/saudi-design-classification.pdf',
            titleBg: 'green',
          },
          {
            title: 'Software Copyright Protection Guide',
            description: 'Guidelines for Protecting Copyright in Software',
            labels: ['Trademarks'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/software-copyright-guide.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/software-copyright-guide.pdf',
            titleBg: 'green',
          },
          {
            title: 'Guide to patent application content',
            description: 'The content of the patent application necessary for filing',
            labels: ['Trademarks'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/guide-to-patent-application-content.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/guide-to-patent-application-content.pdf',
            titleBg: 'green',
          },
        ],
      },
      publications: {
        publications: [],
        publicationsTitle: 'IP Gazette',
        publicationsDescription: 'Official publication of trademark information and updates.',
        publicationsCtaLabel: 'View all gazettes',
        publicationsCtaHref: '/resources/gazettes',
      },
      statistics: {
        statistics: [
          {
            label: 'Number of trademark applications in 2023',
            value: 4076,
            chartType: 'line',
            chartData: [
              { value: 1000 },
              { value: 1500 },
              { value: 2000 },
              { value: 2500 },
              { value: 3000 },
              { value: 3500 },
              { value: 4076 },
            ],
            trend: { value: '100%', direction: 'up', description: 'vs last month' },
          },
          {
            label: 'Number of registered trademarks in 2023',
            value: 4011,
            chartType: 'line',
            chartData: [
              { value: 900 },
              { value: 1200 },
              { value: 1800 },
              { value: 2200 },
              { value: 2700 },
              { value: 3200 },
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
        statisticsTitle: 'Statistics',
        statisticsCtaLabel: 'View more statistics',
        statisticsCtaHref: '/resources/statistics',
      },
      gazette: {
        heading: gazetteTranslations.heading,
        text: gazetteTranslations.text,
        buttonText: gazetteTranslations.buttonText,
        buttonHref: '/resources/tools-and-research/gazette',
        imageSrc: '/images/photo-container.png',
        imageAlt: 'IP Gazette',
      },
    },
    journey: {
      sectionIds: [
        'guidance',
        'trademark-checklist',
        'ip-clinics',
        'ip-search-engine',
        'not-registrable',
        'protection',
        'management',
        'enforcement',
      ],
      sections: {
        guidance: {
          title: 'Guidance',
          description:
            'Turning Brands into Assets: The journey begins with understanding your trademark and its potential.',
        },
        'trademark-checklist': {
          title: 'Trademark checklist',
          description:
            'Evaluate whether your brand or mark meets the necessary criteria to qualify for trademark registration.',
          buttonLabel: 'Go to trademark checklist',
          buttonHref: '/resources/ip-information/digital-guide/ip-category/trademarks/checklist',
        },
        'ip-clinics': {
          title: 'IP Clinics',
          description:
            'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance.',
          buttonLabel: 'Go to IP Clinics',
          buttonHref: '/services/ip-clinics',
        },
        'ip-search-engine': {
          title: 'IP Search Engine',
          description: 'Search for registered trademarks.',
          buttonLabel: 'Go to search engine',
          buttonHref: '/resources/tools-and-research/ip-search-engine',
        },
        'not-registrable': {
          title: 'Non-registrable trademarks',
          description:
            'Certain types of trademarks cannot be registered. See the categories below.',
        },
        protection: {
          title: 'Protection',
          description: 'How to protect your trademark.',
        },
        management: {
          title: 'Management',
          description: 'Trademark management and renewals.',
        },
        enforcement: {
          title: 'Enforcement',
          description: 'How to enforce your trademark rights.',
        },
      },
      tocItems: [
        {
          id: 'guidance',
          label: 'Guidance',
          subItems: [
            { id: 'trademark-checklist', label: 'Trademark checklist' },
            { id: 'ip-clinics', label: 'IP Clinics' },
            { id: 'ip-search-engine', label: 'IP Search Engine' },
            {
              id: 'not-registrable',
              label: 'Non-registrable trademarks',
              subItems: [
                { id: 'generic-terms', label: 'Generic or descriptive terms' },
                { id: 'public-symbols', label: 'Public symbols and emblems' },
                { id: 'misleading-marks', label: 'Misleading or deceptive marks' },
                { id: 'immoral-marks', label: 'Immoral or offensive marks' },
                { id: 'personal-identifiers', label: 'Personal and geographic identifiers' },
                { id: 'similarity', label: 'Similarity to existing or well-known trademarks' },
                { id: 'contrary-policy', label: 'Trademarks contrary to public policy' },
              ],
            },
          ],
        },
        { id: 'protection', label: 'Protection' },
        { id: 'management', label: 'Management' },
        { id: 'enforcement', label: 'Enforcement' },
      ],
      tocAriaLabel: 'Trademarks journey navigation',
    },
    services: {
      title: 'Trademarks services',
      services: [
        {
          title: 'Trademark registration',
          labels: ['Protection'],
          description: 'A service that allows the user to apply for trademark registration.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Trademark associated with sound Registration',
          labels: ['Protection'],
          description: 'A service that allows the user to record a voice mark.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Collective mark registration',
          labels: ['Protection'],
          description:
            'Registration of collective marks that are used to distinguish the goods or services of members of organizations.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Application for registration of control marks',
          labels: ['Protection'],
          description: 'A mark intended to indicate the conduct of control or examination.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Trademark for non-commercial purpose Registration',
          labels: ['Protection'],
          description:
            'It is a mark registered for non-commercial purposes, such as logos used by professional organizations.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Trademark renewal',
          labels: ['Protection'],
          description:
            'A service that enables the applicant to renew trademark protection for a period of ten years.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Transfer the trademark ownership',
          labels: ['Protection'],
          description:
            'A service that allows the user to transfer the ownership of the trademark from the owner to another person.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: 'Amend the address of the trademark owner',
          labels: ['Protection'],
          description:
            'A service that allows the trademark owner to modify the address of the trademark owner.',
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
        {
          title: "Amend the owner's name trademark data",
          labels: ['Protection'],
          description: "A service that allows the trademark owner to modify the owner's name",
          href: '#',
          primaryButtonLabel: viewDetailsLabel,
        },
      ],
      serviceTypeOptions: [
        { value: 'registration', label: 'Registration' },
        { value: 'management', label: 'Management' },
        { value: 'enforcement', label: 'Enforcement' },
      ],
      targetGroupOptions: [
        { value: 'individuals', label: 'Individuals' },
        { value: 'enterprises', label: 'Enterprises' },
      ],
    },
    media: {
      heroTitle: 'Media for trademarks',
      heroDescription:
        'Here you can find news, videos, articles and events on various categories of IP.',
      heroImage: '/images/trademarks/hero.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
        { id: 'articles', label: 'Articles' },
      ],
      content: {
        news: {
          title: 'News',
          description:
            'Get the latest information on trademarks in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about trademarks.',
        },
        articles: {
          title: 'Articles',
          description:
            'Discover the latest articles from SAIP. Explore expert insights, key developments, and detailed analyses to stay ahead in the world of intellectual property.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'Trademarks',
    },
    relatedPages: {
      title: 'Related pages',
      pages: [
        { title: 'FAQs', href: '/resources/ip-information/faq' },
        { title: 'Guidelines', href: '/resources/ip-information/guidelines' },
        { title: 'IP Clinics', href: '/services/ip-clinics' },
        { title: 'IP Academy', href: '/services/ip-academy' },
        {
          title: 'Laws & regulations',
          href: '/resources/lows-and-regulations/systems-and-regulations',
        },
        {
          title: 'International treaties & agreements',
          href: '/resources/lows-and-regulations/international-treaties',
        },
      ],
    },
  };
}

export async function getTrademarksPageData(
  locale?: string,
  options?: { includeJourney?: boolean; includeStatistics?: boolean },
): Promise<TrademarksData> {
  const includeJourney = options?.includeJourney ?? true;
  const includeStatistics = options?.includeStatistics ?? true;
  try {
    // Step 1: Get the list of nodes to find the UUID with the correct locale
    const listResponse = await fetchTrademarksPage(locale || 'en');

    // Handle both array and single object responses
    const nodes = Array.isArray(listResponse.data)
      ? listResponse.data
      : [listResponse.data].filter(Boolean);

    if (nodes.length === 0) {
      return await getTrademarksFallbackData(locale);
    }

    // Step 2: Fetch by UUID with locale to get translated content
    const nodeUuid = nodes[0].id;
    const baseIncludeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_file',
      'field_overview_video_poster',
      'field_overview_video_poster.field_media_image',
      'field_publications_items',
      'field_media_tabs',
      'field_related_links',
      'field_guide_items',
      'field_gazette_image',
      'field_gazette_image.field_media_image',
      'field_guide_items.field_secondary_button_file', // Include uploaded files for guide items
      'field_statistics_items',
      'field_services_items',
      'field_services_items.field_type',
      'field_services_items.field_label',
      'field_services_items.field_target_group',
    ];
    const journeyIncludeFields = ['field_journey_sections'];
    const includeFields = includeJourney
      ? [...baseIncludeFields, ...journeyIncludeFields]
      : baseIncludeFields;

    const response = await fetchDrupal<DrupalIPCategoryPageNode>(
      `/node/trademarks_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // Get translations for transform function
    const { getTranslations } = await import('next-intl/server');
    const tButtons = await getTranslations({ locale: locale || 'en', namespace: 'common.buttons' });
    const viewDetailsLabel = tButtons('viewDetails');

    const tGazette = await getTranslations({ locale: locale || 'en', namespace: 'common.gazette' });
    const gazetteTranslations = {
      heading: tGazette('heading'),
      text: tGazette.raw('text'),
      buttonText: tGazette('buttonText'),
    };

    // When fetching by UUID, response.data is a single object, not an array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    let included = response.included || [];

    // ✅ CRITICAL FIX: Fetch ONLY Trademarks journey sections with FULL nested paragraphs
    // Build filter for sections that belong to Trademarks hierarchy
    if (includeJourney) {
      const journeyInclude = [
        'field_items',
        'field_content_switcher_items',
        'field_parent_section',
      ].join(',');

      try {
        // Step 1: Get Level 1 section IDs from Trademarks Page
        const level1SectionUuids = node.relationships?.field_journey_sections?.data
          ? (Array.isArray(node.relationships.field_journey_sections.data)
              ? node.relationships.field_journey_sections.data
              : [node.relationships.field_journey_sections.data]
            ).map((ref: any) => ref.id)
          : [];

        if (level1SectionUuids.length === 0) {
          console.warn('⚠️ No Level 1 sections found for Trademarks Page');
        }

        // Step 2: Fetch Level 1 sections
        const level1Promises = level1SectionUuids.map((uuid) =>
          fetchDrupal<DrupalJourneySectionNode>(
            `/node/journey_section/${uuid}?include=${journeyInclude}`,
            {},
            locale,
          ),
        );
        const level1Responses = await Promise.all(level1Promises);

        const level1Sections: any[] = [];
        const level1Included: any[] = [];

        level1Responses.forEach((response) => {
          const section = Array.isArray(response.data) ? response.data[0] : response.data;
          if (section) level1Sections.push(section);
          if (response.included) level1Included.push(...response.included);
        });

        // Step 3: Fetch subsections (children of Level 1)
        const subsectionPromises = level1Sections.map((section) =>
          fetchDrupal<DrupalJourneySectionNode>(
            `/node/journey_section?filter[field_parent_section.id]=${section.id}&include=${journeyInclude}`,
            {},
            locale,
          ),
        );
        const subsectionResponses = await Promise.all(subsectionPromises);

        const subsections: any[] = [];
        const subsectionIncluded: any[] = [];

        subsectionResponses.forEach((response) => {
          const subs = Array.isArray(response.data)
            ? response.data
            : [response.data].filter(Boolean);
          subsections.push(...subs);
          if (response.included) subsectionIncluded.push(...response.included);
        });

        // Combine all sections
        const allJourneySections = [...level1Sections, ...subsections];
        const journeyIncluded = [...level1Included, ...subsectionIncluded];

        // Replace journey_section entities in included array with fully-nested versions
        included = included.filter((item: any) => item.type !== 'node--journey_section');
        included.push(...allJourneySections, ...journeyIncluded);
      } catch (e) {
        console.warn('⚠️ Failed to fetch journey sections separately:', e);
      }
    }

    const data = transformTrademarksPage(
      node,
      included,
      locale,
      viewDetailsLabel,
      gazetteTranslations,
    );

    // Fetch statistics paragraphs separately (entity_reference_revisions not included by JSON:API)
    // Skipped when caller doesn't need statistics (e.g. the journey API route).
    if (includeStatistics) {
      const nodeNid = (node.attributes as any).drupal_internal__nid;
      try {
        const statsEndpoint = `/paragraph/statistics_item?filter[parent_id]=${nodeNid}&filter[parent_field_name]=field_statistics_items`;
        const statsResponse = await fetchDrupal<DrupalIncludedEntity>(statsEndpoint, {}, locale);
        const matchingParagraphs = Array.isArray(statsResponse.data) ? statsResponse.data : [];
        if (matchingParagraphs.length > 0) {
          data.overview.statistics.statistics = matchingParagraphs.map((p: DrupalIncludedEntity) =>
            transformStatisticsItem(p, []),
          );
        }
      } catch (_statsError) {
        // Ignore statistics fallback errors and keep page rendering.
      }
    }

    data.dataSource = 'drupal';
    return data;
  } catch (error) {
    console.error(`TRADEMARKS: Using fallback data (${locale || 'en'})`, error);
    return await getTrademarksFallbackData(locale);
  }
}

/**
 * Alternative helper that augments the standard Drupal-based page data with
 * statistics loaded from the external statistics API instead of Drupal paragraphs.
 *
 * This function is NOT used anywhere yet – it allows a safe, opt-in migration path.
 */
export async function getTrademarksPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<TrademarksData> {
  const data = await getTrademarksPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('trademarks');
    if (statsCards && statsCards.length > 0) {
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error('TRADEMARKS: External statistics API failed, keeping Drupal statistics.', error);
  }

  return data;
}
