import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_PLANT_VARIETIES_CHECKLIST } from './DigitalGuidePlantVarietiesChecklist.data';

interface DigitalGuidePlantVarietiesChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuidePlantVarietiesChecklistPage({
  params,
}: DigitalGuidePlantVarietiesChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const drupalData = await getDigitalGuideCategoryData('plant-varieties', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="plantVarieties"
      fallbackChecklist={DIGITAL_GUIDE_PLANT_VARIETIES_CHECKLIST}
    />
  );
}
