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
export interface DesignsData {
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

interface DesignsTranslations {
  heroHeading: string;
  heroSubheading: string;
  overview: {
    headerTitle: string;
    headerDescription: string;
    guideTitle: string;
    guideCtaLabel: string;
    publicationsTitle: string;
    publicationsDescription: string;
    publicationsCtaLabel: string;
    statisticsTitle: string;
    statisticsCtaLabel: string;
  };
  journey: {
    description: string;
    secondDescription: string;
    tocAriaLabel: string;
  };
  services: {
    title: string;
    serviceTypeOptions: {
      guidance: string;
      protection: string;
      management: string;
      enforcement: string;
    };
    targetGroupOptions: {
      individuals: string;
      enterprises: string;
    };
  };
  media: {
    heroTitle: string;
    heroDescription: string;
    tabs: {
      news: string;
      videos: string;
      articles: string;
    };
    content: {
      news: { title: string; description: string };
      videos: { title: string; description: string };
      articles: { title: string; description: string };
    };
    badgeLabel: string;
  };
  relatedPages: {
    title: string;
    pages: {
      faqs: string;
      guidelines: string;
      ipClinics: string;
      ipAcademy: string;
      lawsAndRegulations: string;
      internationalTreaties: string;
    };
  };
  placeholders: {
    untitledService: string;
    untitled: string;
  };
  buttons: {
    viewDetails: string;
    viewMorePublications: string;
    viewMoreStatistics: string;
    downloadFile: string;
    viewFile: string;
  };
  filters: {
    search: string;
    date: string;
    selectDate: string;
  };
}

// Drupal API functions
export async function fetchDesignsPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPCategoryPageNode>> {
  try {
    const endpoint = '/node/designs_page?filter[status]=1';
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

export function transformDesignsPage(
  node: DrupalIPCategoryPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
  translations?: DesignsTranslations,
): DesignsData {
  const attrs = node.attributes as any;
  const nodeLangcode = (attrs as any).langcode || 'en';
  const filteredIncluded = filterIncludedByLangcode(included, nodeLangcode);
  const effectiveIncluded = filteredIncluded.length > 0 ? filteredIncluded : included;

  // Get hero image - field_hero_background_image is an entity reference, so it's in relationships
  const heroImage = (() => {
    const relationships = node.relationships || {};
    if (!relationships.field_hero_background_image) {
      return undefined;
    }

    const imageRel = getRelated(relationships, 'field_hero_background_image', effectiveIncluded);
    if (!imageRel || Array.isArray(imageRel)) {
      return undefined;
    }

    return getImageWithAlt(imageRel, effectiveIncluded);
  })();

  // Get overview video poster - field_overview_video_poster is an entity reference, so it's in relationships
  const videoPoster = (() => {
    const relationships = node.relationships || {};
    if (!relationships.field_overview_video_poster) {
      return undefined;
    }

    const imageRel = getRelated(relationships, 'field_overview_video_poster', effectiveIncluded);
    if (!imageRel || Array.isArray(imageRel)) {
      return undefined;
    }

    return getImageWithAlt(imageRel, effectiveIncluded);
  })();

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
  const statisticsItemsWithDesignIcon = statisticsItems.map((stat) => ({
    ...stat,
    icon: 'design',
  }));

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
          title:
            attrs.title || attrs.field_title || translations?.placeholders.untitledService || '',
          labels,
          description:
            extractText(attrs.field_description) ||
            extractText(attrs.field_content) ||
            extractText(attrs.body) ||
            '',
          href: href,
          primaryButtonLabel:
            attrs.field_primary_button_label || translations?.buttons.viewDetails || '',
          primaryButtonHref: href,
          targetGroups,
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || translations?.heroHeading || '',
    heroSubheading: extractText(attrs.field_hero_subheading) || translations?.heroSubheading || '',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      header: {
        title:
          extractText(attrs.field_overview_header_title) ||
          translations?.overview.headerTitle ||
          '',
        description:
          extractText(
            attrs.field_overview_header_descriptio || attrs.field_overview_header_description,
          ) ||
          translations?.overview.headerDescription ||
          '',
        videoSrc: overviewVideoFileUrl || attrs.field_overview_video_src,
        videoPoster: videoPoster ? { src: videoPoster.src, alt: videoPoster.alt } : undefined,
      },
      guide: {
        guideTitle: extractText(attrs.field_guide_title) || translations?.overview.guideTitle || '',
        guideCards: guideItems,
        ctaLabel:
          extractText(attrs.field_guide_cta_label) || translations?.overview.guideCtaLabel || '',
        ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
      },
      publications: {
        publications: publicationItems,
        publicationsTitle:
          extractText(attrs.field_publications_title) ||
          translations?.overview.publicationsTitle ||
          '',
        publicationsDescription:
          extractText(attrs.field_publications_description) ||
          translations?.overview.publicationsDescription ||
          '',
        publicationsCtaLabel:
          extractText(attrs.field_publications_cta_label) ||
          translations?.overview.publicationsCtaLabel ||
          '',
        publicationsCtaHref: attrs.field_publications_cta_href || '/resources/publications',
      },
      statistics: {
        statistics: statisticsItemsWithDesignIcon,
        statisticsTitle:
          extractText(attrs.field_statistics_title) || translations?.overview.statisticsTitle || '',
        statisticsCtaLabel:
          extractText(attrs.field_statistics_cta_label) ||
          translations?.overview.statisticsCtaLabel ||
          '',
        statisticsCtaHref: attrs.field_statistics_cta_href || '/resources/statistics',
      },
    },
    journey: {
      description: translations?.journey.description || '',
      secondDescription: translations?.journey.secondDescription || '',
      backgroundImage: (() => {
        const journeyImageRel = (attrs as any).field_journey_background_image
          ? getRelated(
              node.relationships || {},
              'field_journey_background_image',
              effectiveIncluded,
            )
          : undefined;
        if (journeyImageRel && !Array.isArray(journeyImageRel)) {
          const journeyImage = getImageWithAlt(journeyImageRel, effectiveIncluded);
          return journeyImage ? journeyImage.src : undefined;
        }
        return heroImage?.src || '/images/services/topographic-journey.jpg';
      })(),
      sectionIds,
      sections: journeySections,
      tocItems: buildJourneyTocItems(journeySections),
      tocAriaLabel: translations?.journey.tocAriaLabel || '',
    },
    services: {
      title: extractText(attrs.field_services_title) || translations?.services.title || '',
      services: servicesItems,
      serviceTypeOptions: [
        { value: 'guidance', label: translations?.services.serviceTypeOptions.guidance || '' },
        { value: 'protection', label: translations?.services.serviceTypeOptions.protection || '' },
        { value: 'management', label: translations?.services.serviceTypeOptions.management || '' },
        {
          value: 'enforcement',
          label: translations?.services.serviceTypeOptions.enforcement || '',
        },
      ],
      targetGroupOptions: [
        {
          value: 'individuals',
          label: translations?.services.targetGroupOptions.individuals || '',
        },
        {
          value: 'enterprises',
          label: translations?.services.targetGroupOptions.enterprises || '',
        },
      ],
    },
    media: {
      heroTitle: translations?.media.heroTitle || '',
      heroDescription: translations?.media.heroDescription || '',
      heroImage: '/images/about/hero.jpg',
      tabs:
        mediaTabs.length > 0
          ? mediaTabs
          : [
              { id: 'news', label: translations?.media.tabs.news || '' },
              { id: 'videos', label: translations?.media.tabs.videos || '' },
              { id: 'articles', label: translations?.media.tabs.articles || '' },
            ],
      content: {
        news: {
          title: translations?.media.content.news.title || '',
          description: translations?.media.content.news.description || '',
        },
        videos: {
          title: translations?.media.content.videos.title || '',
          description: translations?.media.content.videos.description || '',
        },
        articles: {
          title: translations?.media.content.articles.title || '',
          description: translations?.media.content.articles.description || '',
        },
      },
      filterFields: [
        {
          id: 'search',
          label: translations?.filters.search || '',
          type: 'search',
          placeholder: translations?.filters.search || '',
        },
        {
          id: 'date',
          label: translations?.filters.date || '',
          type: 'date',
          variant: 'range',
          placeholder: translations?.filters.selectDate || '',
        },
      ],
      badgeLabel: translations?.media.badgeLabel || '',
    },
    relatedPages: {
      title: (attrs as any).field_related_links_title || translations?.relatedPages.title || '',
      pages: (() => {
        const relatedLinksData = (node.relationships as any)?.field_related_links
          ? getRelated(node.relationships as any, 'field_related_links', effectiveIncluded) || []
          : [];
        const paragraphs = Array.isArray(relatedLinksData) ? relatedLinksData : [];
        return paragraphs.map((p: any) => {
          const pAttrs = p?.attributes || {};
          const link = pAttrs.field_link || {};
          return {
            title: pAttrs.field_title || link.title || translations?.placeholders.untitled || '',
            href: (link.uri || '').replace('internal:', '') || '#',
          };
        });
      })(),
    },
  };
}

async function getDesignsTranslations(locale?: string): Promise<DesignsTranslations> {
  const { getTranslations } = await import('next-intl/server');
  const tDesigns = await getTranslations({
    locale: locale || 'en',
    namespace: 'common.designs',
  });
  const tButtons = await getTranslations({ locale: locale || 'en', namespace: 'buttons' });
  const tPageNavigation = await getTranslations({
    locale: locale || 'en',
    namespace: 'pageNavigation',
  });
  const tFilters = await getTranslations({ locale: locale || 'en', namespace: 'common.filters' });
  const tRelatedPages = await getTranslations({
    locale: locale || 'en',
    namespace: 'common.relatedPages',
  });
  const tIpMedia = await getTranslations({
    locale: locale || 'en',
    namespace: 'ipCategories.media',
  });
  const tCategoryNames = await getTranslations({
    locale: locale || 'en',
    namespace: 'ipCategories.names',
  });

  const category = tCategoryNames('Designs');

  return {
    heroHeading: tDesigns('heroHeading'),
    heroSubheading: tDesigns('heroSubheading'),
    overview: {
      headerTitle: tPageNavigation('informationLibrary'),
      headerDescription: tDesigns('overviewHeaderDescription'),
      guideTitle: tDesigns('guideTitle'),
      guideCtaLabel: tDesigns('guideCtaLabel'),
      publicationsTitle: tDesigns('publicationsTitle'),
      publicationsDescription: tDesigns('publicationsDescription'),
      publicationsCtaLabel: tButtons('viewMorePublications'),
      statisticsTitle: tPageNavigation('statistics'),
      statisticsCtaLabel: tButtons('viewMoreStatistics'),
    },
    journey: {
      description: tDesigns('journey.description'),
      secondDescription: tDesigns('journey.secondDescription'),
      tocAriaLabel: tDesigns('tocAriaLabel'),
    },
    services: {
      title: tDesigns('servicesTitle'),
      serviceTypeOptions: {
        guidance: tFilters('serviceTypeOptions.guidance'),
        protection: tFilters('serviceTypeOptions.protection'),
        management: tFilters('serviceTypeOptions.management'),
        enforcement: tFilters('serviceTypeOptions.enforcement'),
      },
      targetGroupOptions: {
        individuals: tFilters('targetGroupOptions.individuals'),
        enterprises: tFilters('targetGroupOptions.enterprises'),
      },
    },
    media: {
      heroTitle: tIpMedia('heroTitle', { category }),
      heroDescription: tIpMedia('heroDescription', { category }),
      tabs: {
        news: tIpMedia('news.title'),
        videos: tIpMedia('videos.title'),
        articles: tIpMedia('articles.title'),
      },
      content: {
        news: {
          title: tIpMedia('news.title'),
          description: tIpMedia('news.description', { category }),
        },
        videos: {
          title: tIpMedia('videos.title'),
          description: tIpMedia('videos.description', { category }),
        },
        articles: {
          title: tIpMedia('articles.title'),
          description: tIpMedia('articles.description', { category }),
        },
      },
      badgeLabel: tIpMedia('badgeLabel', { category }),
    },
    relatedPages: {
      title: tRelatedPages('title'),
      pages: {
        faqs: tRelatedPages('faqs'),
        guidelines: tRelatedPages('guidelines'),
        ipClinics: tRelatedPages('ipClinics'),
        ipAcademy: tRelatedPages('ipAcademy'),
        lawsAndRegulations: tRelatedPages('lawsAndRegulations'),
        internationalTreaties: tRelatedPages('internationalTreaties'),
      },
    },
    placeholders: {
      untitledService: tDesigns('placeholders.untitledService'),
      untitled: tDesigns('placeholders.untitled'),
    },
    buttons: {
      viewDetails: tButtons('viewDetails'),
      viewMorePublications: tButtons('viewMorePublications'),
      viewMoreStatistics: tButtons('viewMoreStatistics'),
      downloadFile: tButtons('downloadFile'),
      viewFile: tButtons('viewFile'),
    },
    filters: {
      search: tFilters('search'),
      date: tFilters('date'),
      selectDate: tFilters('selectDate'),
    },
  };
}

export async function getDesignsFallbackData(locale?: string): Promise<DesignsData> {
  const { getTranslations } = await import('next-intl/server');
  const translations = await getDesignsTranslations(locale);
  const tDesigns = await getTranslations({
    locale: locale || 'en',
    namespace: 'common.designs',
  });
  const fallbackGuideCards = (tDesigns.raw('fallback.guideCards') as GuideCardData[]) || [];
  const fallbackStatistics = (
    (tDesigns.raw('fallback.statistics') as StatisticsCardData[]) || []
  ).map((stat) => ({
    ...stat,
    icon: 'design',
  }));
  const fallbackSections =
    (tDesigns.raw('fallback.journeySections') as Record<string, JourneySectionData>) || {};
  const fallbackSectionIds = (tDesigns.raw('fallback.journeySectionIds') as string[]) || [];
  const fallbackTocItems = (tDesigns.raw('fallback.tocItems') as TOCItemData[]) || [];
  const fallbackServices = (tDesigns.raw('fallback.services') as ServiceItemData[]) || [];

  const overviewHeader = {
    title: translations.overview.headerTitle,
    description: translations.overview.headerDescription,
    videoSrc: undefined,
    videoPoster: undefined,
  };
  const overviewGuide = {
    guideTitle: translations.overview.guideTitle,
    ctaLabel: translations.overview.guideCtaLabel,
    ctaHref: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT,
    guideCards: fallbackGuideCards,
  };
  const overviewPublications = {
    publications: [],
    publicationsTitle: translations.overview.publicationsTitle,
    publicationsDescription: translations.overview.publicationsDescription,
    publicationsCtaLabel: translations.overview.publicationsCtaLabel,
    publicationsCtaHref: '/resources/publications',
  };
  const overviewStatistics = {
    statistics: fallbackStatistics,
    statisticsTitle: translations.overview.statisticsTitle,
    statisticsCtaLabel: translations.overview.statisticsCtaLabel,
    statisticsCtaHref: '/resources/statistics',
  };
  const services = fallbackServices;
  const serviceTypeOptions = [
    { value: 'guidance', label: translations.services.serviceTypeOptions.guidance },
    { value: 'protection', label: translations.services.serviceTypeOptions.protection },
    { value: 'management', label: translations.services.serviceTypeOptions.management },
    { value: 'enforcement', label: translations.services.serviceTypeOptions.enforcement },
  ];
  const targetGroupOptions = [
    { value: 'individuals', label: translations.services.targetGroupOptions.individuals },
    { value: 'enterprises', label: translations.services.targetGroupOptions.enterprises },
  ];

  return {
    dataSource: 'fallback',
    heroHeading: translations.heroHeading,
    heroSubheading: translations.heroSubheading,
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: translations.heroHeading,
    },
    overview: {
      header: overviewHeader,
      guide: overviewGuide,
      publications: overviewPublications,
      statistics: overviewStatistics,
    },
    journey: {
      description: translations.journey.description,
      secondDescription: translations.journey.secondDescription,
      backgroundImage: '/images/services/topographic-journey.jpg',
      sectionIds: fallbackSectionIds,
      sections: fallbackSections,
      tocItems: fallbackTocItems,
      tocAriaLabel: translations.journey.tocAriaLabel,
    },
    services: {
      title: translations.services.title,
      services,
      serviceTypeOptions,
      targetGroupOptions,
    },
    media: {
      heroTitle: translations.media.heroTitle,
      heroDescription: translations.media.heroDescription,
      heroImage: '/images/about/hero.jpg',
      tabs: [
        { id: 'news', label: translations.media.tabs.news },
        { id: 'videos', label: translations.media.tabs.videos },
        { id: 'articles', label: translations.media.tabs.articles },
      ],
      content: translations.media.content,
      filterFields: [
        {
          id: 'search',
          label: translations.filters.search,
          type: 'search',
          placeholder: translations.filters.search,
        },
        {
          id: 'date',
          label: translations.filters.date,
          type: 'date',
          variant: 'range',
          placeholder: translations.filters.selectDate,
        },
      ],
      badgeLabel: translations.media.badgeLabel,
    },
    relatedPages: {
      title: translations.relatedPages.title,
      pages: [
        { title: translations.relatedPages.pages.faqs, href: '/resources/ip-information/faq' },
        {
          title: translations.relatedPages.pages.guidelines,
          href: '/resources/ip-information/guidelines',
        },
        { title: translations.relatedPages.pages.ipClinics, href: '/services/ip-clinics' },
        { title: translations.relatedPages.pages.ipAcademy, href: '/services/ip-academy' },
        {
          title: translations.relatedPages.pages.lawsAndRegulations,
          href: '/resources/lows-and-regulations/systems-and-regulations',
        },
        {
          title: translations.relatedPages.pages.internationalTreaties,
          href: '/resources/lows-and-regulations/international-treaties',
        },
      ],
    },
  };
}

export async function getDesignsPageData(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<DesignsData> {
  const includeJourney = options?.includeJourney ?? true;
  try {
    // Step 1: Get UUID with the correct locale
    const listResponse = await fetchDesignsPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      return await getDesignsFallbackData(locale);
    }

    // Step 2: Fetch by UUID with locale
    const nodeUuid = nodes[0].id;
    const baseIncludeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_overview_video_poster',
      'field_overview_video_file',
      'field_overview_video_poster.field_media_image',
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
      `/node/designs_page/${nodeUuid}?include=${includeFields}`,
      {},
      locale,
    );
    const translations = await getDesignsTranslations(locale);

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];
    const data = transformDesignsPage(node, included, locale, translations);
    if (!includeJourney) {
      data.journey = {
        ...data.journey,
        sectionIds: [],
        sections: {},
        tocItems: [],
      };
    }

    // Fetch statistics paragraphs separately only if relationship data is empty
    if (data.overview.statistics.statistics.length === 0) {
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
    console.error(`DESIGNS: Using fallback data (${locale || 'en'})`, error);
    return await getDesignsFallbackData(locale);
  }
}

export async function getDesignsPageDataExternalApi(
  locale?: string,
  options?: { includeJourney?: boolean },
): Promise<DesignsData> {
  const data = await getDesignsPageData(locale, options);

  try {
    if (!isStatisticsApiConfigured()) {
      return data;
    }

    const statsCards = await getStatisticsForCategory('patents', {
      domain: PATENTS_DOMAIN_AR.INDUSTRIAL_DESIGNS,
    });

    if (statsCards.length > 0) {
      (data.overview.statistics as any).statistics = statsCards as any;
    }
  } catch (error) {
    console.error('DESIGNS: External statistics API failed, keeping Drupal statistics.', error);
  }

  return data;
}
