import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_DESIGNS_CHECKLIST } from './DigitalGuideDesignsChecklist.data';

interface DigitalGuideDesignsChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideDesignsChecklistPage({
  params,
}: DigitalGuideDesignsChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const drupalData = await getDigitalGuideCategoryData('designs', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="designs"
      fallbackChecklist={DIGITAL_GUIDE_DESIGNS_CHECKLIST}
    />
  );
}
