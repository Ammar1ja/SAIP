import DigitalGuideCategoryChecklistClient from '../../DigitalGuideCategoryChecklistClient';
import { getDigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_TRADEMARKS_CHECKLIST } from './DigitalGuideTrademarksChecklist.data';

interface DigitalGuideTrademarksChecklistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideTrademarksChecklistPage({
  params,
}: DigitalGuideTrademarksChecklistPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const drupalData = await getDigitalGuideCategoryData('trademarks', locale);

  return (
    <DigitalGuideCategoryChecklistClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="trademarks"
      fallbackChecklist={DIGITAL_GUIDE_TRADEMARKS_CHECKLIST}
    />
  );
}
