'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Tabs from '@/components/molecules/Tabs';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import Section from '@/components/atoms/Section';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import IPServicesSection from '@/components/organisms/IPServicesSection';
import IPMediaSection from '@/components/organisms/IPMediaSection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { IPServiceTemplateProps, IPServiceTemplateMedia } from './IPServiceTemplate.types';

const IPServiceTemplate = ({
  tabs,
  defaultActiveTab = 'overview',
  breadcrumbs,
  overview,
  services,
  media,
  additionalTabs = {},
  navigationItems,
  enableMobileScroll = false,
  tabsClassName,
  tabsSectionClassName,
}: IPServiceTemplateProps) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || defaultActiveTab;

  // Dynamically build breadcrumbs based on active tab
  const activeBreadcrumbs = useMemo(() => {
    // If we're on overview/default tab, use base breadcrumbs
    if (activeTab === 'overview' || activeTab === defaultActiveTab) {
      return breadcrumbs;
    }

    // Find the current tab to get its label
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (!currentTab) {
      return breadcrumbs;
    }

    // Add the current tab to breadcrumbs
    return [...breadcrumbs, { label: currentTab.label }];
  }, [activeTab, breadcrumbs, tabs, defaultActiveTab]);

  const renderOverview = () => (
    <>
      <HeroStatic
        title={overview.hero.title}
        description={overview.hero.description}
        backgroundImage={overview.hero.backgroundImage}
        className={overview.hero.className}
        titleClassName={overview.hero.titleClassName}
        descriptionClassName={overview.hero.descriptionClassName}
        titleSize={overview.hero.titleSize}
        titleWeight={overview.hero.titleWeight}
        contentAlign={overview.hero.contentAlign}
        layoutWrapperClassName={overview.hero.layoutWrapperClassName}
        contentStackClassName={overview.hero.contentStackClassName}
        descriptionWrapperClassName={overview.hero.descriptionWrapperClassName}
      />
      {navigationItems && <Navigation items={navigationItems} className="hidden lg:block" />}
      {overview.sections}
      {overview.statistics && (
        <div id="statistics">
          <StatisticsSection
            title={overview.statistics.title}
            ctaLabel={overview.statistics.ctaLabel}
            ctaHref={overview.statistics.ctaHref}
            stats={overview.statistics.stats}
            columns={overview.statistics.columns}
          />
        </div>
      )}
    </>
  );

  const renderServices = () => (
    <IPServicesSection
      title={services.title}
      services={services.services}
      serviceTypeOptions={services.serviceTypeOptions}
      targetGroupOptions={services.targetGroupOptions}
    />
  );

  const renderMedia = () => {
    // If media is a React node (e.g., IPMediaSection component), render it directly
    if (React.isValidElement(media)) {
      return media;
    }

    // Otherwise, render the old IPMediaSection with props
    const mediaData = media as IPServiceTemplateMedia;
    return (
      <IPMediaSection
        heroTitle={mediaData.heroTitle}
        heroDescription={mediaData.heroDescription}
        heroImage={mediaData.heroImage}
        tabs={mediaData.tabs}
        content={mediaData.content}
        filterFields={mediaData.filterFields}
        badgeLabel={mediaData.badgeLabel}
        category={mediaData.category}
        items={mediaData.items}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'services':
        return renderServices();
      case 'media':
        return renderMedia();
      default:
        return additionalTabs[activeTab] || null;
    }
  };

  return (
    <main className="min-h-screen">
      <Section padding="none" className={tabsSectionClassName || 'pt-6'}>
        <Breadcrumbs items={activeBreadcrumbs} className="mb-8" />
        <Tabs
          tabs={tabs}
          defaultActiveTab={defaultActiveTab}
          ariaLabel="Service navigation tabs"
          className={`mb-6 ${tabsClassName || ''}`}
          syncWithQueryParam="tab"
          enableMobileScroll={enableMobileScroll}
        />
      </Section>
      {renderTabContent()}
      <FeedbackSection />
    </main>
  );
};

export default IPServiceTemplate;
