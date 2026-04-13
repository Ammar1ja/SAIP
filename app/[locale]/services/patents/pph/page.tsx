import {
  getPPHServiceDetail,
  fetchRelatedPatentServices,
} from '@/lib/drupal/services/service-detail-pph.service';
import PPHPageClient from './PPHPageClient';

interface PageParams {
  params: Promise<{ locale: string }>;
}

export default async function PPHPage({ params }: PageParams) {
  const { locale } = await params;

  // ✅ Fetch from Drupal (with intelligent fallback)
  const [pphData, relatedServices] = await Promise.all([
    getPPHServiceDetail(locale),
    fetchRelatedPatentServices(locale),
  ]);

  // ✅ Pass Drupal data to client component
  return <PPHPageClient data={pphData} relatedServices={relatedServices} />;
}
