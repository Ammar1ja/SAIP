/**
 * Digital Guide Category Service
 * Handles IP categories (Patents, Trademarks, Copyrights, etc.)
 */

import { fetchContentType, getRelated, fetchDrupal } from '../utils';
import { DrupalNode, DrupalIncludedEntity } from '../types';
import {
  transformTabToReact,
  DigitalGuideTabData,
  transformChecklistStepToStep,
} from './digital-guide-transformers';
import type { ChecklistStep } from '@/context/ChecklistContext';

export interface DigitalGuideCategoryData {
  categoryType?: string;
  title: string;
  label: string;
  icon?: string;
  tabs: DigitalGuideTabData[];
  checklist?: ChecklistStep[];
}

/**
 * Fetch digital guide category by type
 */
export async function fetchDigitalGuideCategory(categoryType: string, locale?: string) {
  try {
    // First, fetch the category node
    const response = await fetchContentType(
      'digital_guide_category',
      {
        filter: {
          field_category_type: categoryType,
          status: '1',
        },
      },
      locale,
    );

    if (!response.data || response.data.length === 0) {
      return { categories: [], included: [] };
    }

    const category = response.data[0];
    const rels = category.relationships || {};
    const included: DrupalIncludedEntity[] = response.included || [];
    const nodeNid = (category.attributes as any).drupal_internal__nid;

    // Fetch tabs paragraphs separately (entity_reference_revisions not included by JSON:API)
    const tabsIncluded: DrupalIncludedEntity[] = [];
    try {
      const allTabsResponse = await fetchDrupal<DrupalIncludedEntity>(
        `/paragraph/digital_guide_tab`,
        {},
        locale,
      );
      const allTabs = Array.isArray(allTabsResponse.data)
        ? allTabsResponse.data
        : allTabsResponse.data
          ? [allTabsResponse.data]
          : [];

      // Filter paragraphs belonging to this node by parent_id
      const matchingTabs = allTabs.filter((tab: any) => {
        const parentId = tab.attributes?.parent_id;
        const parentFieldName = tab.attributes?.parent_field_name;
        return (
          (parentId === String(nodeNid) || parentId === nodeNid) &&
          parentFieldName === 'field_category_tabs'
        );
      });

      // Fetch each matching tab with nested content
      for (const tab of matchingTabs) {
        try {
          const tabResponse = await fetchDrupal<DrupalIncludedEntity>(
            `/paragraph/digital_guide_tab/${tab.id}?include=field_tab_content,field_tab_cta`,
            {},
            locale,
          );
          const tabData = Array.isArray(tabResponse.data) ? tabResponse.data[0] : tabResponse.data;
          if (tabData) {
            tabsIncluded.push(tabData);
            if (tabResponse.included) {
              tabsIncluded.push(...tabResponse.included);
            }
          }
        } catch (err) {
          tabsIncluded.push(tab);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch tabs:`, err);
    }

    // Fetch checklist paragraphs separately
    try {
      const allStepsResponse = await fetchDrupal<DrupalIncludedEntity>(
        `/paragraph/digital_guide_checklist_step`,
        {},
        locale,
      );
      const allSteps = Array.isArray(allStepsResponse.data)
        ? allStepsResponse.data
        : allStepsResponse.data
          ? [allStepsResponse.data]
          : [];

      // Filter paragraphs belonging to this node by parent_id
      const matchingSteps = allSteps.filter((step: any) => {
        const parentId = step.attributes?.parent_id;
        const parentFieldName = step.attributes?.parent_field_name;
        return (
          (parentId === String(nodeNid) || parentId === nodeNid) &&
          parentFieldName === 'field_category_checklist'
        );
      });

      // Fetch each matching step with nested content
      for (const step of matchingSteps) {
        try {
          const stepResponse = await fetchDrupal<DrupalIncludedEntity>(
            `/paragraph/digital_guide_checklist_step/${step.id}?include=field_step_content,field_step_on_yes,field_step_on_no`,
            {},
            locale,
          );
          const stepData = Array.isArray(stepResponse.data)
            ? (stepResponse.data[0] as DrupalIncludedEntity)
            : (stepResponse.data as DrupalIncludedEntity);
          if (stepData) {
            tabsIncluded.push(stepData);
            if (stepResponse.included) {
              tabsIncluded.push(...stepResponse.included);
            }
          }
        } catch (err) {
          tabsIncluded.push(step);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch checklist steps:`, err);
    }

    return {
      categories: response.data || [],
      included: tabsIncluded,
    };
  } catch (error) {
    console.error(`Failed to fetch digital guide category (${categoryType}):`, error);
    return { categories: [], included: [] };
  }
}

/**
 * Get digital guide category data with tabs
 */
export async function getDigitalGuideCategoryData(
  categoryType: string,
  locale?: string,
): Promise<DigitalGuideCategoryData | null> {
  try {
    const result = await fetchDigitalGuideCategory(categoryType, locale);

    if (!result.categories || result.categories.length === 0) {
      console.log(`🔴 DIGITAL GUIDE CATEGORY: No category found for ${categoryType} (${locale})`);
      return null;
    }

    const category = result.categories[0];
    const attrs = category.attributes as any;
    const rels = category.relationships || {};

    // Get tabs from field_category_tabs (paragraphs)
    const tabsData = getRelated(rels, 'field_category_tabs', result.included);
    const tabs: DigitalGuideTabData[] = Array.isArray(tabsData)
      ? tabsData
          .map((tab) => transformTabToReact(tab, result.included))
          .filter((tab): tab is DigitalGuideTabData => tab !== null)
      : tabsData
        ? [transformTabToReact(tabsData, result.included)].filter(
            (tab): tab is DigitalGuideTabData => tab !== null,
          )
        : [];

    const title = attrs.field_category_title || attrs.title || categoryType;
    const label = attrs.field_category_label || title;
    const icon = attrs.field_category_icon || undefined;

    // Get checklist if exists
    const checklistData = getRelated(rels, 'field_category_checklist', result.included);
    const checklistSteps: ChecklistStep[] = Array.isArray(checklistData)
      ? checklistData
          .map((step) => transformChecklistStepToStep(step, result.included))
          .filter((step): step is ChecklistStep => step !== null)
      : checklistData
        ? [transformChecklistStepToStep(checklistData, result.included)].filter(
            (step): step is ChecklistStep => step !== null,
          )
        : [];

    console.log(
      `✅ DIGITAL GUIDE CATEGORY: Using Drupal data for ${categoryType} with ${tabs.length} tabs${checklistSteps.length > 0 ? ` and ${checklistSteps.length} checklist steps` : ''} (${locale})`,
    );
    return {
      title,
      label,
      icon,
      tabs,
      ...(checklistSteps.length > 0 && { checklist: checklistSteps }),
    };
  } catch (error) {
    console.log(`🔴 DIGITAL GUIDE CATEGORY: Error for ${categoryType} (${locale})`, error);
    return null;
  }
}

/**
 * Get all digital guide categories (for IP Category page)
 */
export async function getAllDigitalGuideCategories(
  locale?: string,
): Promise<DigitalGuideCategoryData[]> {
  try {
    const response = await fetchContentType(
      'digital_guide_category',
      {
        filter: {
          status: '1',
        },
        include: ['field_category_tabs'],
      },
      locale,
    );

    const categories: DigitalGuideCategoryData[] = (response.data || []).map((category) => {
      const attrs = category.attributes as any;
      return {
        categoryType: attrs.field_category_type || '',
        title: attrs.field_category_title || attrs.title || '',
        label: attrs.field_category_label || attrs.title || '',
        icon: attrs.field_category_icon || undefined,
        tabs: [], // We don't need full tabs for the category listing page
      };
    });

    console.log(`✅ DIGITAL GUIDE CATEGORIES: Found ${categories.length} categories (${locale})`);
    return categories;
  } catch (error) {
    console.log(`🔴 DIGITAL GUIDE CATEGORIES: Error (${locale})`, error);
    return [];
  }
}
