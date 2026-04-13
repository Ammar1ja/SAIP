import { fetchDrupal, getProxyUrl, getApiUrl } from '../utils';
import {
  getRelated,
  getImageWithAlt,
  extractText,
  filterIncludedByLangcode,
  normalizeServiceTypeKey,
} from '../utils';
import { DrupalIPCategoryPageNode, DrupalIncludedEntity } from '../types';
import { DrupalResponse } from '../api-client';
import { ROUTES } from '@/lib/routes';
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
import { getStatisticsForCategory, isStatisticsApiConfigured } from '@/lib/statistics-api';

// Frontend interfaces
export interface CopyrightsData {
  dataSource?: 'drupal' | 'fallback';
  heroHeading: string;
  heroSubheading: string;
  heroSecondSubheading?: string;
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
export async function fetchCopyrightsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  try {
    const endpoint = '/node/copyrights_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  } catch (error) {
    // Fallback to generic IP category page
    const endpoint = '/node/ip_category_page?filter[status][value]=1';
    const response = await fetchDrupal<DrupalIPCategoryPageNode>(endpoint, {}, locale);
    return response;
  }
}

// Use extractText from utils for consistent HTML sanitization

// Reuse transformation functions from patents.service.ts
import {
  transformGuideItem,
  transformPublicationItem,
  transformStatisticsItem,
  transformJourneySection,
  transformMediaTab,
} from './patents.service';

export function transformCopyrightsPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
  heroSecondSubheadingTranslation?: string,
): CopyrightsData {
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

        // Get service type (Protection, Management, etc.) from taxonomy
        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', effectiveIncluded) || []
          : [];
        const serviceTypeEntity = Array.isArray(serviceTypeTerms)
          ? serviceTypeTerms[0]
          : serviceTypeTerms;
        const serviceType = (serviceTypeEntity as any)?.attributes?.name || '';

        const serviceTypeKey = normalizeServiceTypeKey(serviceType);
        const labels = serviceTypeKey ? [serviceTypeKey] : [];

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
          href: attrs.field_href || '#',
          primaryButtonLabel: attrs.field_primary_button_label || 'View details',
          targetGroups,
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Copyrights overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Copyright grants creators exclusive rights to use and control their work, preventing unauthorized use by others.',
    heroSecondSubheading:
      extractText((attrs as any).field_hero_second_subheading) ||
      heroSecondSubheadingTranslation ||
      'An author is the creator of a work, identified by their name unless stated otherwise. For anonymous or pseudonymous works, the publisher may represent the author. This term also includes contributors like scriptwriters and dialogue authors in visual or audio projects.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title: extractText(attrs.field_overview_header_title) || 'Information library',
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) || 'Watch the video and learn the key steps involved in copyrights.',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || 'Copyright Guide',
        guideCards: guideItems,
        ctaLabel: extractText(attrs.field_guide_cta_label) || 'Go to Guidelines',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle: extractText(attrs.field_publications_title) || 'Publications',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          'The copyright publications provides important updates and information on copyright procedures.',
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
      tocAriaLabel: 'Copyrights journey navigation',
    },
    services: {
      title: extractText(attrs.field_services_title) || 'Copyrights services',
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
      heroTitle: 'Media for copyrights',
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
            'Get the latest information on copyrights in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about copyrights.',
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
      badgeLabel: 'Copyrights',
    },
    relatedPages: {
      title: (attrs as any).field_related_links_title || 'Related pages',
      pages: (() => {
        // Get related_links paragraphs from relationships
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

export async function getCopyrightsFallbackData(locale?: string): Promise<CopyrightsData> {
  const { getTranslations } = await import('next-intl/server');
  const tCopyrights = await getTranslations({
    locale: locale || 'en',
    namespace: 'common.copyrights',
  });
  const heroSecondSubheadingTranslation = tCopyrights('heroSecondSubheading');
  // Simple fallback data without external dependencies
  const overviewHeader = {
    title: 'Information library',
    description: 'Watch the video and learn the key steps involved in copyrights.',
    videoSrc: undefined,
    videoPoster: undefined,
  };
  const overviewGuide = {
    guideTitle: 'Copyright Guide',
    ctaLabel: 'Go to Guidelines',
    ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
    guideCards: [
      {
        title: 'Copyright Registration Guide',
        description:
          'Learn how to register your creative works and protect your intellectual property',
        labels: ['Copyrights'],
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/copyright-registration.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/copyright-registration.pdf',
        titleBg: 'green' as const,
      },
      {
        title: 'Digital Copyright Protection Guide',
        description: 'Guidelines for protecting copyright in digital content and software',
        labels: ['Copyrights'],
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/digital-copyright.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/digital-copyright.pdf',
        titleBg: 'green' as const,
      },
      {
        title: 'Copyright Licensing Guide',
        description: 'Understanding copyright licensing agreements and their terms',
        labels: ['Copyrights'],
        publicationDate: '04.08.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/copyright-licensing.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/copyright-licensing.pdf',
        titleBg: 'green' as const,
      },
    ],
  };
  const overviewPublications = {
    publications: [
      {
        title: 'Copyright publication 5123',
        description: '',
        labels: ['Copyrights'],
        publicationNumber: '512380456',
        durationDate: '15.09 - 15.11.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/copyright-publication-5123.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/copyright-publication-5123.pdf',
        titleBg: 'green' as const,
      },
      {
        title: 'Copyright publication 5124',
        description: '',
        labels: ['Copyrights'],
        publicationNumber: '512380457',
        durationDate: '16.09 - 16.11.2024',
        primaryButtonLabel: 'Download file',
        primaryButtonHref: '/files/copyright-publication-5124.pdf',
        secondaryButtonLabel: 'View file',
        secondaryButtonHref: '/files/copyright-publication-5124.pdf',
        titleBg: 'green' as const,
      },
    ],
    publicationsTitle: 'Publications',
    publicationsDescription:
      'The copyright publications provides important updates and information on copyright procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
    publicationsCtaLabel: 'View more publication',
    publicationsCtaHref: '/resources/publications',
  };
  const overviewStatistics = {
    statistics: [
      {
        label: 'Number of copyright registrations in 2023',
        value: 3245,
        chartType: 'line' as const,
        chartData: [
          { value: 800 },
          { value: 1200 },
          { value: 1600 },
          { value: 2000 },
          { value: 2400 },
          { value: 2800 },
          { value: 3245 },
        ],
        trend: { value: '95%', direction: 'up' as const, description: 'vs last month' },
      },
      {
        label: 'Number of active copyrights in 2023',
        value: 2987,
        chartType: 'line' as const,
        chartData: [
          { value: 700 },
          { value: 1100 },
          { value: 1500 },
          { value: 1900 },
          { value: 2300 },
          { value: 2600 },
          { value: 2987 },
        ],
        trend: { value: '88%', direction: 'up' as const, description: 'vs last month' },
      },
      {
        label: `Applicant's type`,
        chartType: 'pie' as const,
        breakdown: [
          { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#1B8354' },
          { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#14573A' },
        ],
      },
    ],
    statisticsTitle: 'Statistics',
    statisticsCtaLabel: 'View more statistics',
    statisticsCtaHref: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.IP_SERVICES.ROOT,
  };
  const sections: Record<string, JourneySectionData> = {
    guidance: {
      title: 'Guidance',
      description:
        'Starting your copyright protection journey. Learn about copyright requirements and get professional assistance to protect your creative works.',
    },
    'copyright-checklist': {
      title: 'Copyright Checklist',
      description:
        'Determine if your creative work qualifies for copyright protection. Learn about originality requirements and protected works.',
      buttonLabel: 'Go to copyright checklist',
      buttonHref: '/resources/ip-information/digital-guide/ip-category/copyrights/checklist',
    },
    'ip-clinics': {
      title: 'IP Clinics',
      description:
        'Get professional guidance on copyright protection, including technical and legal inquiries about registration and protecting your creative works.',
      buttonLabel: 'Go to IP Clinics',
      buttonHref: '/services/ip-clinics',
    },
    'ip-search-engine': {
      title: 'IP Search Engine',
      description:
        'Search for registered copyrights through the SAIP intellectual property (IP) engine.',
      buttonLabel: 'Go to IP Search Engine',
      buttonHref: '/resources/tools-and-research/ip-search-engine',
    },
    protection: {
      title: 'Protection',
      description:
        'Register your creative works including literary, artistic, musical, and software works to establish legal protection and exclusive rights.',
      buttonLabel: 'Start registration',
      buttonHref: '#',
    },
    management: {
      title: 'Management',
      description:
        'Monitor and manage your copyright registrations, including licensing, transfers, and enforcement of your rights.',
    },
    enforcement: {
      title: 'Enforcement',
      description:
        'Report unauthorized use of your copyrighted works and take legal action to protect your intellectual property.',
      buttonLabel: 'Report infringement',
      buttonHref: '#',
    },
  };
  const sectionIds = [
    'guidance',
    'copyright-checklist',
    'ip-clinics',
    'ip-search-engine',
    'protection',
    'management',
    'enforcement',
  ];
  const tocItems = [
    {
      id: 'guidance',
      label: 'Guidance',
      subItems: [
        { id: 'copyright-checklist', label: 'Copyright Checklist' },
        { id: 'ip-clinics', label: 'IP Clinics' },
        { id: 'ip-search-engine', label: 'IP Search Engine' },
      ],
    },
    { id: 'protection', label: 'Protection' },
    { id: 'management', label: 'Management' },
    { id: 'enforcement', label: 'Enforcement' },
  ];
  const tocAriaLabel = 'Copyrights journey navigation';
  const servicesTitle = 'Copyrights services';
  const services = [
    {
      title: 'Copyright Registration Service',
      description:
        'Register your original creative works including books, music, art, software, and other copyrightable materials.',
      labels: ['Protection'],
      href: '/services/copyrights/registration',
      primaryButtonLabel: 'View details',
    },
    {
      title: 'Copyright Licensing',
      description:
        'Manage licensing agreements for your copyrighted works and grant permissions for authorized use.',
      labels: ['Management'],
      href: '/services/copyrights/licensing',
      primaryButtonLabel: 'View details',
    },
    {
      title: 'Copyright Infringement Investigation',
      description:
        'Report and investigate potential copyright infringement cases with professional support from SAIP.',
      labels: ['Enforcement'],
      href: '/services/copyrights/infringement',
      primaryButtonLabel: 'View details',
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
    heroHeading: 'Copyrights overview',
    heroSubheading:
      'Copyright grants creators exclusive rights to use and control their work, preventing unauthorized use by others.',
    heroSecondSubheading: heroSecondSubheadingTranslation,
    heroImage: {
      src: '/images/services/copyrights.jpg',
      alt: 'Copyrights overview',
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
      heroTitle: 'Media for copyrights',
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
            'Get the latest information on copyrights in Saudi Arabia thanks to news from SAIP.',
        },
        videos: {
          title: 'Videos',
          description:
            'Explore the latest updates on the IP in Saudi Arabia through our video collection about copyrights.',
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
      badgeLabel: 'Copyrights',
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

export async function getCopyrightsPageData(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<CopyrightsData> {
  const includeJourney = options?.includeJourney ?? true;
  try {
    // Step 1: Get the list of nodes to find the UUID with the correct locale
    const listResponse = await fetchCopyrightsPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      return await getCopyrightsFallbackData(locale);
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
      'field_guide_items.field_secondary_button_file', // Include uploaded files for guide items
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
      `/node/copyrights_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    // Get translations for transform function
    const { getTranslations } = await import('next-intl/server');
    const tCopyrights = await getTranslations({
      locale: locale || 'en',
      namespace: 'common.copyrights',
    });
    const heroSecondSubheadingTranslation = tCopyrights('heroSecondSubheading');

    // When fetching by UUID, response.data is a single object, not an array
    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];
    const data = transformCopyrightsPage(node, included, locale, heroSecondSubheadingTranslation);
    if (!includeJourney) {
      data.journey = {
        sectionIds: [],
        sections: {},
        tocItems: [],
        tocAriaLabel: data.journey.tocAriaLabel,
      };
    }

    // Fetch statistics paragraphs separately
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

    data.dataSource = 'drupal';
    return data;
  } catch (error) {
    console.error(`COPYRIGHTS: Using fallback data (${locale || 'en'})`, error);
    return await getCopyrightsFallbackData(locale);
  }
}

/**
 * Alternative helper that augments the standard Drupal-based page data with
 * statistics loaded from the external statistics API instead of Drupal paragraphs.
 *
 * This function is NOT used anywhere yet – it allows a safe, opt-in migration path.
 */
export async function getCopyrightsPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<CopyrightsData> {
  const data = await getCopyrightsPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('copyrights');
    if (statsCards && statsCards.length > 0) {
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error('COPYRIGHTS: External statistics API failed, keeping Drupal statistics.', error);
  }

  return data;
}
