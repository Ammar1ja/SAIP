import ServiceDetailTemplate from '@/components/templates/ServiceDetailTemplate';
import { getServiceDetailData } from '@/lib/drupal/services/service-universal.service';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

export default async function CopyrightComplaintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getServiceDetailData('copyright-complaint', locale);

  return (
    <ServiceDetailTemplate
      data={data}
      breadcrumbs={[
        { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
        {
          label: messages.breadcrumbs?.serviceDirectory || 'SAIP service directory',
        },
        { label: 'Complaint of copyright infringement' },
      ]}
      tags={['Enforcement', 'Copyright', 'Complaint']}
    />
  );
}
