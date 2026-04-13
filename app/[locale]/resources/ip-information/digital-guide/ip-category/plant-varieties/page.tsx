import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_PLANT_VARIETIES } from './DigitalGuidePlantVarieties.data';

interface DigitalGuidePlantVarietiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuidePlantVarietiesPage({
  params,
}: DigitalGuidePlantVarietiesPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('plantvarieties', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="plantVarieties"
      fallbackData={DIGITAL_GUIDE_PLANT_VARIETIES}
      tabsConfig={{
        about: { id: 'about', labelKey: 'tabs.about' },
        protection: { id: 'protection', labelKey: 'tabs.protection' },
        'submitting-application': {
          id: 'submitting-application',
          labelKey: 'tabs.submittingApplication',
          labelKeyShort: 'tabs.submittingApplicationShort',
        },
      }}
    />
  );
}
