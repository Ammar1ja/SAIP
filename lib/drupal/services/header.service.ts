/**
 * Header Navigation Service
 * Fetches menu items from Drupal for header navigation
 */

import { fetchDrupal } from '../utils';

export interface MenuItem {
  id: string;
  title: string;
  href: string;
  section: string; // 'saip', 'services', 'resources', 'media', 'contact'
  group?: string; // For dropdown grouping
  weight: number;
  icon?: string; // Icon component name
}

export interface NavigationData {
  saipLinks: MenuItem[];
  servicesLinks: MenuItem[];
  resourcesLinks: MenuItem[];
  mediaCenterLinks: MenuItem[];
  contactLinks: MenuItem[];
}

/**
 * Fetch all menu items from Drupal
 */
export async function getNavigationData(locale?: string): Promise<NavigationData> {
  try {
    const response = await fetchDrupal(
      '/node/menu_item?filter[status]=1&sort=field_menu_weight',
      {},
      locale,
    );

    const menuItems: MenuItem[] = response.data.map((node: any) => ({
      id: node.id,
      title: node.attributes.title,
      href: node.attributes.field_menu_href,
      section: node.attributes.field_menu_section,
      group: node.attributes.field_menu_group || undefined,
      weight: node.attributes.field_menu_weight || 0,
      icon: node.attributes.field_menu_icon || undefined,
    }));

    // Group by section
    const saipLinks = menuItems.filter((item) => item.section === 'saip');
    const servicesLinks = menuItems.filter((item) => item.section === 'services');
    const resourcesLinks = menuItems.filter((item) => item.section === 'resources');
    const mediaCenterLinks = menuItems.filter((item) => item.section === 'media');
    const contactLinks = menuItems.filter((item) => item.section === 'contact');

    return {
      saipLinks,
      servicesLinks,
      resourcesLinks,
      mediaCenterLinks,
      contactLinks,
    };
  } catch (error) {
    console.error(`🔴 HEADER: Failed to load navigation (${locale || 'en'})`, error);
    // Return empty arrays as fallback
    return {
      saipLinks: [],
      servicesLinks: [],
      resourcesLinks: [],
      mediaCenterLinks: [],
      contactLinks: [],
    };
  }
}

/**
 * Get menu items for a specific section
 */
export async function getMenuItemsBySection(section: string, locale?: string): Promise<MenuItem[]> {
  const data = await getNavigationData(locale);
  switch (section) {
    case 'saip':
      return data.saipLinks;
    case 'services':
      return data.servicesLinks;
    case 'resources':
      return data.resourcesLinks;
    case 'media':
      return data.mediaCenterLinks;
    case 'contact':
      return data.contactLinks;
    default:
      return [];
  }
}
