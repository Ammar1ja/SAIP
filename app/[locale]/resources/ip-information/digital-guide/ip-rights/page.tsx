import DigitalGuideIPRightsClient from './DigitalGuideIPRightsClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';

interface DigitalGuideIPRightsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideIPRightsPage({ params }: DigitalGuideIPRightsPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('iprights', locale);

  return (
    <DigitalGuideIPRightsClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
    />
  );
}
