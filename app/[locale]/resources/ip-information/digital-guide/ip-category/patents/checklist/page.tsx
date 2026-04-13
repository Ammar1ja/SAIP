import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_PATENTS_CHECKLIST } from './DigitalGuidePatentsChecklist.data';

interface DigitalGuidePatentsChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuidePatentsChecklistPage({
  params,
}: DigitalGuidePatentsChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideCategoryData('patents', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="patents"
      fallbackChecklist={DIGITAL_GUIDE_PATENTS_CHECKLIST}
    />
  );
}
