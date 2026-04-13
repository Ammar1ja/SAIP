import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_INTEGRATED_CIRCUITS_CHECKLIST } from './DigitalGuideIntegratedCircuitsChecklist.data';

interface DigitalGuideIntegratedCircuitsChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideIntegratedCircuitsChecklistPage({
  params,
}: DigitalGuideIntegratedCircuitsChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const drupalData = await getDigitalGuideCategoryData('topographic', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="layoutDesigns"
      fallbackChecklist={DIGITAL_GUIDE_INTEGRATED_CIRCUITS_CHECKLIST}
    />
  );
}
