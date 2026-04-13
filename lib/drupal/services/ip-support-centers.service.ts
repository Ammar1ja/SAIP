/**
 * IP Support Centers Service
 * Handles data fetching and transformation for IP Support Centers (TISC) page
 */

import { fetchDrupal, getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalStatisticsItemNode } from '../types';
import { DrupalResponse } from '../api-client';
import { StatisticsCardData, GuideCardData } from './common-types';

const TISC_ABOUT_FALLBACK_P1 =
  'The National Network of IP Support Centers is a national network aimed at enabling entities and organizations to access IP information and related services, thereby enhancing their ability to leverage their innovative potential, protect their rights, and manage them effectively.';

const TISC_ABOUT_FALLBACK_P2 =
  'This network is part of the international program administered by the World Intellectual Property Organization (WIPO) concerning Technology and Innovation Support Centers (TISC), which aim to enhance the protection and management of IP in organizations globally.';

/** Two visual blocks for About TISC (Figma: 24px gap). Uses field_about_text + field_about_description, or splits one body at “. This network”. */
function normalizeTiscAboutParagraphs(
  primaryField?: string | null,
  secondaryField?: string | null,
): [string, string] {
  const primary = (primaryField ?? '').trim();
  const secondary = (secondaryField ?? '').trim();

  if (primary && secondary) {
    return [primary, secondary];
  }

  if (primary && !secondary) {
    const idx = primary.indexOf('. This network');
    if (idx !== -1) {
      return [primary.slice(0, idx + 1).trim(), primary.slice(idx + 2).trim()];
    }
    const parts = primary.split(/\n\s*\n/);
    if (parts.length >= 2) {
      return [parts[0].trim(), parts.slice(1).join('\n\n').trim()];
    }
    return [primary, ''];
  }

  return [TISC_ABOUT_FALLBACK_P1, TISC_ABOUT_FALLBACK_P2];
}

// Frontend data interfaces
export interface IPSupportCentersData {
  heroHeading: string;
  heroSubheading: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  overview: {
    aboutHeading: string;
    aboutParagraphs: [string, string];
    aboutImage: string;
    responsibilities: Array<{
      description: string;
      icon: string;
    }>;
    ctaBanner: {
      title: string;
      buttonLabel: string;
      buttonHref: string;
    };
    guidelines: GuidelineItemData[];
    statistics: StatisticsCardData[];
  };
  howToJoin: {
    title: string;
    description: string;
    steps: TimelineStepData[];
  };
  media: {
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    tabs: Array<{ id: string; label: string }>;
    content: Record<string, { title: string; description: string }>;
    filterFields: Array<{
      id: string;
      label: string;
      type: string;
      placeholder: string;
      variant?: 'single' | 'range';
    }>;
    badgeLabel: string;
  };
}

export type GuidelineItemData = GuideCardData;

export interface TimelineStepData {
  number: number;
  title: string;
  icon: string;
  details: Array<string | { label: string; href: string; external?: boolean }>;
}

// Drupal API functions
export async function fetchIPSupportCentersPage(
  locale?: string,
): Promise<DrupalResponse<DrupalNode>> {
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
  ];

  const endpoint = `/node/ip_support_centers_page?filter[status][value]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);
  return response;
}

// Transformation functions
export function transformStatisticsItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): StatisticsCardData {
  const attrs = (item as any).attributes || {};

  let chartData: Array<{ value: number }> = [];
  let trend: StatisticsCardData['trend'];

  // Support both old (field_chart_data) and new (field_stat_chart_data) formats
  const chartDataField = attrs.field_stat_chart_data || attrs.field_chart_data;
  if (chartDataField) {
    try {
      const parsed =
        typeof chartDataField === 'string' ? JSON.parse(chartDataField) : chartDataField;
      chartData = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse chart data:', e);
    }
  }

  // Handle trend - support both old and new field names
  const trendValue = attrs.field_stat_trend_value || attrs.field_trend_value;
  const trendDirection = attrs.field_stat_trend_direction || attrs.field_trend_direction;
  const trendDesc = attrs.field_stat_trend_desc || attrs.field_trend_description;
  if (trendValue && trendDirection) {
    trend = {
      value: trendValue,
      direction: trendDirection as 'up' | 'down' | 'neutral',
      description: trendDesc || '',
    };
  }

  // Support multiple label/value formats
  const label = attrs.field_stat_label || attrs.field_label || 'Untitled Statistic';
  const value = attrs.field_stat_value || attrs.field_value;

  return {
    label,
    value: value || 0,
    chartType: (attrs.field_stat_chart_type || attrs.field_chart_type || 'line') as
      | 'line'
      | 'pie'
      | 'bar',
    chartData,
    trend,
  };
}

export function transformGuidelineItem(
  item: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): GuidelineItemData {
  const attrs = (item as any).attributes || {};

  // Handle text_long format (value might be in .value property)
  const description = attrs.field_description?.value || attrs.field_description || '';

  // Handle labels - might be JSON string or array
  let labels: string[] = ['National Network of IP Support Centers'];
  if (attrs.field_labels) {
    try {
      labels =
        typeof attrs.field_labels === 'string'
          ? attrs.field_labels.startsWith('[')
            ? JSON.parse(attrs.field_labels)
            : [attrs.field_labels]
          : attrs.field_labels;
    } catch (e) {
      labels = [attrs.field_labels];
    }
  }

  return {
    title: attrs.title || 'Untitled Guide',
    description,
    labels,
    publicationDate: attrs.field_publication_date || '',
    primaryButtonLabel: attrs.field_primary_button_label || 'Download file',
    primaryButtonHref: attrs.field_primary_button_href || '#',
    secondaryButtonLabel: attrs.field_secondary_button_label || 'View file',
    secondaryButtonHref: attrs.field_secondary_button_href || '#',
    titleBg: (attrs.field_title_bg as 'default' | 'green') || 'default',
  };
}

export function transformTimelineStep(
  step: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): TimelineStepData {
  const attrs = (step as any).attributes || {};

  let details: Array<string | { label: string; href: string; external?: boolean }> = [];
  // field_details is text_long, so value might be in .value property
  const detailsRaw = attrs.field_details?.value || attrs.field_details;
  if (detailsRaw) {
    try {
      details = JSON.parse(detailsRaw);
    } catch (e) {
      // If not JSON, treat as single text item
      details = [detailsRaw];
    }
  }

  return {
    number: attrs.field_number || 0,
    title: attrs.field_title || attrs.title || 'Untitled Step',
    icon: attrs.field_icon || 'user',
    details,
  };
}

export function transformIPSupportCentersPage(
  node: DrupalNode,
  included: DrupalIncludedEntity[] = [],
): IPSupportCentersData {
  const attrs = node.attributes as any;

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

  // Get about image
  // ✅ field_about_image is an entity reference, so it's in relationships, not attributes
  const aboutImage = node.relationships?.field_about_image?.data
    ? (() => {
        const imageRel = getRelated(node.relationships || {}, 'field_about_image', included);
        return imageRel && !Array.isArray(imageRel)
          ? getImageWithAlt(imageRel, included)
          : undefined;
      })()
    : undefined;

  // Get responsibilities items
  const responsibilitiesData = node.relationships?.field_responsibilities_items
    ? getRelated(node.relationships, 'field_responsibilities_items', included) || []
    : [];
  const responsibilities = Array.isArray(responsibilitiesData)
    ? responsibilitiesData.map((item: DrupalIncludedEntity) => {
        const attrs = (item as any).attributes || {};
        return {
          description: extractText(attrs.field_description) || '',
          icon: attrs.field_icon || '',
        };
      })
    : [];

  // Get guidelines items
  const guidelinesData = node.relationships?.field_guidelines_items
    ? getRelated(node.relationships, 'field_guidelines_items', included) || []
    : [];
  const guidelines = Array.isArray(guidelinesData)
    ? guidelinesData.map((item: DrupalIncludedEntity) => transformGuidelineItem(item, included))
    : [];

  // Get statistics items
  const statisticsData = node.relationships?.field_statistics_items
    ? getRelated(node.relationships, 'field_statistics_items', included) || []
    : [];
  const statistics = Array.isArray(statisticsData)
    ? statisticsData.map((item: DrupalIncludedEntity) => transformStatisticsItem(item, included))
    : [];

  // Get how to join steps
  const howToJoinStepsData = node.relationships?.field_how_to_join_steps
    ? getRelated(node.relationships, 'field_how_to_join_steps', included) || []
    : [];
  const howToJoinSteps = Array.isArray(howToJoinStepsData)
    ? howToJoinStepsData.map((step: DrupalIncludedEntity) => transformTimelineStep(step, included))
    : [];

  // Get media tabs
  const mediaTabsData = node.relationships?.field_media_tabs
    ? getRelated(node.relationships, 'field_media_tabs', included) || []
    : [];
  const mediaTabs = Array.isArray(mediaTabsData)
    ? mediaTabsData.map((tab: DrupalIncludedEntity) => {
        const attrs = (tab as any).attributes || {};
        return {
          id: attrs.field_tab_id || 'tab',
          label: attrs.title || 'Untitled Tab',
        };
      })
    : [];

  return {
    heroHeading:
      extractText(attrs.field_hero_heading) || 'National network of IP support centers overview',
    heroSubheading:
      extractText(attrs.field_hero_subheading) ||
      'A national network to enable innovators to obtain technical information in the field of IP.',
    heroImage: heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined,
    overview: {
      aboutHeading: attrs.field_about_heading || 'About TISC',
      aboutParagraphs: normalizeTiscAboutParagraphs(
        extractText(attrs.field_about_text),
        extractText(attrs.field_about_description),
      ),
      aboutImage: aboutImage?.src || '/images/photo-container.png',
      responsibilities,
      ctaBanner: {
        title: attrs.field_cta_banner_title || 'Join TISC Network now',
        buttonLabel: attrs.field_cta_banner_button_label || 'Log in to TISC',
        buttonHref: attrs.field_cta_banner_button_href || '/tisc-login',
      },
      guidelines,
      statistics,
    },
    howToJoin: {
      title: attrs.field_how_to_join_title || 'How to join National network of IP support centers',
      description:
        extractText(attrs.field_how_to_join_description) ||
        'The steps to join National Network of IP Support Centers',
      steps: howToJoinSteps,
    },
    media: {
      heroTitle: extractText(attrs.field_media_hero_title) || 'Media for IP support centers',
      heroDescription:
        extractText(attrs.field_media_hero_description) ||
        'Here you can find news related to IP support centers.',
      heroImage: '/images/ip-support-centers/hero.jpg',
      tabs:
        mediaTabs.length > 0
          ? mediaTabs
          : [
              { id: 'news', label: 'News' },
              { id: 'videos', label: 'Videos' },
            ],
      content: {
        news: {
          title: 'News',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Get the latest information on IP support centers.',
        },
        videos: {
          title: 'Videos',
          description:
            extractText(attrs.field_media_hero_description) ||
            'Get the latest information related to National Network of IP Support Centers through videos.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        {
          id: 'date',
          label: 'Date',
          type: 'date',
          variant: 'range' as const,
          placeholder: 'Select date',
        },
      ],
      badgeLabel: 'IP Support Centers',
    },
  };
}

export function getIPSupportCentersFallbackData(): IPSupportCentersData {
  return {
    heroHeading: 'National network of IP support centers overview',
    heroSubheading:
      'A national network to enable innovators to obtain technical information in the field of IP and facilitate their access to related services.',
    heroImage: {
      src: '/images/ip-support-centers/hero.jpg',
      alt: 'IP Support Centers overview',
    },
    overview: {
      aboutHeading: 'About TISC',
      aboutParagraphs: [TISC_ABOUT_FALLBACK_P1, TISC_ABOUT_FALLBACK_P2],
      aboutImage: '/images/photo-container.png',
      responsibilities: [
        { description: 'Searching and retrieving technical information.', icon: 'AimIcon' },
        { description: 'Accessing and making use of IP publications.', icon: 'BookIcon' },
        {
          description: 'Making use of the databases of patents and scientific and technical data.',
          icon: 'ChartsIcon',
        },
        {
          description:
            'Providing information on the policies, systems and management of industrial property.',
          icon: 'CourtIcon',
        },
        {
          description: 'Providing basic information on the applicable IP-related regulations.',
          icon: 'MegaphoneIcon',
        },
        {
          description:
            'Providing-on-demand search services (such as novelty, search in the previous technology and infringements).',
          icon: 'InternetIcon',
        },
        {
          description: 'Making use of the training programs provided in the fields of IP.',
          icon: 'BrainIcon',
        },
        {
          description:
            'Holding sessions, lectures and meetings to raise the level of IP awareness.',
          icon: 'LightBulbIcon',
        },
        { description: 'Issuing IP-related reports.', icon: 'ChartsIcon' },
        {
          description: 'Enhancing access and making use of the Authority services.',
          icon: 'AimIcon',
        },
      ],
      ctaBanner: {
        title: 'Join TISC Network now',
        buttonLabel: 'Log in to TISC',
        buttonHref: '/tisc-login',
      },
      guidelines: [
        {
          title: 'TISC user guide',
          description: 'TISC user guide',
          labels: ['National Network of IP Support Centers'],
          publicationDate: '04.08.2024',
          primaryButtonLabel: 'Download file',
          primaryButtonHref: '/files/tisc-user-guide.pdf',
          secondaryButtonLabel: 'View file',
          secondaryButtonHref: '/files/tisc-user-guide.pdf',
          titleBg: 'default',
        },
        {
          title: 'TISC: partners relationship management',
          description: 'TISC: partners relationship management',
          labels: ['National Network of IP Support Centers'],
          publicationDate: '04.08.2024',
          primaryButtonLabel: 'Download file',
          primaryButtonHref: '/files/tisc-partners-relationship.pdf',
          secondaryButtonLabel: 'View file',
          secondaryButtonHref: '/files/tisc-partners-relationship.pdf',
          titleBg: 'default',
        },
      ],
      statistics: [
        {
          label: 'Number of IP Support Centers',
          value: 41,
          chartType: 'line',
          chartData: [
            { value: 20 },
            { value: 25 },
            { value: 30 },
            { value: 35 },
            { value: 38 },
            { value: 40 },
            { value: 41 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: 'Number of regions, network range',
          value: 10,
          chartType: 'line',
          chartData: [
            { value: 5 },
            { value: 6 },
            { value: 7 },
            { value: 8 },
            { value: 9 },
            { value: 9 },
            { value: 10 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: 'Number of Services',
          value: 86,
          chartType: 'line',
          chartData: [
            { value: 40 },
            { value: 50 },
            { value: 60 },
            { value: 70 },
            { value: 75 },
            { value: 80 },
            { value: 86 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
        {
          label: 'Number of Beneficiaries',
          value: 587,
          chartType: 'line',
          chartData: [
            { value: 200 },
            { value: 300 },
            { value: 400 },
            { value: 450 },
            { value: 500 },
            { value: 550 },
            { value: 587 },
          ],
          trend: { value: '100%', direction: 'up', description: 'vs last month' },
        },
      ],
    },
    howToJoin: {
      title: 'How to join National network of IP support centers',
      description: 'The steps to join National Network of IP Support Centers',
      steps: [
        {
          number: 1,
          title: 'Submission of an application to join the network',
          icon: 'user',
          details: [
            'Submit a request to join the network, you need to fill out the membership form on the SAIP platform.',
          ],
        },
        {
          number: 2,
          title: "Assessment of the applicant's eligibility",
          icon: 'user-plus',
          details: [
            'Upon receiving the membership request, the eligibility of the requesting entity will be assessed, along with its alignment with the terms of service.',
          ],
        },
        {
          number: 3,
          title: 'Completing the membership requirements',
          icon: 'clipboard-plus',
          details: [
            'A requirement to become a member of the Network of Support Centers involves training personnel and designing supporting services.',
          ],
        },
        {
          number: 4,
          title:
            "Connecting to the national network and the international community of the network on the IP Organization's platform",
          icon: 'key-round',
          details: [
            'Connect to the national network and international community through the IP Organization platform.',
          ],
        },
        {
          number: 5,
          title: 'Joining the network',
          icon: 'send',
          details: [
            "The launch will take place after completing the requirements, allowing for the leveraging of the network's services and benefits.",
          ],
        },
      ],
    },
    media: {
      heroTitle: 'Media for IP support centers',
      heroDescription: 'Here you can find news related to IP support centers.',
      heroImage: '/images/ip-support-centers/hero.jpg',
      tabs: [
        { id: 'news', label: 'News' },
        { id: 'videos', label: 'Videos' },
      ],
      content: {
        news: {
          title: 'News',
          description: 'Get the latest information on IP support centers.',
        },
        videos: {
          title: 'Videos',
          description:
            'Get the latest information related to National Network of IP Support Centers through videos.',
        },
      },
      filterFields: [
        { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
        {
          id: 'date',
          label: 'Date',
          type: 'date',
          variant: 'range' as const,
          placeholder: 'Select date',
        },
      ],
      badgeLabel: 'IP Support Centers',
    },
  };
}

export async function getIPSupportCentersPageData(locale?: string): Promise<IPSupportCentersData> {
  try {
    // Step 1: Fetch to get UUID (without locale to ensure we get the node)
    const initialResponse = await fetchDrupal<DrupalNode>(
      '/node/ip_support_centers_page?filter[status][value]=1',
      {},
      'en',
    );

    if (!initialResponse.data || initialResponse.data.length === 0) {
      console.log('🔴 IP SUPPORT CENTERS: No content found, using fallback data');
      return getIPSupportCentersFallbackData();
    }

    const nodeUuid = initialResponse.data[0].id;

    // Step 2: Fetch with UUID and locale to get translated content
    const includeFields = [
      'field_hero_background_image',
      'field_hero_background_image.field_media_image',
      'field_about_image',
      'field_about_image.field_media_image',
      'field_responsibilities_items',
      'field_guidelines_items',
      'field_statistics_items',
      'field_how_to_join_steps',
    ];

    const response = await fetchDrupal<DrupalNode>(
      `/node/ip_support_centers_page/${nodeUuid}?include=${includeFields.join(',')}`,
      {},
      locale,
    );

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    const included = response.included || [];

    const data = transformIPSupportCentersPage(node, included);

    // Fetch statistics paragraphs separately
    const nodeNid = (node.attributes as any).drupal_internal__nid;
    try {
      const allParagraphsResponse = await fetchDrupal<DrupalIncludedEntity>(
        `/paragraph/statistics_item`,
        {},
        locale,
      );
      const allStatisticsParagraphs = Array.isArray(allParagraphsResponse.data)
        ? allParagraphsResponse.data
        : [];
      const matchingParagraphs = allStatisticsParagraphs.filter((p: any) => {
        const parentId = p.attributes?.parent_id;
        return (
          (parentId === String(nodeNid) || parentId === nodeNid) &&
          p.attributes?.parent_field_name === 'field_statistics_items'
        );
      });
      console.log(
        `📊 IP SUPPORT CENTERS: Stats paragraphs: ${matchingParagraphs.length} (parent_id=${nodeNid})`,
      );
      if (matchingParagraphs.length > 0) {
        data.overview.statistics = matchingParagraphs.map((p: DrupalIncludedEntity) =>
          transformStatisticsItem(p, []),
        );
      }
    } catch (statsError) {
      console.log(`⚠️ IP SUPPORT CENTERS: Could not fetch statistics paragraphs`);
    }

    console.log(`✅ IP SUPPORT CENTERS: Using Drupal data (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(
      `🔴 IP SUPPORT CENTERS: Error fetching data, using fallback data (${locale || 'en'})`,
      error,
    );
    return getIPSupportCentersFallbackData();
  }
}
