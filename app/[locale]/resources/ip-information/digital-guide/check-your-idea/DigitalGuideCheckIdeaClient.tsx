'use client';

import DigitalGuideChecklistSection from '@/components/sections/DigitalGuideChecklistSection';
import { ChecklistProvider } from '@/context/ChecklistContext';
import { useTranslations } from 'next-intl';
import type { DigitalGuideSectionData } from '@/lib/drupal/types/digital-guide';
import type { ChecklistStep, ChecklistAction } from '@/context/ChecklistContext';
import type { DrupalChecklistAction } from '@/lib/drupal/types/digital-guide';

interface DigitalGuideCheckIdeaClientProps {
  drupalData: DigitalGuideSectionData | null;
  locale: string;
  messages: any;
  fallbackChecklist: ChecklistStep[];
}

function transformDrupalActionToChecklistAction(
  drupalAction: DrupalChecklistAction,
): ChecklistAction {
  if (drupalAction.type === 'next_step') {
    return { type: 'nextStep' };
  }

  if (drupalAction.type === 'show_alert') {
    return {
      type: 'showAlert',
      content: {
        title: drupalAction.alertTitle || '',
        description: drupalAction.alertDescription || '',
        actions: {
          primary: {
            ariaLabel: drupalAction.alertButtonLabel || '',
            children: drupalAction.alertButtonLabel || '',
            href: drupalAction.alertButtonHref || '',
          },
        },
      },
    };
  }

  if (drupalAction.type === 'redirect') {
    return {
      type: 'redirect',
      href: drupalAction.redirectHref || '',
      content: drupalAction.alertTitle
        ? {
            title: drupalAction.alertTitle,
            actions: {
              primary: {
                ariaLabel: drupalAction.alertButtonLabel || 'Go back',
                children: drupalAction.alertButtonLabel || 'Go back',
                action: 'back',
              },
            },
          }
        : undefined,
    };
  }

  // Fallback
  return { type: 'nextStep' };
}

export default function DigitalGuideCheckIdeaClient({
  drupalData,
  locale,
  messages,
  fallbackChecklist,
}: DigitalGuideCheckIdeaClientProps) {
  const t = useTranslations('digitalGuide.checkYourIdea');

  // Transform Drupal checklist steps to ChecklistStep format
  const checklist: ChecklistStep[] =
    drupalData && drupalData.checklistSteps.length > 0
      ? drupalData.checklistSteps.map((step) => ({
          content: <div dangerouslySetInnerHTML={{ __html: step.contentHtml }} />,
          onYes: transformDrupalActionToChecklistAction(step.onYes),
          onNo: transformDrupalActionToChecklistAction(step.onNo),
        }))
      : fallbackChecklist;

  return (
    <ChecklistProvider steps={checklist}>
      <DigitalGuideChecklistSection title={drupalData?.title || t('title')} />
    </ChecklistProvider>
  );
}
