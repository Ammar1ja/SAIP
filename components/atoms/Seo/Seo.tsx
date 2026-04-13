'use client';

import Head from 'next/head';
import { usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

type SeoProps = {
  titleKey?: string;
  descriptionKey?: string;
  canonical?: string;
};

const defaultDomain = 'https://saip.gov.sa';

export const Seo = ({
  titleKey = 'default.title',
  descriptionKey = 'default.description',
  canonical,
}: SeoProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('seo');

  const fullUrl = canonical ?? `${defaultDomain}/${locale}${pathname}`;
  const isRTL = locale === 'ar';

  return (
    <Head>
      <title>{t(titleKey)}</title>
      <meta name="description" content={t(descriptionKey)} />
      <link rel="canonical" href={fullUrl} />
      <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} />
    </Head>
  );
};
