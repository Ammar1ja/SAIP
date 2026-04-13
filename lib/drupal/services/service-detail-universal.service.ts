/**
 * Universal Service Detail Service
 * Handles ALL service detail pages (PCT, PPH, Patents, Complaints, etc.)
 */

import { fetchDrupal, getRelated, extractText, normalizeServiceTypeKey } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalTaxonomyEntity } from '../types';

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  labels: string[];

  // Sidebar metadata
  executionTime: string;
  serviceFee: string;
  targetGroup: string;
  serviceChannel: string;
  faqHref: string;
  platformHref: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;

  // Main content
  tabs: Array<{
    id: string;
    label: string;
  }>;

  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;

  requirements: Array<{
    title: string;
    items: string[];
  }>;

  // Related
  relatedServices: Array<{
    title: string;
    labels: string[];
    description: string;
    primaryButtonLabel: string;
    primaryButtonHref: string;
  }>;
}

/**
 * Fetch service detail by slug
 */
export async function fetchServiceDetailBySlug(
  slug: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  console.log(`🔍 [FETCH SERVICE] Looking for slug: "${slug}", locale: "${locale}"`);

  try {
    // Only service_item has field_slug!
    // Other content types (pct, patent_short_path, etc.) don't have this field
    const contentTypes = ['service_item'];

    const slugToTitle = decodeURIComponent(slug).replace(/-/g, ' ').trim();

    for (const contentType of contentTypes) {
      try {
        // CRITICAL: Only include RELATIONSHIPS, not regular field values!
        // When we include field_related_services, we automatically get ALL attributes (field_slug, field_description, etc.)
        // We only need to nest RELATIONSHIP includes (taxonomy terms, media, etc.)
        const includeFields = [
          'field_steps', // paragraphs
          'field_related_services', // related service_item nodes (gets ALL their attributes automatically!)
          'field_related_services.field_ip_category', // taxonomy term in related services
          'field_related_services.field_label', // taxonomy term in related services
          'field_related_services.field_type', // taxonomy term in related services
          'field_related_services.field_target_group', // taxonomy term in related services
          'field_ip_category', // taxonomy term in main node
          'field_target_group', // taxonomy term in main node
          'field_label', // taxonomy term labels
          'field_type', // taxonomy term types
        ].join(',');

        const endpoint = `/node/${contentType}?filter[field_slug]=${slug}&filter[status]=1&include=${includeFields}`;
        console.log(`   Trying ${contentType}: ${endpoint.substring(0, 120)}...`);

        const response = await fetchDrupal(endpoint, {}, locale);

        console.log(
          `   Response for ${contentType}: data=${response.data?.length || 0} items, included=${response.included?.length || 0}`,
        );

        if (response.data && response.data.length > 0) {
          console.log(`✅ Found service in ${contentType}: ${slug}`);
          console.log(`   Included entities: ${response.included?.length || 0}`);
          console.log(`   Steps relationship:`, response.data[0].relationships?.field_steps);
          console.log(
            `   Related services relationship:`,
            response.data[0].relationships?.field_related_services,
          );
          return {
            node: response.data[0],
            included: response.included || [],
          };
        } else {
          console.log(`   ❌ No data returned for ${contentType}`);
        }

        // Fallback: try title contains when field_slug is missing
        if (slugToTitle) {
          const titleEndpoint = `/node/${contentType}?filter[title][operator]=CONTAINS&filter[title][value]=${encodeURIComponent(
            slugToTitle,
          )}&filter[status]=1&include=${includeFields}`;
          console.log(`   Trying ${contentType} by title: ${titleEndpoint.substring(0, 120)}...`);

          const titleResponse = await fetchDrupal(titleEndpoint, {}, locale);
          console.log(
            `   Title response for ${contentType}: data=${titleResponse.data?.length || 0}`,
          );

          if (titleResponse.data && titleResponse.data.length > 0) {
            console.log(`✅ Found service by title in ${contentType}: ${slugToTitle}`);
            return {
              node: titleResponse.data[0],
              included: titleResponse.included || [],
            };
          }
        }
      } catch (error) {
        console.log(
          `   ❌ Error fetching ${contentType}:`,
          error instanceof Error ? error.message : error,
        );
        // Try next content type
        continue;
      }
    }

    console.log(`🔴 [FETCH SERVICE] NOT FOUND after trying all content types!`);

    return null;
  } catch (error) {
    console.error(`Failed to fetch service detail for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Extract target group from taxonomy term
 */
function extractTargetGroup(rels: any, included: DrupalIncludedEntity[]): string {
  if (!rels.field_target_group?.data) {
    return 'All users';
  }

  const targetGroupEntity = getRelated(rels, 'field_target_group', included);
  if (!targetGroupEntity) {
    return 'All users';
  }

  const targetGroupTerm = Array.isArray(targetGroupEntity)
    ? targetGroupEntity[0]
    : targetGroupEntity;

  return (targetGroupTerm as DrupalTaxonomyEntity)?.attributes?.name || 'All users';
}

function extractTaxonomyLabels(
  rels: any,
  included: DrupalIncludedEntity[],
  fieldName: string,
): string[] {
  const related = getRelated(rels, fieldName, included);
  if (!related) return [];

  const items = Array.isArray(related) ? related : [related];
  return items
    .map((item: any) => (item as DrupalTaxonomyEntity)?.attributes?.name)
    .filter((name: string | undefined) => Boolean(name));
}

function dedupeLabels(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Transform Drupal node to ServiceDetail
 */
export function transformServiceDetail(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): ServiceDetail {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Extract category from taxonomy
  const categoryRel = rels.field_ip_category?.data;
  let category = attrs.field_category || 'Services';

  if (categoryRel) {
    const categoryEntity = included.find(
      (inc: any) => inc.id === (Array.isArray(categoryRel) ? categoryRel[0]?.id : categoryRel.id),
    );
    if (categoryEntity) {
      category = (categoryEntity as DrupalTaxonomyEntity).attributes?.name || category;
    }
  }

  const labels = dedupeLabels([
    ...(category ? [category] : []),
    ...extractTaxonomyLabels(rels, included, 'field_type'),
    ...extractTaxonomyLabels(rels, included, 'field_label'),
  ]);

  // Extract steps
  const stepsEntities = getRelated(rels, 'field_steps', included) || [];
  console.log(
    `🔍 Steps entities:`,
    Array.isArray(stepsEntities) ? stepsEntities.length : 'not array',
    stepsEntities,
  );

  const steps = Array.isArray(stepsEntities)
    ? stepsEntities.map((step: any, index: number) => {
        console.log(`   Step ${index + 1}:`, {
          number: step.attributes?.field_step_number,
          title: step.attributes?.field_step_title,
          hasDetails: !!step.attributes?.field_step_details,
        });
        return {
          number: step.attributes?.field_step_number || index + 1,
          title: step.attributes?.field_step_title || `Step ${index + 1}`,
          description: extractText(step.attributes?.field_step_details) || '',
        };
      })
    : [];

  // Extract requirements (text_long field, split by newlines)
  let requirements: Array<{ title: string; items: string[] }> = [];
  if (attrs.field_requirements?.value) {
    const requirementsText = extractText(attrs.field_requirements.value);
    const items = requirementsText
      .split('\n')
      .map((line: string) => line.trim())
      .filter(Boolean);
    if (items.length > 0) {
      requirements = [
        {
          title: 'requirements',
          items,
        },
      ];
    }
  }

  // Build base service object
  const service: ServiceDetail = {
    id: node.attributes.drupal_internal__nid?.toString() || node.id,
    slug: attrs.field_slug || '',
    title: attrs.title || 'Service',
    description: extractText(attrs.field_description) || extractText(attrs.body) || '',
    category,
    labels,

    executionTime: attrs.field_duration || attrs.field_execution_time || '5-10 business days',
    serviceFee: attrs.field_cost || attrs.field_service_fee || 'Free',
    targetGroup: extractTargetGroup(rels, included),
    serviceChannel: attrs.field_service_channel || 'Online',
    faqHref:
      attrs.field_faq_link?.uri || attrs.field_faq_link?.value || '/resources/ip-information/faq',
    platformHref:
      attrs.field_platform_link?.uri ||
      attrs.field_platform_link?.value ||
      attrs.field_external_link?.uri ||
      'https://ip.saip.gov.sa',
    secondaryButtonLabel: attrs.field_secondary_button_label || '',
    secondaryButtonHref: attrs.field_secondary_button_href || '',

    tabs: [
      { id: 'steps', label: 'steps' },
      { id: 'requirements', label: 'requirements' },
    ],

    steps,
    requirements,
    relatedServices: [], // Will be populated below
  };

  // Transform related services if available
  const relatedServicesRaw = getRelated(rels, 'field_related_services', included) || [];
  const relatedServicesData = Array.isArray(relatedServicesRaw)
    ? relatedServicesRaw
    : [relatedServicesRaw];
  console.log(`🔍 RELATED SERVICES DEBUG:`);
  console.log(`   field_related_services in rels:`, rels?.field_related_services);
  console.log(`   rels.field_related_services.data:`, rels?.field_related_services?.data);
  console.log(`   getRelated returned:`, relatedServicesData.length, 'items');
  console.log(`   included count:`, included.length);
  console.log(`   included types:`, included.map((i) => i.type).join(', '));
  if (
    relatedServicesData.length === 0 &&
    rels?.field_related_services?.data &&
    Array.isArray(rels.field_related_services.data)
  ) {
    console.log(`   ❌ MISMATCH! Expected ${rels.field_related_services.data.length} but got 0`);
    console.log(
      `   Looking for:`,
      rels.field_related_services.data.map((d: any) => `${d.type}:${d.id.substring(0, 8)}`),
    );
    console.log(
      `   Available in included:`,
      included
        .filter((i) => i.type === 'node--service_item')
        .map((i) => `${i.type}:${i.id.substring(0, 8)}`),
    );
  }
  if (Array.isArray(relatedServicesData) && relatedServicesData.length > 0) {
    service.relatedServices = relatedServicesData.map((relatedService: any) => {
      const relAttrs = relatedService.attributes || {};
      const relRels = relatedService.relationships || {};

      const relatedCategoryLabels = extractTaxonomyLabels(relRels, included, 'field_ip_category');
      const relatedCategory = relatedCategoryLabels[0] || category;
      const typeLabelsRaw = extractTaxonomyLabels(relRels, included, 'field_type');
      const typeLabels = typeLabelsRaw
        .map((label) => normalizeServiceTypeKey(label) || label)
        .filter(Boolean);
      const extraLabels = extractTaxonomyLabels(relRels, included, 'field_label');
      const labels = dedupeLabels([...typeLabels, ...extraLabels, relatedCategory]);

      // Map category to English slug (works for both EN and AR category names)
      const CATEGORY_SLUG_MAP: Record<string, string> = {
        Patents: 'patents',
        Trademarks: 'trademarks',
        Copyrights: 'copyrights',
        Designs: 'designs',
        'Plant Varieties': 'plant-varieties',
        'Topographic Designs': 'layout-designs-of-integrated-circuits',
        'براءات الاختراع': 'patents',
        'العلامات التجارية': 'trademarks',
        'حقوق النشر': 'copyrights',
        التصاميم: 'designs',
        'الأصناف النباتية': 'plant-varieties',
        'التصاميم الطبوغرافية': 'layout-designs-of-integrated-circuits',
        General: 'general',
        عام: 'general',
      };

      const categorySlug =
        CATEGORY_SLUG_MAP[relatedCategory] || relatedCategory.toLowerCase().replace(/\s+/g, '-');
      const baseHref = `/services/${categorySlug}/${relAttrs.field_slug || relatedService.id}`;
      const href = locale === 'ar' ? `/ar${baseHref}` : baseHref;

      return {
        title: relAttrs.title || 'Service',
        labels,
        description: extractText(relAttrs.field_description) || extractText(relAttrs.body) || '',
        primaryButtonLabel: 'View details',
        primaryButtonHref: href,
      };
    });
  }

  return service;
}

/**
 * Get service detail with fallback
 */
export async function getServiceDetailBySlug(
  slug: string,
  locale?: string,
): Promise<ServiceDetail | null> {
  try {
    const result = await fetchServiceDetailBySlug(slug, locale);

    if (!result) {
      console.log(`🔴 SERVICE DETAIL: Not found for slug ${slug}`);
      return getServiceDetailFallback(slug);
    }

    console.log(`🔍 SERVICE DETAIL: Transforming data for ${slug}`);
    console.log(`   Node relationships:`, Object.keys(result.node.relationships || {}));
    console.log(`   Included count: ${result.included.length}`);

    // Fetch paragraph entities separately (JSON:API doesn't include them by default for entity_reference_revisions)
    const stepsData = result.node.relationships?.field_steps?.data;
    if (stepsData && Array.isArray(stepsData) && stepsData.length > 0) {
      console.log(`🔍 Found ${stepsData.length} step references, fetching paragraphs...`);

      try {
        const paragraphIds = stepsData.map((s: any) => s.id).join(',');
        const paragraphsEndpoint = `/paragraph/service_step?filter[id][operator]=IN&filter[id][value]=${paragraphIds}`;
        const paragraphsResponse = await fetchDrupal(paragraphsEndpoint, {}, locale);

        if (paragraphsResponse.data && paragraphsResponse.data.length > 0) {
          console.log(`✅ Fetched ${paragraphsResponse.data.length} paragraph entities`);
          result.included = [...result.included, ...paragraphsResponse.data];
        }
      } catch (paraError) {
        console.log(`⚠️ Failed to fetch paragraphs:`, paraError);
      }
    }

    const service = transformServiceDetail(result.node, result.included, locale);
    console.log(`✅ SERVICE DETAIL: Using Drupal for ${slug} (${locale})`);
    console.log(`   Steps: ${service.steps.length}`);
    console.log(`   Requirements: ${service.requirements.length}`);
    console.log(`   Related: ${service.relatedServices.length}`);
    return service;
  } catch (error) {
    console.log(`🔴 SERVICE DETAIL: Error for ${slug}, using fallback`, error);
    return getServiceDetailFallback(slug);
  }
}

/**
 * Fetch related services by category
 */
export async function fetchRelatedServicesByCategory(
  categoryName: string,
  currentServiceId: string,
  locale?: string,
  limit: number = 3,
): Promise<Array<{ title: string; description: string; href: string }>> {
  try {
    const includeFields = ['field_ip_category', 'field_type'];
    const endpoint = `/node/service_item?filter[status]=1&include=${includeFields.join(',')}&page[limit]=10`;

    const response = await fetchDrupal(endpoint, {}, locale);

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Filter by category and exclude current service
    const relatedServices = response.data
      .filter((node: DrupalNode) => {
        // Exclude current service
        const nodeId = node.attributes.drupal_internal__nid?.toString() || node.id;
        if (nodeId === currentServiceId) return false;

        // Check if category matches
        const categoryRel = node.relationships?.field_ip_category?.data;
        if (!categoryRel) return false;

        const categoryEntity = response.included?.find(
          (inc: any) =>
            inc.id === (Array.isArray(categoryRel) ? categoryRel[0]?.id : categoryRel.id),
        );

        const categoryEntityName = (categoryEntity as DrupalTaxonomyEntity)?.attributes?.name;
        return categoryEntityName === categoryName;
      })
      .slice(0, limit)
      .map((node: DrupalNode) => {
        const attrs = node.attributes as any;
        const slug = attrs.field_slug || attrs.title?.toLowerCase().replace(/\s+/g, '-') || '';

        // Get category for href construction
        const categoryRel = node.relationships?.field_ip_category?.data;
        const categoryEntity = categoryRel
          ? response.included?.find(
              (inc: any) =>
                inc.id === (Array.isArray(categoryRel) ? categoryRel[0]?.id : categoryRel.id),
            )
          : null;
        const category = (categoryEntity as DrupalTaxonomyEntity)?.attributes?.name || 'services';
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

        return {
          title: attrs.title || 'Service',
          description: extractText(attrs.field_description) || extractText(attrs.body) || '',
          href: `/services/${categorySlug}/${slug}`,
        };
      });

    console.log(
      `✅ Found ${relatedServices.length} related services for category: ${categoryName}`,
    );
    return relatedServices;
  } catch (error) {
    console.error('Error fetching related services:', error);
    return [];
  }
}

/**
 * Fallback data for service details
 */
function getServiceDetailFallback(slug: string): ServiceDetail {
  const fallbacks: Record<string, Partial<ServiceDetail>> = {
    pct: {
      title: 'Patent Cooperation Treaty (PCT)',
      description:
        'File a single international patent application to seek protection in multiple countries.',
      category: 'Patents',
    },
    pph: {
      title: 'Patent Prosecution Highway (PPH)',
      description: 'Accelerate patent examination process through international cooperation.',
      category: 'Patents',
    },
    'patent-application': {
      title: 'Patent Application',
      description: 'Apply for a patent to protect your invention.',
      category: 'Patents',
    },
    'copyright-complaint': {
      title: 'Complaint of Copyright Infringement',
      description: 'Report copyright infringement and protect your rights.',
      category: 'IP Infringement',
    },
    'trademark-complaint': {
      title: 'Complaint of Trademark Infringement',
      description: 'Report trademark infringement and protect your brand.',
      category: 'IP Infringement',
    },
  };

  const base: ServiceDetail = {
    id: slug,
    slug,
    title: 'Service',
    description: 'Service description',
    category: 'Services',
    labels: ['Services'],
    executionTime: '5-10 business days',
    serviceFee: 'Free',
    targetGroup: 'All users',
    serviceChannel: 'Online',
    faqHref: '/resources/ip-information/faq',
    platformHref: 'https://ip.saip.gov.sa',
    secondaryButtonLabel: '',
    secondaryButtonHref: '',
    tabs: [
      { id: 'steps', label: 'steps' },
      { id: 'requirements', label: 'requirements' },
    ],
    steps: [
      { number: 1, title: 'Prepare documentation', description: 'Gather all required documents' },
      { number: 2, title: 'Submit application', description: 'Fill out the application form' },
      { number: 3, title: 'Pay fees', description: 'Complete payment process' },
    ],
    requirements: [
      {
        title: 'Required Documents',
        items: ['Valid ID', 'Application form', 'Supporting documents'],
      },
    ],
    relatedServices: [],
  };

  return {
    ...base,
    ...fallbacks[slug],
  };
}
