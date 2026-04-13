/**
 * IP General Secretariat Service
 * Handles data fetching and transformation for IP General Secretariat page
 */

import {
  fetchDrupal,
  getRelated,
  getImageWithAlt,
  getImageUrl,
  extractText,
  getProxyUrl,
  filterIncludedByLangcode,
  normalizeServiceTypeKey,
} from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalStatisticsItemNode } from '../types';
import { DrupalResponse } from '../api-client';
import { StatisticsCardData } from './common-types';
import { transformServiceItem, ServiceItemData } from './service-directory.service';
import { ROUTES } from '@/lib/routes';

// Frontend data interfaces
export interface IPGeneralSecretariatData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    committeesTitle: string;
    committeesDescription: string;
    committeeVerticalTabs: Array<{ id: string; label: string }>;
    committeeVerticalTabsData: CommitteeTabData[];
    responsibilities: CommitteeResponsibilityData[];
    statistics: StatisticsCardData[];
    relatedPages: Array<{ title: string; href: string }>;
  };
  committees: {
    title: string;
    description: string;
    committeesList: CommitteeDetailData[];
  };
  services: ServiceItemData[];
  centers: GeneralSecretariatServiceData[];
  documentsAndDecisions: DocumentData[];
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

export interface CommitteeTabData {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
}

export interface CommitteeResponsibilityData {
  id: string;
  description: string;
}

export interface CommitteeDetailData {
  id: string;
  title: string;
  description: string;
  responsibilities: Array<{ id: string; description: string }>;
  ctaTitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
}

export interface GeneralSecretariatServiceData {
  id: string;
  title: string;
  description: string;
  labels: string[];
  href: string;
  [key: string]: unknown; // Added to satisfy FilterableItem interface
}

export interface DocumentData {
  id: string;
  name: string;
  committeeType: string;
  date: string;
  hijriDate: string;
  fileUrl: string;
  serviceType: string;
  targetGroups: string[];
}

// Drupal API functions
export async function fetchIPGeneralSecretariatPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  // Include all necessary relationships
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_documents_item',
    'field_documents_item.field_document_file',
    'field_documents_item.field_document_file.field_media_document',
    'field_documents_item.field_target_group',
    'field_documents_item.field_service_type',
    'field_services_items',
    'field_services_items.field_ip_category',
    'field_services_items.field_type',
    'field_services_items.field_target_group',
    'field_services_items.field_label',
    'field_committee_tabs',
    'field_committee_tabs.field_image',
    'field_committee_tabs.field_image.field_media_image',
    'field_statistics_items',
    'field_responsibilities_items',
    'field_centers_items',
    'field_committees_list',
    'field_committees_list.field_responsibilities_items', // ✅ NEW: Include responsibility paragraphs
  ];

  const endpoint = `/node/ip_general_secretariat_page?filter[status][value]=1&include=${includeFields.join(',')}`;
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

  // Handle chart data from attributes (field_stat_chart_data is string_long, stores JSON)
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
      if (chartData.length > 0) {
        console.log(
          `📈 Chart data points found: ${chartData.length} (values: ${chartData.map((d) => d.value).join(', ')})`,
        );
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

  // Handle breakdown data
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
  const label = attrs.field_stat_label || attrs.field_label || 'Untitled Statistic';
  const value = attrs.field_stat_value || attrs.field_value || 0;

  // Get icon from media entity (if available)
  const iconData = getRelated((item as any).relationships || {}, 'field_icon', included);
  const iconUrl = iconData ? getImageUrl(iconData as any, included) : undefined;

  return {
    label,
    value,
    icon: iconUrl, // Add icon support
    chartType: (attrs.field_stat_chart_type || attrs.field_chart_type || 'line') as
      | 'line'
      | 'pie'
      | 'bar',
    chartData: chartData.length > 0 ? chartData : [{ value }],
    trend,
    breakdown,
  };
}

export function transformCommitteeTab(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): CommitteeTabData {
  const attrs = (tab as any).attributes || {};
  const tabImage = (() => {
    const imageRel = getRelated((tab as any).relationships || {}, 'field_image', included);
    return imageRel && !Array.isArray(imageRel) ? getImageWithAlt(imageRel, included) : undefined;
  })();

  const tabId = attrs.field_tab_id || 'tab';
  const title = attrs.title || 'Untitled Committee';

  // Default button hrefs based on committee type
  const getDefaultButtonHref = (id: string): string => {
    if (id.includes('trademark')) return '/services/trademarks';
    if (id.includes('patent') || id.includes('design') || id.includes('plant') || id.includes('ic'))
      return '/services/patents';
    if (id.includes('copyright')) return '/services/copyrights';
    return '#';
  };

  const defaultButtonHref = getDefaultButtonHref(tabId);

  const extractLinkUri = (value: any): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      const first = value[0];
      return first?.uri || first?.url?.uri;
    }
    return value?.uri || value?.url?.uri;
  };

  const normalizeDrupalLink = (value?: string): string | undefined => {
    if (!value) return undefined;
    const cleaned = value
      .replace(/^internal:/, '')
      .replace(/^entity:/, '')
      .trim();
    if (!cleaned) return undefined;
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned;
    if (cleaned.startsWith('/') || cleaned.startsWith('#')) return cleaned;
    return `/${cleaned}`;
  };

  const rawButtonHref = attrs.field_button_href || extractLinkUri(attrs.field_button_link) || '';
  const resolvedButtonHref = normalizeDrupalLink(rawButtonHref) || defaultButtonHref;

  return {
    id: tabId,
    title: title,
    description: extractText(attrs.field_description) || '',
    image: {
      src: tabImage?.src || '/images/photo-container.png',
      alt: tabImage?.alt || 'Committee image',
    },
    buttonLabel: attrs.field_button_label || 'Read More',
    buttonHref: resolvedButtonHref,
    buttonAriaLabel:
      attrs.field_button_aria_label || attrs.field_button_label || `Read more about ${title}`,
  };
}

export function transformIPGeneralSecretariatPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): IPGeneralSecretariatData {
  const attrs = node.attributes as any;
  const nodeLangcode = (attrs as any)?.langcode || locale || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);
  const effectiveIncluded = filteredIncluded.length > 0 ? filteredIncluded : included;

  // Get hero image
  // ✅ Entity reference fields are in relationships, NOT attributes!
  const heroImage = node.relationships?.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_hero_background_image',
          effectiveIncluded,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, effectiveIncluded)
          : undefined;
      })()
    : undefined;

  // Get committee tabs
  const committeeTabsData = node.relationships?.field_committee_tabs
    ? getRelated(node.relationships, 'field_committee_tabs', effectiveIncluded) || []
    : [];
  const committeeTabs = Array.isArray(committeeTabsData)
    ? committeeTabsData.map((tab: DrupalIncludedEntity) => {
        const attrs = (tab as any).attributes || {};
        return {
          id: attrs.field_tab_id || 'tab',
          label: attrs.title || 'Untitled',
        };
      })
    : [];

  const committeeTabsDataTransformed = Array.isArray(committeeTabsData)
    ? committeeTabsData.map((tab: DrupalIncludedEntity) =>
        transformCommitteeTab(tab, effectiveIncluded),
      )
    : [];

  // Get responsibilities items
  const responsibilitiesData = node.relationships?.field_responsibilities_items
    ? getRelated(node.relationships, 'field_responsibilities_items', effectiveIncluded) || []
    : [];
  const responsibilities = Array.isArray(responsibilitiesData)
    ? responsibilitiesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          id: item.id,
          description: extractText(attrs.field_description) || '',
        };
      })
    : [];

  // Get statistics items
  const statisticsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', effectiveIncluded) || []
    : [];
  console.log(
    `📊 IP GENERAL SECRETARIAT: Statistics paragraphs found: ${Array.isArray(statisticsData) ? statisticsData.length : 0}`,
  );
  const statistics = Array.isArray(statisticsData)
    ? statisticsData.map((item: DrupalIncludedEntity) => {
        const transformed = transformStatisticsItem(item, effectiveIncluded);
        console.log(`  - Statistic: ${transformed.label} = ${transformed.value}`);
        return transformed;
      })
    : [];
  console.log(`📊 IP GENERAL SECRETARIAT: Total statistics after transform: ${statistics.length}`);

  // Get committees list
  const committeesListData = node.relationships?.field_committees_list
    ? getRelated(node.relationships, 'field_committees_list', effectiveIncluded) || []
    : [];
  // Fallback responsibilities data by committee ID
  const fallbackResponsibilitiesMap: Record<string, Array<{ id: string; description: string }>> = {
    trademark: [
      {
        id: 'appeals-refusal',
        description:
          'Reviewing appeals against decisions to refuse the registration of a trademark or to make it conditional.',
      },
      {
        id: 'appeals-modifications',
        description:
          'Reviewing appeals against decisions to refuse additions or modifications to a registered trademark.',
      },
    ],
    patent: [
      {
        id: 'patent-disputes',
        description:
          'Resolving disputes related to patent validity, infringement, and licensing agreements.',
      },
      {
        id: 'design-disputes',
        description: 'Handling industrial design disputes and protection matters.',
      },
      {
        id: 'ic-layout',
        description: 'Managing integrated circuit layout design disputes and protection.',
      },
      {
        id: 'plant-varieties',
        description: 'Resolving plant variety protection and rights disputes.',
      },
    ],
    copyright: [
      {
        id: 'literary-works',
        description: 'Resolving disputes related to literary works, books, and written content.',
      },
      {
        id: 'artistic-works',
        description: 'Handling disputes involving artistic works, music, and visual arts.',
      },
      {
        id: 'digital-content',
        description: 'Managing software, digital content, and multimedia copyright disputes.',
      },
    ],
  };

  const committeesList = Array.isArray(committeesListData)
    ? committeesListData.map((committee: DrupalIncludedEntity) => {
        const attrs = (committee as any).attributes || {};
        const rels = (committee as any).relationships || {};
        let committeeResponsibilities: Array<{ id: string; description: string }> = [];

        // ✅ NEW: Try to get responsibilities from field_responsibilities_items (paragraphs)
        const responsibilitiesItemsData = rels.field_responsibilities_items
          ? getRelated(rels, 'field_responsibilities_items', effectiveIncluded) || []
          : [];

        if (Array.isArray(responsibilitiesItemsData) && responsibilitiesItemsData.length > 0) {
          // Parse as paragraphs (new structure)
          committeeResponsibilities = responsibilitiesItemsData.map(
            (item: DrupalIncludedEntity, index: number) => {
              const itemAttrs = (item as any).attributes || {};
              return {
                id: item.id || `resp-${index}`,
                description: extractText(itemAttrs.field_description) || '',
              };
            },
          );
        } else if (attrs.field_responsibilities) {
          // ⚠️ LEGACY: Fallback to old JSON string format (for backwards compatibility)
          try {
            // Check if it's already an array/object or needs parsing
            if (typeof attrs.field_responsibilities === 'string') {
              const parsed = JSON.parse(attrs.field_responsibilities);
              // Handle both array and object formats
              if (Array.isArray(parsed)) {
                committeeResponsibilities = parsed.map((item: any, index: number) => ({
                  id: item.id || `resp-${index}`,
                  description: item.description || item.text || String(item),
                }));
              } else if (typeof parsed === 'object') {
                // If it's an object, try to extract array from common keys
                const items = parsed.items || parsed.responsibilities || parsed.data || [];
                committeeResponsibilities = Array.isArray(items)
                  ? items.map((item: any, index: number) => ({
                      id: item.id || `resp-${index}`,
                      description: item.description || item.text || String(item),
                    }))
                  : [];
              }
            } else if (Array.isArray(attrs.field_responsibilities)) {
              committeeResponsibilities = attrs.field_responsibilities.map(
                (item: any, index: number) => ({
                  id: item.id || `resp-${index}`,
                  description: item.description || item.text || extractText(item) || String(item),
                }),
              );
            }
          } catch (e) {
            console.warn(
              '[LEGACY] Failed to parse committee responsibilities from JSON:',
              e,
              attrs.field_responsibilities,
            );
          }
        }

        // If responsibilities are empty, try to use fallback data based on committee ID
        if (committeeResponsibilities.length === 0) {
          const committeeId = (attrs.field_committee_id || committee.id).toLowerCase();

          // Check if we have fallback data for this committee
          if (fallbackResponsibilitiesMap[committeeId]) {
            committeeResponsibilities = fallbackResponsibilitiesMap[committeeId];
            console.log('Using fallback responsibilities for:', attrs.title || committeeId);
          } else {
            // Try to match by title keywords
            const title = (attrs.title || '').toLowerCase();
            if (title.includes('trademark')) {
              committeeResponsibilities = fallbackResponsibilitiesMap.trademark;
            } else if (
              title.includes('patent') ||
              title.includes('design') ||
              title.includes('plant')
            ) {
              committeeResponsibilities = fallbackResponsibilitiesMap.patent;
            } else if (title.includes('copyright')) {
              committeeResponsibilities = fallbackResponsibilitiesMap.copyright;
            }
          }
        }

        return {
          id: attrs.field_committee_id || committee.id,
          title: attrs.title || 'Untitled Committee',
          description: extractText(attrs.field_description) || '',
          responsibilities: committeeResponsibilities,
          ctaTitle: attrs.field_cta_title || '',
          ctaButtonLabel: attrs.field_cta_button_label || 'Go to litigation path',
          ctaButtonHref: (() => {
            const extractLinkUri = (value: any): string | undefined => {
              if (!value) return undefined;
              if (typeof value === 'string') return value;
              if (Array.isArray(value)) {
                const first = value[0];
                return first?.uri || first?.url?.uri;
              }
              return value?.uri || value?.url?.uri;
            };
            const normalizeDrupalLink = (value?: string): string | undefined => {
              if (!value) return undefined;
              const cleaned = value
                .replace(/^internal:/, '')
                .replace(/^entity:/, '')
                .trim();
              if (!cleaned) return undefined;
              if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned;
              if (cleaned.startsWith('/') || cleaned.startsWith('#')) return cleaned;
              return `/${cleaned}`;
            };
            const rawHref =
              attrs.field_cta_button_href || extractLinkUri(attrs.field_cta_button_link) || '';
            return normalizeDrupalLink(rawHref) || '#';
          })(),
        };
      })
    : [];

  // Get services items (new Services section)
  const servicesData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', effectiveIncluded) || []
    : [];
  const services = Array.isArray(servicesData)
    ? servicesData
        .map((service: DrupalIncludedEntity) => {
          try {
            return transformServiceItem(service as DrupalNode, effectiveIncluded, locale);
          } catch (error) {
            console.warn('⚠️ IP GENERAL SECRETARIAT: Failed to transform service item', error);
            return null;
          }
        })
        .filter((s): s is ServiceItemData => Boolean(s))
    : [];

  // Get centers items - NOTE: This will be fetched separately from service_item with Protection type
  // For now, we'll leave this empty and fetch Protection services in the page component
  const centers: Array<{
    id: string;
    title: string;
    description: string;
    labels: string[];
    href: string;
  }> = [];

  // Get documents items
  const documentsData = node.relationships?.field_documents_item
    ? getRelated(node.relationships, 'field_documents_item', effectiveIncluded) || []
    : [];
  const documents = Array.isArray(documentsData)
    ? documentsData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};

        // Try to get file URL from field_document_file first (uploaded file)
        let fileUrl = '#';
        const fileRelData = (item as any).relationships?.field_document_file?.data;
        if (fileRelData) {
          const mediaOrFileEntity = effectiveIncluded.find(
            (inc: DrupalIncludedEntity) => inc.id === fileRelData.id,
          );
          if (mediaOrFileEntity) {
            const entityType = (mediaOrFileEntity as any).type || '';
            const entityAttrs = (mediaOrFileEntity as any).attributes || {};
            let drupalFileUrl = entityAttrs.uri?.url;

            if (!drupalFileUrl && entityType.startsWith('media--')) {
              const mediaRels = (mediaOrFileEntity as any).relationships || {};
              const fileEntity = getRelated(mediaRels, 'field_media_document', effectiveIncluded);
              if (fileEntity && !Array.isArray(fileEntity)) {
                const fileAttrs = (fileEntity as any).attributes || {};
                drupalFileUrl = fileAttrs.uri?.url;
              }
            }

            if (drupalFileUrl) {
              fileUrl = getProxyUrl(drupalFileUrl, 'view');
            }
          }
        }

        // Fallback to field_file_url if no file uploaded (also needs proxy)
        if (fileUrl === '#' && attrs.field_file_url) {
          fileUrl = getProxyUrl(attrs.field_file_url, 'view');
        }

        // Get target groups from taxonomy terms
        const targetGroupRelData = (item as any).relationships?.field_target_group?.data;
        const targetGroups = Array.isArray(targetGroupRelData)
          ? targetGroupRelData
              .map((rel: any) => {
                const termEntity = effectiveIncluded.find(
                  (inc: DrupalIncludedEntity) => inc.id === rel.id,
                );
                const termAttrs = (termEntity as any)?.attributes || {};
                return termAttrs.name || '';
              })
              .filter(Boolean)
          : targetGroupRelData
            ? (() => {
                const termEntity = effectiveIncluded.find(
                  (inc: DrupalIncludedEntity) => inc.id === targetGroupRelData.id,
                );
                const termAttrs = (termEntity as any)?.attributes || {};
                return termAttrs.name ? [termAttrs.name] : [];
              })()
            : [];

        const serviceTypeRelData = (item as any).relationships?.field_service_type?.data;
        const serviceTypeValue = Array.isArray(serviceTypeRelData)
          ? serviceTypeRelData
              .map((rel: any) => {
                const termEntity = effectiveIncluded.find(
                  (inc: DrupalIncludedEntity) => inc.id === rel.id,
                );
                const termAttrs = (termEntity as any)?.attributes || {};
                return termAttrs.name || '';
              })
              .filter(Boolean)
              .join(', ')
          : serviceTypeRelData
            ? (() => {
                const termEntity = effectiveIncluded.find(
                  (inc: DrupalIncludedEntity) => inc.id === serviceTypeRelData.id,
                );
                const termAttrs = (termEntity as any)?.attributes || {};
                return termAttrs.name || '';
              })()
            : attrs.field_service_type || '';

        const normalizedServiceType = normalizeServiceTypeKey(serviceTypeValue) || serviceTypeValue;

        return {
          id: item.id,
          name: attrs.title || 'Untitled Document',
          committeeType: attrs.field_committee_type || '',
          date: attrs.field_date || '',
          hijriDate: attrs.field_hijri_date_text || attrs.field_hijri_date || '',
          fileUrl,
          serviceType: normalizedServiceType,
          targetGroups,
        };
      })
    : [];

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', effectiveIncluded) || []
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
  const relatedPagesRaw = attrs.field_related_pages || [];
  console.log(
    `🔗 IP GENERAL SECRETARIAT: Related pages raw count: ${Array.isArray(relatedPagesRaw) ? relatedPagesRaw.length : 0}`,
  );
  const relatedPages = Array.isArray(relatedPagesRaw)
    ? relatedPagesRaw.map((link: any) => {
        let href = link.uri?.replace('internal:', '') || '#';

        const normalizedHref = href.toLowerCase();
        if (normalizedHref.includes('faq') && !normalizedHref.includes('guidelines')) {
          href = ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT;
        } else if (normalizedHref.includes('guidelines') || normalizedHref.includes('guideline')) {
          href = ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT;
        }

        console.log(`  - Related page: ${link.title} -> ${href}`);
        return {
          title: link.title || 'Untitled',
          href: href,
        };
      })
    : [];
  console.log(`🔗 IP GENERAL SECRETARIAT: Total related pages: ${relatedPages.length}`);

  return {
    heroHeading:
      extractText(attrs.field_hero_heading) ||
      'General secretariat of IP dispute resolution committees overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Was established by SAIP to enhance operational efficiency in various aspects and to support IP committees.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      committeesTitle: attrs.field_committees_title || 'Committees',
      committeesDescription:
        extractText(attrs.field_committees_description) ||
        'The General Secretariat of IP Dispute Resolution Committees commenced its operations.',
      committeeVerticalTabs: committeeTabs,
      committeeVerticalTabsData: committeeTabsDataTransformed,
      responsibilities,
      statistics,
      relatedPages,
    },
    committees: {
      title: attrs.field_committees_list_title || 'Committees',
      description:
        extractText(attrs.field_committees_list_description) ||
        'There are three types of committees.',
      committeesList,
    },
    services,
    centers,
    documentsAndDecisions: documents,
    media: {
      heroTitle: extractText(attrs.field_media_hero_title) || 'Media for IP General Secretariat',
      heroDescription:
        extractText(attrs.field_media_hero_description) ||
        'Here you can find news related to IP General Secretariat.',
      heroImage: '/images/designs/hero.jpg',
      tabs:
        mediaTabs.length > 0
          ? mediaTabs
          : [
              { id: 'news', label: 'News' },
              { id: 'videos', label: 'Videos' },
            ],
      content: {
        news: {
          title: 'News',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Get the latest information on IP General Secretariat.',
        },
        videos: {
          title: 'Videos',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Explore the latest updates on IP General Secretariat through our video collection.',
        },
      },
      filterFields: [{ id: 'search', label: 'Search', type: 'search', placeholder: 'Search' }],
      badgeLabel: 'IP General Secretariat',
    },
  };
}

export function getIPGeneralSecretariatFallbackData(): IPGeneralSecretariatData {
  return {
    heroHeading: 'General secretariat of IP dispute resolution committees overview',
    heroSubheading:
      'Was established by SAIP to enhance operational efficiency in various aspects and to support IP committees.',
    heroImage: {
      src: '/images/designs/hero.jpg',
      alt: 'General Secretariat overview',
    },
    overview: {
      committeesTitle: 'Committees',
      committeesDescription:
        'The General Secretariat of IP Dispute Resolution Committees commenced its operations with the formation of the first Copyright Violations Committee, established by the decision of the Board of Directors of SAIP No. (01/T/2019) dated 09/08/1440 AH.',
      committeeVerticalTabs: [
        { id: 'trademark-committee', label: 'Trademark committee' },
        { id: 'patents-committee', label: 'Patents Committee' },
        { id: 'copyrights-committee', label: 'Copyrights Committee' },
      ],
      committeeVerticalTabsData: [
        {
          id: 'trademark-committee',
          title: 'Trademark committee',
          description:
            'The first Trademark Appeals Committee was formed after the jurisdiction was transferred to SAIP under Ministerial Decision No. (108) dated 08/04/1441 AH. The committee members have full independence from SAIP and possess extensive legal and technical expertise to review appeals effectively.',
          image: { src: '/images/photo-container.png', alt: 'Trademark committee' },
          buttonLabel: 'Read More',
          buttonHref: '/services/trademarks',
          buttonAriaLabel: 'Read more about Trademark committee',
        },
        {
          id: 'patents-committee',
          title: 'Patents, Designs, Layout designs of IC, Plant Varieties committee',
          description:
            'The General Secretariat of IP Dispute Resolution Committees commenced its operations with the formation of the first Copyright Violations Committee, established by the decision of the Board of Directors of SAIP No. (01/T/2019) dated 09/08/1440 AH.',
          image: { src: '/images/photo-container.png', alt: 'Patent and Design committees' },
          buttonLabel: 'Read More',
          buttonHref: '/services/patents',
          buttonAriaLabel:
            'Read more about Patents, Designs, Layout designs of IC, Plant Varieties committee',
        },
        {
          id: 'copyrights-committee',
          title: 'Copyright committee',
          description:
            'The Copyright Committee specializes in resolving disputes related to literary, artistic, and creative works. This includes books, music, films, software, and other intellectual creations protected under copyright law.',
          image: { src: '/images/photo-container.png', alt: 'Copyright committee' },
          buttonLabel: 'Read More',
          buttonHref: '/services/copyrights',
          buttonAriaLabel: 'Read more about Copyright committee',
        },
      ],
      responsibilities: [
        {
          id: 'supervising',
          description:
            'Supervising the procedures of cases, exchanging their memoranda, and preparing them.',
        },
        {
          id: 'analyzing',
          description:
            'Studying and analyzing cases from legal and technical perspectives and preparing reports to present to the committees.',
        },
        {
          id: 'support',
          description: 'Providing legal, technical, and administrative support to the committees.',
        },
        {
          id: 'opinions',
          description:
            'Offering opinions and participating in studies related to the relevant laws and regulations.',
        },
        {
          id: 'research',
          description:
            'Conducting research, studies, and providing technical and legal consultations.',
        },
        {
          id: 'principles',
          description: 'Extracting judicial principles from the decisions of IP committees.',
        },
        {
          id: 'categorizing',
          description:
            'Categorizing and organizing the decisions issued by the committees and publishing them.',
        },
        {
          id: 'communicating',
          description:
            "Communicating with the parties to the cases and stakeholders regarding the committees' activities.",
        },
        {
          id: 'registering',
          description:
            'Registering cases, organizing their records, arranging and numbering them, and archiving them.',
        },
        {
          id: 'monitoring',
          description:
            'Monitoring the performance indicators of the approved committees and the set targets.',
        },
        {
          id: 'statistics',
          description:
            "Preparing periodic statistics on the committees' activities, their decisions, and litigation durations.",
        },
        {
          id: 'collaborating',
          description:
            "Collaborating with relevant departments within SAIP to develop and improve procedures related to the committees' activities.",
        },
        {
          id: 'training',
          description:
            "Coordinating training programs related to the committees' work, in accordance with the established procedures.",
        },
        {
          id: 'other-tasks',
          description: 'Any other tasks as defined by SAIP regulations and internal policies.',
        },
      ],
      statistics: [
        {
          label: 'Number of committees',
          value: 3,
          chartType: 'line',
          chartData: [{ value: 1 }, { value: 2 }, { value: 3 }],
          trend: { value: '50%', direction: 'up', description: 'vs last year' },
        },
        {
          label: 'Number of decisions made',
          value: 450,
          chartType: 'line',
          chartData: [{ value: 200 }, { value: 300 }, { value: 400 }, { value: 450 }],
          trend: { value: '20%', direction: 'up', description: 'vs last year' },
        },
        {
          label: 'Cases resolved',
          value: 320,
          chartType: 'line',
          chartData: [{ value: 150 }, { value: 220 }, { value: 280 }, { value: 320 }],
          trend: { value: '15%', direction: 'up', description: 'vs last year' },
        },
      ],
      relatedPages: [
        { title: 'FAQs', href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT },
        {
          title: 'Guidelines',
          href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
        },
        { title: 'IP Clinics', href: ROUTES.SERVICES.IP_CLINICS },
        { title: 'IP Academy', href: ROUTES.SERVICES.IP_ACADEMY },
        {
          title: 'Laws and Regulations',
          href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
        },
        {
          title: 'International Treaties',
          href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.ITERNATIONAL_TREATIES.ROOT,
        },
      ],
    },
    committees: {
      title: 'Committees',
      description:
        'There are three types of committees: Trademark committee, Patent, design, integrated circuits & plant varieties committees and Copyright committee.',
      committeesList: [
        {
          id: 'trademark',
          title: 'Trademark committee',
          description:
            'The first Trademark Appeals Committee was formed after the jurisdiction was transferred to SAIP under Ministerial Decision No. (108) dated 08/04/1441 AH.',
          responsibilities: [
            {
              id: 'appeals-refusal',
              description:
                'Reviewing appeals against decisions to refuse the registration of a trademark or to make it conditional.',
            },
            {
              id: 'appeals-modifications',
              description:
                'Reviewing appeals against decisions to refuse additions or modifications to a registered trademark.',
            },
          ],
          ctaTitle: 'Litigation path for trademark committee',
          ctaButtonLabel: 'Go to litigation path',
          ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
        },
        {
          id: 'patent',
          title: 'Patent, Design, Layout designs of IC and Plant varieties committees',
          description:
            'These specialized committees handle disputes related to patents, industrial designs, integrated circuit layout designs, and plant varieties.',
          responsibilities: [
            {
              id: 'patent-disputes',
              description:
                'Resolving disputes related to patent validity, infringement, and licensing agreements.',
            },
            {
              id: 'design-disputes',
              description: 'Handling industrial design disputes and protection matters.',
            },
            {
              id: 'ic-layout',
              description: 'Managing integrated circuit layout design disputes and protection.',
            },
            {
              id: 'plant-varieties',
              description: 'Resolving plant variety protection and rights disputes.',
            },
          ],
          ctaTitle: 'Litigation path for patent committees',
          ctaButtonLabel: 'Go to litigation path',
          ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
        },
        {
          id: 'copyright',
          title: 'Copyright committee',
          description:
            'The Copyright Committee specializes in resolving disputes related to literary, artistic, and creative works.',
          responsibilities: [
            {
              id: 'literary-works',
              description:
                'Resolving disputes related to literary works, books, and written content.',
            },
            {
              id: 'artistic-works',
              description: 'Handling disputes involving artistic works, music, and visual arts.',
            },
            {
              id: 'digital-content',
              description: 'Managing software, digital content, and multimedia copyright disputes.',
            },
          ],
          ctaTitle: 'Litigation path for copyright committee',
          ctaButtonLabel: 'Go to litigation path',
          ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
        },
      ],
    },
    services: [],
    centers: [
      {
        id: '1',
        title: 'Trademark Appeals Committee',
        description: 'Review and resolve trademark-related disputes and appeals.',
        labels: ['Trademark', 'Appeals', 'Disputes'],
        href: '/services/trademark-committee',
      },
      {
        id: '2',
        title: 'Patent Claims Review Committee',
        description: 'Handle patent-related disputes and infringement cases.',
        labels: ['Patent', 'Claims', 'Review'],
        href: '/services/patent-committee',
      },
      {
        id: '3',
        title: 'Copyright Protection Committee',
        description: 'Resolve copyright violations and protection matters.',
        labels: ['Copyright', 'Protection', 'Violations'],
        href: '/services/copyright-committee',
      },
      {
        id: '4',
        title: 'Design Rights Committee',
        description: 'Handle industrial design disputes and protection.',
        labels: ['Design', 'Rights', 'Industrial'],
        href: '/services/design-committee',
      },
    ],
    documentsAndDecisions: [
      {
        id: '1',
        name: 'Requirements for filing a lawsuit',
        committeeType: 'Trademark Grievances Review Committee',
        date: '25.09.2024',
        hijriDate: '22.03.1446',
        fileUrl: '#',
        serviceType: 'protection',
        targetGroups: ['Individuals', 'Enterprises'],
      },
      {
        id: '2',
        name: 'Request form for consideration of filing a lawsuit',
        committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
        date: '25.09.2024',
        hijriDate: '22.03.1446',
        fileUrl: '#',
        serviceType: 'protection',
        targetGroups: ['Individuals', 'Enterprises'],
      },
    ],
    media: {
      heroTitle: 'Media for IP General Secretariat',
      heroDescription: 'Here you can find news related to IP General Secretariat.',
      heroImage: '/images/designs/hero.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
      ],
      content: {
        news: {
          title: 'News',
          description: 'Get the latest information on IP General Secretariat.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on IP General Secretariat through our video collection.',
        },
      },
      filterFields: [{ id: 'search', label: 'Search', type: 'search', placeholder: 'Search' }],
      badgeLabel: 'IP General Secretariat',
    },
  };
}

/**
 * Fetch Protection services from service_item nodes
 * These are displayed in the "Centers" tab
 */
export async function fetchProtectionServices(locale?: string): Promise<ServiceItemData[]> {
  try {
    // Get Protection term ID first
    const termsResponse = await fetchDrupal(
      '/taxonomy_term/service_type?filter[name]=Protection',
      {},
      locale,
    );

    if (!termsResponse.data || termsResponse.data.length === 0) {
      console.log('🔴 Protection taxonomy term not found');
      return [];
    }

    const protectionTermId = termsResponse.data[0].id;

    // Fetch service_item nodes with Protection type
    const includeFields = [
      'field_ip_category',
      'field_type',
      'field_target_group',
      'field_label',
    ].join(',');

    const endpoint = `/node/service_item?filter[status][value]=1&filter[field_type.id]=${protectionTermId}&include=${includeFields}`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (!response.data || response.data.length === 0) {
      console.log('🔴 No Protection services found');
      return [];
    }

    const included = response.included || [];
    const filteredIncluded = filterIncludedByLangcode(included, locale || 'en');
    const effectiveIncluded = filteredIncluded.length > 0 ? filteredIncluded : included;
    const services = response.data.map((service: DrupalNode) =>
      transformServiceItem(service, effectiveIncluded, locale),
    );

    console.log(`✅ Fetched ${services.length} Protection services (${locale || 'en'})`);
    return services;
  } catch (error) {
    console.error('❌ Error fetching Protection services:', error);
    return [];
  }
}

export async function getIPGeneralSecretariatPageData(
  locale?: string,
): Promise<IPGeneralSecretariatData> {
  try {
    // Step 1: Fetch to get UUID (without locale to ensure we get the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/ip_general_secretariat_page?filter[status][value]=1',
      {},
      'en',
    );

    if (!initialResponse.data || initialResponse.data.length === 0) {
      console.log('🔴 IP GENERAL SECRETARIAT: No content found, using fallback data');
      return getIPGeneralSecretariatFallbackData();
    }

    const nodeUuid = initialResponse.data[0].id;

    // Step 2: Fetch with UUID and locale to get translated content
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_services_items',
      'field_services_items.field_ip_category',
      'field_services_items.field_type',
      'field_services_items.field_target_group',
      'field_services_items.field_label',
      'field_committee_tabs',
      'field_committee_tabs.field_image',
      'field_committee_tabs.field_image.field_media_image',
      'field_responsibilities_items',
      'field_statistics_items',
      'field_committees_list',
      'field_centers_items',
      'field_documents_item',
      'field_documents_item.field_document_file',
      'field_documents_item.field_document_file.field_media_document',
      'field_documents_item.field_target_group',
    ];

    const response = await fetchDrupal<DrupalNode>(
      `/node/ip_general_secretariat_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const data = transformIPGeneralSecretariatPage(node, included, locale);
    console.log(`✅ IP GENERAL SECRETARIAT: Using Drupal data (${locale || 'en'})`);
    console.log(
      `📊 IP GENERAL SECRETARIAT: Final statistics count being returned: ${data.overview.statistics.length}`,
    );
    if (data.overview.statistics.length > 0) {
      console.log(
        '📊 IP GENERAL SECRETARIAT: Statistics being returned:',
        data.overview.statistics,
      );
    } else {
      console.log('⚠️ IP GENERAL SECRETARIAT: No statistics found in Drupal data!');
    }
    return data;
  } catch (error) {
    console.log(
      `🔴 IP GENERAL SECRETARIAT: Error fetching data, using fallback data (${locale || 'en'})`,
      error,
    );
    return getIPGeneralSecretariatFallbackData();
  }
}
