import { PageProps } from '@/app/[locale]/types';
import { getMessages, getTranslations } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import SitemapList from '@/components/molecules/SitemapList';
import { getSitemapPageData } from '@/lib/drupal/services/sitemap.service';
import { SITEMAP_DATA } from '@/app/[locale]/sitemap/Sitemap.data';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';

export default async function Sitemap({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'sitemap' });

  // Section labels from translations
  const sectionLabels = {
    saip: t('sections.saip'),
    services: t('sections.services'),
    resources: t('sections.resources'),
    mediaCenter: t('sections.mediaCenter'),
    contact: t('sections.contactUs'),
  };

  // Subsection (group) labels from translations
  const groupLabels = {
    ipProtection: t('subsections.ipProtection'),
    ipEnablement: t('subsections.ipEnablement'),
    ipEnforcement: t('subsections.ipEnforcement'),
    ipInformation: t('subsections.ipInformation'),
    toolsResearch: t('subsections.toolsSearch'),
    ipLicenses: t('subsections.ipLicenses'),
    lawsRegulations: t('subsections.lawsRegulations'),
    mediaLibrary: t('subsections.mediaLibrary'),
  };

  // Fetch sitemap data from Drupal navigation
  const data = await getSitemapPageData(locale, sectionLabels, groupLabels);

  // Use Drupal data if available, otherwise fallback to static data
  const sitemapItems = data.sections.length > 0 ? data.sections : SITEMAP_DATA;

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.sitemap || t('pageTitle') },
  ];
  const pageTitle = data.hero.title || t('pageTitle');
  const pageDescription = data.hero.description || t('pageDescription');

  return (
    <>
      <HeroStatic
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={breadcrumbItems}
        backgroundColor="bg-[#f7fdf9]"
        textColor="dark"
        contentAlign="bottom"
        className="md:pb-16"
      />

      <div className="bg-white py-8 md:py-10 lg:py-12">
        <LayoutWrapper className="md:px-8">
          <SitemapList items={sitemapItems} />
        </LayoutWrapper>
      </div>
    </>
  );
}
