import { TabsProps } from '@/components/molecules/Tabs/Tabs.types';
import {
  PatentDocIcon,
  JourneyIcon,
  PatentServicesIcon,
  PatentMediaIcon,
} from '@/components/icons/services';

const tabTranslations = {
  en: {
    overview: 'Overview',
    journey: 'Journey',
    services: 'Services',
    media: 'Media',
  },
  ar: {
    overview: 'نظرة عامة',
    journey: 'الرحلة',
    services: 'الخدمات',
    media: 'الوسائط',
  },
};

export const getTabsData = (locale: string = 'en'): TabsProps['tabs'] => {
  const t = tabTranslations[locale as 'en' | 'ar'] || tabTranslations.en;

  return [
    {
      id: 'overview',
      label: t.overview,
      icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'journey',
      label: t.journey,
      icon: <JourneyIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'services',
      label: t.services,
      icon: <PatentServicesIcon className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'media',
      label: t.media,
      icon: <PatentMediaIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];
};

// Legacy export for backwards compatibility
export const tabsData = getTabsData('en');
