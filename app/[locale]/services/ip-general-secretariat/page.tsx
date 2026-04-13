import { getIPGeneralSecretariatPageData } from '@/lib/drupal/services';
import GeneralSecretariatPageContent from './GeneralSecretariatPageContent';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

export default async function GeneralSecretariatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getIPGeneralSecretariatPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbItems = [
    { label: messages.breadcrumbs.home, href: '/' },
    { label: messages.breadcrumbs.services, href: ROUTES.SERVICES.SERVICES_OVERVIEW },
    { label: messages.breadcrumbs.ipEnforcement },
    { label: messages.breadcrumbs.ipGeneralSecretariat },
  ];

  return <GeneralSecretariatPageContent data={data} breadcrumbItems={breadcrumbItems} />;
}
