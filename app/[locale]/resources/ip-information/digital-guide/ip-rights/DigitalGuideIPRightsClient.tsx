'use client';

import React from 'react';
import type { TabItem } from '@/components/molecules/Tabs/Tabs.types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIPRightsData } from './DigitalGuideIPRights.data';
import DigitalGuideTabsSection from '@/components/sections/DigitalGuideTabsSection';
import { useTranslations } from 'next-intl';
import type {
  DigitalGuideSectionData,
  DrupalDigitalGuideTabData,
} from '@/lib/drupal/types/digital-guide';
import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';

/**
 * Transform Drupal tab data to ReactNode format for component
 */
function transformDrupalTabsToReact(
  drupalTabs: DrupalDigitalGuideTabData[],
): DigitalGuideTabData[] {
  return drupalTabs.map((tab) => ({
    id: tab.id,
    content: (
      <>
        {tab.contentBlocks.map((block, idx) => (
          <TextContent key={idx} className="space-y-1">
            {block.heading && (
              <Heading
                as="h4"
                size="custom"
                weight="medium"
                color="default"
                className="text-[18px] leading-[28px] tracking-normal"
              >
                {block.heading}
              </Heading>
            )}
            {block.content && (
              <div className="text-compact" dangerouslySetInnerHTML={{ __html: block.content }} />
            )}
          </TextContent>
        ))}
      </>
    ),
    cta:
      tab.ctas.length > 0 ? (
        <>
          {tab.ctas.map((cta, idx) => (
            <TextContent key={idx} className="space-y-1">
              {cta.text && (
                <Paragraph className="font-semibold" variant="compact">
                  {cta.text}
                </Paragraph>
              )}
              {cta.buttonLabel && cta.buttonHref && (
                <Button
                  ariaLabel={cta.buttonAriaLabel || cta.buttonLabel}
                  href={cta.buttonHref}
                  intent={cta.buttonIntent || 'primary'}
                  outline={cta.buttonOutline}
                  className="place-self-center"
                >
                  {cta.buttonLabel}
                </Button>
              )}
            </TextContent>
          ))}
        </>
      ) : undefined,
  }));
}

interface DigitalGuideIPRightsClientProps {
  drupalData: DigitalGuideSectionData | null;
  locale: string;
  messages: any;
}

export default function DigitalGuideIPRightsClient({
  drupalData,
  locale,
  messages,
}: DigitalGuideIPRightsClientProps) {
  const isMobile = useIsMobile();
  const t = useTranslations('digitalGuide.ipRights');
  const fallbackData = useIPRightsData();

  // If Drupal data exists and has tabs, use it
  if (drupalData && drupalData.tabs.length > 0) {
    // Get tab labels from messages or use tab IDs
    const tabs: TabItem[] = drupalData.tabs.map((tab: DrupalDigitalGuideTabData) => {
      // Try to get label from messages, fallback to tab ID
      const tabLabelKey = `tabs.${tab.id}`;
      const label =
        messages?.digitalGuide?.ipRights?.tabs?.[tab.id] ||
        messages?.digitalGuide?.ipRights?.tabs?.[tabLabelKey] ||
        tab.label ||
        tab.id;

      return {
        id: tab.id,
        label: typeof label === 'string' ? label : tab.id,
      };
    });

    const transformedTabs = transformDrupalTabsToReact(drupalData.tabs);

    return (
      <DigitalGuideTabsSection
        title={drupalData.title}
        tabs={tabs}
        defaultActiveTab={tabs[0]?.id || 'about'}
        data={transformedTabs}
      />
    );
  }

  // Fallback to hardcoded data
  const tabs: TabItem[] = [
    { id: 'about', label: t('tabs.about') },
    {
      id: 'scope-of-protection',
      label: isMobile ? t('tabs.scopeOfProtectionShort') : t('tabs.scopeOfProtection'),
    },
    {
      id: 'importance-of-protecting-ip',
      label: isMobile
        ? t('tabs.importanceOfProtectingIPShort')
        : t('tabs.importanceOfProtectingIP'),
    },
    {
      id: 'protecting-an-idea',
      label: isMobile ? t('tabs.protectingAnIdeaShort') : t('tabs.protectingAnIdea'),
    },
  ];

  return (
    <DigitalGuideTabsSection
      title={t('title')}
      tabs={tabs}
      defaultActiveTab="about"
      data={fallbackData}
    />
  );
}
