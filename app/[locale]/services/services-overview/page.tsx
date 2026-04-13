import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import ServicesOverviewTemplate from '@/components/templates/ServicesOverviewTemplate';
import DocumentSection from '@/components/organisms/DocumentSection';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import { getServicesOverviewPageData } from '@/lib/drupal/services/services-overview.service';

export const revalidate = 300;

export default async function ServicesOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [messages, data] = await Promise.all([
    getMessages({ locale }),
    getServicesOverviewPageData(locale),
  ]);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    {
      label: messages.breadcrumbs?.services || 'Services',
      href: ROUTES.SERVICES.SERVICES_OVERVIEW,
    },
    { label: messages.breadcrumbs?.servicesOverview || 'Services Overview' },
  ];
  return (
    <div>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage={data.heroImage?.src || '/images/about/hero.jpg'}
        breadcrumbs={breadcrumbItems}
      />
      <ServicesOverviewTemplate data={data} />
    </div>
  );
}
