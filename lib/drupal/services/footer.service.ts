/**
 * Footer Service
 * Fetches footer configuration from Drupal
 */

import { fetchDrupal } from '../utils';
import { DrupalNode } from '../types';
import { ROUTES } from '@/lib/routes';
import { unstable_cache } from 'next/cache';

/**
 * Convert Western digits to Arabic-Indic digits
 */
function toArabicNumerals(str: string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

function parseTimestampToDate(timestamp: string | number): Date {
  if (typeof timestamp === 'number') {
    // Treat small numbers as unix seconds, otherwise unix milliseconds.
    return new Date(timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp);
  }

  const trimmed = String(timestamp).trim();
  if (!trimmed) return new Date(NaN);

  // Numeric strings may be seconds or milliseconds.
  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
  }

  // ISO-like datetime strings (Drupal changed often returns this format).
  return new Date(trimmed);
}

/**
 * Format timestamp to DD/MM/YYYY
 * @param locale - Optional locale for number formatting (ar for Arabic numerals)
 */
function formatDateToDDMMYYYY(timestamp: string | number, locale?: string): string {
  const date = parseTimestampToDate(timestamp);
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    const fallbackFormatted = `${String(fallback.getDate()).padStart(2, '0')}/${String(
      fallback.getMonth() + 1,
    ).padStart(2, '0')}/${fallback.getFullYear()}`;
    return locale === 'ar' ? toArabicNumerals(fallbackFormatted) : fallbackFormatted;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formatted = `${day}/${month}/${year}`;

  // Convert to Arabic numerals if locale is 'ar'
  return locale === 'ar' ? toArabicNumerals(formatted) : formatted;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  items: FooterLink[];
}

export interface FooterData {
  sections: FooterSection[];
  socialLinks: FooterLink[];
  legalLinks: FooterLink[];
  lastModifiedDate: string;
}

/**
 * Transform Drupal link field to FooterLink array
 */
function transformLinks(links: any[]): FooterLink[] {
  if (!Array.isArray(links)) return [];

  return links.map((link) => ({
    label: link.title || '',
    href: link.uri?.replace('internal:', '') || '#',
  }));
}

/**
 * Fetch footer data from Drupal
 */
export async function fetchFooter(locale?: string): Promise<FooterData> {
  try {
    const response = await fetchDrupal('/node/site_footer?filter[status]=1', {}, locale);

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log('🔴 [FOOTER] No data returned, using fallback');
      return getFooterFallback(locale);
    }

    const node: DrupalNode = response.data[0];
    const attrs = node.attributes as any;

    const data: FooterData = {
      sections: [
        {
          title: 'saip', // Translation key
          items: transformLinks(attrs.field_footer_saip_links || []),
        },
        {
          title: 'ipInformation', // Translation key
          items: transformLinks(attrs.field_footer_ip_info_links || []),
        },
        {
          title: 'toolsResearch', // Translation key
          items: transformLinks(attrs.field_footer_tools_links || []),
        },
        {
          title: 'importantLinks', // Translation key
          items: transformLinks(attrs.field_footer_licensing_links || []),
        },
        {
          title: 'mediaContact', // Translation key
          items: transformLinks(attrs.field_footer_services_links || []),
        },
      ].filter((section) => section.items.length > 0),
      socialLinks: transformLinks(attrs.field_footer_social_links || []),
      legalLinks: transformLinks(attrs.field_footer_legal_links || []),
      lastModifiedDate:
        attrs.field_global_last_modified || attrs.changed
          ? formatDateToDDMMYYYY(attrs.field_global_last_modified || attrs.changed, locale)
          : formatDateToDDMMYYYY(Date.now() / 1000, locale),
    };

    return data;
  } catch (error) {
    console.error('❌ [FOOTER] Error fetching:', error);
    return getFooterFallback(locale);
  }
}

const fetchFooterCachedInternal = unstable_cache(
  async (locale: string) => fetchFooter(locale),
  ['site-footer'],
  {
    revalidate: 300,
    tags: ['drupal:site_footer', 'drupal:global'],
  },
);

export async function fetchFooterCached(locale?: string): Promise<FooterData> {
  return fetchFooterCachedInternal(locale || 'en');
}

/**
 * Fallback footer data
 */
export function getFooterFallback(locale?: string): FooterData {
  return {
    sections: [
      {
        title: 'saip', // Translation key
        items: [
          { label: 'About SAIP', href: '/saip/about' },
          { label: 'National IP strategy', href: '/saip/national-ip-strategy' },
          { label: 'Organisational structure', href: '/saip/organisational-structure' },
          { label: 'SAIP projects', href: '/saip/projects' },
          { label: 'Entities & partners', href: '/saip/entities-partners' },
        ],
      },
      {
        title: 'ipInformation', // Translation key
        items: [
          { label: 'Digital guide', href: '/resources/ip-information/digital-guide' },
          { label: 'Guidelines', href: '/resources/ip-information/guidelines' },
          { label: 'FAQs', href: '/resources/ip-information/faq' },
          { label: 'IP glossary', href: '/resources/ip-information/ip-glossary' },
          { label: 'Reports', href: '/resources/ip-information/reports' },
        ],
      },
      {
        title: 'toolsResearch', // Translation key
        items: [
          { label: 'IP search engine', href: '/resources/tools-and-research/ip-search-engine' },
          { label: 'Gazette', href: '/resources/tools-and-research/gazette' },
          { label: 'Publications', href: '/resources/tools-and-research/publications' },
          { label: 'IP observatory', href: '/resources/tools-and-research/ip-observatory' },
          { label: 'Open data', href: '/resources/tools-and-research/open-data' },
          {
            label: 'Public consultations',
            href: '/resources/tools-and-research/public-consultations',
          },
        ],
      },
      {
        title: 'importantLinks', // Translation key
        items: [
          { label: 'Services overview', href: '/services/services-overview' },
          { label: 'IP agents', href: '/resources/ip-licensing/ip-agents' },
          {
            label: 'Systems & regulations',
            href: '/resources/lows-and-regulations/systems-and-regulations',
          },
          { label: 'SAIP services directory', href: '/services/service-directory' },
        ],
      },
      {
        title: 'mediaContact', // Translation key
        items: [
          { label: 'Media Center', href: '/media-center/media-library' },
          { label: 'Contact & support', href: '/contact-us/contact-and-support' },
          { label: 'Employment', href: '/contact-us/careers' },
          { label: 'Movables', href: '/media-center/movables-platform' },
          { label: 'Branding', href: '/media-center/branding' },
        ],
      },
    ],
    socialLinks: [
      { label: 'X (Twitter)', href: 'https://twitter.com/saip' },
      { label: 'Facebook', href: 'https://facebook.com/saip' },
      { label: 'YouTube', href: 'https://youtube.com/saip' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/saip' },
      { label: 'Instagram', href: 'https://instagram.com/saip' },
    ],
    legalLinks: [
      { label: 'Sitemap', href: ROUTES.SITEMAP.ROOT },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Request Open Data', href: '/request-open-data' },
      { label: 'Terms & Conditions', href: '/terms-of-use' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
    lastModifiedDate: formatDateToDDMMYYYY(Date.now() / 1000, locale),
  };
}
