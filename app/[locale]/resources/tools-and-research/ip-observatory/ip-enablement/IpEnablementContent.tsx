'use client';

import Section from '@/components/atoms/Section';
import GlossaryTabs from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import StatisticsCard from '@/components/organisms/StatisticsSection/StatisticsCard';
import LastUpdateBar from '@/components/atoms/LastUpdateBar';
import { useState } from 'react';
import { IPObservatoryEnablementData } from '@/lib/drupal/services/ip-observatory-enablement.service';
import { useTranslations } from 'next-intl';

interface IpEnablementContentProps {
  data: IPObservatoryEnablementData;
}

export default function IpEnablementContentPage({ data }: IpEnablementContentProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]);
  const t = useTranslations('ipObservatory');

  const renderTabContent = () => {
    const tabData = data.tabsData[activeTab];
    if (!tabData) return null;

    return (
      <div className="space-y-6 md:space-y-8">
        <div>
          <h2 className="text-3xl md:text-[48px] md:leading-[60px] font-medium text-gray-900 mb-3 md:mb-4 md:tracking-[-0.96px]">
            {tabData.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-[28px]">{tabData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tabData.statistics.map((stat, index) => (
            <StatisticsCard
              key={index}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              chartType="line"
              chartData={stat.chartData || data.sampleChartData}
              chartProps={{ margin: { top: 0, right: 0, left: 0, bottom: 0 } }}
            />
          ))}
        </div>

        {/* Last data update bar */}
        {tabData.lastUpdate && (
          <LastUpdateBar
            date={tabData.lastUpdate}
            label={t('lastDataUpdate')}
            className="max-w-[846px] w-full mx-auto py-2 px-4 mt-6 md:mt-8"
            textClassName="text-[18px] leading-[28px] text-neutral-600"
          />
        )}
      </div>
    );
  };

  return (
    <Section>
      <GlossaryTabs tabs={data.tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-8 md:mt-12">{renderTabContent()}</div>
    </Section>
  );
}
