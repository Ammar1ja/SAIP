/**
 * Statistics API client. Fetches raw data from the external statistics server.
 * Endpoints are expected to return JSON arrays matching the SQL query outputs.
 */

import { type PatentsStatRow, type TrademarksStatRow, type CopyrightsStatRow } from './types';
import { getStatisticsApiBaseUrl } from './config';

const DEFAULT_TIMEOUT_MS = 15000;

async function fetchJson<T>(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Statistics API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error) throw e;
    throw new Error('Statistics API request failed');
  }
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const base = getStatisticsApiBaseUrl();
  if (!base) {
    throw new Error('NEXT_PUBLIC_STATISTICS_API_URL is not set');
  }
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

/** Patents (and domain-filtered: industrial designs, plants, integrated circuits) – filing */
export async function fetchPatentsFiling(domain?: string): Promise<PatentsStatRow[]> {
  const path = '/patents/filing';
  const url = buildUrl(path, domain ? { domain } : undefined);
  const data = await fetchJson<PatentsStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}

/** Patents – registered */
export async function fetchPatentsRegistered(domain?: string): Promise<PatentsStatRow[]> {
  const path = '/patents/registered';
  const url = buildUrl(path, domain ? { domain } : undefined);
  const data = await fetchJson<PatentsStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}

/** Trademarks – filing */
export async function fetchTrademarksFiling(): Promise<TrademarksStatRow[]> {
  const url = buildUrl('/trademarks/filing');
  const data = await fetchJson<TrademarksStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}

/** Trademarks – registered */
export async function fetchTrademarksRegistered(): Promise<TrademarksStatRow[]> {
  const url = buildUrl('/trademarks/registered');
  const data = await fetchJson<TrademarksStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}

/** Copyrights – filing */
export async function fetchCopyrightsFiling(): Promise<CopyrightsStatRow[]> {
  const url = buildUrl('/copyrights/filing');
  const data = await fetchJson<CopyrightsStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}

/** Copyrights – registered */
export async function fetchCopyrightsRegistered(): Promise<CopyrightsStatRow[]> {
  const url = buildUrl('/copyrights/registered');
  const data = await fetchJson<CopyrightsStatRow[]>(url);
  return Array.isArray(data) ? data : [];
}
