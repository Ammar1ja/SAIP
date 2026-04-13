'use client';

import DigitalGuideChecklistSection from '@/components/sections/DigitalGuideChecklistSection';
import { ChecklistProvider } from '@/context/ChecklistContext';
import { useTranslations } from 'next-intl';
import type { DigitalGuideCategoryData } from '@/lib/drupal/services/digital-guide-category.service';
import type { ChecklistStep } from '@/context/ChecklistContext';
import { HomeIcon } from 'lucide-react';

interface DigitalGuideCategoryChecklistClientProps {
  drupalData: DigitalGuideCategoryData | null;
  locale: string;
  messages: any;
  categoryKey: string;
  fallbackChecklist: ChecklistStep[];
}

export default function DigitalGuideCategoryChecklistClient({
  drupalData,
  locale,
  messages,
  categoryKey,
  fallbackChecklist,
}: DigitalGuideCategoryChecklistClientProps) {
  const t = useTranslations('digitalGuide.ipCategory');

  // If Drupal data exists and has checklist, use it; otherwise use fallback
  const checklist =
    drupalData?.checklist && drupalData.checklist.length > 0
      ? drupalData.checklist
      : fallbackChecklist;

  const title = drupalData?.title || t(`checklist.${categoryKey}`) || t('title');
  const label = drupalData?.label || t(`labels.${categoryKey}`);

  return (
    <ChecklistProvider steps={checklist}>
      <DigitalGuideChecklistSection title={title} label={label} icon={HomeIcon} />
    </ChecklistProvider>
  );
}
