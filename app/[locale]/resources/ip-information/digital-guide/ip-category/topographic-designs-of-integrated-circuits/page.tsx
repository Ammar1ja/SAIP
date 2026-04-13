import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_INTEGRATED_CIRCUITS } from './DigitalGuideIntegratedCircuits.data';

interface DigitalGuideIntegratedCircuitsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideIntegratedCircuitsPage({
  params,
}: DigitalGuideIntegratedCircuitsPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('topographicdesigns', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="layoutDesigns"
      fallbackData={DIGITAL_GUIDE_INTEGRATED_CIRCUITS}
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
