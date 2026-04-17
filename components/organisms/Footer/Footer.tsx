'use client';

import type { FC } from 'react';
import Section from '@/components/atoms/Section';
import {
  footerWrapper,
  linkGroup,
  heading,
  iconButton,
  bottomBar,
  bottomText,
} from './Footer.styles';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import {
  socialLinks as defaultSocialLinks,
  legalLinks as defaultLegalLinks,
  footerLinks as defaultFooterLinks,
} from './Footer.data';
import Link from 'next/link';
import AccessibilityTools from '@/components/atoms/AccessibilityTools';
import { useLocale, useTranslations } from 'next-intl';

// Props for dynamic data from Drupal
export interface FooterProps {
  sections?: Array<{ title: string; items: Array<{ label: string; href: string }> }>;
  socialLinks?: Array<{ label: string; href: string }>;
  legalLinks?: Array<{ label: string; href: string }>;
  lastModifiedDate?: string;
}

const Footer: FC<FooterProps> = ({
  sections,
  socialLinks: drupalSocialLinks,
  legalLinks: drupalLegalLinks,
  lastModifiedDate,
}) => {
  const tSections = useTranslations('footer.sections');
  const tLegal = useTranslations('footer.legal');
  const tCopyright = useTranslations('footer.copyright');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const currentYear = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    useGrouping: false,
  }).format(new Date().getUTCFullYear());

  // Helper to translate section title (works for both Drupal and fallback)
  const translateSectionTitle = (title: string) => {
    // If it's a key (no spaces), translate it
    if (!title.includes(' ')) {
      return tSections(title);
    }
    // Otherwise it's already full text (shouldn't happen, but fallback)
    return title;
  };

  // Translate section titles (both Drupal and fallback use keys now)
  const translatedSections = (sections && sections.length > 0 ? sections : defaultFooterLinks).map(
    (section) => ({
      ...section,
      title: translateSectionTitle(section.title),
    }),
  );

  let mergedLegalLinks =
    drupalLegalLinks && drupalLegalLinks.length > 0 ? drupalLegalLinks : defaultLegalLinks;

  const sitemapLink = defaultLegalLinks.find((link) => link.label === 'Sitemap');
  const hasSitemap = mergedLegalLinks.some(
    (link) => link.label === 'Sitemap' || link.href === sitemapLink?.href,
  );

  if (!hasSitemap && sitemapLink) {
    mergedLegalLinks = [sitemapLink, ...mergedLegalLinks];
  }

  // Translate legal links
  const translatedLegalLinks = mergedLegalLinks.map((link) => {
    const keyMap: Record<string, string> = {
      Sitemap: 'sitemap',
      Cookies: 'cookies',
      'Request Open Data': 'requestOpenData',
      'Terms & Conditions': 'termsConditions',
      'Privacy Policy': 'privacyPolicy',
    };
    const key = keyMap[link.label] || link.label;
    return {
      ...link,
      label: key.includes(' ') ? link.label : tLegal(key),
    };
  });

  // Use translated data
  const footerSections = translatedSections;
  const legalLinksData = translatedLegalLinks;

  // For social links, merge Drupal URLs with static icons
  const socialLinksData = defaultSocialLinks.map((staticLink, index) => ({
    ...staticLink,
    href: drupalSocialLinks?.[index]?.href || staticLink.href,
  }));

  return (
    <footer className={footerWrapper()} role="contentinfo">
      <Section background="primary">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-8 lg:grid lg:grid-cols-6 lg:gap-6">
          {footerSections.map(({ title, items }) => (
            <div
              key={title}
              className={twMerge(linkGroup(), 'w-full md:flex-1 md:min-w-[180px] lg:min-w-0')}
            >
              <h4 className={heading()}>{title}</h4>
              {items.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="hover:text-white/70 transition-colors"
                  aria-label={label}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}

          <div
            className={twMerge(
              'w-full md:flex-1 md:min-w-[180px] lg:w-[193.33px] lg:min-w-[193.33px] flex flex-col gap-8',
            )}
          >
            <div className={twMerge(linkGroup())}>
              <h4 className={heading()}>{tSections('socialMedia')}</h4>
              <div className="flex gap-2 flex-nowrap">
                {socialLinksData.map(({ label, iconPath, href }) => (
                  <Link key={label} href={href} aria-label={label} className={iconButton()}>
                    <Image
                      src={iconPath}
                      alt={label}
                      width={20}
                      height={20}
                      className={label === 'X (formerly Twitter)' ? 'brightness-0 invert' : ''}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className={twMerge(linkGroup())}>
              <AccessibilityTools className="[&_button]:!w-8 [&_button]:!h-8 [&_button]:!min-w-8 [&_button]:!min-h-8 [&_button]:!max-w-8 [&_button]:!max-h-8" />
            </div>

            <div className="w-full max-w-[220px]">
              <Image
                src="/images/dga.png"
                alt="Digital Government Authority registration"
                width={220}
                height={88}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>

        <div
          className={twMerge(
            bottomBar(),
            'border-transparent lg:border-white/30 mt-10 lg:mt-12 items-center lg:items-start',
          )}
        >
          <div
            className={twMerge(
              bottomText(),
              'text-center',
              isRtl ? 'lg:text-right' : 'lg:text-left',
            )}
          >
            <div
              className={twMerge(
                'flex flex-wrap justify-center gap-4 text-white/90 !text-[14px]',
                isRtl ? 'lg:justify-end' : 'lg:justify-start',
              )}
            >
              {legalLinksData.map(({ label, href }) => (
                <Link key={label} href={href} className="underline !text-[14px]">
                  {label}
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm font-semibold leading-5 text-white">
                {tCopyright('rights')} © {currentYear}
              </p>
              <p className="mt-2 text-xs font-normal leading-[100%] text-white">
                {tCopyright('developed')}
                <br />
                {tCopyright('modified')}: {lastModifiedDate || tCopyright('lastModifiedDate')}
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end shrink-0">
            <Image src="/images/saip-logo.svg" alt="SAIP Logo" width={160} height={80} />
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
