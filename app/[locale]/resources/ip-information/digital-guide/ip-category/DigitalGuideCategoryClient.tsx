'use client';

import type { TabItem } from '@/components/molecules/Tabs/Tabs.types';
import { useIsMobile } from '@/hooks/useIsMobile';
import DigitalGuideTabsSection from '@/components/sections/DigitalGuideTabsSection';
import { HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import type {
  DigitalGuideSectionData,
  DrupalDigitalGuideTabData,
} from '@/lib/drupal/types/digital-guide';
import type { DigitalGuideTabData } from '@/components/sections/DigitalGuideTabsSection';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import { TextContent } from '@/components/atoms/TextConent/TextContent';
import Button from '@/components/atoms/Button';

interface TabConfig {
  id: string;
  labelKey: string;
  labelKeyShort?: string;
}

interface DigitalGuideCategoryClientProps {
  drupalData: DigitalGuideSectionData | DigitalGuideCategoryData | null;
  locale: string;
  messages: any;
  categoryKey: string;
  fallbackData: (() => DigitalGuideTabData[]) | DigitalGuideTabData[];
  tabsConfig?: Record<string, TabConfig>;
}

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
              <Heading as="h4" size="h4">
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

export default function DigitalGuideCategoryClient({
  drupalData,
  locale,
  messages,
  categoryKey,
  fallbackData,
  tabsConfig,
}: DigitalGuideCategoryClientProps) {
  const isMobile = useIsMobile();
  const t = useTranslations('digitalGuide.ipCategory');
  const fallback = typeof fallbackData === 'function' ? fallbackData() : fallbackData;

  // If Drupal data exists and has tabs, use it
  if (drupalData && 'tabs' in drupalData && drupalData.tabs && drupalData.tabs.length > 0) {
    // Check if it's DigitalGuideSectionData (has contentBlocks) vs DigitalGuideCategoryData (has ReactNode)
    const firstTab = drupalData.tabs[0];
    const isDrupalSection = 'contentBlocks' in firstTab;

    // Transform Drupal data to ReactNode format if needed
    const tabsData = isDrupalSection
      ? transformDrupalTabsToReact(drupalData.tabs as DrupalDigitalGuideTabData[])
      : (drupalData.tabs as DigitalGuideTabData[]);

    // Get tab labels from messages or use tab IDs
    const drupalTabsForLabels = (
      isDrupalSection ? drupalData.tabs : []
    ) as DrupalDigitalGuideTabData[];
    const tabs: TabItem[] = drupalTabsForLabels.map((tab) => {
      // Try to get label from messages or tabsConfig
      const config = tabsConfig?.[tab.id];
      let label = tab.label || tab.id;

      if (config) {
        const labelKey = isMobile && config.labelKeyShort ? config.labelKeyShort : config.labelKey;
        label = t(labelKey);
      } else {
        // Try to get from messages
        const tabLabelKey = `tabs.${tab.id}`;
        label =
          messages?.digitalGuide?.ipCategory?.[`${categoryKey}Content`]?.tabs?.[tab.id] ||
          messages?.digitalGuide?.ipCategory?.[`${categoryKey}Content`]?.tabs?.[tabLabelKey] ||
          tab.label ||
          tab.id;
      }

      return {
        id: tab.id,
        label: typeof label === 'string' ? label : tab.id,
      };
    });

    return (
      <DigitalGuideTabsSection
        title={drupalData.title}
        tabs={tabs}
        defaultActiveTab={tabs[0]?.id || 'about'}
        data={tabsData}
        label={drupalData.label}
        icon={HomeIcon}
        description={'description' in drupalData ? drupalData.description : undefined}
      />
    );
  }

  // Fallback to hardcoded data
  const tabs: TabItem[] = tabsConfig
    ? Object.values(tabsConfig).map((config) => ({
        id: config.id,
        label: isMobile && config.labelKeyShort ? t(config.labelKeyShort) : t(config.labelKey),
      }))
    : [
        { id: 'about', label: t('tabs.about') },
        { id: 'protection', label: t('tabs.protection') },
      ];

  return (
    <DigitalGuideTabsSection
      title={t('title')}
      tabs={tabs}
      defaultActiveTab={tabs[0]?.id || 'about'}
      data={fallback}
      label={t(`labels.${categoryKey}`)}
      icon={HomeIcon}
    />
  );
}
