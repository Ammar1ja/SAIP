import DigitalGuideCategoryClient from '../DigitalGuideCategoryClient';
import { getDigitalGuideSectionDataWithTabs } from '@/lib/drupal/services/digital-guide-section.service';
import { getMessages } from 'next-intl/server';
import { DIGITAL_GUIDE_COPYRIGHTS } from './DigitalGuideCopyrights.data';

interface DigitalGuideCopyrightsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DigitalGuideCopyrightsPage({
  params,
}: DigitalGuideCopyrightsPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Try to get data from Drupal first
  const drupalData = await getDigitalGuideSectionDataWithTabs('copyrights', locale);

  return (
    <DigitalGuideCategoryClient
      drupalData={drupalData}
      locale={locale}
      messages={messages as any}
      categoryKey="copyrights"
      fallbackData={DIGITAL_GUIDE_COPYRIGHTS}
      tabsConfig={{
        about: { id: 'about', labelKey: 'tabs.about' },
        protection: { id: 'protection', labelKey: 'tabs.protection' },
        'protected-categories': {
          id: 'protected-categories',
          labelKey: 'tabs.protectedCategories',
          labelKeyShort: 'tabs.protectedCategoriesShort',
        },
        'optional-registration': {
          id: 'optional-registration',
          labelKey: 'tabs.optionalRegistration',
          labelKeyShort: 'tabs.optionalRegistrationShort',
        },
      }}
    />
  );
}
