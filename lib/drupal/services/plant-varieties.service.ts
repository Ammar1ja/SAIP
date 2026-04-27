import { fetchDrupal } from '../utils';
import {
  getRelated,
  getImageWithAlt,
  extractText,
  normalizeServiceTypeKey,
  getApiUrl,
  getProxyUrl,
  filterIncludedByLangcode,
} from '../utils';
import { DrupalIPCategoryPageNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { ROUTES } from '@/lib/routes';
import { getStatisticsForCategory, isStatisticsApiConfigured } from '@/lib/statistics-api';
import { PATENTS_DOMAIN_AR } from '@/lib/statistics-api/domains';
import {
  GuideCardData,
  PublicationCardData,
  StatisticsCardData,
  JourneySectionData,
  TOCItemData,
  ServiceItemData,
  ServiceOptionData,
  MediaTabData,
  MediaContentData,
  FilterFieldData,
  buildJourneySectionsHierarchy,
  buildJourneyTocItems,
} from './common-types';

// Frontend interfaces (same structure as Patents/Copyrights)
export interface PlantVarietiesData {
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

// Drupal API functions
export async function fetchPlantVarietiesPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  try {
    const endpoint = '/node/plant_varieties_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  } catch (error) {
    // Fallback to generic IP category page
    const endpoint = '/node/ip_category_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  }
}

// Reuse transformation functions from patents.service.ts
import {
  transformGuideItem,
  transformPublicationItem,
  transformStatisticsItem,
  transformJourneySection,
  transformMediaTab,
} from './patents.service';

export function transformPlantVarietiesPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
): PlantVarietiesData {
  const attrs = node.attributes as any;
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);
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
    ? getRelated(node.relationships, 'field_guide_items', included) || []
    : [];
  const guideItems = Array.isArray(guideItemsData)
    ? guideItemsData.map((item: DrupalIncludedEntity) => transformGuideItem(item, included))
    : [];

  // Get publication items
  const publicationItemsData = node.relationships?.field_publications_items
    ? getRelated(node.relationships, 'field_publications_items', included) || []
    : [];
  const publicationItems = Array.isArray(publicationItemsData)
    ? publicationItemsData.map((item: DrupalIncludedEntity) =>
        transformPublicationItem(item, included),
      )
    : [];

  // Get statistics items
  const statisticsItemsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', included) || []
    : [];
  const statisticsItems = Array.isArray(statisticsItemsData)
    ? statisticsItemsData.map((item: DrupalIncludedEntity) =>
        transformStatisticsItem(item, included),
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

  // Add child sections from included array (Level 2/3)
  const allJourneySections: DrupalIncludedEntity[] = Array.isArray(journeySectionsData)
    ? [...journeySectionsData]
    : [];

  effectiveIncluded.forEach((entity) => {
    if (entity.type !== 'node--journey_section') {
      return;
    }
    const sectionId = (entity as any).attributes?.field_section_id;
    if (
      level1SectionIds.includes(sectionId) ||
      allJourneySections.some((s) => (s as any).attributes?.field_section_id === sectionId)
    ) {
      return;
    }
    const parentRel = getRelated(
      (entity as any).relationships || {},
      'field_parent_section',
      effectiveIncluded,
    );
    if (parentRel && !Array.isArray(parentRel)) {
      const parentSectionId = (parentRel as any).attributes?.field_section_id;
      if (
        level1SectionIds.includes(parentSectionId) ||
        allJourneySections.some((s) => (s as any).attributes?.field_section_id === parentSectionId)
      ) {
        allJourneySections.push(entity);
      }
    } else if ((entity as any).relationships?.field_parent_section?.data?.id) {
      allJourneySections.push(entity);
    }
  });

  // Transform all sections
  const transformedSections = Array.isArray(allJourneySections)
    ? allJourneySections.map((section: DrupalIncludedEntity) => {
        const transformed = transformJourneySection(section, effectiveIncluded);
        const sectionId = (section as any).attributes?.field_section_id || 'section';
        return { id: sectionId, section: transformed };
      })
    : [];

  // Build hierarchy using helper function
  const { sections: journeySections, sectionIds } =
    buildJourneySectionsHierarchy(transformedSections);

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', included) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => transformMediaTab(tab, included))
    : [];

  // Get services items
  const servicesItemsData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', included) || []
    : [];
  const servicesItems = Array.isArray(servicesItemsData)
    ? servicesItemsData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        const relationships = (item as any).relationships || {};

        const href = attrs.field_href || attrs.field_link?.uri?.replace('internal:', '') || '#';

        // Get service type (Protection, Management, etc.) from taxonomy
        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', included) || []
          : [];
        const serviceTypeEntity = Array.isArray(serviceTypeTerms)
          ? serviceTypeTerms[0]
          : serviceTypeTerms;
        const serviceType = (serviceTypeEntity as any)?.attributes?.name || '';

        const serviceTypeKey = normalizeServiceTypeKey(serviceType);
        const labels = serviceTypeKey ? [serviceTypeKey] : serviceType ? [serviceType] : [];

        const targetGroupTerms = relationships.field_target_group
          ? getRelated(relationships, 'field_target_group', included) || []
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
          href: href,
          primaryButtonLabel: attrs.field_primary_button_label || 'View details',
          primaryButtonHref: href,
          targetGroups,
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Plant Varieties overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Plant variety protection supports breeders by securing exclusive rights to new plant varieties.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title: extractText(attrs.field_overview_header_title) || 'Information library',
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) || 'Watch the video and learn the key steps involved in plant varieties.',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'Plant Varieties Guide',
        guideCards: guideItems,
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle: extractText(attrs.field_publications_title) || 'Publications',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          'The plant varieties publications provides important updates and information on plant variety procedures.',
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
      sectionIds,
      sections: journeySections,
      tocItems: buildJourneyTocItems(journeySections),
      tocAriaLabel: 'Plant varieties journey navigation',
    },
    services: {
      title: extractText(attrs.field_services_title) || 'Plant Varieties services',
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
      heroTitle: 'Media for plant varieties',
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
            'Get the latest information on plant varieties in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about plant varieties.',
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
      badgeLabel: 'Plant Varieties',
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

export function getPlantVarietiesFallbackData(): PlantVarietiesData {
  // Simple fallback data without external dependencies
  const overviewHeader = {
    title: 'Information library',
    description: 'Watch the video and learn the key steps involved in plant varieties.',
    videoSrc: undefined,
    videoPoster: undefined,
  };
  const overviewGuide = {
    guideTitle: 'Plant Varieties Guide',
    ctaLabel: 'Go to Guidelines',
    ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
    guideCards: [
      {
        title: 'Plant Variety Protection Guide',
        description: 'Learn how to protect new plant varieties through the PVP system',
        labels: ['Plant Varieties'],
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/pvp-guide.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/pvp-guide.pdf',
        titleBg: 'green' as const,
      },
    ],
  };
  const overviewPublications = {
    publications: [
      {
        title: 'Plant Variety publication 7001',
        description: '',
        labels: ['Plant Varieties'],
        publicationNumber: '700145678',
        durationDate: '01.10 - 01.12.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/pv-publication-7001.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/pv-publication-7001.pdf',
        titleBg: 'green' as const,
      },
    ],
    publicationsTitle: 'Publications',
    publicationsDescription:
      'The plant variety publications provides important updates and information on plant variety procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
    publicationsCtaLabel: 'View more publication',
    publicationsCtaHref: '/resources/publications',
  };
  const overviewStatistics = {
    statistics: [
      {
        label: 'Number of plant varieties applications in 2023',
        value: 4076,
        icon: 'plant',
        chartType: 'line' as const,
        chartData: [
          { value: 3200 },
          { value: 3400 },
          { value: 3300 },
          { value: 3600 },
          { value: 3800 },
          { value: 3700 },
          { value: 3900 },
          { value: 4076 },
        ],
        trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
      },
      {
        label: 'Number of registered plant varieties in 2023',
        value: 4011,
        icon: 'plant',
        chartType: 'line' as const,
        chartData: [
          { value: 3100 },
          { value: 3300 },
          { value: 3250 },
          { value: 3450 },
          { value: 3600 },
          { value: 3550 },
          { value: 3720 },
          { value: 4011 },
        ],
        trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
      },
      {
        label: `Applicant's type`,
        icon: 'plant',
        chartType: 'pie' as const,
        breakdown: [
          { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#1B8354' },
          { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#14573A' },
        ],
      },
    ],
    statisticsTitle: 'Statistics',
    statisticsCtaLabel: 'View more statistics',
    statisticsCtaHref: '/resources/statistics',
  };
  const sections: Record<string, JourneySectionData> = {
    guidance: {
      title: 'Guidance',
      description:
        'Starting your plant variety protection journey. Learn about the requirements and get professional assistance to protect your new plant varieties.',
    },
    'plant-variety-checklist': {
      title: 'Plant Variety Checklist',
      description:
        'Evaluate whether your plant variety meets the necessary criteria for protection. Assess distinctness, uniformity, and stability requirements.',
      buttonLabel: 'Go to plant variety checklist',
      buttonHref: '/resources/ip-information/digital-guide/ip-category/plant-varieties/checklist',
    },
    'ip-clinics': {
      title: 'IP Clinics',
      description:
        'Get professional guidance on plant variety protection, including technical and legal inquiries about registration and protecting your rights.',
      buttonLabel: 'Go to IP Clinics',
      buttonHref: '/services/ip-clinics',
    },
    'ip-search-engine': {
      title: 'IP Search Engine',
      description:
        'Search for registered plant varieties through the SAIP intellectual property (IP) engine.',
      buttonLabel: 'Go to IP Search Engine',
      buttonHref: '/resources/tools-and-research/ip-search-engine',
    },
    protection: {
      title: 'Protection',
      description:
        'Secure exclusive rights for your new plant variety. Submit your application through our online portal to protect varieties that are distinct, uniform, and stable.',
      buttonLabel: 'Apply for protection',
      buttonHref: '#',
    },
    management: {
      title: 'Management',
      description:
        'Monitor and manage your plant variety rights, including renewals, licensing, and transfer of rights.',
    },
  };
  const sectionIds = [
    'guidance',
    'plant-variety-checklist',
    'ip-clinics',
    'ip-search-engine',
    'protection',
    'management',
  ];
  const tocItems = [
    {
      id: 'guidance',
      label: 'Guidance',
      subItems: [
        { id: 'plant-variety-checklist', label: 'Plant Variety Checklist' },
        { id: 'ip-clinics', label: 'IP Clinics' },
        { id: 'ip-search-engine', label: 'IP Search Engine' },
      ],
    },
    { id: 'protection', label: 'Protection' },
    { id: 'management', label: 'Management' },
  ];
  const tocAriaLabel = 'Plant Varieties journey navigation';
  const servicesTitle = 'Plant Varieties services';
  const services = [
    {
      title: 'Plant Variety Application Service',
      description:
        'Submit applications for protection of new plant varieties that are distinct, uniform, and stable.',
      labels: ['Protection'],
      href: '/services/plant-varieties/application',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/plant-varieties/application',
    },
    {
      title: 'Plant Variety Certificate Renewal',
      description:
        'Renew your plant variety protection certificate to maintain exclusive rights over your protected variety.',
      labels: ['Management'],
      href: '/services/plant-varieties/renewal',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/plant-varieties/renewal',
    },
    {
      title: 'Plant Variety Search',
      description:
        'Search existing plant variety registrations to ensure your variety is distinct and novel.',
      labels: ['Guidance'],
      href: '/services/plant-varieties/search',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/plant-varieties/search',
    },
  ];
  const serviceTypeOptions = [
    { value: 'guidance', label: 'Guidance' },
    { value: 'protection', label: 'Protection' },
    { value: 'management', label: 'Management' },
    { value: 'enforcement', label: 'Enforcement' },
  ];
  const targetGroupOptions = [
    { value: 'individuals', label: 'Individuals' },
    { value: 'enterprises', label: 'Enterprises' },
  ];

  return {
    dataSource: 'fallback',
    heroHeading: 'Plant Varieties overview',
    heroSubheading:
      'Plant variety protection supports breeders by securing exclusive rights to new plant varieties that are distinct, uniform, and stable.',
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Plant Varieties overview',
    },
    overview: {
      header: overviewHeader,
      guide: overviewGuide,
      publications: overviewPublications,
      statistics: overviewStatistics,
    },
    journey: {
      sectionIds,
      sections,
      tocItems,
      tocAriaLabel,
    },
    services: {
      title: servicesTitle,
      services,
      serviceTypeOptions,
      targetGroupOptions,
    },
    media: {
      heroTitle: 'Media for plant varieties',
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
            'Get the latest information on plant varieties in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about plant varieties.',
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
      badgeLabel: 'Plant Varieties',
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

export async function getPlantVarietiesPageData(
  locale?: string,
  options?: { includeJourney?: boolean; includeStatistics?: boolean },
): Promise<PlantVarietiesData> {
  const includeJourney = options?.includeJourney ?? true;
  const includeStatistics = options?.includeStatistics ?? true;
  try {
    // Step 1: Get the list of nodes to find the UUID with the correct locale
    const listResponse = await fetchPlantVarietiesPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      if (locale && locale !== 'en') {
        const retryResponse = await fetchPlantVarietiesPage('en');
        const retryNodes = retryResponse.data;
        if (retryNodes.length > 0) {
          const retryUuid = retryNodes[0].id;
          const baseIncludeFields = [
            'field_hero_background_image',
            'field_hero_background_image.field_media_image',
            'field_overview_video_file',
            'field_overview_video_poster',
            'field_overview_video_poster.field_media_image',
            'field_media_tabs',
            'field_related_links',
            'field_guide_items',
            'field_statistics_items',
            'field_services_items',
            'field_services_items.field_type',
            'field_services_items.field_label',
            'field_services_items.field_target_group',
            'field_publications_items',
          ];
          const journeyIncludeFields = [
            'field_journey_sections',
            'field_journey_sections.field_items',
            'field_journey_sections.field_items.field_sections',
            'field_journey_sections.field_items.field_example',
            'field_journey_sections.field_items.field_example.field_example_items',
            'field_journey_sections.field_content_switcher_items',
            'field_journey_sections.field_parent_section',
            'field_journey_sections.field_parent_section.field_parent_section',
          ];
          const includeFields = includeJourney
            ? [...baseIncludeFields, ...journeyIncludeFields]
            : baseIncludeFields;
          const retryByUuid = await fetchDrupal<DrupalIPCategoryPageNode>(
            `/node/plant_varieties_page/${retryUuid}?include=${includeFields.join(',')}`,
            {},
            'en',
          );
          const retryNode = Array.isArray(retryByUuid.data)
            ? retryByUuid.data[0]
            : retryByUuid.data;
          const retryIncluded = retryByUuid.included || [];
          return transformPlantVarietiesPage(retryNode, retryIncluded);
        }
      }
      return getPlantVarietiesFallbackData();
    }

    // Step 2: Fetch by UUID with locale to get translated content
    const nodeUuid = nodes[0].id;
    const baseIncludeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_file',
      'field_overview_video_poster',
      'field_overview_video_poster.field_media_image',
      'field_media_tabs',
      'field_related_links',
      'field_guide_items',
      'field_statistics_items',
      'field_services_items',
      'field_services_items.field_type',
      'field_services_items.field_label',
      'field_services_items.field_target_group',
      'field_publications_items',
    ];
    const journeyIncludeFields = [
      'field_journey_sections',
      'field_journey_sections.field_items',
      'field_journey_sections.field_items.field_sections',
      'field_journey_sections.field_items.field_example',
      'field_journey_sections.field_items.field_example.field_example_items',
      'field_journey_sections.field_content_switcher_items',
      'field_journey_sections.field_parent_section',
      'field_journey_sections.field_parent_section.field_parent_section',
    ];
    const includeFields = includeJourney
      ? [...baseIncludeFields, ...journeyIncludeFields]
      : baseIncludeFields;

    const response = await fetchDrupal<DrupalIPCategoryPageNode>(
      `/node/plant_varieties_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];
    const data = transformPlantVarietiesPage(node, included);
    if (!includeJourney) {
      data.journey = {
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocAriaLabel: data.journey.tocAriaLabel,
      };
    }

    // Fetch statistics paragraphs separately. Skipped when caller doesn't
    // need statistics (e.g. the journey API route).
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
    console.error(`PLANT VARIETIES: Using fallback data (${locale || 'en'})`, error);
    return getPlantVarietiesFallbackData();
  }
}

export async function getPlantVarietiesPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<PlantVarietiesData> {
  const data = await getPlantVarietiesPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('patents', {
      domain: PATENTS_DOMAIN_AR.PLANT_VARIETIES,
    });

    if (statsCards.length > 0) {
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error(
      'PLANT VARIETIES: External statistics API failed, keeping Drupal statistics.',
      error,
    );
  }

  return data;
}
