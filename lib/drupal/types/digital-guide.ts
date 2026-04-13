/**
 * Digital Guide Section Types for Drupal Service
 */

export interface DigitalGuideContentBlockData {
  heading: string;
  content: string;
}

export interface DigitalGuideCTAData {
  text: string;
  buttonLabel: string;
  buttonHref: string;
  buttonAriaLabel?: string;
  buttonIntent?: 'primary' | 'secondary';
  buttonOutline?: boolean;
}

export interface DrupalDigitalGuideTabData {
  id: string;
  label: string;
  contentBlocks: DigitalGuideContentBlockData[];
  ctas: DigitalGuideCTAData[];
}

export interface DrupalChecklistAction {
  type: 'next_step' | 'show_alert' | 'redirect';
  alertTitle?: string;
  alertDescription?: string;
  alertButtonLabel?: string;
  alertButtonHref?: string;
  redirectHref?: string;
}

export interface DigitalGuideChecklistStepData {
  contentHtml: string; // Raw HTML from Drupal content blocks
  onYes: DrupalChecklistAction;
  onNo: DrupalChecklistAction;
}

export interface DigitalGuideSectionData {
  title: string;
  description: string;
  guideType: string;
  label?: string;
  tabs: DrupalDigitalGuideTabData[];
  checklistSteps: DigitalGuideChecklistStepData[];
}
