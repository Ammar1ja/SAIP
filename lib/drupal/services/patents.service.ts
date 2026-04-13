import type { ReactNode } from 'react';
import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  extractText,
  filterIncludedByLangcode,
  getProxyUrl,
  getApiUrl, // ✅ FIX: Added for transformGuideItem
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
import { getStatisticsForCategory, isStatisticsApiConfigured } from '@/lib/statistics-api';
import {
  JourneySectionData,
  buildJourneySectionsHierarchy,
  buildJourneyTocItems,
} from './common-types';

// Frontend interfaces
export interface PatentsData {
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
  icon?: ReactNode | string;
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
export async function fetchPatentsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  // Lightweight lookup used only to resolve the page UUID for the locale.
  // Heavy includes are fetched in the second request (by UUID).
  try {
    const endpoint = '/node/patents_page?filter[status][value]=1';
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

// Transformation functions
export function transformGuideItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GuideCardData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Format date from ISO string to display format
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

  // Get file URL from file field if available
  // Logic: One uploaded file is used for BOTH View and Download buttons
  // If no file uploaded, use manual URLs (field_primary_button_href, field_secondary_button_href)
  const getFileUrl = (): string | null => {
    if (!relationships.field_secondary_button_file) {
      return null;
    }

    const fileRel = getRelated(relationships, 'field_secondary_button_file', included);
    if (!fileRel || Array.isArray(fileRel)) return null;

    // Get file URL from file entity
    const fileAttrs = (fileRel as any).attributes || {};
    if (fileAttrs.uri?.url) {
      // ✅ FIX: Use getApiUrl() instead of process.env for consistency
      const drupalBaseUrl = getApiUrl().replace('/jsonapi', '');
      const fullUrl = `${drupalBaseUrl}${fileAttrs.uri.url}`;
      return fullUrl;
    }

    return null;
  };

  // Get labels from Drupal - try taxonomy terms first, fallback to string field
  const labelTerms = relationships.field_labels
    ? getRelated(relationships, 'field_labels', included)
    : relationships.field_category
      ? getRelated(relationships, 'field_category', included)
      : null;

  let labels: string[] = [];

  if (labelTerms) {
    // Labels from taxonomy terms
    labels = Array.isArray(labelTerms)
      ? labelTerms.map((term: any) => term?.attributes?.name || '').filter(Boolean)
      : [(labelTerms as any)?.attributes?.name || ''].filter(Boolean);
  } else if (attrs.field_labels) {
    // Fallback to string field
    labels = Array.isArray(attrs.field_labels)
      ? attrs.field_labels.filter((label: any) => label && typeof label === 'string')
      : [attrs.field_labels].filter((label) => label && typeof label === 'string');
  }

  // Default fallback
  if (labels.length === 0) {
    labels = ['Patents'];
  }

  // Get uploaded file URL (if exists)
  const uploadedFileUrl = getFileUrl();

  // Primary button href - prefer uploaded file, fallback to manual URL
  const primaryButtonHref = getProxyUrl(
    uploadedFileUrl || attrs.field_primary_button_href,
    'download',
  );

  // Secondary button href - same file as primary (for View), fallback to manual URL
  const secondaryButtonHref = getProxyUrl(
    uploadedFileUrl || attrs.field_secondary_button_href,
    'view',
  );

  return {
    title: attrs.title || 'Untitled Guide',
    description: extractText(attrs.field_description),
    labels,
    publicationDate: formatDate(attrs.field_publication_date),
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref,
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref,
    titleBg: (attrs.field_title_bg as 'default' | 'green') || 'green',
  };
}

export function transformPublicationItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): PublicationCardData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Get labels from Drupal - try taxonomy terms first, fallback to string field
  const labelTerms = relationships.field_labels
    ? getRelated(relationships, 'field_labels', included)
    : relationships.field_category
      ? getRelated(relationships, 'field_category', included)
      : null;

  let labels: string[] = [];

  if (labelTerms) {
    // Labels from taxonomy terms
    labels = Array.isArray(labelTerms)
      ? labelTerms.map((term: any) => term?.attributes?.name || '').filter(Boolean)
      : [(labelTerms as any)?.attributes?.name || ''].filter(Boolean);
  } else if (attrs.field_labels) {
    // Fallback to string field
    labels = Array.isArray(attrs.field_labels) ? attrs.field_labels : [attrs.field_labels];
  }

  // Default fallback
  if (labels.length === 0) {
    labels = ['Patents'];
  }

  return {
    title: attrs.title || 'Untitled Publication',
    description: extractText(attrs.field_description),
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

  // Handle chart data - support both old (field_chart_data) and new (field_stat_chart_data) formats
  const chartDataField = attrs.field_stat_chart_data || attrs.field_chart_data;
  if (chartDataField) {
    try {
      if (typeof chartDataField === 'string') {
        const parsed = JSON.parse(chartDataField);
        if (parsed.series && Array.isArray(parsed.series)) {
          // Convert series to simple value array
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

  // Handle breakdown data - convert region data to expected format
  if (attrs.field_breakdown) {
    try {
      let parsedBreakdown;
      if (typeof attrs.field_breakdown === 'string') {
        parsedBreakdown = JSON.parse(attrs.field_breakdown);
      } else {
        parsedBreakdown = attrs.field_breakdown;
      }

      if (parsedBreakdown.by_region && Array.isArray(parsedBreakdown.by_region)) {
        // Convert breakdown to expected format
        const total = parsedBreakdown.by_region.reduce(
          (sum: number, region: any) => sum + region.value,
          0,
        );
        breakdown = parsedBreakdown.by_region.map((region: any) => ({
          label: region.region,
          value: total > 0 ? (region.value / total) * 100 : 0,
          displayValue: `${region.value}`,
          color: '#388A5A', // Default green color
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
    // field_title contains the numeric value like "25,000+" or "96%"
    const numericMatch = String(attrs.field_title).match(/[\d,]+/);
    value = numericMatch ? parseInt(numericMatch[0].replace(/,/g, '')) : 0;
    // field_content is the label/description
    label = attrs.field_content || attrs.field_title || 'Statistic';
  }

  return {
    label,
    value: value || 0,
    icon: attrs.field_stat_icon || undefined,
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
export function transformJourneyItem(item: any, included: DrupalIncludedEntity[] = []): any {
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

  // Add category if exists (for Content Switcher filtering)
  if (itemAttrs.field_category) {
    result.category = normalizeKey(itemAttrs.field_category);
  }

  if (itemAttrs.field_button_label) {
    result.buttonLabel = itemAttrs.field_button_label;
  }

  if (itemAttrs.field_button_href) {
    result.buttonHref = itemAttrs.field_button_href;
  }

  // Parse sections (structured content)
  const sectionsRel = getRelated(itemRels, 'field_sections', included);

  if (sectionsRel && Array.isArray(sectionsRel)) {
    result.sections = sectionsRel
      .map((section: any) => {
        const sectionAttrs = section.attributes || {};
        const content = extractText(sectionAttrs.field_content) || '';
        const isNumbered = sectionAttrs.field_is_numbered || false;

        // Parse content as array if it contains newlines (for lists)
        let parsedContent: string | string[] = content;
        if (content && content.includes('\n')) {
          const lines = content.split('\n').filter((line) => line.trim());
          // If it looks like a list and has multiple lines, make it an array
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

  // Parse example (nested accordion)
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

  // Parse items from journey_item paragraphs
  let items: any[] = [];
  const itemsRel = getRelated(rels, 'field_items', included);

  if (itemsRel && Array.isArray(itemsRel)) {
    items = itemsRel
      .map((item: any) => transformJourneyItem(item, included))
      .filter((item: any) => item.title);
  }

  // Get parent section reference (for hierarchical structure)
  const parentSectionId = (() => {
    if (!attrs.field_parent_section && !rels?.field_parent_section) {
      return null;
    }

    const parentRel = getRelated(rels, 'field_parent_section', included);

    if (!parentRel || Array.isArray(parentRel)) {
      return null;
    }

    return (parentRel as any).attributes?.field_section_id || null;
  })();

  // Get display type
  const displayType = attrs.field_display_type || 'default';

  // Get subtitle (for accordion-group)
  const subtitle = attrs.field_subtitle || undefined;

  // Get content switcher settings
  const showContentSwitcher = attrs.field_show_content_switcher || false;
  let contentSwitcherItems: Array<{ id: string; label: string }> | undefined;

  const switcherRel = getRelated(rels, 'field_content_switcher_items', included);

  if (switcherRel && Array.isArray(switcherRel)) {
    contentSwitcherItems = switcherRel
      .map((switcher: any) => {
        const switcherAttrs = switcher.attributes || {};
        const rawId = switcherAttrs.field_switcher_id || switcherAttrs.field_id || '';
        const id = rawId ? String(rawId).trim().toLowerCase().replace(/\s+/g, '-') : '';
        const label = switcherAttrs.field_label || '';

        return { id, label };
      })
      .filter((s: any) => s.id && s.label);
  }
  const shouldShowSwitcher = showContentSwitcher || (contentSwitcherItems?.length || 0) > 0;

  const result: JourneySectionData = {
    title: attrs.title || 'Untitled Section',
    description: extractText(attrs.field_description),
    buttonLabel: attrs.field_button_label,
    buttonHref: attrs.field_button_href,
    items,
    parentSectionId,
    displayType,
  };

  if (subtitle) {
    result.subtitle = subtitle;
  }

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

  // Clean up tab ID - remove quotes and extra characters
  const cleanTabId = (id: string): string => {
    if (!id) return 'tab';
    return id.replace(/['"]/g, '').toLowerCase();
  };

  return {
    id: cleanTabId(attrs.field_tab_id),
    label: attrs.title || 'Untitled Tab',
  };
}

export function transformPatentsPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): PatentsData {
  const attrs = node.attributes as any;

  // ✅ CRITICAL FIX: Filter included entities to match node's langcode
  // API returns ALL language versions, we need only the correct one
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);

  // If filteredIncluded is empty but included has data, use included
  // This happens when related entities don't have translations
  const effectiveIncluded = filteredIncluded.length > 0 ? filteredIncluded : included;

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          effectiveIncluded,
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
          effectiveIncluded,
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
    ? getRelated(node.relationships, 'field_guide_items', effectiveIncluded) || []
    : [];

  const guideItems = Array.isArray(guideItemsData)
    ? guideItemsData.map((item: DrupalIncludedEntity) => {
        // IMPORTANT: Use full 'included' array (not filtered) for file relationships
        // Files don't have langcode and should not be filtered
        return transformGuideItem(item, included);
      })
    : [];

  // Get publication items
  const publicationItemsData = node.relationships?.field_publications_items
    ? getRelated(node.relationships, 'field_publications_items', effectiveIncluded) || []
    : [];
  const publicationItems = Array.isArray(publicationItemsData)
    ? publicationItemsData.map((item: DrupalIncludedEntity) =>
        transformPublicationItem(item, effectiveIncluded),
      )
    : [];

  // Get statistics items
  const statisticsItemsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', effectiveIncluded) || []
    : [];
  const statisticsItems = Array.isArray(statisticsItemsData)
    ? statisticsItemsData.map((item: DrupalIncludedEntity) =>
        transformStatisticsItem(item, effectiveIncluded),
      )
    : [];

  // Get journey sections (Level 1 - directly linked)
  const journeySectionsData = node.relationships?.field_journey_sections
    ? getRelated(node.relationships, 'field_journey_sections', effectiveIncluded) || []
    : [];

  // Collect all section IDs from Level 1 sections
  const level1SectionIds = Array.isArray(journeySectionsData)
    ? journeySectionsData.map((section: DrupalIncludedEntity) => {
        return (section as any).attributes?.field_section_id || null;
      })
    : [];

  // Find all child sections (Level 2 and Level 3) from included entities
  // They are included via field_parent_section relationship or fetched separately
  const allJourneySections: DrupalIncludedEntity[] = Array.isArray(journeySectionsData)
    ? [...journeySectionsData]
    : [];

  // Add child sections from included array
  // They are either included via field_parent_section relationship or fetched separately
  effectiveIncluded.forEach((entity) => {
    if (entity.type === 'node--journey_section') {
      const sectionId = (entity as any).attributes?.field_section_id;

      // Skip if already in list or is a Level 1 section
      if (
        level1SectionIds.includes(sectionId) ||
        allJourneySections.some((s) => (s as any).attributes?.field_section_id === sectionId)
      ) {
        return;
      }

      // Check if this section has a parent
      const parentRel = getRelated(
        (entity as any).relationships || {},
        'field_parent_section',
        effectiveIncluded,
      );

      if (parentRel && !Array.isArray(parentRel)) {
        const parentSectionId = (parentRel as any).attributes?.field_section_id;
        // Include if parent is Level 1, or if parent is already in our list (for Level 3)
        if (
          level1SectionIds.includes(parentSectionId) ||
          allJourneySections.some(
            (s) => (s as any).attributes?.field_section_id === parentSectionId,
          )
        ) {
          allJourneySections.push(entity);
        }
      } else if ((entity as any).relationships?.field_parent_section?.data?.id) {
        // Parent might be referenced by UUID only (not in included)
        // Check if parent UUID matches any Level 1 section UUID
        const parentUuid = (entity as any).relationships.field_parent_section.data.id;
        const journeySectionsArray = Array.isArray(journeySectionsData)
          ? journeySectionsData
          : journeySectionsData
            ? [journeySectionsData]
            : [];
        const parentIsLevel1 = journeySectionsArray.some(
          (s: DrupalIncludedEntity) => (s as any).id === parentUuid,
        );
        const parentIsInList = allJourneySections.some(
          (s: DrupalIncludedEntity) => (s as any).id === parentUuid,
        );

        if (parentIsLevel1 || parentIsInList) {
          allJourneySections.push(entity);
        }
      }
    }
  });

  // Transform all sections (Level 1, 2, and 3)
  const transformedSections = allJourneySections.map((section: DrupalIncludedEntity) => {
    const transformed = transformJourneySection(section, effectiveIncluded);
    const sectionId = (section as any).attributes?.field_section_id || 'section';
    return { id: sectionId, section: transformed };
  });

  // Build hierarchy using helper function (includes virtual sections for items)
  const { sections: journeySections, sectionIds } =
    buildJourneySectionsHierarchy(transformedSections);

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', effectiveIncluded) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => transformMediaTab(tab, effectiveIncluded))
    : [];

  // Get services items
  const servicesItemsData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', effectiveIncluded) || []
    : [];
  const servicesItems = Array.isArray(servicesItemsData)
    ? servicesItemsData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        const relationships = (item as any).relationships || {};

        // Get service type (Protection, Management, etc.) from taxonomy
        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', effectiveIncluded) ||
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
          ? getRelated(relationships, 'field_target_group', effectiveIncluded) || []
          : [];
        const targetGroups = Array.isArray(targetGroupTerms)
          ? targetGroupTerms.map((term: any) => term.attributes?.name || '').filter(Boolean)
          : !Array.isArray(targetGroupTerms) && targetGroupTerms
            ? [(targetGroupTerms as any).attributes?.name || ''].filter(Boolean)
            : [];

        // Support both service_item and content_item formats
        return {
          title: attrs.title || attrs.field_title || 'Untitled Service',
          labels,
          description:
            extractText(attrs.field_description) ||
            extractText(attrs.field_content) ||
            extractText(attrs.body) ||
            '',
          href: attrs.field_href || attrs.field_link?.uri?.replace('internal:', '') || '#',
          primaryButtonLabel: attrs.field_primary_button_label || 'View details',
          targetGroups,
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Patents overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) || 'A patent is a legal right given to the creator.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title:
          extractText(attrs.field_overview_header_title) ||
          getInformationLibraryTitle(locale || nodeLangcode),
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) || 'Watch the video and learn the key steps involved in patents.',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'Patent Guide',
        guideCards: guideItems,
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle: extractText(attrs.field_publications_title) || 'Publications',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          'The patent publications provides important updates and information on patent procedures.',
        publicationsCtaLabel:
          extractText(attrs.field_publications_cta_label) || 'View more publication',
        publicationsCtaHref: attrs.field_publications_cta_href || '/resources/publications',
      },
      statistics: {
        statistics: statisticsItems,
        statisticsTitle: extractText(attrs.field_statistics_title) || 'Statistics',
        statisticsCtaLabel: extractText(attrs.field_statistics_cta_label) || 'View more statistics',
        statisticsCtaHref: attrs.field_statistics_cta_href || '/resources/statistics',
      },
    },
    journey: {
      // Include all sections (parents + subsections + virtual items) in sectionIds for rendering
      sectionIds,
      sections: journeySections,
      tocItems: buildJourneyTocItems(journeySections),
      tocAriaLabel: 'Patents journey navigation',
    },
    services: {
      title: extractText(attrs.field_services_title) || 'Patents services',
      services: servicesItems,
      serviceTypeOptions: [
        { value: 'guidance', label: 'Guidance' },
        { value: 'protection', label: 'Protection' },
        { value: 'management', label: 'Management' },
        { value: 'enforcement', label: 'Enforcement' },
      ],
      targetGroupOptions: [
        { value: 'individuals', label: 'Individuals' },
        { value: 'enterprises', label: 'Enterprises' },
      ],
    },
    media: {
      heroTitle: 'Media for patents',
      heroDescription:
        'Here you can find news, videos, articles and events on various categories of IP.',
      heroImage: '/images/about/hero.jpg',
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
            'Get the latest information on patents in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about patents.',
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
      badgeLabel: 'Patents',
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

export function getPatentsFallbackData(locale?: string): PatentsData {
  return {
    dataSource: 'fallback',
    heroHeading: 'Patents overview',
    heroSubheading:
      'A patent is a legal right given to the creator. Typically, a patent ensures that the owner has the power to control how the invention is used by others.',
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Patents overview',
    },
    overview: {
      header: {
        title: getInformationLibraryTitle(locale),
        description: 'Watch the video and learn the key steps involved in patents.',
        videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
        videoPoster: {
          src: '/images/patents/overview.jpg',
          alt: 'Patents overview video',
        },
      },
      guide: {
        guideTitle: 'Patent Guide',
        ctaLabel: 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
        guideCards: [
          {
            title: 'Fast track examination and sharing work with other offices guide',
            description: 'Locarno Classification Guide (14th Edition)',
            labels: ['Patents'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/fast-track.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/fast-track.pdf',
            titleBg: 'green',
          },
          {
            title: 'Examination report guide',
            description: 'Guidelines for Protecting Copyright in Software',
            labels: ['Patents'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/exam-report.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/exam-report.pdf',
            titleBg: 'green',
          },
          {
            title: 'Guide to patent application',
            description: 'The content of the patent application necessary for filing',
            labels: ['Patents'],
            publicationDate: '04.08.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/patent-application.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/patent-application.pdf',
            titleBg: 'green',
          },
        ],
      },
      publications: {
        publications: [
          {
            title: 'Patent publication 6261',
            description: '',
            labels: ['Patents'],
            publicationNumber: '568980620',
            durationDate: '11.09 - 11.11.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/publication-6261.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/publication-6261.pdf',
            titleBg: 'green',
          },
          {
            title: 'Patent publication 6262',
            description: '',
            labels: ['Patents'],
            publicationNumber: '568980621',
            durationDate: '12.09 - 12.11.2024',
            primaryButtonLabel: 'Download file',
            primaryButtonHref: '/files/publication-6262.pdf',
            secondaryButtonLabel: 'View file',
            secondaryButtonHref: '/files/publication-6262.pdf',
            titleBg: 'green',
          },
        ],
        publicationsTitle: 'Publications',
        publicationsDescription:
          'The patent publications provides important updates and information on patent procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
        publicationsCtaLabel: 'View more publication',
        publicationsCtaHref: '/resources/publications',
      },
      statistics: {
        statistics: [
          {
            label: 'Number of patent applications in 2023',
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
            label: 'Number of registered patents in 2023',
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
    },
    journey: {
      sectionIds: [
        'guidance',
        'patent-checklist',
        'ip-clinics',
        'ip-search-engine',
        'not-patentable',
        'protection',
        'application-process',
        'requirements',
        'how-long-does-it-take',
        'key-documents-needed',
        'why-requirements-important',
        'management',
        'managing-granted-patent',
        'maintain-patent',
        'commercialize-patent',
        'update-records',
        'expand-internationally',
        'maximize-value',
        'enforcement',
        'enforcement-process',
        'understand-rights',
        'steps-to-enforce',
        'saip-support',
        'protecting-patent',
      ],
      sections: {
        // ========== GUIDANCE ==========
        guidance: {
          title: 'Guidance',
          description:
            'Turning ideas into opportunities, The journey begins with understanding your idea and its potential. We help you evaluate its patentability, conduct prior art searches, and navigate the requirements of the patent system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
          displayType: 'default',
          subsections: [
            { id: 'patent-checklist', title: 'Patent checklist' },
            { id: 'ip-clinics', title: 'IP Clinics' },
            { id: 'ip-search-engine', title: 'IP search engine' },
            { id: 'not-patentable', title: 'Not patentable categories' },
          ],
        },
        'patent-checklist': {
          title: 'Patent checklist',
          description:
            'Evaluate whether your idea or invention meets the necessary criteria to qualify for patent protection. It also helps inventors, businesses, and professionals systematically assess the strengths and weaknesses of an invention before committing to the patent application process.',
          buttonLabel: 'Go to patent checklist',
          buttonHref: '/resources/ip-information/digital-guide/ip-category/patents/checklist',
          displayType: 'default',
          parentSectionId: 'guidance',
        },
        'ip-clinics': {
          title: 'IP Clinics',
          description:
            'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting intellectual property rights, issuing prior art search reports that enable beneficiaries to identify the novelty of the innovative opportunity or develop it, and the Intellectual Property Accelerator Program.',
          buttonLabel: 'Go to IP Clinics',
          buttonHref: '/services/ip-clinics',
          displayType: 'default',
          parentSectionId: 'guidance',
        },
        'ip-search-engine': {
          title: 'IP search engine',
          description:
            'Search for patent records in the SAIP intellectual property (IP) engine essential for innovators, businesses, researchers, and IP professionals to assess novelty, avoid infringement, and gain competitive insights.',
          buttonLabel: 'Go to IP search engine',
          buttonHref: '/resources/tools-and-research/ip-search-engine',
          displayType: 'default',
          parentSectionId: 'guidance',
        },
        'not-patentable': {
          title: 'Not patentable categories',
          description:
            'There are excluded categories of inventions or ideas that are not patentable in Saudi Arabia based on the Saudi Patent Law, and these exclusions align with international practices while reflecting local laws and cultural considerations.',
          displayType: 'cards',
          parentSectionId: 'guidance',
          items: [
            {
              title: 'Discoveries, scientific theories, and mathematical methods',
              description:
                '1. Natural discoveries, such as the identification of existing natural phenomena or laws of nature.\n2. Scientific principles or theories, which are abstract and not applied in a practical manner.\n3. Purely mathematical methods, such as equations, algorithms, or calculations without specific technical application.',
            },
            {
              title: 'Schemes, rules, and methods',
              description:
                '• Business models: Methods of conducting business, financial strategies, or commercial techniques.\n• Mental acts: Purely intellectual activities or mental exercises, such as problem-solving or learning methods.\n• Game rules: Instructions or methods for playing games or organizing competitions.',
            },
            {
              title: 'Aesthetic creations',
              description:
                'Artistic works and purely aesthetic designs, such as paintings, sculptures, or decorative patterns, which lack functional or technical aspects.',
            },
            {
              title: 'Medical and surgical methods',
              description:
                '1. Procedures for diagnosing, treating, or performing surgery on humans or animals.\n2. Note: This exclusion applies to the methods, but medical devices, pharmaceuticals, and related technical tools are patentable.',
            },
            {
              title: 'Natural substances and biological processes',
              description:
                '1. Naturally occurring materials, such as minerals, plants, or animals, in their unmodified state.\n2. Biological processes for producing plants or animals, such as crossbreeding or natural selection, unless they involve technical intervention.',
            },
            {
              title: 'Inventions contrary to public order or morality',
              description:
                '1. Any invention deemed harmful to Islamic principles, public order, or public morality.\n2. Examples include weapons of mass destruction or technologies intended for unethical or illegal purposes.',
            },
          ],
        },

        // ========== PROTECTION ==========
        protection: {
          title: 'Protection',
          description:
            'Protecting your patent guarantees your exclusive rights to your invention. Filing a patent application requires adherence to the Saudi Patent Law and the guidelines. This overview of the key requirements, essential documents, and examples will help you meet the legal standards and secure your innovation.',
          displayType: 'default',
          subsections: [
            { id: 'application-process', title: 'Application process for patents' },
            { id: 'requirements', title: 'Requirements' },
          ],
        },
        'application-process': {
          title: 'Application process for patents',
          subtitle: 'Steps to patent application',
          description:
            'Welcome to the Saudi Authority for Intellectual Property (SAIP) guide to patent applications. Learn how your invention can progress from application to grant with our clear and streamlined process.\n\nIf you wish to protect your patent internationally, consider using the PCT service, which allows you to seek protection in over 150 member countries through a single international application.',
          displayType: 'accordion-group',
          parentSectionId: 'protection',
          items: [
            {
              title: '1. Submit your application',
              description:
                "• Start your patent journey by submitting a complete application. Make sure to include all the requirements that are listed in (). Don't forget to pay the filing fees after submission to ensure that your application is fully submitted.",
            },
            {
              title: '2. Formal examination',
              description:
                "• Your application will be reviewed to confirm compliance with procedural requirements. If corrections are needed, you'll be notified and given a chance to update your submission.",
            },
            {
              title: '3. Application publication',
              description:
                'Once approved through formal examination:\n• Your application is published in the SAIP Official Gazette.\n• A public notice period begins, allowing third parties to review or object if needed.',
            },
            {
              title: '4. Substantive examination',
              description:
                'SAIP evaluates your application to ensure it meets the patentability criteria:\n• Novelty: Is your invention new and never disclosed before?\n• Inventive Step: Is it a non-obvious advancement over existing solutions?\n• Industrial Applicability: Can it be used in industry?\n\nIf there are concerns, SAIP will issue an examination report for you to address.',
            },
            {
              title: '5. Respond to examination reports',
              description:
                'You can respond to any objections or feedback by:\n• Providing explanations.\n• Amending your application.\n• Submitting additional documents.\n\nYou may also request an appointment to meet with examiners for further discussion.',
            },
            {
              title: '6. Grant or rejection',
              description:
                "After evaluation:\n• Grant: If your invention meets all criteria, it will be granted a patent, published in the Official Gazette, and you'll receive a certificate of grant.\n• Rejection: If issues remain unresolved, your application may be rejected. You can appeal this decision through SAIP's grievance process.",
            },
          ],
        },
        requirements: {
          title: 'Requirements',
          description: 'General requirements for a patent application',
          displayType: 'expandable',
          parentSectionId: 'protection',
          items: [
            {
              title: 'Eligibility',
              sections: [
                {
                  heading: 'Who can apply',
                  content: [
                    'The inventor(s).',
                    'A legal representative or agent acting on behalf of the inventor(s).',
                    'A business entity holding ownership rights to the invention.',
                  ],
                  isNumbered: true,
                },
                {
                  heading: 'Ownership proof',
                  content:
                    'If the applicant is not the inventor, legal documentation (e.g., assignment agreements) is required to demonstrate ownership.',
                },
              ],
              example: {
                items: [
                  'A company files a patent for a <strong>3D printer nozzle</strong> developed by an employee, using an assignment agreement.',
                ],
              },
            },
            {
              title: 'Patentability criteria',
              sections: [
                {
                  heading: 'The invention must meet the following criteria',
                  content: [
                    'Novelty: The invention must be new and not previously disclosed to the public.',
                    'Inventive Step: It should demonstrate innovation beyond what is obvious to experts in the field.',
                    'Industrial Applicability: The invention must have practical uses in a specific industry.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A <strong>3D printing method</strong> that reduces material waste by introducing real-time calibration during the printing process.',
                ],
              },
            },
          ],
        },
        'how-long-does-it-take': {
          title: 'How long does it take?',
          description:
            '<p>The process typically takes 2–4 years. Speed up your application using SAIP\'s <a href="#">Fast Track Examination (FTE) program</a> or <a href="#">PPH (Patent Prosecution Highway)</a> if you meet the eligibility criteria.</p>\n\n<p>Secure your innovation with SAIP. Start your patent application today!</p>\n\n<h4><strong>Patent protection period</strong></h4>\n<h5><strong>Duration of protection:</strong></h5>\n<p>A patent in Saudi Arabia is protected for <strong>20 years</strong> from the filing date.</p>\n\n<h5><strong>Conditions for maintaining protection:</strong></h5>\n<h6><strong>Payment of annual fees</strong></h6>\n<p>Annual fees for the patent application or protection certificate must be paid at the beginning of each year, starting from the year following the application filing date.</p>\n\n<ul>\n<li>If an applicant pays the required fees for three years without being granted the protection document, they may postpone payment of fees for subsequent years until the decision to grant the protection document is issued.</li>\n</ul>\n\n<h6><strong>Payment grace</strong></h6>\n<ul>\n<li>If the annual fees are not paid within <strong>three months</strong> of the due date, a <strong>double fee</strong> will apply.</li>\n<li>Failure to pay within an additional <strong>three months</strong>, even after receiving a warning, will result in the cancellation of the application or protection certificate.</li>\n</ul>\n\n<h5><strong>End of protection:</strong></h5>\n<p>After the 20-year period, the patent expires, and the invention enters the <strong>public domain</strong>, meaning anyone can use it without the patent holder\'s permission.</p>',
          displayType: 'default',
          parentSectionId: 'protection',
        },
        'key-documents-needed': {
          title: 'Key documents needed for patent submission',
          description: '',
          displayType: 'expandable',
          parentSectionId: 'protection',
          showContentSwitcher: true,
          contentSwitcherItems: [
            { id: 'applicant', label: 'Applicant' },
            { id: 'patent', label: 'Patent' },
            { id: 'priority', label: 'Priority' },
            { id: 'language', label: 'Language' },
          ],
          items: [
            // === APPLICANT TAB ===
            {
              category: 'applicant',
              title: 'Application form',
              sections: [
                {
                  heading: 'What it is',
                  content:
                    'An official digital form provided by SAIP that includes the applicant and invention details.',
                },
                {
                  heading: 'What it should include',
                  content: [
                    'The title of the invention.',
                    'Applicant and inventor details (name, address, and contact information).',
                    'Filing date and priority claims, if applicable.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  '<strong>Title:</strong> "A High-Precision 3D Printer for Industrial Applications."',
                  '<strong>Applicant:</strong> Future Manufacturing LLC.',
                  '<strong>Inventor:</strong> Eng. Omar Al-Saeed.',
                ],
              },
            },
            {
              category: 'applicant',
              title: 'Power of attorney (if filled by a representative)',
              sections: [
                {
                  heading: 'What it is',
                  content:
                    'A legal document authorizing a representative to act on behalf of the applicant.',
                },
                {
                  heading: 'When needed',
                  content: 'Required if the application is filed by an attorney or an agent.',
                },
              ],
              example: {
                items: [
                  'A signed Power of Attorney document naming "Innovation Law Firm Co." as the applicant\'s representative.',
                ],
              },
            },
            {
              category: 'applicant',
              title: 'Declaration of inventorship',
              sections: [
                {
                  heading: 'What it is',
                  content: 'A statement identifying the true inventor(s) of the invention.',
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Names and signatures of the inventor(s).',
                    'A declaration confirming their contributions.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  '"We, Dr Hala Al-Rashid and Eng. Khalid Al-Naimi, declare that we are the original inventors of the multi-material 3D printer described in this application."',
                ],
              },
            },
            // === PATENT TAB ===
            {
              category: 'patent',
              title: 'Abstract (الملخص)',
              sections: [
                {
                  heading: 'What it is',
                  content: "A concise summary of the invention's purpose and key features.",
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Should not exceed 250 words.',
                    "Must provide an overview of the invention's purpose, key technical aspects, and main benefits.",
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A 3D printer that uses adaptive material feeders to minimize errors and enhance precision during large-scale manufacturing.',
                ],
              },
            },
            {
              category: 'patent',
              title: 'Complete description (الوصف الكامل)',
              sections: [
                {
                  heading: 'What it is',
                  content: 'A detailed technical explanation of the invention.',
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Field of the invention: The technical area it belongs to.',
                    'Prior problems addressed: Challenges in existing solutions and how the invention overcomes them.',
                    "Objectives and advantages: The invention's key benefits over prior art.",
                    'Replication details: Sufficient technical details to enable a skilled person to replicate the invention.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'Description of a multi-material 3D printer capable of seamlessly switching between polymers and metals during a single print cycle to create hybrid products.',
                ],
              },
            },
            {
              category: 'patent',
              title: 'Claims (مطالبات الحماية)',
              sections: [
                {
                  heading: 'What it is',
                  content:
                    'The most critical part of the application, defining the scope of legal protection.',
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Clear and precise statements outlining the unique technical features of the invention.',
                    'Coverage of all essential components of the invention.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A 3D printer system featuring an adjustable nozzle mechanism to optimize material flow for different printing speeds and resolutions.',
                ],
              },
            },
            {
              category: 'patent',
              title: 'Drawings (الرسومات)',
              sections: [
                {
                  heading: 'What it is',
                  content:
                    'Technical illustrations or diagrams that visually explain the invention.',
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Must clarify the structure, components, or operation of the invention.',
                    'Should be in JPG or PNG format.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A schematic showing the internal structure of the 3D printer nozzle adjustment mechanism.',
                ],
              },
            },
            // === PRIORITY TAB ===
            {
              category: 'priority',
              title: 'Priority document (if applicable)',
              sections: [
                {
                  heading: 'What it is',
                  content:
                    'A certified copy of an earlier patent application filed in another jurisdiction, used to claim priority under the Paris Convention.',
                },
                {
                  heading: 'Requirements',
                  content: [
                    'Applicable if the invention was filed in another country within the past 12 months.',
                    "Must provide an overview of the invention's purpose, key technical aspects, and main benefits.",
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A priority document for a US patent application related to a <strong>temperature-controlled 3D printing process</strong> filed six months earlier.',
                ],
              },
            },
            // === LANGUAGE TAB ===
            {
              category: 'language',
              title: 'Language requirements',
              sections: [
                {
                  heading: 'Requirements',
                  content: [
                    'All documents must be submitted in <strong>Arabic</strong>.',
                    'Official translations are required for documents in other languages.',
                  ],
                  isNumbered: true,
                },
              ],
              example: {
                items: [
                  'A detailed description of the <strong>3D printing process</strong> in English must be translated into Arabic before submission.',
                ],
              },
            },
          ],
        },
        'why-requirements-important': {
          title: 'Why these requirements are important?',
          description:
            'By adhering to these requirements, you can ensure your patent application is thorough, legally compliant, and protects your innovation effectively, such as securing rights for a 3D printing system or any other groundbreaking technology.',
          displayType: 'default',
          parentSectionId: 'protection',
        },

        // ========== MANAGEMENT ==========
        management: {
          title: 'Management',
          description:
            'Once your patent is granted, there are several steps you should take to maintain and maximize its value.',
          displayType: 'default',
          subsections: [
            { id: 'managing-granted-patent', title: 'Managing your granted patent' },
            { id: 'maintain-patent', title: 'Maintain your patent' },
            { id: 'commercialize-patent', title: 'Commercialize your patent' },
            { id: 'update-records', title: 'Update patent records' },
            { id: 'expand-internationally', title: 'Expand internationally' },
            { id: 'maximize-value', title: "Maximize your patent's value" },
          ],
        },
        'managing-granted-patent': {
          title: 'Managing your granted patent',
          description: '',
          displayType: 'header',
          parentSectionId: 'management',
        },
        'maintain-patent': {
          title: 'Maintain your patent',
          description:
            'Pay annual maintenance fees:\n• All granted patents require annual renewal fees to remain active. Non-payment can lead to the lapse of your patent rights.\n• SAIP provides clear schedules for fee deadlines to help applicants stay compliant.',
          displayType: 'default',
          parentSectionId: 'management',
        },
        'commercialize-patent': {
          title: 'Commercialize your patent',
          description:
            'Explore licensing opportunities:\n• Licensing allows others to use your invention in exchange for royalties or lump-sum payments. This is an effective way to generate revenue without directly commercializing the product yourself.\n\nSelf-commercialization:\n• Use your patented technology to develop and market products directly, creating a competitive advantage.\n\nTransfer ownership:\n• If needed, you can assign your patent to another entity or person. Ensure that ownership transfers are officially recorded with SAIP to avoid legal complications.\n\nCollaborate for growth:\n• Partner with companies or investors who can help bring your invention to market at scale.',
          displayType: 'default',
          parentSectionId: 'management',
        },
        'update-records': {
          title: 'Update patent records',
          description:
            'Notify SAIP of ownership changes:\n• Any changes in ownership or licensing agreements must be officially recorded with SAIP.\n\nAmend patent information:\n• If there are errors or changes needed in the patent record, submit a request to amend the patent details.',
          displayType: 'default',
          parentSectionId: 'management',
        },
        'expand-internationally': {
          title: 'Expand internationally',
          description:
            'Leverage priority rights:\n• Use the priority date of your SAIP patent to file for protection in additional countries through treaties like the Patent Cooperation Treaty (PCT).\n\nProtect in key markets:\n• Evaluate markets where your invention has potential and file for patents in those jurisdictions to protect your business interests.',
          displayType: 'default',
          parentSectionId: 'management',
        },
        'maximize-value': {
          title: "Maximize your patent's value",
          description:
            "Regularly assess your patent's relevance:\n• Evaluate whether your patent is still aligned with your business strategy or holds market value. If it no longer offers value, consider abandoning it to save costs.\n\nPortfolio management:\n• If you own multiple patents, consider managing them as a portfolio to maximize collective strategic or financial benefits.\n\nUtilize patent valuation:\n• Determine the financial worth of your patent for use in licensing negotiations, business transactions, or investment pitches.",
          displayType: 'default',
          parentSectionId: 'management',
        },

        // ========== ENFORCEMENT ==========
        enforcement: {
          title: 'Enforcement',
          description:
            'The Saudi Authority for Intellectual Property (SAIP) is committed to safeguarding the rights of patent holders and providing effective mechanisms for patent enforcement in Saudi Arabia.',
          displayType: 'default',
          subsections: [
            { id: 'enforcement-process', title: 'Enforcement process' },
            { id: 'understand-rights', title: 'Understand your patent rights' },
            { id: 'steps-to-enforce', title: 'Steps to enforce your patent' },
            { id: 'saip-support', title: 'SAIP support for patent enforcement' },
            { id: 'protecting-patent', title: 'Protecting your patent' },
          ],
        },
        'enforcement-process': {
          title: 'Enforcement process',
          description:
            'Below is an overview of the enforcement process, enabling patent owners to protect their inventions and address any infringement.',
          displayType: 'header',
          parentSectionId: 'enforcement',
        },
        'understand-rights': {
          title: 'Understand your patent rights',
          description:
            'As a patent holder, you have the exclusive right to:\n• Manufacture, use, sell, or license your invention.\n• Prevent unauthorized parties from using, making, selling, or distributing your patented invention.\n• Take legal action against any party that infringes on your patent rights.',
          displayType: 'default',
          parentSectionId: 'enforcement',
        },
        'steps-to-enforce': {
          title: 'Steps to enforce your patent',
          description: '',
          displayType: 'expandable',
          parentSectionId: 'enforcement',
          items: [
            {
              title: '1. Monitor and detect infringement',
              description:
                '• Regularly monitor the market and industry activities to identify unauthorized use of your patented invention.\n• Collect evidence of infringement, such as product samples, advertisements, or sales records.',
            },
            {
              title: '2. Notify the infringer',
              description:
                'Send a formal notice to the alleged infringer, detailing the patent rights and the nature of the infringement. This step often prompts negotiations or settlements without the need for litigation.',
            },
            {
              title: '3. File a lawsuit with the relevant authority',
              description:
                'If infringement persists after attempts to resolve the issue directly, the patent owner must file a lawsuit with the Commercial Circuits and Courts for legal action.\n\nThe lawsuit may address cases such as:\n• Unauthorized manufacturing, distribution, or sale of products incorporating the patented invention.\n• Commercial-scale infringement causing financial harm or public interest concerns.\n\nThe courts will evaluate the evidence and issue a binding decision, which may include:\n• Injunctions to stop infringing activities.\n• Compensation for damages.\n• Orders to seize or destroy infringing products.',
            },
            {
              title: '4. Judicial appeal',
              description:
                "If either party is dissatisfied with the court's decision, they may escalate the matter to the competent Saudi courts.\n• Appeals must be filed within 60 days of the decision.\n\nJudicial remedies may include:\n• Penalties: Enhanced fines or imprisonment for severe or repeated violations.\n• Compensation: Financial damages, including losses or harm to the patent holder's reputation.\n• Additional measures: Orders to prevent future infringement, such as halting production or distribution of infringing products.",
            },
          ],
        },
        'saip-support': {
          title: 'SAIP support for patent enforcement',
          description:
            'SAIP offers several services to assist patent holders in managing and protecting their rights:\n\nMediation service:\n• Mediation and arbitration to resolve disputes quickly and efficiently by conciliators in intellectual property fields, accredited by SAIP and the Taradhi Center at the Ministry of Justice.\n\nExpert guidance:\n• Support and advice on legal procedures and enforcement options.\n\nAwareness programs:\n• Educational resources to help patent holders understand and exercise their rights.',
          displayType: 'default',
          buttonLabel: 'Go to Mediation service',
          buttonHref: '/services/mediation',
          parentSectionId: 'enforcement',
        },
        'protecting-patent': {
          title: 'Protecting your patent',
          description:
            'To ensure effective enforcement:\n• Keep your patent active: Pay annual maintenance fees promptly to retain legal protection.\n• Monitor the market regularly: Track the use of your patented inventions across industries and platforms to detect infringement early.\n• Collaborate with legal experts: Work with qualified legal professionals to address violations and file lawsuits where necessary.',
          displayType: 'default',
          parentSectionId: 'enforcement',
        },
      },
      tocItems: [
        {
          id: 'guidance',
          label: 'Guidance',
          subItems: [
            { id: 'patent-checklist', label: 'Patent checklist' },
            { id: 'ip-clinics', label: 'IP Clinics' },
            { id: 'ip-search-engine', label: 'IP search engine' },
            { id: 'not-patentable', label: 'Not patentable categories' },
          ],
        },
        {
          id: 'protection',
          label: 'Protection',
          subItems: [
            { id: 'application-process', label: 'Application process for patents' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'how-long-does-it-take', label: 'How long does it take?' },
            { id: 'key-documents-needed', label: 'Key documents needed' },
            { id: 'why-requirements-important', label: 'Why requirements important?' },
          ],
        },
        {
          id: 'management',
          label: 'Management',
          subItems: [
            { id: 'managing-granted-patent', label: 'Managing your granted patent' },
            { id: 'maintain-patent', label: 'Maintain your patent' },
            { id: 'commercialize-patent', label: 'Commercialize your patent' },
            { id: 'update-records', label: 'Update patent records' },
            { id: 'expand-internationally', label: 'Expand internationally' },
            { id: 'maximize-value', label: "Maximize your patent's value" },
          ],
        },
        {
          id: 'enforcement',
          label: 'Enforcement',
          subItems: [
            { id: 'enforcement-process', label: 'Enforcement process' },
            { id: 'understand-rights', label: 'Understand your patent rights' },
            { id: 'steps-to-enforce', label: 'Steps to enforce your patent' },
            { id: 'saip-support', label: 'SAIP support' },
            { id: 'protecting-patent', label: 'Protecting your patent' },
          ],
        },
      ],
      tocAriaLabel: 'Patents journey navigation',
    },
    services: {
      title: 'Patents services',
      services: [
        {
          title: 'Patent application',
          labels: ['Protection'],
          description: 'A service that allows the user to file a patent application.',
          href: '/services/patents/patent-application',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'Patent Cooperation Treaty (PCT)',
          labels: ['Protection'],
          description:
            'The Patent Cooperation Treaty (PCT) helps applicants obtain patent protection for their inventions internationally.',
          href: '/services/patents/pct',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'Fast Track Examination of Patent Applications (PPH)',
          labels: ['Protection'],
          description:
            'Under the PPH agreement, patent offices participating in the Program have agreed that when an applicant receives a positive decision.',
          href: '/services/patents/pph',
          primaryButtonLabel: 'View details',
        },
      ],
      serviceTypeOptions: [
        { value: 'guidance', label: 'Guidance' },
        { value: 'protection', label: 'Protection' },
        { value: 'management', label: 'Management' },
        { value: 'enforcement', label: 'Enforcement' },
      ],
      targetGroupOptions: [
        { value: 'individuals', label: 'Individuals' },
        { value: 'enterprises', label: 'Enterprises' },
      ],
    },
    media: {
      heroTitle: 'Media for patents',
      heroDescription:
        'Here you can find news, videos, articles and events on various categories of IP.',
      heroImage: '/images/about/hero.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
        { id: 'articles', label: 'Articles' },
      ],
      content: {
        news: {
          title: 'News',
          description:
            'Get the latest information on patents in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about patents.',
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
      badgeLabel: 'Patents',
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

export async function getPatentsPageData(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<PatentsData> {
  const includeJourney = options?.includeJourney ?? true;
  try {
    // Step 1: Get the list of nodes to find the UUID with the correct locale
    const listResponse = await fetchPatentsPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      return getPatentsFallbackData(locale);
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
      'field_guide_items.field_secondary_button_file', // Include uploaded files for guide items
      'field_statistics_items', // Prefer direct relation data from page payload
      'field_services_items',
      'field_services_items.field_type',
      'field_services_items.field_label',
      'field_services_items.field_target_group',
    ];
    const journeyIncludeFields = [
      'field_journey_sections',
      'field_journey_sections.field_items',
      'field_journey_sections.field_content_switcher_items',
      'field_journey_sections.field_parent_section',
    ];
    const includeFields = includeJourney
      ? [...baseIncludeFields, ...journeyIncludeFields]
      : baseIncludeFields;

    const response = await fetchDrupal<DrupalIPCategoryPageNode>(
      `/node/patents_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // When fetching by UUID, response.data is a single object, not an array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;

    let included = response.included || [];

    // Fetch child journey sections (Level 2 and 3) separately
    // JSON:API doesn't automatically include children via field_parent_section
    if (includeJourney) {
      const level1SectionsData = node.relationships?.field_journey_sections?.data;
      const level1Sections = Array.isArray(level1SectionsData)
        ? level1SectionsData
        : level1SectionsData
          ? [level1SectionsData]
          : [];
      if (level1Sections.length > 0) {
        try {
          // Get Level 1 section UUIDs
          const level1Uuids = level1Sections.map((s: any) => s.id);

          // Fetch all journey_section nodes with FULL nested paragraphs
          const journeyInclude = [
            'field_parent_section',
            'field_items',
            'field_items.field_sections', // ✅ ADD: Include sections from journey items
            'field_items.field_example',
            'field_items.field_example.field_example_items',
            'field_content_switcher_items',
          ].join(',');

          // Fetch Level 2 sections (children of Level 1) directly
          const level2Promises = level1Uuids.map((uuid) =>
            fetchDrupal<DrupalJourneySectionNode>(
              `/node/journey_section?filter[field_parent_section.id]=${uuid}&include=${journeyInclude}`,
              {},
              locale,
            ),
          );
          const level2Responses = await Promise.all(level2Promises);

          const level2Sections: any[] = [];
          const level2Included: any[] = [];

          level2Responses.forEach((response) => {
            const subs = Array.isArray(response.data)
              ? response.data
              : [response.data].filter(Boolean);
            level2Sections.push(...subs);
            if (response.included) level2Included.push(...response.included);
          });

          if (level2Sections.length > 0) {
            // Add Level 2 sections to included
            included = [...included, ...level2Sections, ...level2Included];

            // Fetch Level 3 sections (children of Level 2)
            const level2Uuids = level2Sections.map((s: any) => s.id);
            const level3Promises = level2Uuids.map((uuid) =>
              fetchDrupal<DrupalJourneySectionNode>(
                `/node/journey_section?filter[field_parent_section.id]=${uuid}&include=${journeyInclude}`,
                {},
                locale,
              ),
            );
            const level3Responses = await Promise.all(level3Promises);

            const level3Sections: any[] = [];
            const level3Included: any[] = [];

            level3Responses.forEach((response) => {
              const subs = Array.isArray(response.data)
                ? response.data
                : [response.data].filter(Boolean);
              level3Sections.push(...subs);
              if (response.included) level3Included.push(...response.included);
            });

            if (level3Sections.length > 0) {
              included = [...included, ...level3Sections, ...level3Included];
            }
          }
        } catch (error) {
          console.warn('Failed to fetch child journey sections:', error);
          // Continue with Level 1 sections only
        }
      }
    }

    const data = transformPatentsPage(node, included, locale);

    // Step 3: Fetch statistics paragraphs only when relation include did not resolve any stats.
    if (data.overview.statistics.statistics.length === 0) {
      const nodeNid = (node.attributes as any).drupal_internal__nid;
      try {
        const statsEndpoint = `/paragraph/statistics_item?filter[parent_id]=${nodeNid}&filter[parent_field_name]=field_statistics_items`;
        const statsResponse = await fetchDrupal<DrupalIncludedEntity>(statsEndpoint, {}, locale);
        let matchingParagraphs = Array.isArray(statsResponse.data) ? statsResponse.data : [];

        if (matchingParagraphs.length === 0) {
          const allStatsResponse = await fetchDrupal<DrupalIncludedEntity>(
            `/paragraph/statistics_item`,
            {},
            locale,
          );
          const allStatisticsParagraphs = Array.isArray(allStatsResponse.data)
            ? allStatsResponse.data
            : [];
          matchingParagraphs = allStatisticsParagraphs.filter((p: any) => {
            const parentId = p.attributes?.parent_id;
            const parentFieldName = p.attributes?.parent_field_name;
            return (
              (parentId === String(nodeNid) || parentId === nodeNid) &&
              parentFieldName === 'field_statistics_items'
            );
          });
        }

        if (matchingParagraphs.length > 0) {
          data.overview.statistics.statistics = matchingParagraphs.map((p: DrupalIncludedEntity) =>
            transformStatisticsItem(p, []),
          );
        }
      } catch (statsError) {
        console.error('PATENTS: Could not fetch statistics paragraphs:', statsError);
      }
    }
    data.dataSource = 'drupal';
    return data;
  } catch (error) {
    console.error('PATENTS: Using fallback data', error);
    return getPatentsFallbackData();
  }
}

/**
 * Alternative helper that augments the standard Drupal-based page data with
 * statistics loaded from the external statistics API instead of Drupal paragraphs.
 *
 * This function is NOT used anywhere yet – it allows a safe, opt-in migration path.
 */
export async function getPatentsPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<PatentsData> {
  const data = await getPatentsPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('patents');
    if (statsCards && statsCards.length > 0) {
      // Replace only the cards; keep title/CTA coming from Drupal.
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error('PATENTS: External statistics API failed, keeping Drupal statistics.', error);
  }

  return data;
}
