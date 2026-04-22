import type { DrupalIncludedEntity, DrupalNode } from '@/lib/drupal/types';
import type {
  DigitalGuideSectionData,
  DrupalDigitalGuideTabData,
  DigitalGuideContentBlockData,
  DigitalGuideCTAData,
} from '@/lib/drupal/types/digital-guide';
import { fetchDrupal, getRelated } from '../utils';

/**
 * Transforms a digital guide CTA paragraph to React-friendly format
 */
function transformCTAToReact(cta: DrupalIncludedEntity): DigitalGuideCTAData | null {
  try {
    const attrs = cta.attributes as any;
    return {
      text: attrs.field_cta_text?.value || attrs.field_cta_text || '',
      buttonLabel: attrs.field_cta_button_label?.value || attrs.field_cta_button_label || '',
      buttonHref: attrs.field_cta_button_href?.value || attrs.field_cta_button_href || '',
      buttonAriaLabel:
        attrs.field_cta_button_aria_label?.value || attrs.field_cta_button_aria_label || '',
      buttonIntent: (attrs.field_cta_button_intent?.value ||
        attrs.field_cta_button_intent ||
        'primary') as 'primary' | 'secondary',
      buttonOutline:
        attrs.field_cta_button_outline?.value ?? attrs.field_cta_button_outline ?? false,
    };
  } catch (error) {
    console.error('Failed to transform CTA:', error);
    return null;
  }
}

/**
 * Fetches a digital guide section by guide type
 */
export async function fetchDigitalGuideSection(
  guideType: string,
  locale: string,
): Promise<{ sections: DrupalNode[]; included: DrupalIncludedEntity[] }> {
  try {
    // Fetch node with included tabs using direct URL
    const response = await fetchDrupal(
      `/node/digital_guide_section?filter[field_guide_type]=${guideType}&filter[status]=1&include=field_digital_guide_tabs&sort=field_weight`,
      {},
      locale,
    );

    if (!response.data || response.data.length === 0) {
      return { sections: [], included: [] };
    }

    const section = Array.isArray(response.data) ? response.data[0] : response.data;
    const nodeNid = (section.attributes as any).drupal_internal__nid;
    const included: DrupalIncludedEntity[] = response.included || [];
    const rels = section.relationships || {};

    // Get tab UUIDs from node relationships
    const tabsRelationship = rels.field_digital_guide_tabs?.data || [];
    const tabUuids = Array.isArray(tabsRelationship)
      ? tabsRelationship.map((rel: any) => rel.id)
      : tabsRelationship?.id
        ? [tabsRelationship.id]
        : [];

    // Get tabs from included - filter by UUID from relationships AND langcode
    const tabsFromIncluded = included.filter(
      (item) =>
        item.type === 'paragraph--digital_guide_tab' &&
        item.attributes?.langcode === locale &&
        tabUuids.includes(item.id),
    );

    const tabsIncluded: DrupalIncludedEntity[] = [];
    let matchingSteps: any[] = [];

    // Fetch each tab with nested content (only included entities like content blocks and CTAs)
    try {
      for (const tab of tabsFromIncluded) {
        try {
          const tabResponse = await fetchDrupal<DrupalIncludedEntity>(
            `/paragraph/digital_guide_tab/${tab.id}?include=field_tab_content,field_tab_cta`,
            {},
            locale,
          );
          // Only add nested included entities (content blocks, CTAs), NOT the tab itself (it's already in included)
          if (tabResponse.included) {
            for (const inc of tabResponse.included) {
              tabsIncluded.push(inc);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch tab ${tab.id} with nested content:`, error);
        }
      }

      // Fetch checklist steps
      const stepsResponse = await fetchDrupal<DrupalIncludedEntity>(
        `/paragraph/digital_guide_checklist_step`,
        {},
        locale,
      );
      const allSteps = Array.isArray(stepsResponse.data)
        ? stepsResponse.data
        : stepsResponse.data
          ? [stepsResponse.data]
          : [];

      // Filter checklist steps by parent node and langcode
      matchingSteps = allSteps.filter((step: any) => {
        const parentId = step.attributes?.parent_id;
        const parentFieldName = step.attributes?.parent_field_name;
        const stepLangcode = step.attributes?.langcode;
        return (
          (parentId === String(nodeNid) || parentId === nodeNid) &&
          parentFieldName === 'field_category_checklist' &&
          stepLangcode === locale
        );
      });

      console.log('🔍 [FETCH] Checklist steps:', {
        allSteps: allSteps.length,
        matchingSteps: matchingSteps.length,
        matchingStepIds: matchingSteps.map((s: any) => s.id),
      });

      // Fetch each step with nested content and actions (only included entities, not the step itself)
      for (const step of matchingSteps) {
        try {
          const stepResponse = await fetchDrupal<DrupalIncludedEntity>(
            `/paragraph/digital_guide_checklist_step/${step.id}?include=field_step_content,field_step_on_yes,field_step_on_no`,
            {},
            locale,
          );
          // Only add nested included entities (content blocks, actions), NOT the step itself
          if (stepResponse.included) {
            for (const inc of stepResponse.included) {
              tabsIncluded.push(inc);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch checklist step ${step.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tabs or checklist steps:', error);
    }

    return {
      sections: [section],
      included: [...included, ...matchingSteps, ...tabsIncluded],
    };
  } catch (error) {
    console.error(`Failed to fetch digital guide section for ${guideType}:`, error);
    return { sections: [], included: [] };
  }
}

/**
 * Transforms a content block paragraph to React-friendly format
 */
function transformContentBlockToReact(
  block: DrupalIncludedEntity,
): DigitalGuideContentBlockData | null {
  try {
    const attrs = block.attributes as any;
    return {
      heading: attrs.field_heading?.value || attrs.field_heading || '',
      // Use VALUE instead of PROCESSED to preserve CSS classes
      content: attrs.field_paragraph?.value || attrs.field_paragraph?.processed || '',
    };
  } catch (error) {
    console.error('Failed to transform content block:', error);
    return null;
  }
}

/**
 * Transforms a tab paragraph to React-friendly format
 */
function transformTabToReact(
  tab: DrupalIncludedEntity,
  allIncluded: DrupalIncludedEntity[],
): DrupalDigitalGuideTabData | null {
  try {
    const attrs = tab.attributes as any;
    const rels = tab.relationships || {};

    // Get content blocks
    const contentBlocksData = getRelated(rels, 'field_tab_content', allIncluded);

    const contentBlocks: DigitalGuideContentBlockData[] = (
      Array.isArray(contentBlocksData)
        ? contentBlocksData
        : contentBlocksData
          ? [contentBlocksData]
          : []
    )
      .map((block) => transformContentBlockToReact(block))
      .filter((block): block is DigitalGuideContentBlockData => block !== null);

    // Get CTAs
    const ctasData = getRelated(rels, 'field_tab_cta', allIncluded);
    const ctas: DigitalGuideCTAData[] = (
      Array.isArray(ctasData) ? ctasData : ctasData ? [ctasData] : []
    )
      .map((cta) => transformCTAToReact(cta))
      .filter((cta): cta is DigitalGuideCTAData => cta !== null);

    return {
      id: attrs.field_tab_id || '',
      label: attrs.field_tab_label || '',
      contentBlocks,
      ctas,
    };
  } catch (error) {
    console.error('Failed to transform tab:', error);
    return null;
  }
}

/**
 * Gets digital guide section data with tabs
 */
export async function getDigitalGuideSectionDataWithTabs(
  guideType: string,
  locale: string,
): Promise<DigitalGuideSectionData | null> {
  try {
    const result = await fetchDigitalGuideSection(guideType, locale);

    if (!result.sections || result.sections.length === 0) {
      console.log(`⚠️ DIGITAL GUIDE SECTION: No data found for ${guideType}, using fallback`);
      return null;
    }

    const section = result.sections[0];
    const attrs = section.attributes as any;
    const rels = section.relationships || {};

    // Get tabs from result.included (already fetched and filtered in fetchDigitalGuideSection)
    const allTabParagraphs = result.included.filter(
      (item) => item.type === 'paragraph--digital_guide_tab',
    );

    const tabs: DrupalDigitalGuideTabData[] = allTabParagraphs
      .map((tab) => transformTabToReact(tab, result.included))
      .filter((tab): tab is DrupalDigitalGuideTabData => tab !== null);

    // Get checklist steps
    const allChecklistSteps = result.included.filter(
      (item) => item.type === 'paragraph--digital_guide_checklist_step',
    );

    console.log('🔍 [CHECK YOUR IDEA DEBUG]', {
      totalIncluded: result.included.length,
      checklistStepsFound: allChecklistSteps.length,
      stepIds: allChecklistSteps.map((s) => s.id),
    });

    const checklistSteps = allChecklistSteps
      .map((step) => {
        try {
          const stepRels = step.relationships || {};

          // Get content blocks
          const contentBlocks = getRelated(stepRels, 'field_step_content', result.included);
          const contentArray = Array.isArray(contentBlocks) ? contentBlocks : [contentBlocks];

          console.log('  🔍 Step', step.id, {
            contentBlocks,
            isArray: Array.isArray(contentBlocks),
            contentArrayLength: contentArray.length,
          });

          const contentHtml = contentArray
            .map((block: any) => {
              const blockAttrs = block?.attributes;
              // Use VALUE instead of PROCESSED to preserve CSS classes
              const html =
                blockAttrs?.field_paragraph?.value || blockAttrs?.field_paragraph?.processed || '';
              console.log('    📝 Block', block?.id, {
                hasProcessed: !!blockAttrs?.field_paragraph?.processed,
                hasValue: !!blockAttrs?.field_paragraph?.value,
                htmlLength: html.length,
                htmlPreview: html.substring(0, 100),
              });
              return html;
            })
            .filter(Boolean)
            .join('\n');

          // Get onYes action
          const yesAction = getRelated(stepRels, 'field_step_on_yes', result.included);
          const yesAttrs = (Array.isArray(yesAction) ? yesAction[0] : yesAction)?.attributes as any;
          const onYes = {
            type: (yesAttrs?.field_action_type || 'next_step') as
              | 'next_step'
              | 'show_alert'
              | 'redirect',
            alertTitle: yesAttrs?.field_action_alert_title || undefined,
            alertDescription: (yesAttrs?.field_action_alert_description as any)?.value || undefined,
            alertButtonLabel: yesAttrs?.field_action_alert_button_label || undefined,
            alertButtonHref: yesAttrs?.field_action_alert_button_href || undefined,
            redirectHref: yesAttrs?.field_action_redirect_href || undefined,
          };

          // Get onNo action
          const noAction = getRelated(stepRels, 'field_step_on_no', result.included);
          const noAttrs = (Array.isArray(noAction) ? noAction[0] : noAction)?.attributes as any;
          const onNo = {
            type: (noAttrs?.field_action_type || 'next_step') as
              | 'next_step'
              | 'show_alert'
              | 'redirect',
            alertTitle: noAttrs?.field_action_alert_title || undefined,
            alertDescription: (noAttrs?.field_action_alert_description as any)?.value || undefined,
            alertButtonLabel: noAttrs?.field_action_alert_button_label || undefined,
            alertButtonHref: noAttrs?.field_action_alert_button_href || undefined,
            redirectHref: noAttrs?.field_action_redirect_href || undefined,
          };

          return {
            contentHtml,
            onYes,
            onNo,
          };
        } catch (error) {
          console.error('Failed to transform checklist step:', error);
          return null;
        }
      })
      .filter((step) => step !== null);

    return {
      title: attrs.title || '',
      description:
        attrs.field_description?.value || attrs.field_description?.processed || attrs.field_description || '',
      guideType: attrs.field_guide_type || guideType,
      tabs,
      checklistSteps,
    };
  } catch (error) {
    console.error(`Error fetching digital guide section for ${guideType}:`, error);
    return null;
  }
}
