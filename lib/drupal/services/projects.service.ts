/**
 * Projects Service
 * Handles data fetching and transformation for projects page
 */

import { fetchDrupal, getRelated, getImageWithAlt, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity, DrupalProjectsPageNode, DrupalProject } from '../types';

// Frontend data interfaces
export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  reference: string;
  tenderStage: string;
  mainActivity: string;
  tenderType: string;
  tenderFees: string;
  publicationDate: string;
  announcementVendor: string;
  bidSubmissionDeadline: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
}

export interface ProjectsPageData {
  // Hero section
  title: string;
  description: string;
  heroImage?: {
    url: string;
    alt: string;
  };

  // Etimad section
  etimadUrl: string;
  etimadText: string;

  // Projects list
  projects: ProjectData[];
}

/**
 * Fetch projects page data from Drupal
 */
export async function fetchProjectsPage(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  // Only include fields that exist as relationships in Drupal
  // Available: field_projects
  const includeFields = [
    'field_hero_background_image',
    'field_hero_background_image.field_media_image',
    'field_projects',
  ];

  // Use the correct content type that exists in Drupal
  const endpoint = `/node/projects_page?filter[status]=1&include=${includeFields.join(',')}`;
  const response = await fetchDrupal(endpoint, {}, locale);

  if (response.data && response.data.length > 0) {
    return { nodes: response.data, included: response.included || [] };
  }

  throw new Error('No Projects page content found');
}

/**
 * Fetch individual projects from Drupal
 */
export async function fetchProjects(locale?: string): Promise<{
  nodes: DrupalNode[];
  included: DrupalIncludedEntity[];
}> {
  const includeFields = [
    'field_image',
    'field_image.field_media_image',
    'field_tender_stage',
    'field_activity',
    'field_tender_type',
  ];

  const possibleContentTypes = ['project', 'tender'];

  for (const contentType of possibleContentTypes) {
    try {
      const endpoint = `/node/${contentType}?filter[status]=1&include=${includeFields.join(',')}`;
      const response = await fetchDrupal(endpoint, {}, locale);

      console.log(`🔍 PROJECTS: Trying ${contentType} - got ${response.data?.length || 0} nodes`);
      console.log(`🔍 PROJECTS: Included entities count: ${response.included?.length || 0}`);

      if (response.included && response.included.length > 0) {
        console.log(
          `🔍 PROJECTS: Included types:`,
          response.included.map((i) => i.type),
        );
      }

      if (response.data && response.data.length > 0) {
        console.log(`✅ PROJECTS: Found content in ${contentType}`);

        // DEBUG: Show first node relationships
        const firstNode = response.data[0];
        if (firstNode.relationships) {
          console.log(`🐛 First node relationships:`, Object.keys(firstNode.relationships));
          console.log(
            `🐛 field_tender_stage data:`,
            firstNode.relationships.field_tender_stage?.data,
          );
          console.log(`🐛 field_activity data:`, firstNode.relationships.field_activity?.data);
          console.log(
            `🐛 field_tender_type data:`,
            firstNode.relationships.field_tender_type?.data,
          );
        }

        return { nodes: response.data, included: response.included || [] };
      }
    } catch (error) {
      console.log(`❌ PROJECTS: Failed ${contentType} - ${(error as Error).message}`);
      continue;
    }
  }

  throw new Error('No Projects content found');
}

/**
 * Transform Drupal project data to frontend format
 */
export function transformProject(
  project: DrupalProject,
  included: DrupalIncludedEntity[] = [],
): ProjectData {
  // Get attributes from Drupal node structure
  const attrs = (project as any).attributes || {};

  // Get relationships from Drupal node structure
  const relationships = (project as any).relationships || {};

  const imageRel = relationships.field_image
    ? getRelated(relationships, 'field_image', included)
    : undefined;
  const image =
    imageRel && !Array.isArray(imageRel) ? getImageWithAlt(imageRel, included) : undefined;

  // Get taxonomy terms from relationships
  const tenderStageTerms = relationships.field_tender_stage
    ? getRelated(relationships, 'field_tender_stage', included) || []
    : [];
  const activityTerms = relationships.field_activity
    ? getRelated(relationships, 'field_activity', included) || []
    : [];
  const tenderTypeTerms = relationships.field_tender_type
    ? getRelated(relationships, 'field_tender_type', included) || []
    : [];

  const tenderStageTerm = Array.isArray(tenderStageTerms) ? tenderStageTerms[0] : tenderStageTerms;
  const activityTerm = Array.isArray(activityTerms) ? activityTerms[0] : activityTerms;
  const tenderTypeTerm = Array.isArray(tenderTypeTerms) ? tenderTypeTerms[0] : tenderTypeTerms;

  // Format dates for display - returns "DD/MM/YYYY" for publicationDate and "HH:MM AM|PM DD/MM/YYYY" for deadline
  const normalizeDateValue = (value?: string | number) => {
    if (!value) return '';
    if (typeof value === 'number') {
      return value < 10_000_000_000 ? value * 1000 : value;
    }
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
    }
    return trimmed;
  };

  const formatPublicationDate = (dateString: string | number) => {
    const normalized = normalizeDateValue(dateString);
    if (!normalized) return '';
    try {
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return String(dateString);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return String(dateString);
    }
  };

  const formatDeadline = (dateString: string | number) => {
    const normalized = normalizeDateValue(dateString);
    if (!normalized) return '';
    try {
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return String(dateString);

      const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const dateStr = `${day}/${month}/${year}`;

      return `${time} ${dateStr}`;
    } catch {
      return String(dateString);
    }
  };

  const rawSlug =
    attrs.field_slug ||
    attrs.field_reference ||
    project.id ||
    attrs.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: project.id,
    slug: (rawSlug || project.id).toString(),
    title: attrs.title || 'Untitled Project',
    reference: attrs.field_reference || '',
    tenderStage: (tenderStageTerm?.attributes?.name as string) || 'Unknown',
    mainActivity: (activityTerm?.attributes?.name as string) || 'Unknown',
    tenderType: (tenderTypeTerm?.attributes?.name as string) || 'Unknown',
    tenderFees: attrs.field_tender_fees || 'Results have not been announced yet',
    publicationDate: formatPublicationDate(
      attrs.field_publication_date || attrs.created || attrs.changed,
    ),
    announcementVendor: attrs.field_announcement_vendor || 'Results have not been announced yet',
    bidSubmissionDeadline: formatDeadline(attrs.field_bid_submission_deadline),
    description: extractText(attrs.field_description),
    image: image ? { url: image.src, alt: image.alt } : project.image,
  };
}

/**
 * Transform Drupal projects page data to frontend format
 */
export function transformProjectsPage(
  node: DrupalProjectsPageNode,
  included: DrupalIncludedEntity[],
): ProjectsPageData {
  const attrs = node.attributes as any;

  // Get hero image
  // ✅ field_hero_background_image is an entity reference, so it's in relationships, not attributes
  const rels = node.relationships as any;
  const heroImage = rels?.field_hero_background_image?.data
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

  // Get projects
  const projectsData = node.relationships?.field_projects
    ? getRelated(node.relationships, 'field_projects', included) || []
    : [];
  const projects = Array.isArray(projectsData)
    ? projectsData.map((project: DrupalIncludedEntity) =>
        transformProject(project as any, included),
      )
    : [];

  return {
    title: attrs.title,
    description: extractText(attrs.body) || 'Learn more about our projects and initiatives',
    heroImage: heroImage ? { url: heroImage.src, alt: heroImage.alt } : undefined,
    etimadUrl: 'https://etimad.sa',
    etimadText: 'Go to Etimad platform',
    projects,
  };
}

/**
 * Get fallback data for projects page
 */
export function getProjectsFallbackData(locale?: string): ProjectsPageData {
  return {
    title: locale === 'ar' ? 'مشاريع الهيئة' : 'SAIP Projects',
    description:
      locale === 'ar'
        ? 'تعرف على المزيد حول مشاريعنا ومبادراتنا'
        : 'Learn more about our projects and initiatives',
    heroImage: {
      url: '/images/projects/hero.jpg',
      alt: 'Projects',
    },
    etimadUrl: 'https://etimad.sa',
    etimadText: locale === 'ar' ? 'الانتقال إلى منصة اعتماد' : 'Go to Etimad platform',
    projects: [
      {
        id: '1',
        slug: '1',
        title: locale === 'ar' ? 'تدريب أكاديمية الملكية الفكرية 2024' : 'IP Academy Training 2024',
        reference: '220939662341',
        tenderStage: 'Open',
        mainActivity: 'Training',
        tenderType: 'Electronic reverse bidding',
        tenderFees: 'Results have not been announced yet',
        publicationDate: '10.10.2024',
        announcementVendor: 'Results have not been announced yet',
        bidSubmissionDeadline: '10:09 AM 15.10.24',
      },
      {
        id: '2',
        slug: '2',
        title: 'Patent Management System',
        reference: '220939662342',
        tenderStage: 'Closed',
        mainActivity: 'IT services',
        tenderType: 'Direct purchase',
        tenderFees: 'SAR 500',
        publicationDate: '01.09.2024',
        announcementVendor: 'Vendor A',
        bidSubmissionDeadline: '12:00 PM 05.09.24',
      },
      {
        id: '3',
        slug: '3',
        title: 'Trademark Awareness Campaign',
        reference: '220939662343',
        tenderStage: 'Awarded',
        mainActivity: 'Marketing',
        tenderType: 'Public tender',
        tenderFees: 'SAR 1000',
        publicationDate: '15.08.2024',
        announcementVendor: 'Vendor B',
        bidSubmissionDeadline: '03:00 PM 20.08.24',
      },
      {
        id: '4',
        slug: '4',
        title: 'Copyrights Digitalization',
        reference: '220939662344',
        tenderStage: 'Open',
        mainActivity: 'Consulting services',
        tenderType: 'Electronic reverse bidding',
        tenderFees: 'Results have not been announced yet',
        publicationDate: '10.10.2024',
        announcementVendor: 'Results have not been announced yet',
        bidSubmissionDeadline: '10:09 AM 15.10.24',
      },
      {
        id: '5',
        slug: '5',
        title: 'IP Enforcement Platform',
        reference: '220939662345',
        tenderStage: 'Closed',
        mainActivity: 'IT services',
        tenderType: 'Direct purchase',
        tenderFees: 'SAR 800',
        publicationDate: '20.07.2024',
        announcementVendor: 'Vendor C',
        bidSubmissionDeadline: '11:00 AM 25.07.24',
      },
      {
        id: '6',
        slug: '6',
        title: 'Designs Registration Portal',
        reference: '220939662346',
        tenderStage: 'Awarded',
        mainActivity: 'Web development',
        tenderType: 'Public tender',
        tenderFees: 'SAR 1200',
        publicationDate: '05.06.2024',
        announcementVendor: 'Vendor D',
        bidSubmissionDeadline: '09:00 AM 10.06.24',
      },
    ],
  };
}

/**
 * Main function to get projects page data
 */
export async function getProjectsPageData(locale?: string): Promise<ProjectsPageData> {
  try {
    const { nodes, included } = await fetchProjectsPage(locale);

    if (nodes.length === 0) {
      console.log('🔴 PROJECTS PAGE: No content found, using fallback data');
      return getProjectsFallbackData(locale);
    }

    const node = nodes[0] as DrupalProjectsPageNode;
    const data = transformProjectsPage(node, included);

    console.log(`✅ PROJECTS PAGE: Using Drupal data (${locale || 'en'})`);
    return data;
  } catch (error) {
    console.log(`🔴 PROJECTS PAGE: Error fetching data, using fallback data (${locale || 'en'})`);
    return getProjectsFallbackData(locale);
  }
}

/**
 * Get individual projects data
 */
export async function getProjectsData(locale?: string): Promise<ProjectData[]> {
  try {
    const { nodes, included } = await fetchProjects(locale);

    if (nodes.length === 0) {
      console.log('🔴 PROJECTS: No content found, using fallback data');
      return getProjectsFallbackData(locale).projects;
    }

    const projects = nodes.map((node: DrupalNode) =>
      transformProject(node as unknown as DrupalProject, included),
    );

    console.log(`✅ PROJECTS: Using Drupal data (${locale || 'en'})`);
    return projects;
  } catch (error) {
    console.log(`🔴 PROJECTS: Error fetching data, using fallback data (${locale || 'en'})`);
    return getProjectsFallbackData(locale).projects;
  }
}

export async function getProjectDetail(slug: string, locale?: string): Promise<ProjectData | null> {
  const projects = await getProjectsData(locale);
  return (
    projects.find(
      (project) =>
        project.slug === slug ||
        project.id === slug ||
        project.reference === slug ||
        project.slug === slug.toLowerCase(),
    ) || null
  );
}
