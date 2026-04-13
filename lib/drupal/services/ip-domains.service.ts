/**
 * IP Domains Service
 * Fetches Main IP Services data from Drupal (Patents, Trademarks, etc.)
 */

import { fetchDrupal, extractText } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';

export interface IpDomainItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  weight: number;
}

/**
 * Fetch IP Domains that should display in Main IP Services
 */
export async function fetchIpDomains(locale?: string): Promise<IpDomainItem[]> {
  try {
    // Filter by field_display_in_main_ip_page = true, sort by weight
    const endpoint = `/node/ip_domain?filter[status][value]=1&filter[field_display_in_main_ip_page][value]=1&sort=field_weight`;
    const response = await fetchDrupal(endpoint, {}, locale);

    if (!response.data || !Array.isArray(response.data)) {
      console.log('🔴 [IP_DOMAINS] No data returned from API');
      return getIpDomainsFallback();
    }

    // ✅ CRITICAL FIX: Filter nodes to match target locale
    // API may return all language versions, we need only the correct one
    const targetLangcode = locale === 'ar' ? 'ar' : 'en';
    const filteredNodes = response.data.filter((node: DrupalNode) => {
      const nodeLangcode = (node.attributes as any)?.langcode || 'en';
      return nodeLangcode === targetLangcode;
    });

    if (filteredNodes.length === 0) {
      console.log(`🔴 [IP_DOMAINS] No nodes found for locale ${targetLangcode}, using fallback`);
      return getIpDomainsFallback();
    }

    const items: IpDomainItem[] = filteredNodes.map((node: DrupalNode, index: number) => {
      const attrs = node.attributes as any;

      // Extract link from field_portal_link
      const portalLink = attrs.field_portal_link;
      let href = '/services/patents'; // default

      if (portalLink) {
        if (typeof portalLink === 'string') {
          href = portalLink;
        } else if (portalLink.uri) {
          // Handle Drupal link field format
          href = portalLink.uri.replace('internal:', '');
        }
      }

      return {
        id: node.id || `ip-domain-${index}`,
        title: attrs.title || '',
        href,
        icon: attrs.field_icon_name || '',
        weight: attrs.field_weight || index,
      };
    });

    return items;
  } catch (error) {
    console.error('❌ [IP_DOMAINS] Error fetching:', error);
    return getIpDomainsFallback();
  }
}

/**
 * Fallback data when API fails
 */
export function getIpDomainsFallback(): IpDomainItem[] {
  return [
    { id: '1', title: 'Patents', href: '/services/patents', icon: 'patents', weight: 1 },
    { id: '2', title: 'Trademarks', href: '/services/trademarks', icon: 'trademarks', weight: 2 },
    { id: '3', title: 'Copyrights', href: '/services/copyrights', icon: 'copyrights', weight: 3 },
    { id: '4', title: 'Designs', href: '/services/designs', icon: 'designs', weight: 4 },
    {
      id: '5',
      title: 'Layout designs of IC',
      href: '/services/layout-designs-of-integrated-circuits',
      icon: 'ic',
      weight: 5,
    },
    {
      id: '6',
      title: 'Plant varieties',
      href: '/services/plant-varieties',
      icon: 'plants',
      weight: 6,
    },
  ];
}
