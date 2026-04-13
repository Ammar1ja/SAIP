import {
  getIPClinicsServiceDetail,
  fetchRelatedIPClinicsServices,
} from '@/lib/drupal/services/service-detail-ip-clinics.service';
import ConsultancyServicesPageClient from './ConsultancyServicesPageClient';

interface PageParams {
  params: Promise<{ locale: string }>;
}

export default async function ConsultancyServicesPage({ params }: PageParams) {
  const { locale } = await params;

  // ✅ Fetch from Drupal (with intelligent fallback)
  const [clinicsData, relatedServices] = await Promise.all([
    getIPClinicsServiceDetail(locale),
    fetchRelatedIPClinicsServices(locale),
  ]);

  // ✅ Pass Drupal data to client component
  return <ConsultancyServicesPageClient data={clinicsData} relatedServices={relatedServices} />;
}
