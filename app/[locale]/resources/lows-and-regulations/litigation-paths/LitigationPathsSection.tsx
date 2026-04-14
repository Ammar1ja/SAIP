'use client';

import React, { useState } from 'react';
import Section from '@/components/atoms/Section';
import ContentBlock from '@/components/molecules/ContentBlock';
import TabVertical from '@/components/molecules/TabVertical';
import Select from '@/components/atoms/Select';
import LitigationPathChart from './charts/LitigationPathChart';
import type { PathwayData } from '@/lib/drupal/services/litigation-paths.service';

interface LitigationPathsSectionProps {
  sectionHeading: string;
  sectionDescription: string;
  pathways: PathwayData[];
}

const LitigationPathsSection = ({
  sectionHeading,
  sectionDescription,
  pathways,
}: LitigationPathsSectionProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Build tabs from Drupal data
  const tabs = pathways.map((pathway, index) => ({
    id: pathway.type,
    label: pathway.title,
    index,
  }));

  const handleTabChange = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index !== -1) {
      setActiveTabIndex(index);
    }
  };

  const activePathway = pathways[activeTabIndex];

  const splitDescriptionToParagraphs = (text: string): string[] => {
    const normalized = text.trim();
    if (!normalized) return [];

    // EN + AR anchors from content pattern.
    const splitAnchors = ['The fifth flow', 'المسار الخامس'];
    for (const anchor of splitAnchors) {
      const idx = normalized.indexOf(anchor);
      if (idx > 0) {
        return [normalized.slice(0, idx).trim(), normalized.slice(idx).trim()].filter(Boolean);
      }
    }

    return [normalized];
  };

  const descriptionParagraphs = splitDescriptionToParagraphs(sectionDescription);
  const descriptionNode = (
    <>
      {descriptionParagraphs.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
      ))}
    </>
  );

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <ContentBlock
          heading={sectionHeading}
          text={descriptionNode}
          className="w-full max-w-[1280px] !space-y-0"
          headingClassName="w-full !text-[30px] !leading-[38px] md:!text-[36px] md:!leading-[44px] lg:!text-[48px] lg:!leading-[60px] !tracking-[-0.02em] !font-medium text-text-default"
          textClassName="!mt-3 max-w-[628px] text-[18px] leading-[28px] font-normal tracking-normal text-text-primary-paragraph [&_p]:max-w-[628px] [&_p]:text-[18px] [&_p]:leading-[28px] [&_p]:font-normal [&_p]:tracking-normal [&_p]:text-text-primary-paragraph [&_p]:mb-[18px] [&_p:last-child]:mb-0"
        />
      </div>

      {activePathway && (
        <>
          <div className="hidden lg:block">
            <div className="flex gap-8">
              <div className="w-[280px] shrink-0">
                <TabVertical
                  tabs={tabs}
                  activeTab={tabs[activeTabIndex]?.id || tabs[0]?.id}
                  onTabChange={handleTabChange}
                  ariaLabel="Litigation paths navigation"
                  indicatorHeight="lg"
                />
              </div>
              <div className="flex-1">
                <LitigationPathChart
                  pathwayType={activePathway.type}
                  nodeContents={activePathway.nodes}
                />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="mb-6">
              <Select
                id="litigation-path-select"
                label={sectionHeading}
                options={tabs.map((tab) => ({
                  value: tab.id,
                  label: tab.label,
                }))}
                value={tabs[activeTabIndex]?.id || tabs[0]?.id}
                onChange={(value) => {
                  if (typeof value === 'string') {
                    handleTabChange(value);
                  }
                }}
                placeholder={`Select ${sectionHeading.toLowerCase()}`}
                ariaLabel={`Select ${sectionHeading.toLowerCase()}`}
              />
            </div>
            <LitigationPathChart
              pathwayType={activePathway.type}
              nodeContents={activePathway.nodes}
            />
          </div>
        </>
      )}
    </Section>
  );
};

export default LitigationPathsSection;
