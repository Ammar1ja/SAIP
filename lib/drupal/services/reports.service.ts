/**
 * Reports Service
 * Handles data fetching and transformation for Reports page
 */

import { fetchDrupal, getRelated, getImageWithAlt, extractText, getProxyUrl } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend data interfaces
export interface ReportsData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  reports: ReportItemData[];
  categoryOptions: Array<{ label: string; value: string }>;
  reportTypeOptions: Array<{ label: string; value: string }>;
}

export interface ReportItemData {
  id: string;
  title: string;
  variant: 'report';
  publicationDate: string;
  reportType: string;
  labels: string[];
  href: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  [key: string]: unknown; // Added to satisfy FilterableItem interface
}

export interface ReportDetailData extends ReportItemData {
  overview?: string;
  methodology?: string;
  keyFindings?: string;
  relatedReports: ReportItemData[];
}

const CATEGORY_ALLOWLIST = [
  'Trademarks',
  'Patents',
  'Copyrights',
  'Designs',
  'Topographic designs of integrated circuits',
  'Plants varieties',
  'IP academy',
  'IP clinics',
  'IP licensing',
  'IP infringement',
  'IP dispute resolution committees',
  'National network of IP support centers',
];

const REPORT_TYPE_ALLOWLIST = ['Statistical reports', 'Periodic reports', 'Knowledge reports'];

const normalizeLabel = (value: string) => value.trim().toLowerCase();

const buildOptions = (labels: string[], allowlist: string[]) => {
  const unique = [...new Set(labels)].filter(Boolean);
  const allowlistNormalized = new Set(allowlist.map(normalizeLabel));
  const filtered = unique.filter((label) => allowlistNormalized.has(normalizeLabel(label)));
  const resolved = filtered.length > 0 ? filtered : unique;
  return resolved.map((label) => ({ label, value: normalizeLabel(label) }));
};

const fetchReportCategories = async (locale?: string): Promise<string[]> => {
  try {
    const response = await fetchDrupal(
      `/taxonomy_term/report_categories?filter[status]=1&sort=weight&filter[langcode]=${locale || 'en'}`,
      {},
      locale,
    );
    const terms = Array.isArray(response.data) ? response.data : [];
    return terms.map((term: any) => extractText(term.attributes?.name) || '').filter(Boolean);
  } catch (error) {
    console.error('Error fetching report categories:', error);
    return [];
  }
};

const fetchReportTypes = async (locale?: string): Promise<string[]> => {
  try {
    const response = await fetchDrupal(
      `/taxonomy_term/report_types?filter[status]=1&sort=weight&filter[langcode]=${locale || 'en'}`,
      {},
      locale,
    );
    const terms = Array.isArray(response.data) ? response.data : [];
    return terms.map((term: any) => extractText(term.attributes?.name) || '').filter(Boolean);
  } catch (error) {
    console.error('Error fetching report types:', error);
    return [];
  }
};

// Drupal API functions - 2-step UUID fetch pattern (like FAQ service)
export async function fetchReportsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode> | null> {
  // Fetch with field_report_item to get curated list (now that field_category is fixed)
  const response = await fetchDrupal<DrupalNode>(
    '/node/reports_page?filter[status]=1&include=field_hero_background_image,field_hero_background_image.field_media_image,field_report_item,field_report_item.field_file,field_report_item.field_file.field_media_document,field_report_item.field_category,field_report_item.field_report_type',
    {},
    locale,
  );

  if (!response || !response.data || response.data.length === 0) {
    return null;
  }

  return response;
}

// Fetch individual report items
export async function fetchReports(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // Fetch basic data without complex includes - let transform handle fallbacks
  const endpoint = `/node/report_item?filter[status]=1&include=field_file,field_file.field_media_document,field_category,field_report_type`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

export async function fetchReportByUUID(
  uuid: string,
  locale?: string,
): Promise<DrupalResponse<DrupalNode> | null> {
  const endpoint =
    `/node/report_item/${uuid}?include=` +
    [
      'field_file',
      'field_file.field_media_document',
      'field_category',
      'field_report_type',
      'field_related_reports',
      'field_related_reports.field_file',
      'field_related_reports.field_file.field_media_document',
      'field_related_reports.field_category',
      'field_related_reports.field_report_type',
    ].join(',');

  try {
    return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  } catch {
    return null;
  }
}

// Transformation functions
export function transformReportItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): ReportItemData {
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  // Get category from relationship
  const categoryTerms = relationships.field_category
    ? getRelated(relationships, 'field_category', included) || []
    : [];
  const categories = Array.isArray(categoryTerms)
    ? categoryTerms.map((term: any) => term.attributes?.name || '').filter(Boolean)
    : [];

  // Get report type from relationship
  const reportTypeTerm = relationships.field_report_type
    ? (() => {
        const term = getRelated(relationships, 'field_report_type', included);
        return term && !Array.isArray(term) ? term : null;
      })()
    : null;
  const reportType =
    (reportTypeTerm?.attributes?.name as string | undefined) || attrs.field_report_type || 'Text';

  // File URL from media (field_file -> media.document -> field_media_document)
  const getFileUrl = (): string | undefined => {
    if (!relationships.field_file) return undefined;

    const mediaEntity = getRelated(relationships, 'field_file', included);
    if (!mediaEntity || Array.isArray(mediaEntity)) return undefined;

    const mediaRels = (mediaEntity as any).relationships || {};
    const fileEntity = getRelated(mediaRels, 'field_media_document', included);
    if (!fileEntity || Array.isArray(fileEntity)) return undefined;

    const fileAttrs = (fileEntity as any).attributes || {};
    return fileAttrs.uri?.url;
  };

  const fileUrl = getFileUrl();

  // Both View and Download should point to the same file (like Guidelines).
  // View opens the PDF in browser, Download triggers a file download.
  const finalFileHref = fileUrl || attrs.field_primary_button_href;
  const finalPrimaryHref = getProxyUrl(finalFileHref, 'download');
  const finalSecondaryHref = getProxyUrl(finalFileHref, 'view');

  // Format publication date from ISO to readable format (DD.MM.YYYY)
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return dateStr;
    }
  };

  return {
    id: (item as any).id || '',
    title: attrs.title || 'Untitled Report',
    variant: 'report',
    publicationDate: formatDate(attrs.field_publication_date),
    reportType,
    labels: categories.length > 0 ? categories : ['Statistical', 'Category'],
    href: attrs.field_href || attrs.path?.alias || `/resources/ip-information/reports/${item.id}`,
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref: finalPrimaryHref,
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref: finalSecondaryHref,
  };
}

export function transformReportDetail(
  item: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): ReportDetailData {
  const base = transformReportItem(item as DrupalIncludedEntity, included);
  const attrs = (item as any).attributes || {};
  const relationships = (item as any).relationships || {};

  const relatedRel = getRelated(relationships, 'field_related_reports', included);
  const relatedReports = Array.isArray(relatedRel)
    ? relatedRel.map((related) => transformReportItem(related, included))
    : [];

  return {
    ...base,
    overview: extractText(attrs.field_report_overview) || extractText(attrs.body) || '',
    methodology: extractText(attrs.field_report_methodology) || '',
    keyFindings: extractText(attrs.field_report_key_findings) || '',
    relatedReports,
  };
}

export function getReportsFallbackData(locale?: string): ReportsData {
  return {
    heroHeading: 'Reports',
    heroSubheading:
      "It offers key statistics and trends in IP domains, highlights growth in IP activities, and reflects SAIP's commitment to transparency, supporting decision-makers, practitioners, and stakeholders in understanding the evolving IP landscape in Saudi Arabia.",
    heroImage: {
      src: '/images/reports/hero.jpg',
      alt: 'Reports',
    },
    reports: Array.from({ length: 6 }, (_, i) => ({
      id: `fallback-${i + 1}`,
      title: `Report Title ${i + 1}`,
      variant: 'report' as const,
      publicationDate: '06.08.2025',
      reportType: 'Text',
      labels: ['Statistical', 'Category'],
      href: '#',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '#',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '#download',
    })),
    categoryOptions: [
      { label: 'Trademarks', value: 'trademarks' },
      { label: 'Patents', value: 'patents' },
      { label: 'Copyrights', value: 'copyrights' },
    ],
    reportTypeOptions: [
      { label: 'Statistical reports', value: 'statistical' },
      { label: 'Periodic reports', value: 'periodic' },
      { label: 'Knowledge reports', value: 'knowledge' },
    ],
  };
}

export async function getReportDetailData(
  id: string,
  locale?: string,
): Promise<ReportDetailData | null> {
  const response = await fetchReportByUUID(id, locale);
  const node = response?.data && !Array.isArray(response.data) ? response.data : null;
  if (!node) return null;

  const included = response?.included || [];
  return transformReportDetail(node, included);
}

export async function getReportsPageData(locale?: string): Promise<ReportsData> {
  try {
    // Try to fetch reports page first using 2-step UUID pattern
    const pageResponse = await fetchReportsPage(locale);

    if (!pageResponse || !pageResponse.data) {
      console.log('🔴 REPORTS: No page content found, using fallback data');
      return getReportsFallbackData(locale);
    }

    const node = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;
    const included = pageResponse.included || [];

    // Get hero data from page
    const attrs = node.attributes as any;
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

    // Get reports from field_report_item (curated list from CMS)
    const reportsRel = node.relationships?.field_report_item?.data;
    let reports: ReportItemData[] = [];

    if (reportsRel && Array.isArray(reportsRel) && reportsRel.length > 0) {
      // Use curated list from CMS
      const reportNodes = reportsRel
        .map((ref: any) => {
          return included.find((i) => i.type === 'node--report_item' && i.id === ref.id);
        })
        .filter(Boolean);

      reports = reportNodes.map((item) =>
        transformReportItem(item as DrupalIncludedEntity, included),
      );

      console.log(
        `🟢 REPORTS: Using curated list from CMS (${reports.length} reports) (${locale || 'en'})`,
      );
    } else {
      // Fallback: fetch all active reports if curated list is empty
      const itemsResponse = await fetchReports(locale);
      reports = itemsResponse.data.map((item: DrupalNode) =>
        transformReportItem(item, itemsResponse.included || []),
      );

      console.log(
        `🟡 REPORTS: No curated list, showing all active reports (${reports.length}) (${locale || 'en'})`,
      );
    }

    // Extract unique categories and report types from reports (fallback)
    const categoriesFromReports = [...new Set(reports.flatMap((r) => r.labels))].filter(Boolean);
    const reportTypesFromReports = [...new Set(reports.map((r) => r.reportType))].filter(Boolean);

    // Prefer taxonomy terms (aligned with Figma filters), fallback to report data
    const [categoryTerms, reportTypeTerms] = await Promise.all([
      fetchReportCategories(locale),
      fetchReportTypes(locale),
    ]);
    const categories = categoryTerms.length > 0 ? categoryTerms : categoriesFromReports;
    const reportTypes = reportTypeTerms.length > 0 ? reportTypeTerms : reportTypesFromReports;

    console.log(`  Hero: ${extractText(attrs.field_hero_heading)}`);
    console.log(`  Reports: ${reports.length}`);

    return {
      heroHeading: extractText(attrs.field_hero_heading) || 'Reports',
      heroSubheading:
        extractText(attrs.field_hero_subheading) ||
        "It offers key statistics and trends in IP domains, highlights growth in IP activities, and reflects SAIP's commitment to transparency, supporting decision-makers, practitioners, and stakeholders in understanding the evolving IP landscape in Saudi Arabia.",
      heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
      reports,
      categoryOptions: buildOptions(categories, CATEGORY_ALLOWLIST),
      reportTypeOptions: buildOptions(reportTypes, REPORT_TYPE_ALLOWLIST),
    };
  } catch (error) {
    console.log(`🔴 REPORTS: Error fetching data, using fallback data (${locale || 'en'})`);
    console.error(error);
    return getReportsFallbackData(locale);
  }
}
