import { NextRequest, NextResponse } from 'next/server';
import { getServerDrupalBaseUrl } from '@/lib/drupal/config';

const shouldLog = process.env.NODE_ENV !== 'production';
const debugLog = (...args: unknown[]) => {
  if (shouldLog) {
    console.log(...args);
  }
};

/**
 * Backward-compatible feedback endpoint.
 * Supports requests like: /api/feedback/contact-us/contact-and-support
 * and forwards them to Drupal statistics API.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pagePath: string[] }> },
) {
  try {
    const { pagePath = [] } = await context.params;
    const pathFromSegments = `/${pagePath.join('/')}`.replace(/\/{2,}/g, '/');
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'page';

    const allowedTypes = ['page', 'faq_question'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be: page or faq_question' },
        { status: 400 },
      );
    }

    const backendUrl = getServerDrupalBaseUrl();
    const endpoint =
      `${backendUrl}/api/feedback/statistics?page_url=${encodeURIComponent(pathFromSegments)}` +
      `&type=${type}`;

    debugLog('📡 [FEEDBACK-PROXY-COMPAT] Fetching from backend:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          yes_percentage: 0,
          total_feedbacks: 0,
          yes_count: 0,
          no_count: 0,
        },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, must-revalidate' },
        },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('❌ [FEEDBACK-PROXY-COMPAT] Error:', error);
    return NextResponse.json(
      {
        yes_percentage: 0,
        total_feedbacks: 0,
        yes_count: 0,
        no_count: 0,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, must-revalidate' },
      },
    );
  }
}
