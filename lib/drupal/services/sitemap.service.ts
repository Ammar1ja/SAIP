import { fetchDrupal } from '../utils';
import { extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import { getNavigationData, MenuItem } from './header.service';
import { SitemapListItems } from '@/components/molecules/SitemapList/SitemapList.types';

// Hero data for sitemap page
export interface SitemapPageData {
  hero: {
    title: string;
    description: string;
  };
  sections: SitemapListItems[];
}

// Step 1: Fetch UUID (without locale to get canonical)
async function fetchSitemapPageUUID(): Promise<string | null> {
  try {
    const endpoint = `/node/sitemap_page?filter[status]=1&fields[node--sitemap_page]=drupal_internal__nid`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {});
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch sitemap page UUID:', error);
    return null;
  }
}

// Step 2: Fetch by UUID with locale
async function fetchSitemapPageByUUID(
  uuid: string,
  locale?: string,
): Promise<{ node: DrupalNode; included: DrupalIncludedEntity[] } | null> {
  try {
    const endpoint = `/node/sitemap_page/${uuid}`;
    const response = await fetchDrupal<DrupalNode>(endpoint, {}, locale);

    if (!response.data) {
      return null;
    }

    const node = Array.isArray(response.data) ? response.data[0] : response.data;
    return {
      node,
      included: response.included || [],
    };
  } catch (error) {
    console.error(`Failed to fetch sitemap page by UUID (${locale}):`, error);
    return null;
  }
}

// Transform navigation data to SitemapListItems format
function transformNavigationToSitemap(
  navData: Awaited<ReturnType<typeof getNavigationData>>,
  sectionLabels: Record<string, string>,
  groupLabels?: Record<string, string>,
): SitemapListItems[] {
  const sections: SitemapListItems[] = [];

  // SAIP section
  if (navData.saipLinks.length > 0) {
    sections.push({
      label: sectionLabels.saip || 'SAIP',
      children: transformMenuItems(navData.saipLinks, groupLabels),
    });
  }

  // Services section
  if (navData.servicesLinks.length > 0) {
    sections.push({
      label: sectionLabels.services || 'Services',
      children: transformMenuItems(navData.servicesLinks, groupLabels),
    });
  }

  // Resources section
  if (navData.resourcesLinks.length > 0) {
    sections.push({
      label: sectionLabels.resources || 'Resources',
      children: transformMenuItems(navData.resourcesLinks, groupLabels),
    });
  }

  // Media Center section
  if (navData.mediaCenterLinks.length > 0) {
    sections.push({
      label: sectionLabels.mediaCenter || 'Media Center',
      children: transformMenuItems(navData.mediaCenterLinks, groupLabels),
    });
  }

  // Contact section
  if (navData.contactLinks.length > 0) {
    sections.push({
      label: sectionLabels.contact || 'Contact us',
      children: transformMenuItems(navData.contactLinks, groupLabels),
    });
  }

  return sections;
}

// Transform menu items to sitemap format, grouping by group field
function transformMenuItems(
  items: MenuItem[],
  groupLabels?: Record<string, string>,
): SitemapListItems[] {
  // Group items by their group field
  const grouped = items.reduce(
    (acc, item) => {
      const group = item.group || 'default';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  // If all items are in 'default' group, return flat list
  if (Object.keys(grouped).length === 1 && grouped['default']) {
    return grouped['default'].map((item) => ({
      label: item.title,
      href: item.href,
    }));
  }

  // Otherwise, create nested structure with translated group names
  return Object.entries(grouped)
    .map(([groupName, groupItems]) => {
      if (groupName === 'default') {
        // Items without group go at top level
        return groupItems.map((item) => ({
          label: item.title,
          href: item.href,
        }));
      }
      // Use translated group name if available
      const translatedGroupName = groupLabels?.[groupName] || groupName;
      return {
        label: translatedGroupName,
        children: groupItems.map((item) => ({
          label: item.title,
          href: item.href,
        })),
      };
    })
    .flat();
}

// Fallback data
function getSitemapFallbackData(): SitemapPageData {
  return {
    hero: {
      title: 'Sitemap',
      description:
        'A sitemap serves as a guide, simplifying navigation and making information on the website easier to locate.',
    },
    sections: [],
  };
}

// Main export function
export async function getSitemapPageData(
  locale?: string,
  sectionLabels?: Record<string, string>,
  groupLabels?: Record<string, string>,
): Promise<SitemapPageData> {
  try {
    // Fetch navigation data for sitemap sections
    const navData = await getNavigationData(locale);

    // Default section labels
    const labels = sectionLabels || {
      saip: 'SAIP',
      services: 'Services',
      resources: 'Resources',
      mediaCenter: 'Media Center',
      contact: 'Contact us',
    };

    // Try to fetch hero from Drupal sitemap_page content type
    let hero = {
      title: 'Sitemap',
      description: 'A sitemap serves as a guide, simplifying navigation.',
    };

    try {
      const uuid = await fetchSitemapPageUUID();
      if (uuid) {
        const result = await fetchSitemapPageByUUID(uuid, locale);
        if (result) {
          const attrs = result.node.attributes as any;
          hero = {
            title: extractText(attrs.field_hero_heading) || extractText(attrs.title) || hero.title,
            description: extractText(attrs.field_hero_subheading) || hero.description,
          };
        }
      }
    } catch (error) {
      console.log('Sitemap hero not found in Drupal, using default');
    }

    // Transform navigation to sitemap format with translated group names
    const sections = transformNavigationToSitemap(navData, labels, groupLabels);

    console.log(
      `🟢 SITEMAP: Generated from navigation (${locale || 'en'}) - ${sections.length} sections`,
    );

    return {
      hero,
      sections,
    };
  } catch (error) {
    console.error(`🔴 SITEMAP: Error generating sitemap (${locale || 'en'})`, error);
    return getSitemapFallbackData();
  }
}
