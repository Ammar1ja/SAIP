import { fetchDrupal } from '../utils';
import {
  getRelated,
  getImageWithAlt,
  extractText,
  filterIncludedByLangcode,
  normalizeServiceTypeKey,
  getApiUrl,
  getProxyUrl,
} from '../utils';
import { DrupalIPCategoryPageNode, DrupalIncludedEntity, DrupalJourneySectionNode } from '../types';
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
export interface TopographicDesignsData {
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
    description?: string;
    secondDescription?: string;
    backgroundImage?: string;
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
export async function fetchTopographicDesignsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  // Simple endpoint without heavy includes - we'll fetch by UUID with full includes later
  const endpoint = `/node/layout_designs_page?filter[status][value]=1`;
  return await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
}

// Reuse transformation functions from patents.service.ts
import {
  transformGuideItem,
  transformPublicationItem,
  transformStatisticsItem,
  transformJourneySection,
  transformMediaTab,
} from './patents.service';

export function transformTopographicDesignsPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
  overviewDescriptionTranslation?: string,
): TopographicDesignsData {
  const attrs = node.attributes as any;

  // ✅ CRITICAL FIX: Filter included entities to match node's langcode
  // API returns ALL language versions, we need only the correct one
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
          ? getImageWithAlt(imageRel, effectiveIncluded)
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
          ? getImageWithAlt(imageRel, effectiveIncluded)
          : undefined;
      })()
    : undefined;

  // Get overview video file (uploaded media)
  let overviewVideoFileUrl: string | undefined;
  const overviewVideoRel = getRelated(
    node.relationships || {},
    'field_overview_video_file',
    effectiveIncluded,
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
    ? guideItemsData.map((item: DrupalIncludedEntity) =>
        transformGuideItem(item, effectiveIncluded),
      )
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

        const href = attrs.field_href || attrs.field_link?.uri?.replace('internal:', '') || '#';

        // Get service type (Protection, Management, etc.) from taxonomy
        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', effectiveIncluded) || []
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
    heroHeading:
      extractText(attrs.field_hero_heading) || 'Layout Designs of Integrated Circuits overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Layout designs protect the three-dimensional configurations of integrated circuits.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title: extractText(attrs.field_overview_header_title) || 'Information library',
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) ||
          overviewDescriptionTranslation ||
          'Watch the video and learn the key steps involved in layout designs of integrated circuits.',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'Layout Designs Guide',
        guideCards: guideItems,
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle: extractText(attrs.field_publications_title) || 'Publications',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          'The layout designs publications provides important updates and information on layout design procedures.',
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
      description: extractText(attrs.field_journey_description) || undefined,
      secondDescription: extractText(attrs.field_journey_second_description) || undefined,
      // Layout Designs doesn't have field_journey_background_image, use hero image instead
      backgroundImage: heroImage?.src || undefined,
      sectionIds,
      sections: journeySections,
      tocItems: buildJourneyTocItems(journeySections),
      tocAriaLabel: 'Layout designs journey navigation',
    },
    services: {
      title: extractText(attrs.field_services_title) || 'Layout Designs services',
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
      heroTitle: 'Media for layout designs',
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
            'Get the latest information on layout designs in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about layout designs.',
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
      badgeLabel: 'Layout Designs',
    },
    relatedPages: {
      title: (attrs as any).field_related_links_title || 'Related pages',
      pages: (() => {
        const relatedLinksData = (node.relationships as any)?.field_related_links
          ? getRelated(node.relationships as any, 'field_related_links', effectiveIncluded) || []
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

export async function getTopographicDesignsFallbackData(
  locale?: string,
): Promise<TopographicDesignsData> {
  const { getTranslations } = await import('next-intl/server');
  const tTopographic = await getTranslations({
    locale: locale || 'en',
    namespace: 'common.topographicDesigns',
  });
  const overviewDescriptionTranslation = tTopographic('overviewDescription');
  // Simple fallback data without external dependencies
  const TOPOGRAPHIC_DESIGNS_GUIDE_CARDS: any[] = [
    {
      title: 'IC Layout Design Classification',
      description: 'Learn how to classify IC layout designs',
      labels: ['Layout Designs'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/ic-layout-classification.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/ic-layout-classification.pdf',
      titleBg: 'green' as const,
    },
    {
      title: 'Software Copyright Protection Guide',
      description: 'Guidelines for protecting copyrights in software',
      labels: ['Layout Designs'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/software-copyright-protection.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/software-copyright-protection.pdf',
      titleBg: 'green' as const,
    },
    {
      title: 'Guide to patent application contact',
      description: 'The content of the patent application necessary for filing',
      labels: ['Layout Designs'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/patent-application-contact.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/patent-application-contact.pdf',
      titleBg: 'green' as const,
    },
  ];
  // Layout Designs does not have publications section
  const TOPOGRAPHIC_DESIGNS_PUBLICATIONS: any[] = [];
  const TOPOGRAPHIC_DESIGNS_STATISTICS_CARDS: any[] = [
    {
      label: 'Number of IC layout registrations in 2023',
      value: 234,
      chartType: 'line' as const,
      chartData: [
        { value: 50 },
        { value: 80 },
        { value: 120 },
        { value: 160 },
        { value: 190 },
        { value: 210 },
        { value: 234 },
      ],
      trend: { value: '65%', direction: 'up' as const, description: 'vs last month' },
    },
  ];
  const TOPOGRAPHIC_DESIGNS_JOURNEY_SECTIONS: Record<string, JourneySectionData> = {
    guidance: {
      title: 'Guidance',
      description:
        'Starting your IC layout design protection journey. Learn about the requirements for protecting layout designs of integrated circuits.',
    },
    'ic-layout-checklist': {
      title: 'IC Layout Design Checklist',
      description:
        'Evaluate whether your integrated circuit layout design meets the protection criteria. Assess originality and three-dimensional configuration requirements.',
      buttonLabel: 'Go to IC layout checklist',
      buttonHref:
        '/resources/ip-information/digital-guide/ip-category/topographic-designs-of-integrated-circuits/checklist',
    },
    'ip-clinics': {
      title: 'IP Clinics',
      description:
        'Get professional guidance on layout design protection, including technical and legal inquiries about registration.',
      buttonLabel: 'Go to IP Clinics',
      buttonHref: '/services/ip-clinics',
    },
    'ip-search-engine': {
      title: 'IP Search Engine',
      description:
        'Search for registered IC layout designs through the SAIP intellectual property (IP) engine.',
      buttonLabel: 'Go to IP Search Engine',
      buttonHref: '/resources/tools-and-research/ip-search-engine',
    },
    protection: {
      title: 'Protection',
      description:
        'Submit your application to protect the layout design of your integrated circuit through our online portal.',
      buttonLabel: 'Start registration',
      buttonHref: '#',
    },
    management: {
      title: 'Management',
      description:
        'Monitor and manage your layout design rights, including licensing and transfer of rights.',
    },
  };
  const TOPOGRAPHIC_DESIGNS_JOURNEY_SECTION_IDS = [
    'guidance',
    'ic-layout-checklist',
    'ip-clinics',
    'ip-search-engine',
    'protection',
    'management',
  ];
  const TOPOGRAPHIC_DESIGNS_JOURNEY_TOC_ITEMS = [
    {
      id: 'guidance',
      label: 'Guidance',
      subItems: [
        { id: 'ic-layout-checklist', label: 'IC Layout Design Checklist' },
        { id: 'ip-clinics', label: 'IP Clinics' },
        { id: 'ip-search-engine', label: 'IP Search Engine' },
      ],
    },
    { id: 'protection', label: 'Protection' },
    { id: 'management', label: 'Management' },
  ];
  const TOPOGRAPHIC_DESIGNS_SERVICES_DATA = [
    {
      title: 'IC Layout Design Registration',
      description:
        'Register the layout design of integrated circuits to protect your innovative semiconductor layouts.',
      labels: ['Protection'],
      href: '/services/layout-designs-of-integrated-circuits/registration',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/layout-designs-of-integrated-circuits/registration',
    },
    {
      title: 'IC Layout Rights Management',
      description:
        'Manage and maintain your registered IC layout design rights, including renewals and licensing agreements.',
      labels: ['Management'],
      href: '/services/layout-designs-of-integrated-circuits/management',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/layout-designs-of-integrated-circuits/management',
    },
    {
      title: 'IC Layout Design Search',
      description:
        "Search existing IC layout design registrations to ensure your design is original and doesn't infringe existing rights.",
      labels: ['Guidance'],
      href: '/services/layout-designs-of-integrated-circuits/search',
      primaryButtonLabel: 'View details',
      primaryButtonHref: '/services/layout-designs-of-integrated-circuits/search',
    },
  ];

  return {
    dataSource: 'fallback',
    heroHeading: 'Layout Designs of Integrated Circuits overview',
    heroSubheading:
      'Layout designs protect the three-dimensional configurations of integrated circuits, fostering innovation in electronics.',
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Layout Designs of Integrated Circuits overview',
    },
    overview: {
      header: {
        title: 'Information library',
        description:
          overviewDescriptionTranslation ||
          'Watch the video and learn the key steps involved in layout designs of integrated circuits.',
      },
      guide: {
        guideTitle: 'Layout Designs Guide',
        ctaLabel: 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
        guideCards: TOPOGRAPHIC_DESIGNS_GUIDE_CARDS,
      },
      publications: {
        publications: TOPOGRAPHIC_DESIGNS_PUBLICATIONS,
        publicationsTitle: 'Publications',
        publicationsDescription:
          'The layout designs publications provides important updates and information on layout design procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
        publicationsCtaLabel: 'View more publication',
        publicationsCtaHref: '/resources/publications',
      },
      statistics: {
        statistics: TOPOGRAPHIC_DESIGNS_STATISTICS_CARDS,
        statisticsTitle: 'Statistics',
        statisticsCtaLabel: 'View more statistics',
        statisticsCtaHref: '/resources/statistics',
      },
    },
    journey: {
      description:
        'We are dedicated to empowering IC layout design holders by providing a seamless and transparent experience throughout the design protection process.',
      secondDescription:
        'From fostering innovation to protecting, managing, and enforcing your IC layout design rights, we ensure your creations are safeguarded and transformed into valuable assets that enhance market presence and drive economic growth. Learn more about the IC layout design journey.',
      backgroundImage: '/images/services/topographic-journey.jpg',
      sectionIds: TOPOGRAPHIC_DESIGNS_JOURNEY_SECTION_IDS,
      sections: TOPOGRAPHIC_DESIGNS_JOURNEY_SECTIONS,
      tocItems: TOPOGRAPHIC_DESIGNS_JOURNEY_TOC_ITEMS,
      tocAriaLabel: 'Layout designs journey navigation',
    },
    services: {
      title: 'Layout Designs of Integrated Circuits services',
      services: TOPOGRAPHIC_DESIGNS_SERVICES_DATA,
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
      heroTitle: 'Media for layout designs',
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
            'Get the latest information on layout designs in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about layout designs.',
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
      badgeLabel: 'Layout Designs',
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

export async function getTopographicDesignsPageData(
  locale?: string,
  options?: { includeJourney?: boolean; includeStatistics?: boolean },
): Promise<TopographicDesignsData> {
  const includeJourney = options?.includeJourney ?? true;
  const includeStatistics = options?.includeStatistics ?? true;
  try {
    // Step 1: Get the list of nodes to find the UUID with the correct locale
    const listResponse = await fetchTopographicDesignsPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      return await getTopographicDesignsFallbackData(locale);
    }

    // Step 2: Fetch by UUID with locale to get translated content
    const nodeUuid = nodes[0].id;

    const baseIncludeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_poster',
      'field_overview_video_file',
      'field_overview_video_poster.field_media_image',
      'field_publications_items',
      'field_media_tabs',
      'field_related_links',
      'field_guide_items',
      'field_guide_items.field_secondary_button_file',
      'field_statistics_items',
      'field_services_items',
      'field_services_items.field_type',
      'field_services_items.field_label',
      'field_services_items.field_target_group',
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
    const includeFields = [
      ...baseIncludeFields,
      ...(includeJourney ? journeyIncludeFields : []),
    ].join(',');
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(
      `/node/layout_designs_page/${nodeUuid}?include=${includeFields}`,
      {},
      locale,
    );
    const node = Array.isArray(response.data) ? response.data[0] : response.data;

    let included = response.included || [];

    // Fetch child journey sections (Level 2 and 3) separately.
    // JSON:API include does not recursively expand children by parent relation.
    if (includeJourney) {
      const level1SectionsData = node.relationships?.field_journey_sections?.data;
      const level1Sections = Array.isArray(level1SectionsData)
        ? level1SectionsData
        : level1SectionsData
          ? [level1SectionsData]
          : [];

      if (level1Sections.length > 0) {
        try {
          const level1Uuids = level1Sections.map((section: any) => section.id);
          const journeyInclude = [
            'field_parent_section',
            'field_items',
            'field_items.field_sections',
            'field_items.field_example',
            'field_items.field_example.field_example_items',
            'field_content_switcher_items',
          ].join(',');

          const level2Promises = level1Uuids.map((uuid) =>
            fetchDrupal<DrupalJourneySectionNode>(
              `/node/journey_section?filter[field_parent_section.id]=${uuid}&include=${journeyInclude}`,
              {},
              locale,
            ),
          );
          const level2Responses = await Promise.all(level2Promises);

          const level2Sections: DrupalJourneySectionNode[] = [];
          const level2Included: DrupalIncludedEntity[] = [];

          level2Responses.forEach((childResponse) => {
            const childSections = Array.isArray(childResponse.data)
              ? childResponse.data
              : [childResponse.data].filter(Boolean);
            level2Sections.push(...childSections);
            if (childResponse.included) {
              level2Included.push(...(childResponse.included as DrupalIncludedEntity[]));
            }
          });

          if (level2Sections.length > 0) {
            included = [...included, ...level2Sections, ...level2Included];

            const level2Uuids = level2Sections.map((section) => section.id);
            const level3Promises = level2Uuids.map((uuid) =>
              fetchDrupal<DrupalJourneySectionNode>(
                `/node/journey_section?filter[field_parent_section.id]=${uuid}&include=${journeyInclude}`,
                {},
                locale,
              ),
            );
            const level3Responses = await Promise.all(level3Promises);

            const level3Sections: DrupalJourneySectionNode[] = [];
            const level3Included: DrupalIncludedEntity[] = [];

            level3Responses.forEach((childResponse) => {
              const childSections = Array.isArray(childResponse.data)
                ? childResponse.data
                : [childResponse.data].filter(Boolean);
              level3Sections.push(...childSections);
              if (childResponse.included) {
                level3Included.push(...(childResponse.included as DrupalIncludedEntity[]));
              }
            });

            if (level3Sections.length > 0) {
              included = [...included, ...level3Sections, ...level3Included];
            }
          }
        } catch (error) {
          console.warn('Failed to fetch child journey sections for topographic designs:', error);
          // Continue with currently available sections.
        }
      }
    }

    // Get translations for transform function
    const { getTranslations } = await import('next-intl/server');
    const tTopographic = await getTranslations({
      locale: locale || 'en',
      namespace: 'common.topographicDesigns',
    });
    const overviewDescriptionTranslation = tTopographic('overviewDescription');

    const data = transformTopographicDesignsPage(
      node,
      included,
      locale,
      overviewDescriptionTranslation,
    );
    if (!includeJourney) {
      data.journey = {
        ...data.journey,
        sectionIds: [],
        sections: {},
        tocItems: [],
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
    console.error(`TOPOGRAPHIC DESIGNS: Using fallback data (${locale || 'en'})`, error);
    return await getTopographicDesignsFallbackData(locale);
  }
}

export async function getTopographicDesignsPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<TopographicDesignsData> {
  const data = await getTopographicDesignsPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('patents', {
      domain: PATENTS_DOMAIN_AR.INTEGRATED_CIRCUITS,
    });

    if (statsCards.length > 0) {
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error(
      'TOPOGRAPHIC DESIGNS: External statistics API failed, keeping Drupal statistics.',
      error,
    );
  }

  return data;
}
