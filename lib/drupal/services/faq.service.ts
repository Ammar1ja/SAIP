/**
 * FAQ Service
 * Handles data fetching and transformation for FAQ page
 */

import { fetchDrupal, extractText, getImageUrl, getRelated } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';

// Frontend data interfaces
export interface FaqCategoryData {
  id: string;
  label: string;
  questions: FaqQuestionData[];
  services?: string[];
}

export interface FaqQuestionData {
  id: string;
  title: string;
  description: string;
  lastUpdate?: string;
  services?: string[];
}

export interface FaqPageData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  categories: FaqCategoryData[];
}

// Drupal API functions
export async function fetchFaqPage(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = 'field_hero_background_image,field_hero_background_image.field_media_image';
  const endpoint = `/node/faq_page?filter[status]=1&include=${includeFields}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

export async function fetchFaqCategories(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  const endpoint = `/node/faq_category?filter[status]=1&sort=field_weight&include=field_related_services,field_ip_categories`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

export async function fetchFaqQuestions(locale?: string): Promise<DrupalResponse<DrupalNode>> {
  // Include category reference to allow grouping
  const endpoint = `/node/faq_item?filter[status]=1&sort=field_weight&include=field_faq_category,field_related_services`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformFaqData(
  pageNode: DrupalNode | null,
  categories: (DrupalNode | DrupalIncludedEntity)[],
  questions: (DrupalNode | DrupalIncludedEntity)[],
  included: DrupalIncludedEntity[] = [],
): FaqPageData {
  // Group questions by category
  const categoriesMap = new Map<string, FaqCategoryData>();

  // Initialize categories - use UUID as map key
  categories.forEach((cat) => {
    const attrs = (cat.attributes || {}) as any;
    const categoryRels = cat.relationships || {};
    const relatedServices = getRelated(categoryRels, 'field_related_services', included);
    const ipCategoryTerm = getRelated(categoryRels, 'field_ip_categories', included);
    const relatedServicesArray = Array.isArray(relatedServices)
      ? relatedServices
      : relatedServices
        ? [relatedServices]
        : [];
    const services = Array.from(
      new Set(
        relatedServicesArray
          .map((service: any) => {
            const serviceAttrs = (service?.attributes || {}) as any;
            return (
              extractText(serviceAttrs.field_title) ||
              extractText(serviceAttrs.title) ||
              serviceAttrs.title ||
              ''
            );
          })
          .filter(Boolean),
      ),
    );

    // Use field_category_id (e.g. "patents") as the display ID
    const categoryId = extractText(attrs.field_category_id) || cat.id || '';
    const ipCategoryLabel = Array.isArray(ipCategoryTerm)
      ? extractText((ipCategoryTerm[0] as any)?.attributes?.name)
      : extractText((ipCategoryTerm as any)?.attributes?.name);
    // Prefer taxonomy (ip_categories) label, fallback to FAQ category title.
    const categoryLabel =
      ipCategoryLabel ||
      extractText(attrs.field_title) ||
      extractText(attrs.title) ||
      'Untitled Category';

    // Map key is UUID (cat.id), value.id is the category_id (string like "patents")
    categoriesMap.set(cat.id, {
      id: categoryId,
      label: categoryLabel,
      questions: [],
      services,
    });
  });

  // Add questions to categories
  questions.forEach((question) => {
    const attrs = question.attributes as any;
    const questionRels = question.relationships || {};
    const categoryEntity = getRelated(questionRels, 'field_faq_category', included);

    let categoryUuid: string | null = null;

    if (categoryEntity) {
      const cat = Array.isArray(categoryEntity) ? categoryEntity[0] : categoryEntity;
      if (cat && cat.id) {
        categoryUuid = cat.id; // This is the UUID
      }
    } else {
      const relData = questionRels?.field_faq_category?.data as any;
      if (Array.isArray(relData) && relData[0]?.id) {
        categoryUuid = relData[0].id;
      } else if (relData?.id) {
        categoryUuid = relData.id;
      }
    }

    if (!categoryUuid) {
      const generalEntry = Array.from(categoriesMap.entries()).find(
        ([, cat]) => cat.id === 'general',
      );
      categoryUuid = generalEntry?.[0] || null;
    }

    // Look up category by UUID
    if (categoryUuid && categoriesMap.has(categoryUuid)) {
      const category = categoriesMap.get(categoryUuid)!;
      const relatedServices = getRelated(questionRels, 'field_related_services', included);
      const relatedServicesArray = Array.isArray(relatedServices)
        ? relatedServices
        : relatedServices
          ? [relatedServices]
          : [];
      const services = Array.from(
        new Set(
          relatedServicesArray
            .map((service: any) => {
              const serviceAttrs = (service?.attributes || {}) as any;
              return (
                extractText(serviceAttrs.field_title) ||
                extractText(serviceAttrs.title) ||
                serviceAttrs.title ||
                ''
              );
            })
            .filter(Boolean),
        ),
      );

      const title =
        extractText(attrs.field_question) ||
        extractText(attrs.field_title) ||
        extractText(attrs.title) ||
        'Untitled Question';

      const description =
        extractText(attrs.field_description) || extractText(attrs.field_answer) || '';

      const lastUpdate = (attrs.changed ||
        attrs.field_changed ||
        (question.attributes as any)?.changed) as string | undefined;

      category.questions.push({
        id: attrs.field_question_id || question.id,
        title,
        description,
        lastUpdate,
        services,
      });
    }
  });

  // Get hero data from page node
  const pageAttrs = (pageNode?.attributes || {}) as any;
  const pageRels = pageNode?.relationships || {};
  const heroImageEntity = getRelated(
    pageRels,
    'field_hero_background_image',
    included,
  ) as DrupalIncludedEntity | null;
  const heroImageUrl = heroImageEntity ? getImageUrl(heroImageEntity, included) : undefined;

  return {
    heroHeading: extractText(pageAttrs.field_hero_heading) || pageAttrs.title || 'FAQs',
    heroSubheading:
      extractText(pageAttrs.field_hero_subheading) || 'Find answers to frequently asked questions',
    heroImage: heroImageUrl ? { src: heroImageUrl, alt: 'FAQ Hero' } : undefined,
    categories: Array.from(categoriesMap.values()),
  };
}

export function getFaqFallbackData(): FaqPageData {
  return {
    heroHeading: 'FAQs',
    heroSubheading: 'Find answers to frequently asked questions',
    categories: [
      {
        id: 'general',
        label: 'General questions',
        services: [],
        questions: [
          {
            id: 'q1',
            title: 'What does the term "intellectual property" mean?',
            description:
              'Intellectual property (IP) refers to creations of the mind, such as inventions, literary and artistic works, and symbols, names and images used in commerce.',
          },
          {
            id: 'q2',
            title: 'What is the role of the SAIP?',
            description:
              'The Saudi Authority for Intellectual Property (SAIP) is a body specialized in regulating the fields of intellectual property, protecting the rights of owners in various fields, and raising awareness about the importance of this domain.',
          },
        ],
      },
      {
        id: 'patents',
        label: 'Patents',
        services: [],
        questions: [
          {
            id: 'q10',
            title: 'How long does a patent last?',
            description:
              'A patent typically lasts for 20 years from the filing date, provided renewal fees are paid.',
          },
        ],
      },
      {
        id: 'trademarks',
        label: 'Trademarks',
        services: [],
        questions: [
          {
            id: 'q11',
            title: 'What is a trademark?',
            description:
              'A trademark includes names, words, symbols, numbers, images, patterns, colors, or combinations of these, used to distinguish goods or services.',
          },
        ],
      },
      {
        id: 'copyrights',
        label: 'Copyrights',
        services: [],
        questions: [],
      },
      {
        id: 'designs',
        label: 'Designs',
        services: [],
        questions: [],
      },
      {
        id: 'topographic',
        label: 'Topographic Design of Integrated Circuits',
        services: [],
        questions: [],
      },
      {
        id: 'plant-varieties',
        label: 'Plant varieties',
        services: [],
        questions: [],
      },
      {
        id: 'licenses',
        label: 'Licenses',
        services: [],
        questions: [],
      },
    ],
  };
}

export async function getFaqPageData(locale?: string): Promise<FaqPageData> {
  try {
    // Step 1: Get UUIDs from EN version (always exists)
    const initialPageResponse = await fetchDrupal<DrupalNode>(
      '/node/faq_page?filter[status][value]=1',
      {},
      'en',
    );

    const initialData = Array.isArray(initialPageResponse.data)
      ? initialPageResponse.data
      : initialPageResponse.data
        ? [initialPageResponse.data]
        : [];

    if (initialData.length === 0) {
      return getFaqFallbackData();
    }

    const pageUuid = initialData[0].id;

    // Step 2: Fetch FAQ Page with UUID and locale to get translated content
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
    ];
    const pageResponse = await fetchDrupal<DrupalNode>(
      `/node/faq_page/${pageUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const pageNode = Array.isArray(pageResponse.data) ? pageResponse.data[0] : pageResponse.data;
    const pageIncluded = pageResponse.included || [];

    // Step 3: Get category UUIDs from EN, then fetch each by UUID with locale
    const categoriesEnResponse = await fetchFaqCategories('en');
    const categoriesEn = Array.isArray(categoriesEnResponse.data)
      ? categoriesEnResponse.data
      : [categoriesEnResponse.data];

    // Fetch each category by UUID with locale
    const categoriesPromises = categoriesEn.map((cat) =>
      fetchDrupal<DrupalNode>(
        `/node/faq_category/${cat.id}?include=field_related_services,field_ip_categories`,
        {},
        locale,
      ),
    );
    const categoriesResponses = await Promise.all(categoriesPromises);
    const categoriesData = categoriesResponses.map((r) =>
      Array.isArray(r.data) ? r.data[0] : r.data,
    );
    const categoriesIncluded = categoriesResponses.flatMap((r) => r.included || []);

    // Step 4: Get question UUIDs from EN, then fetch each by UUID with locale
    const questionsEnResponse = await fetchFaqQuestions('en');
    const questionsEn = Array.isArray(questionsEnResponse.data)
      ? questionsEnResponse.data
      : [questionsEnResponse.data];

    // Fetch each question by UUID with locale
    const questionsPromises = questionsEn.map((q) =>
      fetchDrupal<DrupalNode>(
        `/node/faq_item/${q.id}?include=field_faq_category,field_related_services`,
        {},
        locale,
      ),
    );
    const questionsResponses = await Promise.all(questionsPromises);
    const questionsData = questionsResponses.map((r) =>
      Array.isArray(r.data) ? r.data[0] : r.data,
    );
    const questionsIncluded = questionsResponses.flatMap((r) => r.included || []);

    // Step 5: Transform the data
    const data = transformFaqData(pageNode, categoriesData, questionsData, [
      ...pageIncluded,
      ...questionsIncluded,
      ...categoriesIncluded,
    ]);

    return data;
  } catch (error) {
    console.error('FAQ: Error fetching data', error);
    return getFaqFallbackData();
  }
}
