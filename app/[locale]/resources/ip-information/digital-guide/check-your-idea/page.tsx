import DigitalGuideCheckIdeaClient from './DigitalGuideCheckIdeaClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_CHECK_IDEA_CHECKLIST } from './DigitalGuideCheckIdeaChecklist.data';

interface DigitalGuideCheckIdeaPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideCheckIdeaPage({
  params,
}: DigitalGuideCheckIdeaPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('checkyouridea', locale);

  return (
    <DigitalGuideCheckIdeaClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      fallbackChecklist={DIGITAL_GUIDE_CHECK_IDEA_CHECKLIST}
    />
  );
}
