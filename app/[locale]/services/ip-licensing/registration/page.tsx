import {
  getIPLicensingServiceDetail,
  fetchRelatedIPLicensingServices,
} from '@/lib/drupal/services/service-detail-ip-licensing.service';
import RegistrationPageClient from './RegistrationPageClient';

interface PageParams {
  params: Promise<{ locale: string }>;
}

export default async function IPLicensingRegistrationPage({ params }: PageParams) {
  const { locale } = await params;

  const [licensingData, relatedServices] = await Promise.all([
    getIPLicensingServiceDetail(locale),
    fetchRelatedIPLicensingServices(locale),
  ]);

  return <RegistrationPageClient data={licensingData} relatedServices={relatedServices} />;
}
