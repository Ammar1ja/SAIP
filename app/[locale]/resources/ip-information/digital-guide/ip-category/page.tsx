import DigitalGuideIPCategoryClient from './DigitalGuideIPCategoryClient';
import { getAllDigitalGuideCategories } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

interface DigitalGuideIPCategoryPageProps {
  params: Promise<{ locale: string }>;
}

// Map category types to routes
const categoryRoutes: Record<string, string> = {
  patents: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PATENTS.ROOT,
  trademarks: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.TRADEMARKS.ROOT,
  copyrights: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.COPYRIGHTS.ROOT,
  designs: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.DESIGNS.ROOT,
  'plant-varieties': ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.ROOT,
  plant_varieties: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY.PLANT_VARIETIES.ROOT,
  topographic:
    ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
      .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.ROOT,
  topographic_designs_of_integrated_circuits:
    ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.IP_CATEGORY
      .TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS.ROOT,
};

export default async function DigitalGuideIPCategoryPage({
  params,
}: DigitalGuideIPCategoryPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get categories from Drupal
  const drupalCategories = await getAllDigitalGuideCategories(locale);

  return (
    <DigitalGuideIPCategoryClient
      drupalCategories={drupalCategories}
      locale={locale}
      messages={messages as any}
      categoryRoutes={categoryRoutes}
    />
  );
}
