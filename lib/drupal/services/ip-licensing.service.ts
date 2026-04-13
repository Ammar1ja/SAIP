import {
  fetchDrupal,
  getProxyUrl,
  getRelated,
  getImageWithAlt,
  extractText,
  normalizeServiceTypeKey,
} from '../utils';
import {
  DrupalIPLicensingPageNode,
  DrupalIncludedEntity,
  DrupalRequirementItemNode,
  DrupalMediaTabNode,
} from '../types';
import { DrupalResponse } from '../api-client';
import { getApiUrl } from '../config';

// Frontend interfaces
export interface IPLicensingData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    guideData: GuideData;
    requirements: RequirementItemData[];
    exemptions: string[];
    quickLinks: QuickLinkData[];
    relatedPages?: Array<{ title: string; href: string }>;
    relatedServices?: RelatedServiceData[];
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
}

export interface GuideData {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  viewFileLabel: string;
  viewFileHref: string;
  downloadFileLabel: string;
  downloadFileHref: string;
}

export interface RequirementItemData {
  number: number;
  text: string;
}

export interface QuickLinkData {
  label: string;
  href: string;
}

export interface RelatedServiceData {
  question: string;
  title: string;
  description: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ServiceItemData {
  title: string;
  labels: string[];
  description: string;
  href: string;
  primaryButtonLabel?: string;
}

export interface ServiceOptionData {
  value: string;
  label: string;
}

export interface MediaTabData {
  id: string;
  label: string;
}

export interface MediaContentData {
  title: string;
  description: string;
}

export interface FilterFieldData {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  variant?: 'single' | 'range';
}

// Drupal API functions
export async function fetchIPLicensingPage(
  locale?: string,
): Promise<DrupalResponse<DrupalIPLicensingPageNode>> {
  const includeFields = [
    'field_guide_image',
    'field_guide_file',
    'field_requirements_items',
    'field_quick_link_items',
    'field_exemption_items',
    'field_services_items',
    'field_services_items.field_type',
    'field_services_items.field_target_group',
    'field_services_items.field_label',
    'field_related_page_items',
    'field_related_service_items',
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_media_background_image',
    'field_media_background_image.field_media_image',
    'field_media_tabs',
  ];
  const endpoint = `/node/ip_licensing_page?filter[status][value]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalIPLicensingPageNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformRequirementItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): RequirementItemData {
  const attrs = (item as any).attributes || {};

  return {
    number: attrs.field_number || 0,
    text: attrs.field_text || '',
  };
}

export function transformMediaTab(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): MediaTabData {
  const attrs = (tab as any).attributes || {};

  return {
    id: attrs.field_tab_id || 'tab',
    label: attrs.title || 'Untitled Tab',
  };
}

export function transformIPLicensingPage(
  node: DrupalIPLicensingPageNode,
  included: DrupalIncludedEntity[] = [],
): IPLicensingData {
  const attrs = node.attributes as any;
  const relationships = node.relationships || {};

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
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

  // Get media background image
  const mediaBackgroundImage = node.relationships?.field_media_background_image?.data
    ? (() => {
        const imageRel = getRelated(
          node.relationships || {},
          'field_media_background_image',
          included,
        );
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get guide image
  // ✅ field_guide_image is an entity reference, so it's in relationships, not attributes
  const guideImage = node.relationships?.field_guide_image?.data
    ? (() => {
        const imageRel = getRelated(node.relationships || {}, 'field_guide_image', included);
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get guide file (PDF)
  let guideFileUrl: string | undefined;
  if (node.relationships?.field_guide_file?.data) {
    const fileEntity = getRelated(node.relationships, 'field_guide_file', included);
    if (fileEntity && !Array.isArray(fileEntity)) {
      const uri = (fileEntity.attributes as any)?.uri?.url;
      if (uri) {
        guideFileUrl = uri.startsWith('http') ? uri : `${getApiUrl()}${uri}`;
      }
    }
  }

  // Get requirements items
  const requirementsData = node.relationships?.field_requirements_items
    ? getRelated(node.relationships, 'field_requirements_items', included) || []
    : [];
  const requirements = Array.isArray(requirementsData)
    ? requirementsData.map((item: DrupalIncludedEntity) => transformRequirementItem(item, included))
    : [];

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', included) || []
    : [];
  let mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => transformMediaTab(tab, included))
    : [];

  // If no media tabs configured, use default tabs (only news for IP Licensing)
  if (mediaTabs.length === 0) {
    mediaTabs = [{ id: 'news', label: 'News' }];
  }

  // Get services items
  const servicesData = node.relationships?.field_services_items
    ? getRelated(node.relationships, 'field_services_items', included) || []
    : [];
  const services = Array.isArray(servicesData)
    ? servicesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        const relationships = (item as any).relationships || {};

        const serviceTypeTerms = relationships.field_type
          ? getRelated(relationships, 'field_type', included) || []
          : [];
        const serviceTypeEntity = Array.isArray(serviceTypeTerms)
          ? serviceTypeTerms[0]
          : serviceTypeTerms;
        const serviceType = (serviceTypeEntity as any)?.attributes?.name || '';
        const normalizedServiceType = normalizeServiceTypeKey(serviceType);

        const rawLabels = Array.isArray(attrs.field_labels)
          ? attrs.field_labels
          : attrs.field_labels
            ? [attrs.field_labels]
            : [];
        const normalizedLabels = rawLabels
          .map((label: string) => normalizeServiceTypeKey(label) || label)
          .filter(Boolean);

        const labels = normalizedServiceType
          ? [normalizedServiceType]
          : serviceType
            ? [serviceType]
            : normalizedLabels.length > 0
              ? normalizedLabels
              : ['protection'];

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
          description: extractText(attrs.field_description) || '',
          href: attrs.field_href || '#',
          targetGroups,
          // Note: primaryButtonLabel is NOT stored in Drupal - it comes from translations in the frontend
        };
      })
    : [];

  // Get quick links from paragraphs (new) or JSON (old fallback)
  let quickLinks: QuickLinkData[] = [];
  const quickLinkItemsData = node.relationships?.field_quick_link_items
    ? getRelated(node.relationships, 'field_quick_link_items', included) || []
    : [];

  if (Array.isArray(quickLinkItemsData) && quickLinkItemsData.length > 0) {
    quickLinks = quickLinkItemsData.map((item: DrupalIncludedEntity) => {
      const attrs = (item as any).attributes || {};
      return {
        label: attrs.field_link_label || '',
        href: attrs.field_link_url || '#',
      };
    });
  } else if (attrs.field_quick_links) {
    // Fallback to old JSON format
    try {
      quickLinks = JSON.parse(attrs.field_quick_links);
    } catch (e) {
      console.warn('Failed to parse quick links:', e);
    }
  }

  // Get exemptions from paragraphs (new) or JSON (old fallback)
  let exemptions: string[] = [];
  const exemptionItemsData = node.relationships?.field_exemption_items
    ? getRelated(node.relationships, 'field_exemption_items', included) || []
    : [];

  if (Array.isArray(exemptionItemsData) && exemptionItemsData.length > 0) {
    exemptions = exemptionItemsData.map((item: DrupalIncludedEntity) => {
      const attrs = (item as any).attributes || {};
      return attrs.field_exemption_text || '';
    });
  } else if (attrs.field_exemptions) {
    // Fallback to old JSON format
    try {
      exemptions = JSON.parse(attrs.field_exemptions);
    } catch (e) {
      console.warn('Failed to parse exemptions:', e);
    }
  }

  // Get related pages
  const relatedPagesData = node.relationships?.field_related_page_items
    ? getRelated(node.relationships, 'field_related_page_items', included) || []
    : [];
  const relatedPages = Array.isArray(relatedPagesData)
    ? relatedPagesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          title: attrs.field_link_title || 'Untitled Page',
          href: attrs.field_link_url || '#',
        };
      })
    : [];

  // Get related services
  const relatedServicesData = node.relationships?.field_related_service_items
    ? getRelated(node.relationships, 'field_related_service_items', included) || []
    : [];
  const relatedServices = Array.isArray(relatedServicesData)
    ? relatedServicesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          question: attrs.field_service_question || '',
          title: attrs.field_service_title || '',
          description: attrs.field_service_description || '',
          price: attrs.field_service_price || '',
          ctaLabel: attrs.field_service_cta_label || 'Go to SAIP Platform',
          ctaHref: attrs.field_service_cta_url || '#',
        };
      })
    : [];

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'IP licensing overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'Information about becoming a certified IP Agent for representing clients in IP matters.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      guideData: {
        title: attrs.field_guide_title || 'IP licensing guide',
        description:
          attrs.field_guide_description ||
          'Experts provide essential guidance on how to protect ideas and innovations through the correct registration of intellectual property rights.',
        image: guideImage
          ? { src: guideImage.src, alt: guideImage.alt }
          : { src: '/images/placeholder-document.png', alt: 'Document placeholder' },
        viewFileLabel: attrs.field_guide_view_file_label || 'View file',
        viewFileHref: guideFileUrl
          ? getProxyUrl(guideFileUrl, 'view')
          : attrs.field_guide_view_file_href || '#',
        downloadFileLabel: attrs.field_guide_download_file_label || 'Download file',
        downloadFileHref: guideFileUrl
          ? getProxyUrl(guideFileUrl, 'download')
          : attrs.field_guide_download_file_href || '#',
      },
      requirements,
      exemptions,
      quickLinks,
      relatedPages: relatedPages.length > 0 ? relatedPages : undefined,
      relatedServices: relatedServices.length > 0 ? relatedServices : undefined,
    },
    services: {
      title: attrs.field_services_title || 'IP licensing services',
      services,
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
      heroTitle: extractText(attrs.field_media_hero_title) || 'Media for IP licensing',
      heroDescription:
        extractText(attrs.field_media_hero_description) ||
        'Here you can find news related to IP Licensing.',
      heroImage: mediaBackgroundImage?.src || '/images/ip-licensing/hero.jpg',
      tabs: mediaTabs, // Already has fallback above (lines 242-248)
      content: {
        news: {
          title: extractText(attrs.field_media_news_title) || 'News',
          description:
            extractText(attrs.field_media_news_description) ||
            'Get the latest information on IP Licensing in Saudi Arabia thanks to news from SAIP.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'IP Licensing',
    },
  };
}

export function getIPLicensingFallbackData(): IPLicensingData {
  return {
    heroHeading: 'IP licensing overview',
    heroSubheading:
      'Information about becoming a certified IP Agent for representing clients in IP matters and joining a professional network dedicated to protecting IP rights in Saudi Arabia.',
    heroImage: {
      src: '/images/ip-licensing/hero.jpg',
      alt: 'IP Licensing overview',
    },
    overview: {
      guideData: {
        title: 'IP licensing guide',
        description:
          'Experts provide essential guidance on how to protect ideas and innovations through the correct registration of intellectual property rights and offer advice on intellectual property strategies.',
        image: {
          src: '/images/placeholder-document.png',
          alt: 'Document placeholder',
        },
        viewFileLabel: 'View file',
        viewFileHref: '#',
        downloadFileLabel: 'Download file',
        downloadFileHref: '#',
      },
      requirements: [
        { number: 1, text: 'You are a Saudi national.' },
        { number: 2, text: 'You have full legal capacity.' },
        { number: 3, text: 'You are Saudi Arabia resident.' },
        { number: 4, text: 'You are not an employee of any government agency.' },
        {
          number: 5,
          text: 'You have no convictions for crimes involving honor or breach of trust, unless rehabilitated.',
        },
        {
          number: 6,
          text: "You have at least a bachelor's degree in law, science, engineering, or another approved major from a recognized Saudi University or equivalent under Saudi Arabia regulations.",
        },
        { number: 7, text: 'You possess a professional verification certificate issued by SAIP.' },
        { number: 8, text: 'You have paid the prescribed licensing fee.' },
      ],
      exemptions: [
        'You are a licensed lawyer with at least two years of professional experience in intellectual property since obtaining your law practice license.',
        'You are an evaluator of protection applications with at least two years of relevant work experience.',
        'You hold a postgraduate degree in intellectual property with at least one year of experience in the field.',
      ],
      quickLinks: [
        { label: 'IP agents', href: '/ip-agents' },
        {
          label: 'Supervisory unit for non-profit sector organizations',
          href: '/supervisory-unit',
        },
      ],
    },
    services: {
      title: 'IP licensing services',
      services: [
        {
          title: 'IP Agent License Registration',
          labels: ['Protection'],
          description:
            'Become a certified IP Agent and represent clients in Intellectual Property matters. Join a network of professionals dedicated to protecting Intellectual Property.',
          href: '/services/ip-licensing/registration',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'IP Agent License Modification',
          labels: ['Protection'],
          description: 'Make changes to your IP agent license application.',
          href: '#',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'IP Agent License Renewal',
          labels: ['Protection'],
          description:
            'Is your IP Agent License expiring or has it already expired? Fill out an application to renew your license.',
          href: '#',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'IP Agent License Suspension',
          labels: ['Enforcement'],
          description: 'Information and procedures regarding the suspension of IP Agent Licenses.',
          href: '#',
          primaryButtonLabel: 'View details',
        },
        {
          title: 'IP Agent License Reinstatement',
          labels: ['Enforcement'],
          description: 'Reinstate your suspended IP Agent License by following the required steps.',
          href: '#',
          primaryButtonLabel: 'View details',
        },
      ],
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
      heroTitle: 'Media for IP licensing',
      heroDescription: 'Here you can find news related to IP Licensing.',
      heroImage: '/images/ip-licensing/hero.jpg',
      tabs: [{ id: 'news', label: 'News' }],
      content: {
        news: {
          title: 'News',
          description:
            'Get the latest information on IP Licensing in Saudi Arabia thanks to news from SAIP.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        { id: 'date', label: 'Date', type: 'date', variant: 'range', placeholder: 'Select date' },
      ],
      badgeLabel: 'IP Licensing',
    },
  };
}

export async function getIPLicensingPageData(locale?: string): Promise<IPLicensingData> {
  try {
    // Step 1: Get UUID with the correct locale
    const listResponse = await fetchIPLicensingPage(locale || 'en');
    const nodes = listResponse.data;

    if (nodes.length === 0) {
      console.log(`🔴 IP LICENSING: Using fallback data ❌ (${locale || 'en'}) - No nodes found`);
      return getIPLicensingFallbackData();
    }

    // Step 2: Fetch by UUID with locale
    const nodeUuid = nodes[0].id;
    const includeFields = [
      'field_guide_image',
      'field_guide_file',
      'field_requirements_items',
      'field_quick_link_items',
      'field_exemption_items',
      'field_services_items',
      'field_related_page_items',
      'field_related_service_items',
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_media_background_image',
      'field_media_background_image.field_media_image',
      'field_media_tabs',
    ];

    const response = await fetchDrupal<DrupalIPLicensingPageNode>(
      `/node/ip_licensing_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];
    const data = transformIPLicensingPage(node, included);

    console.log(`🟢 IP LICENSING: Using Drupal data ✅ (${locale || 'en'})`);
    console.log('Hero Image:', data.heroImage);
    console.log('Guide Image:', data.overview.guideData.image);
    console.log('Requirements:', data.overview.requirements.length);
    console.log('Exemptions:', data.overview.exemptions.length);
    console.log('Quick Links:', data.overview.quickLinks.length);
    console.log('Services:', data.services.services.length);

    return data;
  } catch (error) {
    console.log('🔴 IP LICENSING: Using fallback data ❌', error);
    return getIPLicensingFallbackData();
  }
}
