import { NextRequest, NextResponse } from 'next/server';
import { getServerDrupalBaseUrl } from '@/lib/drupal/config';

const shouldLog = process.env.NODE_ENV !== 'production';
const debugLog = (...args: unknown[]) => {
  if (shouldLog) {
    console.log(...args);
  }
};

const MAX_SEARCH_KEY_LENGTH = 500;
const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 200;

/**
 * Proxy for Drupal global search API (Views REST export at /api/search).
 * Avoids CORS and mixed content; uses server-side Drupal URL.
 *
 * Query params: searchKey (required, 2+ chars), page, items_per_page, lang (en|ar).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let searchKey = searchParams.get('searchKey')?.trim() ?? '';
    const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10) || 0);
    let pageSize = parseInt(searchParams.get('items_per_page') ?? String(DEFAULT_PAGE_SIZE), 10);
    const lang = searchParams.get('lang') ?? '';

    if (searchKey.length < 2) {
      return NextResponse.json(
        { data: { items: [], totalCount: 0 } },
        { status: 200, headers: { 'Cache-Control': 'no-store, must-revalidate' } },
      );
    }

    if (searchKey.length > MAX_SEARCH_KEY_LENGTH) {
      searchKey = searchKey.slice(0, MAX_SEARCH_KEY_LENGTH);
    }
    pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, pageSize));

    const params = new URLSearchParams();
    params.set('searchKey', searchKey);
    params.set('page', String(page));
    params.set('items_per_page', String(pageSize));
    if (lang && (lang === 'en' || lang === 'ar')) {
      params.set('lang', lang);
    }

    const backendUrl = getServerDrupalBaseUrl();
    const endpoint = `${backendUrl}/api/search?${params.toString()}`;

    debugLog('📡 [SEARCH-PROXY] Fetching from backend:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      debugLog('⚠️ [SEARCH-PROXY] Backend error:', response.status);
      return NextResponse.json(
        { data: { items: [], totalCount: 0 } },
        { status: 200, headers: { 'Cache-Control': 'no-store, must-revalidate' } },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    });
  } catch (error) {
    console.error('❌ [SEARCH-PROXY] Error:', error);
    return NextResponse.json(
      { data: { items: [], totalCount: 0 } },
      { status: 200, headers: { 'Cache-Control': 'no-store, must-revalidate' } },
    );
  }
}
