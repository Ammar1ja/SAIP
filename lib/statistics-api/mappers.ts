/**
 * Maps raw statistics API rows to StatisticsCardType[] for use in StatisticsSection.
 */

import type { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';
import type { PatentsStatRow, TrademarksStatRow, CopyrightsStatRow } from './types';

const BREAKDOWN_COLORS = ['#1B8354', '#14573A', '#388A5A', '#1C6846'];

function groupByYear<T extends { year: number; count_of_applications: number }>(
  rows: T[],
): Array<{ year: number; total: number }> {
  const byYear = new Map<number, number>();
  for (const r of rows) {
    const y = Number(r.year);
    if (!Number.isNaN(y)) {
      byYear.set(y, (byYear.get(y) ?? 0) + Number(r.count_of_applications ?? 0));
    }
  }
  return Array.from(byYear.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);
}

function buildLineChartCard(
  label: string,
  rows: Array<{ year: number; total: number }>,
): StatisticsCardType {
  const chartData = rows.map((r) => ({ date: String(r.year), value: r.total }));
  const last = rows[rows.length - 1];
  const value = last ? last.total : 0;
  return {
    label,
    value,
    chartType: 'line',
    chartData,
  };
}

function buildPieBreakdown(
  items: Array<{ label: string; count: number }>,
): Array<{ label: string; value: number; displayValue: string; color: string }> {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (total === 0) return [];
  return items.map((item, i) => {
    const pct = (item.count / total) * 100;
    const displayValue = `${pct.toFixed(2).replace('.', ',')}%`;
    return {
      label: item.label,
      value: pct,
      displayValue,
      color: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length],
    };
  });
}

export interface MapPatentsOptions {
  filingLabel?: string;
  registeredLabel?: string;
  applicantTypeLabel?: string;
}

/** Map patents (or domain-filtered) filing + registered rows to 3 cards: filing line, registered line, applicant type pie */
export function mapPatentsToCards(
  filingRows: PatentsStatRow[],
  registeredRows: PatentsStatRow[],
  options: MapPatentsOptions = {},
): StatisticsCardType[] {
  const {
    filingLabel = 'Number of applications by year (filing)',
    registeredLabel = 'Number of registered by year',
    applicantTypeLabel = "Applicant's type",
  } = options;

  const filingByYear = groupByYear(filingRows);
  const registeredByYear = groupByYear(registeredRows);

  const byCategory = new Map<string, number>();
  for (const r of filingRows) {
    const cat = r.applicant_category?.trim() || 'Other';
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(r.count_of_applications ?? 0));
  }
  const breakdownItems = Array.from(byCategory.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  const cards: StatisticsCardType[] = [
    buildLineChartCard(filingLabel, filingByYear),
    buildLineChartCard(registeredLabel, registeredByYear),
    {
      label: applicantTypeLabel,
      chartType: 'pie',
      breakdown: buildPieBreakdown(breakdownItems),
    },
  ];
  return cards;
}

export interface MapTrademarksOptions {
  filingLabel?: string;
  registeredLabel?: string;
  ownerTypeLabel?: string;
}

export function mapTrademarksToCards(
  filingRows: TrademarksStatRow[],
  registeredRows: TrademarksStatRow[],
  options: MapTrademarksOptions = {},
): StatisticsCardType[] {
  const {
    filingLabel = 'Number of trademark applications by year',
    registeredLabel = 'Number of registered trademarks by year',
    ownerTypeLabel = 'Owner type',
  } = options;

  const filingByYear = groupByYear(filingRows);
  const registeredByYear = groupByYear(registeredRows);

  const byOwner = new Map<string, number>();
  for (const r of filingRows) {
    const cat = r.owner_type?.trim() || 'Other';
    byOwner.set(cat, (byOwner.get(cat) ?? 0) + Number(r.count_of_applications ?? 0));
  }
  const breakdownItems = Array.from(byOwner.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  return [
    buildLineChartCard(filingLabel, filingByYear),
    buildLineChartCard(registeredLabel, registeredByYear),
    {
      label: ownerTypeLabel,
      chartType: 'pie',
      breakdown: buildPieBreakdown(breakdownItems),
    },
  ];
}

export interface MapCopyrightsOptions {
  filingLabel?: string;
  registeredLabel?: string;
  claimantTypeLabel?: string;
}

export function mapCopyrightsToCards(
  filingRows: CopyrightsStatRow[],
  registeredRows: CopyrightsStatRow[],
  options: MapCopyrightsOptions = {},
): StatisticsCardType[] {
  const {
    filingLabel = 'Number of copyright applications by year',
    registeredLabel = 'Number of registered copyrights by year',
    claimantTypeLabel = "Claimant's type",
  } = options;

  const filingByYear = groupByYear(filingRows);
  const registeredByYear = groupByYear(registeredRows);

  const byCategory = new Map<string, number>();
  for (const r of filingRows) {
    const cat = r.applicant_category?.trim() || 'Other';
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(r.count_of_applications ?? 0));
  }
  const breakdownItems = Array.from(byCategory.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  return [
    buildLineChartCard(filingLabel, filingByYear),
    buildLineChartCard(registeredLabel, registeredByYear),
    {
      label: claimantTypeLabel,
      chartType: 'pie',
      breakdown: buildPieBreakdown(breakdownItems),
    },
  ];
}
