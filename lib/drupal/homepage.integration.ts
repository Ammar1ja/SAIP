/**
 * Homepage Integration
 * Seamlessly integrate Drupal CMS with existing page.tsx components
 * Includes fallback to dummyCms data according to SAIP rules
 */

import { getHomepagePageData, type HomepageData } from './services/homepage.service';
import { fetchIpDomains } from './services/ip-domains.service';
import { allHighlights } from '@/lib/dummyCms/allHighlight';

// Extended HomepageData with services items
export interface ExtendedHomepageData extends HomepageData {
  services: HomepageData['services'] & {
    items?: Array<{ title: string; href: string }>;
  };
}

/**
 * Get homepage data with smart fallback handling
 * Integrates Drupal data with existing fallback data according to SAIP rules
 */
export async function getHomepageData(locale?: string): Promise<ExtendedHomepageData> {
  try {
    // Fetch homepage and IP domains in parallel
    const [drupalData, ipDomains] = await Promise.all([
      getHomepagePageData(locale),
      fetchIpDomains(locale),
    ]);

    // Merge with fallback highlights if empty
    if (drupalData.highlights.highlights.length === 0) {
      drupalData.highlights.highlights = allHighlights.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        buttonHref: item.buttonHref,
      })) as any;
    }

    // Add IP domains to services section
    return {
      ...drupalData,
      services: {
        ...drupalData.services,
        items: ipDomains.map((d) => ({ title: d.title, href: d.href })),
      },
    };
  } catch (error) {
    // Failed to fetch homepage data from Drupal, using fallback

    // Return complete fallback data
    const fallbackData: ExtendedHomepageData = {
      hero: {
        heading: '',
        subheading: '',
        videos: [
          {
            id: '1',
            url: '/videos/homepage.mp4',
            title: 'Saudi Authority for Intellectual Property',
          },
        ],
      },
      about: {
        heading: 'About SAIP',
        text: "SAIP aims to guide, protect, manage and enforce beneficiaries' IP in the Kingdom in line with international best practices.",
        image: '/images/photo-container.png',
      },
      services: {
        heading: 'Main IP Services',
        text: 'Intellectual property is the set of rights that protect human innovations and creations. At SAIP, through a wide range of services, we take care of IPs in multiple stages from guidance, protection, management to enforcement. Learn more about our Main IP Services:',
        items: [
          { title: 'Patents', href: '/services/patents' },
          { title: 'Trademarks', href: '/services/trademarks' },
          { title: 'Copyrights', href: '/services/copyrights' },
          { title: 'Designs', href: '/services/designs' },
          {
            title: 'Layout designs of IC',
            href: '/services/layout-designs-of-integrated-circuits',
          },
          { title: 'Plant varieties', href: '/services/plant-varieties' },
        ],
      },
      featuredNews: {
        title: 'Featured news',
        text: 'Stay informed with the latest updates from the SAIP including key announcements, policy changes, initiatives, and developments in the IP sector.',
        items: [],
      },
      highlights: {
        heading: 'Highlights',
        text: 'Discover key sections of the SAIP website and access essential services, regulations, and resources designed to support and protect IP',
        highlights: allHighlights.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          buttonHref: item.buttonHref,
        })) as any,
      },
      lastModifiedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '/'),
    };

    return fallbackData;
  }
}

/**
 * Note: Hero component manages videos internally from allVideos
 * We don't need to pass videos as props
 */

/**
 * Transform service text for component compatibility
 * Handles both JSX and string content from Drupal
 */
export function transformServiceText(text: React.ReactNode | string) {
  if (typeof text === 'string') {
    return text;
  }
  return text;
}

/**
 * Transform news text for component compatibility
 * Handles both JSX and string content from Drupal
 */
export function transformNewsText(text: React.ReactNode | string) {
  if (typeof text === 'string') {
    // Return string - JSX transformation happens in component
    return text;
  }
  return text;
}

/**
 * Note: API URL configuration moved to drupalConfig in config.ts
 * Automatic environment detection for development/test/staging/production
 */
