import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_TRADEMARKS } from './DigitalGuideTrademarks.data';

interface DigitalGuideTrademarksPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideTrademarksPage({
  params,
}: DigitalGuideTrademarksPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('trademarks', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="trademarks"
      fallbackData={DIGITAL_GUIDE_TRADEMARKS}
      tabsConfig={{
        about: { id: 'about', labelKey: 'tabs.about' },
        protection: { id: 'protection', labelKey: 'tabs.protection' },
        'registration-of-trademark': {
          id: 'registration-of-trademark',
          labelKey: 'tabs.registrationOfTrademark',
          labelKeyShort: 'tabs.registrationOfTrademarkShort',
        },
      }}
    />
  );
}
