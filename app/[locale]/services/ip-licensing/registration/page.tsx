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

  // ✅ Fetch from Drupal (with intelligent fallback)
  const [licensingData, relatedServices] = await Promise.all([
    getIPLicensingServiceDetail(locale),
    fetchRelatedIPLicensingServices(locale),
  ]);

  // ✅ Pass Drupal data to client component
  return <RegistrationPageClient data={licensingData} relatedServices={relatedServices} />;
}
