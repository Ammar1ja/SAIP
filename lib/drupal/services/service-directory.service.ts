/**
 * Service Directory Service
 * Handles data fetching and transformation for service directory page
 * Aggregates ALL services from Drupal's service_item content type
 */

import { fetchDrupal, getRelated, getImageUrl, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalTaxonomyEntity } from '../types';

/**
 * Known service routes - maps service title patterns to dedicated page routes
 * These services have custom pages instead of the universal [category]/[slug] route
 */
const KNOWN_SERVICE_ROUTES: Record<string, string> = {
  // Patents
  'patent cooperation treaty': '/services/patents/pct',
  pct: '/services/patents/pct',
  'fast track examination': '/services/patents/pph',
  pph: '/services/patents/pph',
  'patent prosecution highway': '/services/patents/pph',

  // Designs
  'design registration': '/services/designs/application',
  'design renewal': '/services/designs/renewal',
  'design search': '/services/designs/search',

  // Plant Varieties
  'plant variety': '/services/plant-varieties/application',
  'plant variety application': '/services/plant-varieties/application',
  'plant variety renewal': '/services/plant-varieties/renewal',
  'plant variety search': '/services/plant-varieties/search',

  // Layout Designs / IC
  'layout design': '/services/layout-designs-of-integrated-circuits/registration',
  'integrated circuit': '/services/layout-designs-of-integrated-circuits/registration',
  'ic layout': '/services/layout-designs-of-integrated-circuits/registration',

  // IP Infringement
  'trademark infringement': '/services/ip-infringement/trademark-complaint',
  'trademark complaint': '/services/ip-infringement/trademark-complaint',
  'complaint of trademark': '/services/ip-infringement/trademark-complaint',
  'copyright infringement': '/services/ip-infringement/copyright-complaint',
  'copyright complaint': '/services/ip-infringement/copyright-complaint',
  'complaint of copyright': '/services/ip-infringement/copyright-complaint',

  // IP Licensing
  'ip agent license': '/services/ip-licensing/registration',
  'ip agent registration': '/services/ip-licensing/registration',

  // IP Clinics
  'consultancy clinic': '/services/ip-clinics/consultancy-services',
  'ip consultancy': '/services/ip-clinics/consultancy-services',
};

/**
 * Get the correct href for a service based on its title and category
 */
// Map category names (EN/AR) to English URL slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  // English names
  Patents: 'patents',
  Trademarks: 'trademarks',
  Copyrights: 'copyrights',
  Designs: 'designs',
  'Plant Varieties': 'plant-varieties',
  'Topographic Designs': 'layout-designs-of-integrated-circuits',
  'Topographic designs of integrated circuits': 'layout-designs-of-integrated-circuits',
  'Layout Designs of Integrated Circuits': 'layout-designs-of-integrated-circuits',
  // Arabic names
  'براءات الاختراع': 'patents',
  'العلامات التجارية': 'trademarks',
  'حقوق النشر': 'copyrights',
  التصاميم: 'designs',
  'الأصناف النباتية': 'plant-varieties',
  'التصاميم الطبوغرافية': 'layout-designs-of-integrated-circuits',
  // General fallback
  General: 'general',
  عام: 'general',
};

function getServiceHref(
  title: string,
  category: string,
  locale?: string,
  fieldSlug?: string,
): string {
  const titleLower = title.toLowerCase();

  // Check known routes first
  for (const [pattern, route] of Object.entries(KNOWN_SERVICE_ROUTES)) {
    if (titleLower.includes(pattern)) {
      // Add locale prefix for Arabic
      return locale === 'ar' ? `/ar${route}` : route;
    }
  }

  // Map category to English slug (works for both EN and AR category names)
  const categorySlug = CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/\s+/g, '-');

  // Use field_slug if available (preferred), otherwise generate from title
  const serviceSlug =
    fieldSlug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const baseRoute = `/services/${categorySlug}/${serviceSlug}`;
  // Add locale prefix for Arabic
  return locale === 'ar' ? `/ar${baseRoute}` : baseRoute;
}

function extractLinkUri(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return first?.uri || first?.url?.uri;
  }
  return value?.uri || value?.url?.uri;
}

function normalizeServiceLink(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value
    .replace(/^internal:/, '')
    .replace(/^entity:/, '')
    .trim();
  if (!cleaned) return undefined;
  if (
    cleaned.startsWith('http://') ||
    cleaned.startsWith('https://') ||
    cleaned.startsWith('mailto:') ||
    cleaned.startsWith('tel:')
  ) {
    return cleaned;
  }
  if (cleaned.startsWith('/') || cleaned.startsWith('#')) return cleaned;
  return `/${cleaned}`;
}

// Frontend data interfaces
export interface ServiceItemData {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string; // IP Category (Patents, Trademarks, etc.)
  ipCategoryIds: string[];
  serviceCategory?: string; // Service Category (IP Clinics, IP Licensing, etc.) from field_label
  serviceCategoryIds: string[];
  serviceType: string;
  serviceTypeValues: string[];
  serviceTypeIds: string[];
  targetGroup: string;
  targetGroupValues: string[];
  targetGroupIds: string[];
  labels: string[];
  [key: string]: unknown;
}

export interface TaxonomyTermData {
  id: string;
  name: string;
}

export interface ServiceDirectoryData {
  // Hero section
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    url: string;
    alt: string;
  };

  // Services list - aggregated from ALL IP categories
  services: ServiceItemData[];

  // Filter options - dynamically generated
  categories: string[];
  serviceCategories: string[];
  serviceTypes: string[];
  targetGroups: string[];
  categoryOptions: Array<{ label: string; value: string }>;
  serviceTypeOptions: Array<{ label: string; value: string }>;
  targetGroupOptions: Array<{ label: string; value: string }>;
}

const SERVICE_LABEL_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'عيادات الملكية الفكرية': { en: 'IP Clinics', ar: 'عيادات الملكية الفكرية' },
  'مراكز دعم الملكية الفكرية': { en: 'IP Support Centers', ar: 'مراكز دعم الملكية الفكرية' },
  'التعدي على الملكية الفكرية': { en: 'IP Infringement', ar: 'التعدي على الملكية الفكرية' },
  'ترخيص أنشطة الملكية الفكرية': { en: 'IP Licensing', ar: 'ترخيص أنشطة الملكية الفكرية' },
  'الأمانة العامة للملكية الفكرية': {
    en: 'IP General Secretariat',
    ar: 'الأمانة العامة للملكية الفكرية',
  },
  'أكاديمية الملكية الفكرية': { en: 'IP Academy', ar: 'أكاديمية الملكية الفكرية' },
};

function localizeServiceLabel(label: string, locale?: string): string {
  const translated = SERVICE_LABEL_TRANSLATIONS[label];
  if (!translated) return label;
  return locale === 'ar' ? translated.ar : translated.en;
}

function dedupeOptionsByLabel(
  options: Array<{ label: string; value: string }>,
): Array<{ label: string; value: string }> {
  const seen = new Set<string>();
  const deduped: Array<{ label: string; value: string }> = [];

  for (const option of options) {
    const normalizedLabel = option.label.trim().toLowerCase();
    if (!normalizedLabel || seen.has(normalizedLabel)) {
      continue;
    }
    seen.add(normalizedLabel);
    deduped.push(option);
  }

  return deduped;
}

/**
 * Fetch service directory page data from Drupal with services and categories
 */
export async function fetchServiceDirectoryPage(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  try {
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/service_directory_page?filter[status]=1',
      {},
      'en',
    );

    const initialData = Array.isArray(initialResponse.data)
      ? initialResponse.data
      : initialResponse.data
        ? [initialResponse.data]
        : [];

    if (initialData.length === 0) {
      return { nodes: [], included: [] };
    }

    const pageUuid = initialData[0].id;

    const includeFields = [
      'field_services_data',
      'field_services_data.field_ip_category',
      'field_services_data.field_type',
      'field_services_data.field_target_group',
      'field_services_data.field_label',
      'field_services_data.field_icon',
      'field_categories_data',
    ].join(',');

    const pageResponse = await fetchDrupal<DrupalNode>(
      `/node/service_directory_page/${pageUuid}?include=${includeFields}`,
      {},
      locale,
    );

    const pageNode = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;

    if (pageNode) {
      return { nodes: [pageNode], included: pageResponse.included || [] };
    }

    return { nodes: [], included: [] };
  } catch (_error) {
    return { nodes: [], included: [] };
  }
}

/**
 * Fetch ALL service_item nodes from Drupal with their taxonomy relationships
 */
export async function fetchAllServices(locale?: string): Promise<{
  services: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // Include all taxonomy term references for filtering
  const includeFields = [
    'field_ip_category',
    'field_type',
    'field_target_group',
    'field_label',
    'field_icon',
  ].join(',');

  const endpoint = `/node/service_item?filter[status]=1&include=${includeFields}&page[limit]=100`;
  const response = await fetchDrupal(endpoint, {}, locale);

  return {
    services: response.data || [],
    included: response.included || [],
  };
}

export async function fetchTaxonomyTerms(
  vid: string,
  locale?: string,
): Promise<TaxonomyTermData[]> {
  try {
    const response = await fetchDrupal(
      `/taxonomy_term/${vid}?filter[status]=1&sort=weight&filter[langcode]=${locale || 'en'}`,
      {},
      locale,
    );

    const terms = Array.isArray(response.data) ? response.data : [];
    return terms
      .map((term: any) => ({
        id: term.id,
        name: term.attributes?.name || '',
      }))
      .filter((term: TaxonomyTermData) => term.name);
  } catch (error) {
    console.warn(`⚠️ SERVICE DIRECTORY: Unable to fetch taxonomy ${vid}`, error);
    return [];
  }
}

/**
 * Transform Drupal service_item node to frontend format
 */
export function transformServiceItem(
  service: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): ServiceItemData {
  const attrs = service.attributes as any;
  const relationships = service.relationships || {};

  // Get taxonomy terms - use field_ip_category for IP Category (Patents, Trademarks, etc.)
  const ipCategoryTerms = relationships.field_ip_category
    ? getRelated(relationships, 'field_ip_category', included)
    : null;
  const serviceTypeTerms = relationships.field_type
    ? getRelated(relationships, 'field_type', included)
    : null;
  const targetGroupTerms = relationships.field_target_group
    ? getRelated(relationships, 'field_target_group', included)
    : null;
  const labelTerms = relationships.field_label
    ? getRelated(relationships, 'field_label', included)
    : null;

  // Extract category from ip_categories taxonomy
  const category = ipCategoryTerms
    ? Array.isArray(ipCategoryTerms)
      ? (ipCategoryTerms[0] as DrupalTaxonomyEntity)?.attributes?.name || 'General'
      : (ipCategoryTerms as DrupalTaxonomyEntity)?.attributes?.name || 'General'
    : 'General';
  const ipCategoryIds = ipCategoryTerms
    ? Array.isArray(ipCategoryTerms)
      ? ipCategoryTerms.map((term) => term.id).filter(Boolean)
      : [(ipCategoryTerms as DrupalTaxonomyEntity)?.id].filter(Boolean)
    : [];

  const serviceTypeValues = serviceTypeTerms
    ? Array.isArray(serviceTypeTerms)
      ? serviceTypeTerms
          .map((term) => (term as DrupalTaxonomyEntity)?.attributes?.name || '')
          .filter(Boolean)
      : [(serviceTypeTerms as DrupalTaxonomyEntity)?.attributes?.name || ''].filter(Boolean)
    : [];
  const serviceTypeIds = serviceTypeTerms
    ? Array.isArray(serviceTypeTerms)
      ? serviceTypeTerms.map((term) => term.id).filter(Boolean)
      : [(serviceTypeTerms as DrupalTaxonomyEntity)?.id].filter(Boolean)
    : [];
  const serviceType = serviceTypeValues[0] || 'Service';

  const targetGroupValues = targetGroupTerms
    ? Array.isArray(targetGroupTerms)
      ? targetGroupTerms
          .map((term) => (term as DrupalTaxonomyEntity)?.attributes?.name || '')
          .filter(Boolean)
      : [(targetGroupTerms as DrupalTaxonomyEntity)?.attributes?.name || ''].filter(Boolean)
    : [];
  const targetGroupIds = targetGroupTerms
    ? Array.isArray(targetGroupTerms)
      ? targetGroupTerms.map((term) => term.id).filter(Boolean)
      : [(targetGroupTerms as DrupalTaxonomyEntity)?.id].filter(Boolean)
    : [];
  const targetGroup = targetGroupValues[0] || 'All';

  // Extract service category from field_label (taxonomy reference)
  // field_label is used for Service Categories (IP Clinics, IP Licensing, etc.)
  const serviceCategory = labelTerms
    ? Array.isArray(labelTerms)
      ? (labelTerms[0] as DrupalTaxonomyEntity)?.attributes?.name || undefined
      : (labelTerms as DrupalTaxonomyEntity)?.attributes?.name || undefined
    : undefined;
  const serviceCategoryIds = labelTerms
    ? Array.isArray(labelTerms)
      ? labelTerms.map((term) => term.id).filter(Boolean)
      : [(labelTerms as DrupalTaxonomyEntity)?.id].filter(Boolean)
    : [];

  // Extract labels (legacy - keep for backwards compatibility)
  const labels = labelTerms
    ? Array.isArray(labelTerms)
      ? labelTerms.map((term: any) => term?.attributes?.name || '').filter(Boolean)
      : [(labelTerms as DrupalTaxonomyEntity)?.attributes?.name || ''].filter(Boolean)
    : [category]; // Default to category as label

  // Build href - prefer field_href, then use smart routing
  const rawHref = attrs.field_href || extractLinkUri(attrs.field_external_link) || '';
  let href = normalizeServiceLink(rawHref) || '';
  if (!href) {
    // Use smart routing based on service title, category, and field_slug
    href = getServiceHref(attrs.title || '', category, locale, attrs.field_slug);
  } else if (locale === 'ar' && href.startsWith('/') && !href.startsWith('/ar')) {
    // Add locale prefix only for internal relative paths
    href = `/ar${href}`;
  }

  return {
    id: service.id,
    title: attrs.title || attrs.field_title || 'Untitled Service',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',
    href,
    category,
    ipCategoryIds,
    serviceCategory,
    serviceCategoryIds,
    serviceType,
    serviceTypeValues,
    serviceTypeIds,
    targetGroup,
    targetGroupValues,
    targetGroupIds,
    labels,
  };
}

/**
 * Transform hero section from service_directory_page
 */
export function transformHeroSection(
  node: DrupalNode | null,
  included: DrupalIncludedEntity[] = [],
): { heroHeading: string; heroSubheading: string; heroImage?: { url: string; alt: string } } {
  if (!node) {
    return {
      heroHeading: 'SAIP service directory',
      heroSubheading: 'Here you can find all of the services provided by SAIP.',
    };
  }

  const attrs = node.attributes as any;

  return {
    heroHeading:
      extractText(attrs.field_hero_heading) || attrs.field_hero_heading || 'SAIP service directory',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      attrs.field_hero_subheading ||
      'Here you can find all of the services provided by SAIP.',
    heroImage: undefined,
  };
}

/**
 * Build complete Service Directory data from services and hero
 */
export function buildServiceDirectoryData(
  services: ServiceItemData[],
  heroData: {
    heroHeading: string;
    heroSubheading: string;
    heroImage?: { url: string; alt: string };
  },
  taxonomyTerms?: {
    ipCategories: TaxonomyTermData[];
    serviceLabels: TaxonomyTermData[];
    serviceTypes: TaxonomyTermData[];
    targetGroups: TaxonomyTermData[];
  },
  locale?: string,
): ServiceDirectoryData {
  // Combine IP Categories and Service Categories into one unified "categories" list
  // This gives users one simple filter: Category (Patents, Trademarks, IP Clinics, IP Licensing, etc.)
  const ipCategories = [...new Set(services.map((s) => s.category))].filter(Boolean);
  const serviceCategories = [...new Set(services.map((s) => s.serviceCategory).filter(Boolean))];
  const allCategories = [...new Set([...ipCategories, ...serviceCategories])]
    .filter((cat): cat is string => Boolean(cat))
    .sort();

  const serviceTypes = [
    ...new Set(services.flatMap((s) => s.serviceTypeValues || s.serviceType || []).filter(Boolean)),
  ].sort();
  const targetGroups = [
    ...new Set(services.flatMap((s) => s.targetGroupValues || s.targetGroup || []).filter(Boolean)),
  ].sort();

  const categoryOptions = taxonomyTerms
    ? dedupeOptionsByLabel([
        ...taxonomyTerms.ipCategories.map((term) => ({ label: term.name, value: term.id })),
        ...taxonomyTerms.serviceLabels.map((term) => ({
          label: localizeServiceLabel(term.name, locale),
          value: term.id,
        })),
      ])
    : allCategories.map((cat) => ({ label: cat, value: cat }));

  const serviceTypeOptions = taxonomyTerms
    ? taxonomyTerms.serviceTypes.map((term) => ({ label: term.name, value: term.id }))
    : serviceTypes.map((type) => ({ label: type, value: type }));

  const targetGroupOptions = taxonomyTerms
    ? taxonomyTerms.targetGroups.map((term) => ({ label: term.name, value: term.id }))
    : targetGroups.map((group) => ({ label: group, value: group }));

  return {
    ...heroData,
    services,
    categories: allCategories, // Unified categories
    serviceCategories: [], // Deprecated - no longer used in UI
    serviceTypes,
    targetGroups,
    categoryOptions,
    serviceTypeOptions,
    targetGroupOptions,
  };
}

/**
 * Get fallback data for service directory page (empty state)
 */
export function getServiceDirectoryFallbackData(): ServiceDirectoryData {
  return {
    heroHeading: 'SAIP service directory',
    heroSubheading: 'Here you can find all of the services provided by SAIP.',
    heroImage: {
      url: '/images/about/hero.jpg',
      alt: 'Service Directory',
    },
    services: [],
    categories: [],
    serviceCategories: [],
    serviceTypes: [],
    targetGroups: [],
    categoryOptions: [],
    serviceTypeOptions: [],
    targetGroupOptions: [],
  };
}

/**
 * Main function to get service directory page data
 * ALWAYS fetches ALL service_item nodes from database (not just from field_services_data)
 */
export async function getServiceDirectoryPageData(locale?: string): Promise<ServiceDirectoryData> {
  try {
    // Get hero section from service_directory_page
    const pageResult = await fetchServiceDirectoryPage(locale).catch(() => ({
      nodes: [],
      included: [],
    }));

    const heroData =
      pageResult.nodes.length > 0
        ? transformHeroSection(pageResult.nodes[0], pageResult.included)
        : {
            heroHeading: 'SAIP service directory',
            heroSubheading: 'Here you can find all of the services provided by SAIP.',
          };

    // ALWAYS fetch ALL service_item nodes from database
    const servicesResult = await fetchAllServices(locale);

    const [ipCategories, serviceLabels, serviceTypes, targetGroups] = await Promise.all([
      fetchTaxonomyTerms('ip_categories', locale),
      fetchTaxonomyTerms('labels', locale),
      fetchTaxonomyTerms('service_type', locale),
      fetchTaxonomyTerms('target_group', locale),
    ]);

    if (!servicesResult.services || servicesResult.services.length === 0) {
      return buildServiceDirectoryData(
        [],
        heroData,
        {
          ipCategories,
          serviceLabels,
          serviceTypes,
          targetGroups,
        },
        locale,
      );
    }

    // Transform all services
    const services = servicesResult.services
      .map((service) => {
        try {
          return transformServiceItem(service, servicesResult.included, locale);
        } catch (error) {
          console.warn('⚠️ SERVICE DIRECTORY: Error transforming service:', error);
          return null;
        }
      })
      .filter((s): s is ServiceItemData => {
        if (!s) return false;
        const hasValidTitle = Boolean(s.title && s.title !== 'Untitled Service');
        return hasValidTitle;
      });

    return buildServiceDirectoryData(
      services,
      heroData,
      {
        ipCategories,
        serviceLabels,
        serviceTypes,
        targetGroups,
      },
      locale,
    );
  } catch (error) {
    console.error(`SERVICE DIRECTORY: Error loading data (${locale || 'en'})`, error);
    return getServiceDirectoryFallbackData();
  }
}
