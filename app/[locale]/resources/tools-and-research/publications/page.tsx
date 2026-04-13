import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs';
import { ROUTES } from '@/lib/routes';
import { getPublicationsPageData } from '@/lib/drupal/services';
import PublicationsContent from './PublicationsContent';
import { getMessages } from 'next-intl/server';

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getPublicationsPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs.toolsAndResearch,
    },
    { label: messages.breadcrumbs.publications },
  ];

  return <PublicationsContent data={data} breadcrumbs={breadcrumbs} />;
}
