import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { useDesignsData } from './DigitalGuideDesigns.data';

interface DigitalGuideDesignsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideDesignsPage({ params }: DigitalGuideDesignsPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('designs', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="designs"
      fallbackData={useDesignsData}
      tabsConfig={{
        about: { id: 'about', labelKey: 'tabs.about' },
        protection: { id: 'protection', labelKey: 'tabs.protection' },
        prototype: { id: 'prototype', labelKey: 'tabs.prototype' },
        'registration-of-designs': {
          id: 'registration-of-designs',
          labelKey: 'tabs.registrationOfDesigns',
          labelKeyShort: 'tabs.registrationOfDesignsShort',
        },
      }}
    />
  );
}
