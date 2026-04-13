import { FC, Suspense } from 'react';
import Section from '@/components/atoms/Section';
import Tabs from '@/components/molecules/Tabs';
import Heading from '@/components/atoms/Heading';
import { useTabs } from '@/hooks/useTabs';
import { SectionWithTabsProps } from './SectionWithTabs.types';

const SectionWithTabs = <T,>({
  title,
  ariaLabel,
  tabs,
  data,
  renderPanel,
  defaultActiveTab,
  className,
}: SectionWithTabsProps<T>) => {
  const { activeTab, setActiveTab } = useTabs(tabs, defaultActiveTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const activeData = data[activeIndex];

  return (
    <Section className={className}>
      <Heading as="h2" size="h2" className="py-8" aria-label={ariaLabel || title}>
        {title}
      </Heading>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel={ariaLabel || title}
      />
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6"
      >
        <Suspense fallback={<div>Loading...</div>}>
          {activeData ? (
            renderPanel(activeData)
          ) : (
            <p className="text-neutral-500">No data available.</p>
          )}
        </Suspense>
      </div>
    </Section>
  );
};

export default SectionWithTabs;
