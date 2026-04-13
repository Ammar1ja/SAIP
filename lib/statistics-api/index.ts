/**
 * Statistics API module. Fetches IP statistics from the external server and returns
 * data in the shape expected by StatisticsSection (StatisticsCardType[]).
 *
 * Integration: when ready, call getStatisticsForCategory() in the page data services
 * (patents, trademarks, copyrights, designs, plant-varieties, topographic-designs)
 * and assign the result to overview.statistics.statistics instead of Drupal field_statistics_items.
 */

import type { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';
import type { StatisticsCategory, PatentsDomain } from './types';
import { getStatisticsApiBaseUrl } from './config';
import {
  fetchPatentsFiling,
  fetchPatentsRegistered,
  fetchTrademarksFiling,
  fetchTrademarksRegistered,
  fetchCopyrightsFiling,
  fetchCopyrightsRegistered,
} from './client';
import { mapPatentsToCards, mapTrademarksToCards, mapCopyrightsToCards } from './mappers';

export type { StatisticsCategory, PatentsDomain } from './types';
export type { PatentsStatRow, TrademarksStatRow, CopyrightsStatRow } from './types';
export { PATENTS_DOMAIN_AR, mapPatentsDomainToSlug } from './domains';
export { getStatisticsApiBaseUrl, isStatisticsApiConfigured } from './config';
export {
  fetchPatentsFiling,
  fetchPatentsRegistered,
  fetchTrademarksFiling,
  fetchTrademarksRegistered,
  fetchCopyrightsFiling,
  fetchCopyrightsRegistered,
} from './client';
export { mapPatentsToCards, mapTrademarksToCards, mapCopyrightsToCards } from './mappers';

export interface GetStatisticsForCategoryOptions {
  /** Optional domain for patents view: e.g. "Industrial designs", "Plant varieties", "Integrated circuits". Omit for "Patents". */
  domain?: PatentsDomain;
  /** Optional labels for cards (e.g. from translations). Keys: filingLabel, registeredLabel, applicantTypeLabel / ownerTypeLabel / claimantTypeLabel */
  labels?: Record<string, string>;
}

/**
 * Fetches statistics for the given category and returns cards ready for StatisticsSection.
 * Throws if NEXT_PUBLIC_STATISTICS_API_URL is not set or the API request fails.
 * Use in try/catch and fall back to Drupal or fallback data on error.
 */
export async function getStatisticsForCategory(
  category: StatisticsCategory,
  options: GetStatisticsForCategoryOptions = {},
): Promise<StatisticsCardType[]> {
  if (!getStatisticsApiBaseUrl()) {
    throw new Error('Statistics API is not configured (NEXT_PUBLIC_STATISTICS_API_URL)');
  }

  const { domain, labels = {} } = options;

  switch (category) {
    case 'patents': {
      const [filing, registered] = await Promise.all([
        fetchPatentsFiling(domain),
        fetchPatentsRegistered(domain),
      ]);
      return mapPatentsToCards(filing, registered, {
        filingLabel: labels.filingLabel,
        registeredLabel: labels.registeredLabel,
        applicantTypeLabel: labels.applicantTypeLabel,
      });
    }
    case 'trademarks': {
      const [filing, registered] = await Promise.all([
        fetchTrademarksFiling(),
        fetchTrademarksRegistered(),
      ]);
      return mapTrademarksToCards(filing, registered, {
        filingLabel: labels.filingLabel,
        registeredLabel: labels.registeredLabel,
        ownerTypeLabel: labels.ownerTypeLabel,
      });
    }
    case 'copyrights': {
      const [filing, registered] = await Promise.all([
        fetchCopyrightsFiling(),
        fetchCopyrightsRegistered(),
      ]);
      return mapCopyrightsToCards(filing, registered, {
        filingLabel: labels.filingLabel,
        registeredLabel: labels.registeredLabel,
        claimantTypeLabel: labels.claimantTypeLabel,
      });
    }
    default: {
      const _: never = category;
      return _;
    }
  }
}
