import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_COPYRIGHTS_CHECKLIST } from './DigitalGuideCopyrightsChecklist.data';

interface DigitalGuideCopyrightsChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideCopyrightsChecklistPage({
  params,
}: DigitalGuideCopyrightsChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const drupalData = await getDigitalGuideCategoryData('copyrights', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="copyrights"
      fallbackChecklist={DIGITAL_GUIDE_COPYRIGHTS_CHECKLIST}
    />
  );
}
