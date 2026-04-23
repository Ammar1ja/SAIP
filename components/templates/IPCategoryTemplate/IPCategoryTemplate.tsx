'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Section from '@/components/atoms/Section';
import Tabs from '@/components/molecules/Tabs';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import dynamic from 'next/dynamic';
import Spinner from '@/components/atoms/Spinner';
import { IPCategoryTemplateProps } from './IPCategoryTemplate.types';
import { TabItem } from '@/components/molecules/Tabs/Tabs.types';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { useTranslations } from 'next-intl';

const IPOverviewSection = dynamic(() => import('@/components/organisms/IPOverviewSection'), {
  loading: () => <Spinner />,
});
const IPJourneySection = dynamic(() => import('@/components/organisms/IPJourneySection'), {
  loading: () => <Spinner />,
});
const IPServicesSection = dynamic(() => import('@/components/organisms/IPServicesSection'), {
  loading: () => <Spinner />,
});

const IPCategoryTemplate = ({
  hero,
  navigation,
  overview,
  journey,
  journeyEndpoint,
  isFallbackData = false,
  services,
  media,
  tabsData,
  breadcrumbs,
  tabsClassName,
}: IPCategoryTemplateProps) => {
  const t = useTranslations('common.labels');
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const defaultTab = tabsData[0]?.value || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);
  const [showTabLoader, setShowTabLoader] = useState(false);
  const [isTabPending, startTabTransition] = useTransition();
  const [lazyJourney, setLazyJourney] = useState<typeof journey | null>(null);
  const [isJourneyLoading, setIsJourneyLoading] = useState(false);
  const [journeyLoadFailed, setJourneyLoadFailed] = useState(false);
  const tabChangeStartedAtRef = useRef<number | null>(null);
  const hideLoaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MIN_TAB_LOADER_MS = 180;
  const hasJourneyContent = Object.keys(journey.sections || {}).length > 0;
  const effectiveJourney = lazyJourney || journey;

  const clearHideLoaderTimeout = () => {
    if (hideLoaderTimeoutRef.current) {
      clearTimeout(hideLoaderTimeoutRef.current);
      hideLoaderTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    // Sync local tab state only when URL changes.
    // Avoid including activeTab in deps to prevent one-frame rollback/flicker.
    const nextTab = tabFromUrl || defaultTab;
    setActiveTab(nextTab);

    if (tabChangeStartedAtRef.current !== null) {
      const elapsed = Date.now() - tabChangeStartedAtRef.current;
      const remaining = Math.max(0, MIN_TAB_LOADER_MS - elapsed);
      clearHideLoaderTimeout();
      hideLoaderTimeoutRef.current = setTimeout(() => {
        setShowTabLoader(false);
        tabChangeStartedAtRef.current = null;
      }, remaining);
    }

    return () => {
      clearHideLoaderTimeout();
    };
  }, [tabFromUrl, defaultTab]);

  useEffect(() => {
    return () => {
      clearHideLoaderTimeout();
    };
  }, []);

  const loadJourney = useCallback(async () => {
    if (!journeyEndpoint) return;
    if (hasJourneyContent || Object.keys(lazyJourney?.sections || {}).length > 0) return;
    if (isJourneyLoading) return;

    try {
      setIsJourneyLoading(true);
      setJourneyLoadFailed(false);
      const response = await fetch(journeyEndpoint);

      if (!response.ok) {
        setJourneyLoadFailed(true);
        return;
      }
      const data = await response.json();

      if (data?.journey && Object.keys(data.journey.sections || {}).length > 0) {
        setLazyJourney((prev) => prev || data.journey);
      } else {
        setJourneyLoadFailed(true);
      }
    } catch {
      setJourneyLoadFailed(true);
    } finally {
      setIsJourneyLoading(false);
    }
  }, [journeyEndpoint]);

  useEffect(() => {
    if (activeTab !== 'journey') return;
    loadJourney();
  }, [activeTab, loadJourney]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    tabChangeStartedAtRef.current = Date.now();
    setShowTabLoader(true);
    setActiveTab(tabId);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabId);
    startTabTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const getJourneyTitle = () => {
    // Prefer explicit journey title when available
    if (effectiveJourney?.title) {
      return effectiveJourney.title;
    }

    if (effectiveJourney?.tocName) {
      return t('journey', { category: effectiveJourney.tocName }).trim();
    }

    // If hero title looks Arabic, don't append "journey"
    if (/[\u0600-\u06FF]/.test(hero.title)) {
      return hero.title;
    }

    const overviewIndex = hero.title.toLowerCase().indexOf('overview');
    if (overviewIndex !== -1) {
      const categoryName = hero.title.substring(0, overviewIndex).trim();
      return `${categoryName} journey`;
    }
    if (hero.title.toLowerCase().includes('designs')) {
      return 'Designs journey';
    }
    return `${hero.title} journey`;
  };

  const hasOverviewHeroImage = Boolean(hero.backgroundImage?.trim());
  const journeyBackgroundImage = effectiveJourney.backgroundImage || hero.backgroundImage;
  const hasJourneyHeroImage = Boolean(journeyBackgroundImage?.trim());

  return (
    <>
      <Section padding="none" className="py-5">
        {isFallbackData && (
          <div className="mb-3 inline-flex rounded-md bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            FALLBACK DATA
          </div>
        )}
        <Breadcrumbs items={breadcrumbs} variant="services" />
        <Tabs
          tabs={
            tabsData.map((tab) => ({
              id: tab.value,
              label: tab.label,
              icon: tab.icon,
            })) as TabItem[]
          }
          className={`mt-5 ${tabsClassName || ''}`}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Section>
      {/* Hero Section */}
      {activeTab === 'overview' && (
        <HeroStatic
          title={hero.title}
          description={hero.description}
          secondDescription={hero.secondDescription}
          backgroundImage={hasOverviewHeroImage ? hero.backgroundImage : undefined}
          backgroundColor={hasOverviewHeroImage ? undefined : 'bg-primary-50'}
          textColor={hasOverviewHeroImage ? 'white' : 'dark'}
        />
      )}
      {activeTab === 'journey' && (
        <HeroStatic
          title={getJourneyTitle()}
          description={effectiveJourney.description || hero.description}
          secondDescription={effectiveJourney.secondDescription}
          backgroundImage={hasJourneyHeroImage ? journeyBackgroundImage : undefined}
          backgroundColor={hasJourneyHeroImage ? undefined : 'bg-primary-50'}
          textColor={hasJourneyHeroImage ? 'white' : 'dark'}
        />
      )}
      {/* Navigation between Hero and Overview - only show on overview tab */}
      {activeTab === 'overview' && navigation && <Navigation {...navigation} />}
      {/* Content Sections */}
      <div className="relative min-h-[120px]">
        {(showTabLoader || isTabPending) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 pointer-events-none">
            <Spinner />
          </div>
        )}
        {activeTab === 'overview' && <IPOverviewSection {...overview} />}
        {activeTab === 'journey' &&
          (isJourneyLoading ? (
            <Spinner />
          ) : Object.keys(effectiveJourney.sections || {}).length > 0 ? (
            <IPJourneySection {...effectiveJourney} />
          ) : (
            <Section>
              <p className="text-neutral-700">
                {journeyLoadFailed
                  ? 'Journey data is temporarily unavailable.'
                  : 'Journey content is loading...'}
              </p>
            </Section>
          ))}
        {activeTab === 'services' && <IPServicesSection {...services} />}
        {activeTab === 'media' && media}
      </div>
      <FeedbackSection />
    </>
  );
};

export default IPCategoryTemplate;
