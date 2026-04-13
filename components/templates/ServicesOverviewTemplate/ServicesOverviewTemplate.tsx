'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Tabs from '@/components/molecules/Tabs';
import dynamic from 'next/dynamic';
import { AddNoteIcon } from '@/components/icons/services';
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/atoms/Spinner';
import Section from '@/components/atoms/Section';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { ServicesOverviewData } from '@/lib/drupal/services/services-overview.service';
import { ROUTES } from '@/lib/routes';
import FeedbackSection from '@/components/organisms/FeedbackSection';

type TabId = 'discover' | 'protection' | 'enablement' | 'enforcement';

const ServicesDiscoverSection = dynamic(
  () => import('@/components/sections/ServicesDiscoverSection'),
  { loading: () => <Spinner /> },
);
const ServicesProtectionSection = dynamic(
  () => import('@/components/sections/ServicesProtectionSection'),
  { loading: () => <Spinner /> },
);
const ServicesEnablementSection = dynamic(
  () => import('@/components/sections/ServicesEnablementSection'),
  { loading: () => <Spinner /> },
);
const ServicesEnforcementSection = dynamic(
  () => import('@/components/sections/ServicesEnforcementSection'),
  { loading: () => <Spinner /> },
);

interface ServicesOverviewTemplateProps {
  data: ServicesOverviewData;
}

const ServicesOverviewTemplate = ({ data }: ServicesOverviewTemplateProps) => {
  const t = useTranslations('servicesOverview.tabs');
  const tNav = useTranslations('servicesOverview.nav');
  const tButtons = useTranslations('buttons');
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get('tab') || undefined;

  const tabs = [
    {
      id: 'discover',
      label: t('discover'),
    },
    {
      id: 'protection',
      label: t('protection'),
    },
    {
      id: 'enablement',
      label: t('enablement'),
    },
    {
      id: 'enforcement',
      label: t('enforcement'),
    },
  ];

  const tabNavigations: Record<TabId, { label: string; href: string }[]> = {
    discover: [
      { label: tNav('discoverServices'), href: '#discover-services' },
      { label: tNav('infoYouNeed'), href: '#info-you-need' },
      { label: tNav('serviceDirectory'), href: '#service-directory' },
    ],
    protection: [
      { label: tNav('ipProtection'), href: '#ip-protection' },
      { label: tNav('aboutIpServices'), href: '#about-ip-services' },
    ],
    enablement: [
      { label: tNav('ipEnablement'), href: '#ip-enablement' },
      { label: tNav('aboutIpEnablement'), href: '#about-ip-enablement' },
    ],
    enforcement: [
      { label: tNav('ipEnforcement'), href: '#ip-enforcement' },
      { label: tNav('aboutEnforcement'), href: '#about-enforcement' },
    ],
  };

  const validTabIds: TabId[] = tabs.map((t) => t.id as TabId);
  const initialTab = (
    validTabIds.includes(tabFromQuery as TabId) ? tabFromQuery : tabs[0].id
  ) as TabId;
  const activeTab: TabId = initialTab;
  const [activeVerticalTab, setActiveVerticalTab] = useState(
    data.verticalTabsData?.[0]?.id || 'ip-services-information',
  );

  // Handler to prevent scroll-to-top
  const handleVerticalTabChange = useCallback((tabId: string) => {
    // Store current scroll position BEFORE state change
    const currentScrollY = window.scrollY;

    // Update state
    setActiveVerticalTab(tabId);

    // Restore scroll position AFTER React re-renders
    setTimeout(() => {
      if (window.scrollY !== currentScrollY) {
        window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      }
    }, 0);

    requestAnimationFrame(() => {
      if (window.scrollY !== currentScrollY) {
        window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      }
    });
  }, []);

  // Map service titles to tab IDs
  const getServiceHref = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('protection') || lowerTitle.includes('management')) {
      return '?tab=protection';
    }
    if (lowerTitle.includes('enablement')) {
      return '?tab=enablement';
    }
    if (lowerTitle.includes('enforcement') || lowerTitle.includes('dispute')) {
      return '?tab=enforcement';
    }
    return '#';
  };

  // Transform services data for components
  const servicesData = data.servicesData.map((service) => ({
    title: service.title,
    description: service.description,
    icon: service.icon?.url
      ? () => (
          <img
            src={service.icon?.url}
            alt={service.icon?.alt}
            className="w-6 h-6"
            width={24}
            height={24}
          />
        )
      : AddNoteIcon,
    alt: service.icon?.alt || 'Service Icon',
    href: getServiceHref(service.title),
  }));

  // Transform vertical tabs data
  const verticalTabs = data.verticalTabsData.map((tab) => ({
    id: tab.id,
    label: tab.title,
  }));

  // Function to get button text based on tab ID or title
  const getButtonText = (tab: any) => {
    const title = tab.title.toLowerCase();

    // Specific scenarios from your screenshots
    if (title.includes('ip services information') || title.includes('digital')) {
      return 'Go to Digital guide';
    }
    if (title.includes('trademark')) {
      return 'Go to trademarks';
    }
    if (title.includes('ips support') || title.includes('clinic')) {
      return 'Go to IP clinics';
    }

    // Default fallback - use translation
    return tNav('learnMore');
  };

  const resolveServiceHrefFromTitle = (rawTitle?: string) => {
    const title = (rawTitle || '').toLowerCase();

    if (
      title.includes('ip services information') ||
      title.includes('digital') ||
      title.includes('دليل')
    ) {
      return ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT;
    }
    if (title.includes('trademark') || title.includes('علام')) {
      return ROUTES.SERVICES.TRADEMARKS;
    }
    if (title.includes('patent') || title.includes('براء')) {
      return ROUTES.SERVICES.PATENTS;
    }
    if (title.includes('copyright') || title.includes('حقوق')) {
      return ROUTES.SERVICES.COPYRIGHTS;
    }
    if (title.includes('design') || title.includes('تصميم')) {
      return ROUTES.SERVICES.DESIGNS;
    }
    if (title.includes('plant') || title.includes('varieti') || title.includes('نبات')) {
      return ROUTES.SERVICES.PLANT_VARIETIES;
    }
    if (
      title.includes('topographic') ||
      title.includes('integrated circuit') ||
      title.includes('دوائر متكاملة') ||
      title.includes('تخطيطية')
    ) {
      return ROUTES.SERVICES.TOPOGRAPHIC_DESIGNS_OF_INTEGRATED_CIRCUITS;
    }
    if (title.includes('ips support') || title.includes('clinic') || title.includes('عياد')) {
      return ROUTES.SERVICES.IP_CLINICS;
    }
    if (title.includes('ip academy') || title.includes('academy') || title.includes('أكاديمية')) {
      return ROUTES.SERVICES.IP_ACADEMY;
    }
    if (title.includes('support center') || title.includes('مراكز دعم')) {
      return ROUTES.SERVICES.IP_SUPPORT_CENTERS;
    }
    if (title.includes('licensing') || title.includes('ترخيص')) {
      return ROUTES.SERVICES.IP_LICENSING;
    }
    if (title.includes('infringement') || title.includes('انتها')) {
      return ROUTES.SERVICES.IP_INFRINGEMENT;
    }
    if (title.includes('secretariat') || title.includes('dispute') || title.includes('الأمانة')) {
      return ROUTES.SERVICES.IP_GENERAL_SECRETARIAT;
    }

    return ROUTES.SERVICES.SERVICES_OVERVIEW;
  };

  const verticalTabsData = data.verticalTabsData.map((tab) => ({
    id: tab.id,
    title: tab.title,
    description: tab.description,
    image: tab.image || {
      src: '/images/national-ip-strategy/photo-container.jpg',
      alt: `${tab.title} illustration`,
    },
    buttonLabel: tab.buttonLabel && tab.buttonLabel.trim() ? tab.buttonLabel : getButtonText(tab),
    buttonHref:
      tab.buttonHref && tab.buttonHref.trim()
        ? tab.buttonHref.replace(/^internal:/, '').trim()
        : resolveServiceHrefFromTitle(tab.title),
    buttonAriaLabel: `Go to ${tab.title} services page`,
  }));

  return (
    <div>
      <Section padding="none" className="py-5 flex justify-center items-center">
        <Tabs
          tabs={tabs}
          activeTab={initialTab}
          onTabChange={() => {}}
          ariaLabel="Services navigation"
          syncWithQueryParam="tab"
          enableMobileScroll
          className="max-w-[1280px]"
          tabListClassName="rounded-md"
          tabButtonClassName="!h-12 !px-4 text-[14px] leading-[20px] md:text-[20px] md:leading-[30px] font-normal transition-all duration-300 ease-in-out"
        />
      </Section>
      <Navigation className="mt-0" items={tabNavigations[activeTab]} />
      <div className="mt-8">
        {initialTab === 'discover' && (
          <ServicesDiscoverSection
            discoverHeading={data.discoverHeading}
            servicesData={servicesData}
            infoHeading={tNav('infoYouNeed')}
            infoDescription={tNav('infoDescription')}
            verticalTabs={verticalTabs}
            verticalTabsData={verticalTabsData}
            activeVerticalTab={activeVerticalTab}
            setActiveVerticalTab={handleVerticalTabChange}
            serviceDirectorySection={data.serviceDirectorySection}
          />
        )}
        {initialTab === 'protection' && (
          <ServicesProtectionSection
            heading={data.protectionSection.heading}
            description={data.protectionSection.description}
            image={data.protectionSection.image}
            verticalTabsData={data.protectionSection.verticalTabs.map((tab) => {
              const formatServiceName = (title?: string, id?: string): string => {
                if (title && title.trim()) {
                  return title;
                }
                if (id) {
                  return id
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                }
                return '';
              };
              const serviceName = formatServiceName(tab.title, tab.id);
              let buttonHref: string | undefined = undefined;

              if (tab.buttonHref && tab.buttonHref !== '#' && tab.buttonHref.trim()) {
                let normalizedHref = tab.buttonHref.replace(/^internal:/, '').trim();
                if (normalizedHref && normalizedHref !== '#') {
                  if (!normalizedHref.startsWith('/')) {
                    normalizedHref = `/${normalizedHref}`;
                  }
                  buttonHref = normalizedHref;
                }
              }

              if (!buttonHref || buttonHref === '#') {
                buttonHref = resolveServiceHrefFromTitle(tab.title);
              }

              const buttonLabel =
                tab.buttonLabel && tab.buttonLabel.trim()
                  ? tab.buttonLabel
                  : `${tButtons('goTo')} ${serviceName}`.trim();

              return {
                id: tab.id,
                title: tab.title,
                description: tab.description,
                image: tab.image,
                buttonLabel: buttonLabel,
                buttonHref: buttonHref,
                buttonAriaLabel: tab.buttonAriaLabel || buttonLabel,
              };
            })}
          />
        )}
        {initialTab === 'enablement' && (
          <ServicesEnablementSection
            heading={data.enablementSection.heading}
            description={data.enablementSection.description}
            image={data.enablementSection.image}
            infoHeading={data.enablementSection.infoHeading}
            infoDescription={data.enablementSection.infoDescription}
            verticalTabsData={data.enablementSection.verticalTabs.map((tab) => {
              const title = tab.title?.trim() || '';
              const normalizedKey = `${tab.id || ''} ${title}`.toLowerCase();
              const resolveHref = () => resolveServiceHrefFromTitle(tab.title || '');

              let buttonHref: string | undefined = undefined;

              if (tab.buttonHref && tab.buttonHref !== '#' && tab.buttonHref.trim()) {
                let normalizedHref = tab.buttonHref.replace(/^internal:/, '').trim();
                if (normalizedHref && normalizedHref !== '#') {
                  if (!normalizedHref.startsWith('/')) {
                    normalizedHref = `/${normalizedHref}`;
                  }
                  buttonHref = normalizedHref;
                }
              }

              if (!buttonHref || buttonHref === '#') {
                buttonHref = resolveHref();
              }

              const defaultLabel = title ? `${tButtons('goTo')} ${title}` : tButtons('goTo');
              const buttonLabel =
                tab.buttonLabel && tab.buttonLabel.trim() ? tab.buttonLabel : defaultLabel;

              return {
                id: tab.id,
                title: tab.title,
                description: tab.description,
                image: tab.image,
                buttonLabel: buttonLabel,
                buttonHref: buttonHref,
                buttonAriaLabel: tab.buttonAriaLabel || buttonLabel,
              };
            })}
          />
        )}
        {initialTab === 'enforcement' && (
          <ServicesEnforcementSection
            heading={data.enforcementSection.heading}
            description={data.enforcementSection.description}
            image={data.enforcementSection.image}
            infoHeading={data.enforcementSection.infoHeading}
            infoDescription={data.enforcementSection.infoDescription}
            verticalTabsData={data.enforcementSection.verticalTabs.map((tab) => ({
              id: tab.id,
              title: tab.title,
              description: tab.description,
              image: tab.image,

              buttonLabel: tab.buttonLabel,
              buttonHref: tab.buttonHref,
              buttonAriaLabel: tab.buttonAriaLabel,
            }))}
          />
        )}
      </div>
      <FeedbackSection />
    </div>
  );
};

export default ServicesOverviewTemplate;
