/**
 * Digital Guide Transformers
 * Transform Drupal paragraphs to React components
 */

import { DrupalIncludedEntity } from '../types';
import { extractText, getRelated } from '../utils';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import List from '@/components/atoms/List';
import TextContent from '@/components/atoms/TextConent';
import Button from '@/components/atoms/Button';
import { HomeIcon } from 'lucide-react';
import React from 'react';
import type { ChecklistAction } from '@/context/ChecklistContext';
import type { InlineAlertContent } from '@/components/molecules/InlineAlert';
import type { ChecklistStep } from '@/context/ChecklistContext';

/**
 * Transform content block paragraph to React component
 */
export function transformContentBlockToReact(
  block: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): React.ReactNode {
  const attrs = block.attributes as any;
  const blockType = attrs.field_block_type || 'heading_paragraph';
  const heading = attrs.field_heading || '';
  const headingLevel = attrs.field_heading_level || 'h4';
  const paragraph = extractText(attrs.field_paragraph) || '';
  const listItems = attrs.field_list_items
    ? typeof attrs.field_list_items === 'string'
      ? attrs.field_list_items.split('\n').filter(Boolean)
      : Array.isArray(attrs.field_list_items)
        ? attrs.field_list_items
        : []
    : [];
  const listOrdered = attrs.field_list_ordered || false;

  const elements: React.ReactNode[] = [];

  if (blockType === 'heading_paragraph' || blockType === 'heading_list') {
    if (heading) {
      const headingAs = headingLevel === 'h3' ? 'h3' : 'h4';
      const headingSize = headingLevel === 'h3' ? 'h3' : 'h4';
      elements.push(
        <Heading key="heading" as={headingAs} size={headingSize}>
          {heading}
        </Heading>,
      );
    }
  }

  if (blockType === 'heading_paragraph' || blockType === 'paragraph_only') {
    if (paragraph) {
      elements.push(
        <Paragraph key="paragraph" variant="compact">
          {paragraph}
        </Paragraph>,
      );
    }
  }

  if (blockType === 'heading_list' || blockType === 'list_only') {
    if (listItems.length > 0) {
      elements.push(
        <List
          key="list"
          ordered={listOrdered}
          items={listItems.map((item: string, idx: number) => ({
            id: idx,
            content: item,
          }))}
        />,
      );
    }
  }

  if (elements.length === 0) {
    return null;
  }

  // Wrap in TextContent if there's a heading
  if (heading && (blockType === 'heading_paragraph' || blockType === 'heading_list')) {
    return (
      <TextContent className="space-y-1">
        {elements.map((element, index) =>
          React.isValidElement(element)
            ? React.cloneElement(element, { key: element.key || `element-${index}` })
            : element,
        )}
      </TextContent>
    );
  }

  return (
    <>
      {elements.map((element, index) =>
        React.isValidElement(element)
          ? React.cloneElement(element, { key: element.key || `element-${index}` })
          : element,
      )}
    </>
  );
}

/**
 * Transform CTA paragraph to React component
 */
export function transformCTAToReact(
  cta: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): React.ReactNode {
  const attrs = cta.attributes as any;
  const text = extractText(attrs.field_cta_text) || '';
  const buttonLabel = attrs.field_cta_button_label || '';
  const buttonHref = attrs.field_cta_button_href || '';
  const buttonAriaLabel = attrs.field_cta_button_aria_label || buttonLabel;
  const buttonIntent = attrs.field_cta_button_intent || 'primary';
  const buttonOutline = attrs.field_cta_button_outline || false;

  if (!buttonLabel || !buttonHref) {
    return null;
  }

  return (
    <>
      {text && (
        <Paragraph className="font-semibold" variant="compact">
          {text}
        </Paragraph>
      )}
      <Button
        ariaLabel={buttonAriaLabel}
        href={buttonHref}
        intent={buttonIntent as 'primary' | 'secondary'}
        outline={buttonOutline}
        className={text ? '' : 'place-self-center'}
      >
        {buttonHref.includes('saip') || buttonHref.includes('services') ? (
          <>
            <HomeIcon size={20} /> {buttonLabel}
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </>
  );
}

/**
 * Transform tab paragraph to frontend format
 */
export interface DigitalGuideTabData {
  id: string;
  content: React.ReactNode;
  cta?: React.ReactNode;
}

export function transformTabToReact(
  tab: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): DigitalGuideTabData | null {
  const attrs = tab.attributes as any;
  const rels = tab.relationships || {};

  const tabId = attrs.field_tab_id || '';
  const tabLabel = attrs.field_tab_label || '';

  if (!tabId) {
    return null;
  }

  // Get content blocks
  const contentBlocksData = getRelated(rels, 'field_tab_content', included);
  const contentBlocks = Array.isArray(contentBlocksData)
    ? contentBlocksData
    : contentBlocksData
      ? [contentBlocksData]
      : [];

  // Transform content blocks to React
  const contentElements = contentBlocks
    .map((block, index) => {
      const element = transformContentBlockToReact(block, included);
      // Add key prop if element is valid
      if (element && React.isValidElement(element)) {
        return React.cloneElement(element, { key: `tab-block-${block.id || index}` });
      }
      return element;
    })
    .filter(Boolean);

  // Get CTA if exists
  const ctaData = getRelated(rels, 'field_tab_cta', included);
  const cta = ctaData && !Array.isArray(ctaData) ? transformCTAToReact(ctaData, included) : null;

  return {
    id: tabId,
    content: (
      <>
        {contentElements.map((element, index) =>
          React.isValidElement(element)
            ? React.cloneElement(element, { key: element.key || `tab-content-${index}` })
            : element,
        )}
      </>
    ),
    ...(cta && { cta }),
  };
}

/**
 * Transform checklist action paragraph to ChecklistAction
 */
export function transformChecklistActionToAction(
  action: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): ChecklistAction {
  const attrs = action.attributes as any;
  const actionType = attrs.field_action_type || 'next_step';

  if (actionType === 'next_step') {
    return { type: 'nextStep' };
  }

  if (actionType === 'redirect') {
    const href = attrs.field_action_redirect_href || '';
    const alertTitle = attrs.field_action_alert_title || '';
    const alertDescription = extractText(attrs.field_action_alert_description) || '';

    const content: InlineAlertContent | undefined =
      alertTitle || alertDescription
        ? {
            title: alertTitle,
            description: alertDescription,
            actions: {
              primary: {
                ariaLabel: attrs.field_action_alert_button_aria_label || 'Go back',
                children: attrs.field_action_alert_button_label || 'Go back',
                href: attrs.field_action_alert_button_href || href,
              },
            },
          }
        : undefined;

    return { type: 'redirect', href, content };
  }

  if (actionType === 'show_alert') {
    const buttonLabel = attrs.field_action_alert_button_label || '';
    const buttonHref = attrs.field_action_alert_button_href || '';
    const hasButton = Boolean(buttonLabel);
    const content: InlineAlertContent = {
      title: attrs.field_action_alert_title || '',
      description: extractText(attrs.field_action_alert_description) || '',
      ...(hasButton
        ? {
            actions: {
              primary: {
                ariaLabel: attrs.field_action_alert_button_aria_label || buttonLabel,
                children: buttonLabel,
                href: buttonHref,
              },
            },
          }
        : {}),
    };

    return { type: 'showAlert', content };
  }

  // Default fallback
  return { type: 'nextStep' };
}

/**
 * Transform checklist step paragraph to ChecklistStep
 */
export function transformChecklistStepToStep(
  step: DrupalIncludedEntity,
  included: DrupalIncludedEntity[] = [],
): ChecklistStep | null {
  try {
    const attrs = step.attributes as any;
    const rels = step.relationships || {};

    // Get step content (content blocks)
    const contentBlocksData = getRelated(rels, 'field_step_content', included);
    const contentBlocks = Array.isArray(contentBlocksData)
      ? contentBlocksData
      : contentBlocksData
        ? [contentBlocksData]
        : [];

    if (contentBlocks.length === 0) {
      console.warn('Checklist step has no content blocks', { stepId: step.id });
      return null;
    }

    // Transform content blocks to React
    const contentElements = contentBlocks
      .map((block, index) => {
        try {
          const element = transformContentBlockToReact(block, included);
          // Add key prop if element is valid
          if (element && React.isValidElement(element)) {
            return React.cloneElement(element, { key: `block-${block.id || index}` });
          }
          return element;
        } catch (err) {
          console.error('Error transforming content block:', err, { blockId: block.id });
          return null;
        }
      })
      .filter(Boolean);

    if (contentElements.length === 0) {
      console.warn('Checklist step has no valid content elements', { stepId: step.id });
      return null;
    }

    // Get onYes action
    const onYesData = getRelated(rels, 'field_step_on_yes', included);
    let onYes: ChecklistAction = { type: 'nextStep' };
    if (onYesData && !Array.isArray(onYesData)) {
      try {
        onYes = transformChecklistActionToAction(onYesData, included);
      } catch (err) {
        console.error('Error transforming onYes action:', err);
      }
    }

    // Get onNo action
    const onNoData = getRelated(rels, 'field_step_on_no', included);
    let onNo: ChecklistAction = { type: 'nextStep' };
    if (onNoData && !Array.isArray(onNoData)) {
      try {
        onNo = transformChecklistActionToAction(onNoData, included);
      } catch (err) {
        console.error('Error transforming onNo action:', err);
      }
    }

    return {
      content: (
        <>
          {contentElements.map((element, index) =>
            React.isValidElement(element)
              ? React.cloneElement(element, {
                  key: element.key || `step-content-${step.id}-${index}`,
                })
              : element,
          )}
        </>
      ),
      onYes,
      onNo,
    };
  } catch (error) {
    console.error('Error transforming checklist step:', error, { stepId: step.id });
    return null;
  }
}
