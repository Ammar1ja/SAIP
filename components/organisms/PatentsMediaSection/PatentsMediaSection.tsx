'use client';

import { useState } from 'react';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Section from '@/components/atoms/Section';
import { TabVertical } from '@/components/molecules/TabVertical/TabVertical';
import { Filters } from '@/components/molecules/Filters';
import Heading from '@/components/atoms/Heading';
import { MEDIA_TABS, MEDIA_CONTENT, FILTER_FIELDS } from './PatentsMediaSection.data';

const PatentsMediaSection = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    search: '',
    date: '',
  });

  const { title, description } = MEDIA_CONTENT[activeTab as keyof typeof MEDIA_CONTENT];

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', date: '' });
  };

  return (
    <>
      <HeroStatic
        title="Media for patents"
        description="Here you can find news, videos, articles and events on various categories of IP."
        backgroundImage="/images/about/hero.jpg"
      />
      <Section>
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="sticky top-24 self-start z-10 min-w-[220px] max-w-[260px]">
            <div className="bg-white rounded-md shadow-sm">
              <TabVertical
                tabs={MEDIA_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                ariaLabel="Media navigation"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Heading size="h1" as="h1" className="mb-2">
              {title}
            </Heading>
            <p className="text-neutral-700 mb-4 max-w-2xl">{description}</p>
            <span className="inline-block border border-neutral-300 rounded-full px-3 py-1 text-sm mb-4">
              Patents
            </span>
            <div className="max-w-5xl mx-auto mb-8">
              <Filters
                fields={FILTER_FIELDS}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                showHideFilters={false}
                columns={2}
              />
            </div>
            <div className="text-neutral-400 italic">No data yet – coming soon!</div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default PatentsMediaSection;
