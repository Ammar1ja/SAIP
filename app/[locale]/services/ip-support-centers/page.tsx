import { getIPSupportCentersPageData } from '@/lib/drupal/services';
import IpSupportCentersPageContent from './IpSupportCentersPageContent';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

export default async function IpSupportCentersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getIPSupportCentersPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: '/' },
    { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
    { label: messages.breadcrumbs.ipEnablement },
    { label: messages.breadcrumbs.ipSupportCenters },
  ];

  return <IpSupportCentersPageContent data={data} breadcrumbs={breadcrumbs} />;
}
