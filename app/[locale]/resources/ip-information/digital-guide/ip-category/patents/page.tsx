import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { usePatentsData } from './DigitalGuidePatents.data';

interface DigitalGuidePatentsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuidePatentsPage({ params }: DigitalGuidePatentsPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('patents', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="patents"
      fallbackData={usePatentsData}
      tabsConfig={{
        about: { id: 'about', labelKey: 'tabs.about' },
        protection: { id: 'protection', labelKey: 'tabs.protection' },
        'initial-prototype': {
          id: 'initial-prototype',
          labelKey: 'tabs.initialPrototype',
          labelKeyShort: 'tabs.initialPrototypeShort',
        },
        'patent-application': {
          id: 'patent-application',
          labelKey: 'tabs.patentApplication',
          labelKeyShort: 'tabs.patentApplicationShort',
        },
      }}
    />
  );
}
