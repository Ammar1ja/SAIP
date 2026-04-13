import { getPCTServiceDetail } from '@/lib/drupal/services/service-detail-pct.service';
import ServiceDetailTemplate from '@/components/templates/ServiceDetailTemplate/ServiceDetailTemplate';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

interface PageParams {
  params: Promise<{ locale: string }>;
}

export default async function PCTPage({ params }: PageParams) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // ✅ Fetch from Drupal (with intelligent fallback)
  const pctData = await getPCTServiceDetail(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    {
      label: messages.breadcrumbs?.serviceDirectory || 'SAIP service directory',
      href: ROUTES.SERVICES.SERVICE_DIRECTORY,
    },
    { label: 'Patent Cooperation Treaty (PCT)' },
  ];

  // ✅ Universal template handles all service details
  return (
    <ServiceDetailTemplate
      serviceData={pctData}
      breadcrumbItems={breadcrumbItems}
      category="Patents"
    />
  );
}
