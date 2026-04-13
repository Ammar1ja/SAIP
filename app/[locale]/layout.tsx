import '@/styles/globals.css';
import React from 'react';
import { Metadata, ResolvingMetadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import Header from '@/components/organisms/Header';
import VerificationBar from '@/components/molecules/VerificationBar';
import HeaderSpacer from '@/components/molecules/HeaderSpacer';
import { VerificationBarProvider } from '@/context/VerificationBarContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import { clsx } from 'clsx';
import { DirectionProvider } from '@/context/DirectionContext';
import { ContrastProvider } from '@/context/ContrastContext';
import { LayoutProps } from './types';
import dynamic from 'next/dynamic';
import { fetchFooterCached } from '@/lib/drupal/services/footer.service';

const Footer = dynamic(
  () => import('@/components/organisms/Footer').then((mod) => mod.default),
  {},
);

const MobileBottomNav = dynamic(() => import('@/components/molecules/MobileBottomNav'));

interface GenerateMetadataProps {
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(
  { params }: GenerateMetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const messages = await getMessages();
  const cookieLocale = (await cookies()).get('NEXT_LOCALE');
  const { locale } = await params;
  const currentLocale = locale || cookieLocale?.value || 'ar';

  return {
    title: 'SAIP',
    description: 'Saudi Authority for Intellectual Property',
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function RootLayout({ children, modal, params }: LayoutProps) {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE');
  const { locale } = await params;

  const currentLocale = locale || cookieLocale?.value || 'ar';
  const dir = currentLocale === 'ar' ? 'rtl' : 'ltr';

  // Load messages with correct locale - includes common.searchModal
  const messages = await getMessages({ locale: currentLocale });

  // Fetch footer data from Drupal
  const footerData = await fetchFooterCached(currentLocale);

  return (
    <html lang={currentLocale} className={clsx('font-sans', dir)} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages} locale={currentLocale}>
          <DirectionProvider dir={dir}>
            <ContrastProvider>
              <CookieConsentProvider>
                <VerificationBarProvider>
                  <VerificationBar />
                  <HeaderSpacer />
                  <Header locale={currentLocale} />
                  {children}
                  {modal}
                  <Footer
                    sections={footerData.sections}
                    socialLinks={footerData.socialLinks}
                    legalLinks={footerData.legalLinks}
                    lastModifiedDate={footerData.lastModifiedDate}
                  />
                  <MobileBottomNav />
                </VerificationBarProvider>
              </CookieConsentProvider>
            </ContrastProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
