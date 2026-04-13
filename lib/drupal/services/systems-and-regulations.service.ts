import { fetchDrupal, getApiUrl } from '../utils';
import { getRelated, getImageWithAlt, extractText, getProxyUrl } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { systemsRegulationsData } from '@/app/[locale]/resources/lows-and-regulations/systems-and-regulations/SystemsAndRegulationsSection.data';

// Frontend interface for Systems and Regulations
export interface RegulationItem {
  title: string;
  publicationNumber: string;
  durationDate: string;
  durationDateValue?: string;
  description?: string;
  labels: string[];
  type?: string;
  category?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  [key: string]: unknown; // Index signature for FilterableItem compatibility
}

export interface SystemsAndRegulationsData {
  hero: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  overview: {
    heading: string;
    description: string;
  };
  regulations: RegulationItem[];
  filterFields: Array<{
    id: string;
    type: 'search' | 'select' | 'date';
    label: string; // Required for FilterField compatibility
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    multiselect?: boolean;
    variant?: 'single' | 'range'; // For date range support
    restrictFutureDates?: boolean;
  }>;
}

const documentCategoriesFallback = [
  { en: 'General', ar: 'عام' },
  { en: 'Patents', ar: 'براءات اختراع' },
  { en: 'Trademarks', ar: 'علامات تجارية' },
  { en: 'Copyrights', ar: 'حقوق نشر' },
  { en: 'Designs', ar: 'تصاميم' },
  {
    en: 'Topographic designs of integrated circuits',
    ar: 'التصاميم الطوبوغرافية للدوائر المتكاملة',
  },
  { en: 'Plants varieties', ar: 'أصناف النباتات' },
  { en: 'IP academy', ar: 'أكاديمية الملكية الفكرية' },
  { en: 'IP clinics', ar: 'عيادات الملكية الفكرية' },
  { en: 'IP licensing', ar: 'ترخيص الملكية الفكرية' },
  { en: 'IP infringement', ar: 'التعدي على الملكية الفكرية' },
  { en: 'IP dispute resolution committees', ar: 'لجان تسوية منازعات الملكية الفكرية' },
  {
    en: 'National network of IP support centers',
    ar: 'الشبكة الوطنية لمراكز دعم الملكية الفكرية',
  },
];

const buildDocumentCategoryOptions = (
  locale: string | undefined,
  categories: Array<{ label: string; value: string }>,
): Array<{ label: string; value: string }> => {
  const normalized = new Map<string, { label: string; value: string }>();

  categories.forEach((category) => {
    const label = category.label?.trim();
    if (!label) return;
    const key = label.toLowerCase();
    if (!normalized.has(key)) {
      normalized.set(key, { label, value: category.value || label });
    }
  });

  const fallbackLabels = documentCategoriesFallback.map((entry) =>
    (locale === 'ar' ? entry.ar : entry.en).trim(),
  );

  fallbackLabels.forEach((label) => {
    if (!label) return;
    const key = label.toLowerCase();
    if (!normalized.has(key)) {
      normalized.set(key, { label, value: label });
    }
  });

  const orderMap = new Map(fallbackLabels.map((label, index) => [label.toLowerCase(), index]));

  return Array.from(normalized.values()).sort((a, b) => {
    const indexA = orderMap.get(a.label.toLowerCase());
    const indexB = orderMap.get(b.label.toLowerCase());

    if (indexA === undefined && indexB === undefined) {
      return a.label.localeCompare(b.label);
    }
    if (indexA === undefined) return 1;
    if (indexB === undefined) return -1;
    return indexA - indexB;
  });
};

// Fetch document categories taxonomy
export async function fetchDocumentCategories(
  locale?: string,
): Promise<Array<{ label: string; value: string }>> {
  try {
    const response = await fetchDrupal<DrupalIncludedEntity>(
      '/taxonomy_term/document_categories?filter[status]=1&sort=weight',
      {},
      locale,
    );
    const terms = response.data || [];

    return terms.map((term) => {
      const name = extractText((term.attributes as { name?: string })?.name) || '';
      return {
        label: name,
        value: name, // Use name as value for filtering
      };
    });
  } catch (error) {
    console.error('Failed to fetch document categories:', error);
    return [];
  }
}

// Drupal fetch function
export async function fetchSystemsAndRegulationsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  // Include regulations list with file and hero background image
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_regulations_list',
    'field_regulations_list.field_secondary_button_file',
  ];
  const endpoint = `/node/systems_regulations_page?filter[status]=1&include=${includeFields.join(',')}`;
  return await fetchDrupal<DrupalNode>(endpoint, {}, locale);
}

// Transform function
export function transformSystemsAndRegulationsPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
  categories: Array<{ label: string; value: string }> = [],
): SystemsAndRegulationsData {
  const attrs = node.attributes as Record<string, unknown>;
  const rels = node.relationships || {};

  // Get hero background image (media reference)
  // ✅ field_hero_background_image is an entity reference, so it's in relationships
  const heroImage = rels.field_hero_background_image?.data
    ? (() => {
        const imageRel = getRelated(rels, 'field_hero_background_image', included);

        if (imageRel && !Array.isArray(imageRel)) {
          const imageData = getImageWithAlt(imageRel, included);
          return imageData?.src ? imageData : null;
        }
        return null;
      })()
    : null;
  const heroImageUrl = heroImage?.src || '/images/laws/regulations.jpg';

  // Transform regulations from Drupal
  const regulationsData = getRelated(rels, 'field_regulations_list', included) || [];
  const regulations: RegulationItem[] = Array.isArray(regulationsData)
    ? (regulationsData as DrupalIncludedEntity[]).map((regNode) => {
        const regAttrs = regNode.attributes as Record<string, unknown>;
        const regRels = regNode.relationships || {};

        // Get file URL from field_secondary_button_file (direct file reference, like Guide Items)
        let fileUrl: string | undefined;
        if (regRels.field_secondary_button_file) {
          const fileEntity = getRelated(regRels, 'field_secondary_button_file', included);
          if (fileEntity && !Array.isArray(fileEntity)) {
            const uri = (fileEntity.attributes as { uri?: { url?: string } })?.uri?.url;
            if (uri) {
              // ✅ FIX: Use getApiUrl() instead of process.env for consistency
              const drupalBaseUrl = getApiUrl().replace('/jsonapi', '');
              fileUrl = uri.startsWith('http') ? uri : `${drupalBaseUrl}${uri}`;
            }
          }
        }

        // Parse labels (handle JSON string or array)
        let labelsRaw = regAttrs.field_labels || [];

        // If it's a JSON string, parse it
        if (typeof labelsRaw === 'string') {
          try {
            labelsRaw = JSON.parse(labelsRaw);
          } catch {
            // If parsing fails, treat as single label
            labelsRaw = [labelsRaw];
          }
        }

        const labels = Array.isArray(labelsRaw)
          ? labelsRaw
              .flatMap((item: string | { value?: string }) => {
                const rawValue = typeof item === 'string' ? item : item.value || '';
                const trimmed = rawValue.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                  try {
                    const parsed = JSON.parse(trimmed);
                    return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [trimmed];
                  } catch {
                    return [trimmed];
                  }
                }
                return trimmed ? [trimmed] : [];
              })
              .filter((label) => label !== '')
          : [];

        const title =
          extractText(regAttrs.field_regulation_title) ||
          extractText(regAttrs.title) ||
          'Untitled Regulation';
        const number = extractText(regAttrs.field_regulation_number) || '';
        const dateValue =
          typeof regAttrs.field_regulation_date === 'string' ? regAttrs.field_regulation_date : '';

        const typeFromLabels = labels.find(
          (label) =>
            label.toLowerCase().includes('system') ||
            label.toLowerCase().includes('regulation') ||
            label.toLowerCase().includes('نظام') ||
            label.toLowerCase().includes('لائحة'),
        );
        let type = typeFromLabels || '';
        if (!type && regAttrs.field_type) {
          const fieldType = Array.isArray(regAttrs.field_type)
            ? regAttrs.field_type[0]
            : regAttrs.field_type;
          type = typeof fieldType === 'string' ? fieldType : extractText(fieldType) || '';
        }

        if (type) {
          const typeLower = type.toLowerCase();
          type =
            typeLower.includes('system') || typeLower.includes('نظام')
              ? locale === 'ar'
                ? 'نظام'
                : 'System'
              : locale === 'ar'
                ? 'لائحة'
                : 'Regulation';
        }
        const category =
          labels.find(
            (label) =>
              !label.toLowerCase().includes('system') &&
              !label.toLowerCase().includes('regulation') &&
              !label.toLowerCase().includes('نظام') &&
              !label.toLowerCase().includes('لائحة'),
          ) ||
          labels[0] ||
          '';

        return {
          title,
          publicationNumber: number,
          durationDate: dateValue
            ? new Date(dateValue).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
            : '',
          durationDateValue: dateValue || undefined,
          labels,
          type,
          category,
          primaryButtonLabel: locale === 'ar' ? 'تحميل' : 'Download',
          primaryButtonHref: getProxyUrl(fileUrl, 'download'),
          secondaryButtonLabel: locale === 'ar' ? 'عرض' : 'View',
          secondaryButtonHref: getProxyUrl(fileUrl, 'view'),
        };
      })
    : [];

  return {
    hero: {
      title:
        extractText(attrs.field_hero_heading) ||
        (locale === 'ar' ? 'الأنظمة واللوائح' : 'Systems and Regulations'),
      description:
        extractText(attrs.field_hero_subheading) ||
        (locale === 'ar'
          ? 'الوصول إلى الإطار القانوني الكامل الذي يحكم الملكية الفكرية في المملكة العربية السعودية.'
          : 'Access the complete legal framework governing intellectual property in Saudi Arabia.'),
      backgroundImage: heroImageUrl,
    },
    overview: {
      heading:
        extractText((attrs as Record<string, unknown>).field_overview_heading) ||
        (locale === 'ar' ? 'الإطار القانوني للملكية الفكرية' : 'IP Legal Framework'),
      description:
        locale === 'ar'
          ? 'مجموعة شاملة من القوانين واللوائح والقواعد التنفيذية لحماية وإنفاذ الملكية الفكرية.'
          : 'Comprehensive collection of laws, regulations, and implementing rules for intellectual property protection and enforcement.',
    },
    regulations,
    filterFields: [
      {
        id: 'search',
        type: 'search' as const,
        label: locale === 'ar' ? 'بحث' : 'Search',
        placeholder:
          locale === 'ar' ? 'ابحث عن النظام أو اللائحة' : 'Search for a system or regulation',
      },
      {
        id: 'date',
        type: 'date' as const,
        variant: 'range' as const,
        label: locale === 'ar' ? 'التاريخ' : 'Date',
        placeholder: locale === 'ar' ? 'اختر التاريخ' : 'Select date',
        restrictFutureDates: true,
      },
      {
        id: 'category',
        type: 'select' as const,
        label: locale === 'ar' ? 'الفئة' : 'Category',
        placeholder: locale === 'ar' ? 'اختر' : 'Select',
        multiselect: true,
        options: categories.filter((cat) => {
          const valueLower = cat.value?.toLowerCase().trim() || '';
          const labelLower = cat.label?.toLowerCase().trim() || '';
          return (
            valueLower !== 'all' &&
            labelLower !== 'all' &&
            valueLower !== 'الكل' &&
            labelLower !== 'الكل' &&
            valueLower !== '' &&
            labelLower !== ''
          );
        }),
      },
      {
        id: 'type',
        type: 'select' as const,
        label: locale === 'ar' ? 'النوع' : 'Type',
        placeholder: locale === 'ar' ? 'اختر' : 'Select',
        options: [
          { label: locale === 'ar' ? 'الكل' : 'All', value: 'All' },
          { label: locale === 'ar' ? 'نظام' : 'System', value: 'System' },
          { label: locale === 'ar' ? 'لائحة' : 'Regulation', value: 'Regulation' },
        ],
      },
    ],
  };
}

// Fallback data function
export function getSystemsAndRegulationsFallbackData(locale?: string): SystemsAndRegulationsData {
  const dummyNode: DrupalNode = {
    id: 'fallback',
    type: 'systems_and_regulations_page',
    attributes: {
      drupal_internal__nid: 0,
      title: locale === 'ar' ? 'الأنظمة واللوائح' : 'Systems and Regulations',
      created: new Date().toISOString(),
      changed: new Date().toISOString(),
      status: true,
      field_hero_heading: locale === 'ar' ? 'الأنظمة واللوائح' : 'Systems and Regulations',
      field_hero_subheading: {
        value:
          locale === 'ar'
            ? 'الوصول إلى الإطار القانوني الكامل الذي يحكم الملكية الفكرية في المملكة العربية السعودية.'
            : 'Access the complete legal framework governing intellectual property in Saudi Arabia.',
        format: 'plain_text',
      },
      field_overview_heading:
        locale === 'ar' ? 'الإطار القانوني للملكية الفكرية' : 'IP Legal Framework',
    },
    relationships: {
      field_regulations_list: {
        data: systemsRegulationsData.map((_, index: number) => ({
          id: `fallback-${index}`,
          type: 'regulation',
        })),
      },
    },
  };

  const dummyIncluded: DrupalIncludedEntity[] = systemsRegulationsData.map(
    (
      item: {
        title: string;
        publicationNumber: string;
        durationDate: string;
        durationDateValue?: string;
        labels: string[];
        primaryButtonHref?: string;
        secondaryButtonHref?: string;
      },
      index: number,
    ) => {
      const entity: DrupalIncludedEntity = {
        id: `fallback-${index}`,
        type: 'regulation',
        attributes: {
          field_regulation_title: item.title,
          field_regulation_number: item.publicationNumber,
          field_regulation_date: item.durationDateValue || item.durationDate,
          field_labels: JSON.stringify(item.labels),
        },
      };

      if (item.secondaryButtonHref) {
        entity.relationships = {
          field_secondary_button_file: {
            data: {
              id: `file-${index}`,
              type: 'file',
            },
          },
        };
      }

      return entity;
    },
  );

  const categories = [
    { value: 'General', label: 'General' },
    { value: 'Trademarks', label: 'Trademarks' },
    { value: 'Patents', label: 'Patents' },
    { value: 'Copyrights', label: 'Copyrights' },
    { value: 'Designs', label: 'Designs' },
    {
      value: 'Topographic designs of integrated circuits',
      label: 'Topographic designs of integrated circuits',
    },
    { value: 'Plants varieties', label: 'Plants varieties' },
    { value: 'IP academy', label: 'IP academy' },
    { value: 'IP clinics', label: 'IP clinics' },
    { value: 'IP licensing', label: 'IP licensing' },
    { value: 'IP infringement', label: 'IP infringement' },
    {
      value: 'IP dispute resolution committees',
      label: 'IP dispute resolution committees',
    },
    {
      value: 'National network of IP support centers',
      label: 'National network of IP support centers',
    },
  ];

  return transformSystemsAndRegulationsPage(dummyNode, dummyIncluded, locale, categories);
}

// Main export function
export async function getSystemsAndRegulationsPageData(
  locale?: string,
): Promise<SystemsAndRegulationsData> {
  try {
    // Fetch categories and page data in parallel
    const [categoriesResponse, pageResponse] = await Promise.all([
      fetchDocumentCategories(locale),
      fetchSystemsAndRegulationsPage(locale),
    ]);

    const nodes = pageResponse.data;
    const included = pageResponse.included || [];
    const categories = buildDocumentCategoryOptions(locale, categoriesResponse);

    if (nodes.length === 0) {
      return getSystemsAndRegulationsFallbackData(locale);
    }

    const node = nodes[0];
    return transformSystemsAndRegulationsPage(node, included, locale, categories);
  } catch (error) {
    console.error('Systems and Regulations fetch error:', error);
    return getSystemsAndRegulationsFallbackData(locale);
  }
}
