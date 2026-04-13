import { fetchDrupal, getRelated, getImageUrl, extractText, getProxyUrl } from '../utils';
import {
  DrupalNode,
  DrupalServicesOverviewPageNode,
  DrupalServiceItem,
  DrupalVerticalTabItem,
  DrupalIncludedEntity,
  DrupalServicesProtectionSectionNode,
  DrupalServicesEnablementSectionNode,
  DrupalServicesEnforcementSectionNode,
  DrupalVerticalTabItemNode,
} from '../types';

// Frontend interfaces
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon?: {
    url: string;
    alt: string;
  };
}

export interface VerticalTabData {
  id: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
}

export interface ServicesOverviewData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  discoverHeading: string;
  servicesData: ServiceData[];
  infoHeading: string;
  infoDescription: string;
  verticalTabsData: VerticalTabData[];
  serviceDirectorySection: {
    heading: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
    buttonLabel: string;
    buttonHref: string;
  };
  protectionSection: {
    heading: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };

    verticalTabs: VerticalTabData[];
  };
  enablementSection: {
    heading: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
    infoHeading?: string;
    infoDescription?: string;
    verticalTabs: VerticalTabData[];
  };
  enforcementSection: {
    heading: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
    infoHeading?: string;
    infoDescription?: string;
    verticalTabs: VerticalTabData[];
  };
}

/**
 * Fetch services overview page data from Drupal
 */
export async function fetchServicesOverviewPage(locale?: string): Promise<DrupalNode[]> {
  // Only include fields that exist as relationships in Drupal
  // Available: field_enablement_section, field_enforcement_section, field_protection_section, field_services_data, field_vertical_tabs_data
  const includeFields = [
    'field_services_data',
    'field_services_data.field_icon',
    'field_services_data.field_icon.field_media_image',
    'field_vertical_tabs_data',
    'field_vertical_tabs_data.field_image',
    'field_vertical_tabs_data.field_image.field_media_image',
    'field_protection_section',
    'field_protection_section.field_vertical_tabs',
    'field_protection_section.field_vertical_tabs.field_image',
    'field_protection_section.field_vertical_tabs.field_image.field_media_image',
    'field_enablement_section',
    'field_enablement_section.field_vertical_tabs',
    'field_enablement_section.field_vertical_tabs.field_image',
    'field_enablement_section.field_vertical_tabs.field_image.field_media_image',
    'field_enforcement_section',
    'field_enforcement_section.field_vertical_tabs',
    'field_enforcement_section.field_vertical_tabs.field_image',
    'field_enforcement_section.field_vertical_tabs.field_image.field_media_image',
  ];

  const includeString = includeFields.join(',');
  const endpoint = `/node/services_overview_page?filter[status]=1&include=${includeString}`;

  const response = await fetchDrupal(endpoint, {}, locale);
  return response.data;
}

/**
 * Transform Drupal service item data to frontend format
 */
export function transformServiceItem(
  service: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): ServiceData {
  const attrs = (service as any).attributes || {};
  const relationships = (service as any).relationships || {};

  // Get icon
  const iconRelationship = relationships.field_icon
    ? getRelated(relationships, 'field_icon', included)
    : null;
  const iconUrl =
    iconRelationship && !Array.isArray(iconRelationship)
      ? getImageUrl(iconRelationship, included)
      : '';
  const iconProxyUrl = iconUrl ? getProxyUrl(iconUrl, 'view') : '';

  return {
    id: service.id,
    title: attrs.title || 'Untitled Service',
    description: extractText(attrs.field_description) || '',
    icon:
      iconProxyUrl && iconProxyUrl !== ''
        ? { url: iconProxyUrl, alt: extractText(attrs.field_alt_text) || '' }
        : undefined,
  };
}

/**
 * Transform Drupal vertical tab item data to frontend format
 */
export function transformVerticalTabItem(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): VerticalTabData {
  const attrs = (tab as any).attributes || {};
  const relationships = (tab as any).relationships || {};

  // Get image
  const imageRelationship = relationships.field_image
    ? getRelated(relationships, 'field_image', included)
    : null;
  const imageUrl =
    imageRelationship && !Array.isArray(imageRelationship)
      ? getImageUrl(imageRelationship, included)
      : '';

  return {
    id: tab.id,
    title: attrs.title || 'Untitled Tab',
    description: extractText(attrs.field_description) || '',
    image: imageUrl && imageUrl !== '' ? { src: imageUrl, alt: 'Vertical tab image' } : undefined,
    buttonLabel: attrs.field_button_label || undefined,
    buttonHref: attrs.field_button_href || undefined,
    buttonAriaLabel: attrs.field_button_label || undefined,
  };
}

/**
 * Transform Drupal section data to frontend format
 */
export function transformSection(
  section: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): {
  heading: string;
  description: string;
  image?: { src: string; alt: string };
  infoHeading?: string;
  infoDescription?: string;
  verticalTabs: VerticalTabData[];
} {
  const attrs = (section as any).attributes || {};
  const relationships = (section as any).relationships || {};

  // Get section image
  const imageRelationship = relationships.field_image
    ? getRelated(relationships, 'field_image', included)
    : null;
  const imageUrl =
    imageRelationship && !Array.isArray(imageRelationship)
      ? getImageUrl(imageRelationship, included)
      : '';

  // Get vertical tabs
  const verticalTabsData = relationships.field_vertical_tabs
    ? getRelated(relationships, 'field_vertical_tabs', included) || []
    : [];
  const verticalTabs = Array.isArray(verticalTabsData)
    ? verticalTabsData.map((tab: DrupalIncludedEntity) =>
        transformVerticalTabItem(tab as DrupalVerticalTabItemNode, included),
      )
    : [];

  return {
    heading: attrs.field_heading || attrs.title || 'Section',
    description: extractText(attrs.field_description) || '',
    image: imageUrl && imageUrl !== '' ? { src: imageUrl, alt: 'Section image' } : undefined,
    infoHeading: extractText(attrs.field_info_heading) || undefined,
    infoDescription: extractText(attrs.field_info_description) || undefined,
    verticalTabs,
  };
}

/**
 * Transform Drupal services overview page data to frontend format
 */
export function transformServicesOverviewPage(
  node: DrupalServicesOverviewPageNode,
  included: DrupalIncludedEntity[] = [],
  locale?: string,
): ServicesOverviewData {
  const attrs = node.attributes as any;
  const rels = node.relationships || {};

  // Get hero image from relationships
  const heroImageEntity = getRelated(rels, 'field_hero_background_image', included);
  const heroImageUrl =
    heroImageEntity && !Array.isArray(heroImageEntity)
      ? getImageUrl(heroImageEntity, included)
      : '';

  // Get services data - są w relationships, nie w attributes!
  const servicesData = node.relationships?.field_services_data
    ? getRelated(node.relationships, 'field_services_data', included) || []
    : [];
  const services = Array.isArray(servicesData)
    ? servicesData.map((service: DrupalIncludedEntity) =>
        transformServiceItem(service as DrupalServiceItem, included),
      )
    : [];

  // Get vertical tabs data - są w relationships, nie w attributes!
  const verticalTabsData = node.relationships?.field_vertical_tabs_data
    ? getRelated(node.relationships, 'field_vertical_tabs_data', included) || []
    : [];
  const verticalTabs = Array.isArray(verticalTabsData)
    ? verticalTabsData.map((tab: DrupalIncludedEntity) =>
        transformVerticalTabItem(tab as DrupalVerticalTabItem, included),
      )
    : [];

  // Get Service Directory Section
  const serviceDirectorySectionData = node.relationships?.field_directory_section
    ? getRelated(node.relationships, 'field_directory_section', included)
    : null;
  const serviceDirectorySection =
    serviceDirectorySectionData && !Array.isArray(serviceDirectorySectionData)
      ? serviceDirectorySectionData
      : null;

  // Get sections data
  const protectionSectionData = node.relationships?.field_protection_section
    ? getRelated(node.relationships, 'field_protection_section', included)
    : null;
  const enablementSectionData = node.relationships?.field_enablement_section
    ? getRelated(node.relationships, 'field_enablement_section', included)
    : null;
  const enforcementSectionData = node.relationships?.field_enforcement_section
    ? getRelated(node.relationships, 'field_enforcement_section', included)
    : null;

  // Ensure sections are single entities, not arrays
  const protectionSection =
    protectionSectionData && !Array.isArray(protectionSectionData) ? protectionSectionData : null;
  const enablementSection =
    enablementSectionData && !Array.isArray(enablementSectionData) ? enablementSectionData : null;
  const enforcementSection =
    enforcementSectionData && !Array.isArray(enforcementSectionData)
      ? enforcementSectionData
      : null;

  // Transform Service Directory Section
  // CRITICAL FIX: field_directory_section is NOT translatable, so it always references
  // the same node (EN version). We need to use the node's langcode-aware attributes
  // to get the correct translation based on the parent node's langcode.
  const transformedDirectorySection = serviceDirectorySection
    ? (() => {
        const dirAttrs = (serviceDirectorySection as any).attributes || {};
        // Use the langcode from included entity - Drupal returns translated version
        // when we include the relationship in the API call with locale parameter
        const langcode = dirAttrs.langcode || 'en';

        // Try to get translations for fallback
        const getFallbackHeading = () => {
          if (locale === 'ar') return 'دليل خدمات الهيئة';
          return 'SAIP service directory';
        };
        const getFallbackButtonLabel = () => {
          if (locale === 'ar') return 'انتقل إلى دليل خدمات الهيئة';
          return 'Go to SAIP service directory';
        };

        return {
          heading: extractText(dirAttrs.field_heading) || dirAttrs.title || getFallbackHeading(),
          description: extractText(dirAttrs.field_description) || extractText(dirAttrs.body) || '',
          image: undefined,
          buttonLabel: dirAttrs.field_button_label || getFallbackButtonLabel(),
          buttonHref: dirAttrs.field_button_href || '/services/service-directory',
        };
      })()
    : {
        heading: locale === 'ar' ? 'دليل خدمات الهيئة' : 'SAIP service directory',
        description:
          locale === 'ar'
            ? 'ابحث عن جميع الخدمات المتاحة في مكان واحد! تتيح لك هذه الصفحة تصفح والبحث عن الخدمات باستخدام فلاتر سهلة الاستخدام.'
            : 'Find all available services in one place! This page allows you to browse and search for services using intuitive filters.',
        image: undefined,
        buttonLabel:
          locale === 'ar' ? 'انتقل إلى دليل خدمات الهيئة' : 'Go to SAIP service directory',
        buttonHref: '/services/service-directory',
      };

  return {
    heroHeading: extractText(attrs.field_hero_heading) || 'Services overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      "Find the right service for your needs. Explore all available services and resources in one place. Whether you're looking for specific IP categories or broader support, this page guides you to the right solutions for your goals.",
    heroImage:
      heroImageUrl && heroImageUrl !== ''
        ? { src: heroImageUrl, alt: 'Services overview' }
        : undefined,
    discoverHeading: extractText(attrs.field_discover_heading) || 'Discover services',
    servicesData: services,
    infoHeading: extractText(attrs.field_info_heading) || 'Information you might need',
    infoDescription:
      extractText(attrs.field_info_description) ||
      'Check out the examples below for guidance on where to find specific answers.',
    verticalTabsData: verticalTabs,
    serviceDirectorySection: transformedDirectorySection,
    protectionSection: protectionSection
      ? transformSection(protectionSection, included)
      : {
          heading: 'IP protection & management',
          description:
            'The six main IP services are: Patents, Trademarks, Copyrights, Integrated Circuits, Designs and Plants.',
          verticalTabs: [],
        },
    enablementSection: enablementSection
      ? transformSection(enablementSection, included)
      : {
          heading: 'IP Enablement',
          description:
            'Support and services beyond the main intellectual property categories for anyone seeking comprehensive IP solutions.',
          verticalTabs: [],
        },
    enforcementSection: enforcementSection
      ? transformSection(enforcementSection, included)
      : {
          heading: 'IP enforcement & dispute',
          description:
            'IP enforcement is essential for protecting innovations and ensuring fair use through the processes for handling disputes.',
          verticalTabs: [],
        },
  };
}

/**
 * Get services overview page data with fallback
 */
export async function getServicesOverviewPageData(locale?: string): Promise<ServicesOverviewData> {
  try {
    const nodes = await fetchServicesOverviewPage(locale);

    if (nodes.length === 0) {
      return getFallbackData();
    }

    const node = nodes[0] as DrupalServicesOverviewPageNode;

    // CRITICAL: JSON:API requires UUID, not node ID, especially with locale prefix!
    // Using node.id causes 404 with /ar/ prefix
    const nodeUuid = (node as any).id; // This is already UUID from JSON:API response

    const response = await fetchDrupal(
      `/node/services_overview_page/${nodeUuid}?include=${[
        'field_hero_background_image',
        'field_hero_background_image.field_media_image',
        'field_services_data',
        'field_services_data.field_icon',
        'field_services_data.field_icon.field_media_image',
        'field_vertical_tabs_data',
        'field_vertical_tabs_data.field_image',
        'field_vertical_tabs_data.field_image.field_media_image',
        'field_directory_section',
        'field_directory_section.field_image',
        'field_directory_section.field_image.field_media_image',
        'field_protection_section',
        'field_protection_section.field_image',
        'field_protection_section.field_image.field_media_image',
        'field_protection_section.field_vertical_tabs',
        'field_protection_section.field_vertical_tabs.field_image',
        'field_protection_section.field_vertical_tabs.field_image.field_media_image',
        'field_enablement_section',
        'field_enablement_section.field_image',
        'field_enablement_section.field_image.field_media_image',
        'field_enablement_section.field_vertical_tabs',
        'field_enablement_section.field_vertical_tabs.field_image',
        'field_enablement_section.field_vertical_tabs.field_image.field_media_image',
        'field_enforcement_section',
        'field_enforcement_section.field_image',
        'field_enforcement_section.field_image.field_media_image',
        'field_enforcement_section.field_vertical_tabs',
        'field_enforcement_section.field_vertical_tabs.field_image',
        'field_enforcement_section.field_vertical_tabs.field_image.field_media_image',
      ].join(',')}`,
      {},
      locale,
    );

    // CRITICAL: Use response.data instead of node from first fetch!
    // response.data contains the translated node with correct langcode
    // When fetching by UUID, JSON:API returns single object, not array

    const nodeWithTranslations = (
      Array.isArray(response.data) ? response.data[0] : response.data
    ) as DrupalServicesOverviewPageNode;

    // WORKAROUND: field_directory_section is NOT translatable, so it always references
    // the same node (EN version). We need to fetch the referenced node separately with locale.
    let directoryNodeTranslated = null;
    const directoryRef = nodeWithTranslations.relationships?.field_directory_section?.data;

    if (directoryRef && !Array.isArray(directoryRef) && directoryRef.id) {
      try {
        const dirNodeType = directoryRef.type.replace('--', '/'); // e.g., 'node--page' => 'node/page'
        const dirResponse = await fetchDrupal(`/${dirNodeType}/${directoryRef.id}`, {}, locale);
        directoryNodeTranslated = Array.isArray(dirResponse.data)
          ? dirResponse.data[0]
          : dirResponse.data;

        // Add to included array so transformServicesOverviewPage can find it
        if (directoryNodeTranslated) {
          response.included = response.included || [];
          // Replace existing directory node in included array
          const existingIndex = response.included.findIndex((inc) => inc.id === directoryRef.id);

          if (existingIndex >= 0) {
            response.included[existingIndex] = directoryNodeTranslated as any;
          } else {
            response.included.push(directoryNodeTranslated as any);
          }
        }
      } catch (error) {
        console.error(`❌ [SERVICES] Failed to fetch translated directory node:`, error);
      }
    }

    const transformedData = transformServicesOverviewPage(
      nodeWithTranslations,
      response.included,
      locale,
    );

    return transformedData;
  } catch (error) {
    console.error(`SERVICES OVERVIEW: Using fallback data (${locale || 'en'})`, error);
    return getFallbackData();
  }
}

/**
 * Fallback data for services overview page
 */
export function getFallbackData(): ServicesOverviewData {
  return {
    heroHeading: 'Services overview',
    heroSubheading:
      "Find the right service for your needs. Explore all available services and resources in one place. Whether you're looking for specific IP categories or broader support, this page guides you to the right solutions for your goals.",
    heroImage: {
      src: '/images/about/hero.jpg',
      alt: 'Services Overview',
    },
    discoverHeading: 'Discover services',
    servicesData: [
      {
        id: 'fallback-1',
        title: 'IP Protection & Management',
        description:
          "If you're looking for more information about specific IP, check the six categories below IP Protection & Management.",
        icon: {
          url: '/icons/services/add_note.svg',
          alt: 'Add Note Icon',
        },
      },
      {
        id: 'fallback-2',
        title: 'IP Enablement',
        description:
          'If you need support with your IPs, you can find specialized assistance under IP Enablement.',
        icon: {
          url: '/icons/services/circle_info.svg',
          alt: 'Circle Info Icon',
        },
      },
      {
        id: 'fallback-3',
        title: 'IP Enforcement & Dispute',
        description: 'Description',
        icon: {
          url: '/icons/services/circle_plus.svg',
          alt: 'Circle Plus Icon',
        },
      },
    ],
    infoHeading: 'Information you might need',
    infoDescription: 'Check out the examples below for guidance on where to find specific answers.',
    verticalTabsData: [
      {
        id: 'fallback-tab-1',
        title: 'IP Services Information',
        description:
          "If you're looking for information about a specific IP service but aren't sure which category it falls under, the Digital guide is the perfect place to start.",
        image: {
          src: '/images/national-ip-strategy/photo-container.jpg',
          alt: 'IP Services Information illustration',
        },
      },
      {
        id: 'fallback-tab-2',
        title: 'Trademark Information',
        description:
          'In IP protection & management you can find key IP categories, including Trademarks, with in-depth information and related services.',
        image: {
          src: '/images/national-ip-strategy/Trademark-information.jpg',
          alt: 'Trademark Information illustration',
        },
      },
      {
        id: 'fallback-tab-3',
        title: 'IPs Support',
        description:
          "In IP enablement you can explore options like IP clinics, where you'll receive expert help for managing your intellectual property. This service, along with others provides comprehensive solutions tailored to your needs.",
        image: {
          src: '/images/national-ip-strategy/IPs-Support.jpg',
          alt: 'IPs Support illustration',
        },
      },
    ],
    serviceDirectorySection: {
      heading: 'SAIP service directory',
      description:
        "Find all available services in one place! This page allows you to browse and search for services using intuitive filters. Whether you know exactly what you're looking for or are just exploring, you can access a comprehensive list of all services offered on the site.",
      image: {
        src: '/images/services/service-directory.jpg',
        alt: 'SAIP service directory',
      },
      buttonLabel: 'Go to SAIP service directory',
      buttonHref: '/services/service-directory',
    },
    protectionSection: {
      heading: 'IP protection & management',
      description:
        'The six main IP services are: Patents, Trademarks, Copyrights, Integrated Circuits, Designs and Plants.',
      image: {
        src: '/images/services/service-directory.jpg',
        alt: 'IP protection & management',
      },
      verticalTabs: [
        {
          id: 'patents',
          title: '',
          description:
            'Patents protect inventions and grant exclusive rights to their creators. There you can find detailed information about patent applications, procedures, and related services. Explore resources to help you navigate the patent process and protect your innovations.',
          image: { src: '/images/services/patents.jpg', alt: 'Patents' },
          buttonLabel: 'Go to Patents',
          buttonHref: '/services/patents',
          buttonAriaLabel: 'Navigate to Patents section',
        },
        {
          id: 'trademarks',
          title: '',
          description:
            'Trademarks encompass names, words, signatures, symbols, numbers, titles, seals, designs, graphics, images, distinctive engravings, packaging styles, shapes, colors, or color combinations. They include any sign or group of signs intended to distinguish the goods or services of a business.',
          image: { src: '/images/services/trademarks.jpg', alt: 'Trademarks' },
          buttonLabel: 'Go to Trademarks',
          buttonHref: '/services/trademarks',
          buttonAriaLabel: 'Navigate to Trademarks section',
        },
        {
          id: 'copyrights',
          title: '',
          description:
            'Copyright grants creators exclusive rights to use and control their work, preventing unauthorized use by others. An author is the creator of a work, identified by their name unless stated otherwise. For anonymous or pseudonymous works, the publisher may represent the author. This term also includes contributors like scriptwriters and dialogue authors in visual or audio projects.',
          image: { src: '/images/services/copyrights.jpg', alt: 'Copyrights' },
          buttonLabel: 'Go to Copyrights',
          buttonHref: '/services/copyrights',
          buttonAriaLabel: 'Navigate to Copyrights section',
        },
        {
          id: 'designs',
          title: '',
          description:
            'Design encompasses creations focused on the decorative or aesthetic appearance of an object. It can include three-dimensional elements like shapes or surfaces, as well as two-dimensional aspects such as graphics, lines, or colors.',
          image: { src: '/images/services/designs.jpg', alt: 'Designs' },
          buttonLabel: 'Go to Designs',
          buttonHref: '/services/designs',
          buttonAriaLabel: 'Navigate to Designs section',
        },
        {
          id: 'layout-designs-and-integrated-circuits',
          title: '',
          description:
            'An integrated circuit is a small electronic circuit created to perform a specific function. It is commonly used in electronic devices, where its components — at least one of which is active and their connections are integrated into a single piece of material. These components are arranged in a three-dimensional layout for efficient manufacturing.',
          image: {
            src: '/images/services/layout-designs.jpg',
            alt: 'Layout designs and Integrated Circuits',
          },
          buttonLabel: 'Go to Topographic designs of integrated circuits',
          buttonHref: '/services/layout-designs-and-integrated-circuits',
          buttonAriaLabel: 'Navigate to Layout designs and Integrated Circuits section',
        },
        {
          id: 'plant-varieties',
          title: '',
          description:
            'Plant varieties are specific subsets within a botanical taxon, classified as one of the simplest identifiable forms. They are defined by the consistent expression of traits resulting from a single genotype or a specific set of genotypes. A plant variety is distinguished from other plant groups by these unique characteristics and its ability to reproduce while preserving these traits unchanged.',
          image: { src: '/images/services/plant.jpg', alt: 'Plant Varieties' },
          buttonLabel: 'Go to Plant varieties',
          buttonHref: '/services/plant-varieties',
          buttonAriaLabel: 'Navigate to Plant varieties section',
        },
      ],
    },
    enablementSection: {
      heading: 'IP Enablement',
      description:
        'Support and services beyond the main intellectual property categories for anyone seeking comprehensive IP solutions.',
      image: {
        src: '/images/services/ip-enablement.jpg',
        alt: 'IP Enablement',
      },
      verticalTabs: [
        {
          id: 'ip-licensing',
          title: 'IP licensing',
          description: '?',
          image: { src: '/images/services/licensing.jpg', alt: 'IP licensing' },
          buttonLabel: 'Go to IP licensing',
          buttonHref: '/services/ip-licensing',
          buttonAriaLabel: 'Navigate to IP licensing section',
        },
        {
          id: 'ip-academy',
          title: 'IP Academy',
          description:
            'Through the training plan, the academy provides a diversified suite of specialized and qualitative programs which are likely to contribute to developing the relevant staff, and support theIP initiatives in the KSA and MENA.',
          image: { src: '/images/services/academy.jpg', alt: 'IP Academy' },
          buttonLabel: 'Go to IP Academy',
          buttonHref: '/services/ip-academy',
          buttonAriaLabel: 'Navigate to IP Academy section',
        },
        {
          id: 'ip-clinics',
          title: 'IP Clinics',
          description: '?',
          image: { src: '/images/services/clinics.jpg', alt: 'IP Clinics' },
          buttonLabel: 'Go to IP Clinics',
          buttonHref: '/services/ip-clinics',
          buttonAriaLabel: 'Navigate to IP Clinics section',
        },
        {
          id: 'ip-support-centers',
          title: 'National network of IP support centers',
          description: '?',
          image: {
            src: '/images/services/network.jpg',
            alt: 'National network of IP support centers',
          },
          buttonLabel: 'Go to National network',
          buttonHref: '/services/national-network',
          buttonAriaLabel: 'Navigate to National network of IP support centers section',
        },
      ],
    },
    enforcementSection: {
      heading: 'IP enforcement & dispute',
      description:
        'IP enforcement is essential for protecting innovations and ensuring fair use through the processes for handling disputes.',
      infoHeading: 'About IP enforcement & dispute services',
      infoDescription:
        'Explore the services below to learn how IP infringements are handled and disputes are resolved.',
      image: {
        src: '/images/services/enforcement.jpg',
        alt: 'IP enforcement & dispute',
      },
      verticalTabs: [
        {
          id: 'ip-infringement',
          title: 'IP infringement',
          description:
            "To ensures compliance with Saudi Arabia's IP laws, protecting the rights of creators, innovators, and businesses. Cases of infringement are handled promptly and fairly, safeguarding IP and supporting a transparent and innovative ecosystem. Beneficiaries can use this service to maintain the integrity of their IP assets and seek appropriate legal remedies.",
          image: { src: '/images/services/infringement.jpg', alt: 'IP infringement' },
          buttonLabel: 'Go to IP infringement',
          buttonHref: '/services/ip-infringement',
          buttonAriaLabel: 'Navigate to IP infringement section',
        },
        {
          id: 'general-secretariat',
          title: 'General secretariat of IP dispute resolution committees',
          description:
            'General Secretariat for IP Committees initiative aims to achieve the highest level of efficiency and quality in services related to IP cases handled by the committees specified in relevant laws and regulations, ensuring transparency, justice, and swift execution.',
          image: {
            src: '/images/services/secretariat.jpg',
            alt: 'General secretariat of IP dispute resolution committees',
          },
          buttonLabel: 'Go to IP committees',
          buttonHref: '/services/general-secretariat',
          buttonAriaLabel:
            'Navigate to General secretariat of IP dispute resolution committees section',
        },
      ],
    },
  };
}
