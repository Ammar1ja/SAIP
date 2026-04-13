import { getIPClinicsPageData } from '@/lib/drupal/services';
import IpClinicsPageContent from './IpClinicsPageContent';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

export const revalidate = 300;

export default async function IpClinicsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [data, messages] = await Promise.all([
    getIPClinicsPageData(locale),
    getMessages({ locale }),
  ]);

  const breadcrumbItems = [
    { label: messages.breadcrumbs.home, href: '/' },
    { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
    { label: messages.breadcrumbs.ipEnablement },
    { label: messages.breadcrumbs.ipClinics },
  ];

  return <IpClinicsPageContent data={data} breadcrumbItems={breadcrumbItems} />;
}
