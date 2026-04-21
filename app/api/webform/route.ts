import { NextRequest, NextResponse } from 'next/server';
import { getServerDrupalBaseUrl, getApiUrl } from '@/lib/drupal/config';

/**
 * POST /api/webform — Proxy for Drupal webform submissions with file uploads.
 *
 * Next.js Server Actions cannot serialize File objects, so this API route
 * receives the FormData from the browser, re-constructs a clean FormData,
 * and forwards it to Drupal's custom endpoint (/api/saip/webform-submit).
 */
export async function POST(request: NextRequest) {
  try {
    // Prefer the public Drupal URL (same one used by JSON:API fetches, which
    // are known to be reachable from the pod). getServerDrupalBaseUrl may
    // return an in-cluster service name that isn't resolvable from this pod.
    const internalOverride = process.env.DRUPAL_INTERNAL_URL?.trim();
    const backendUrl = internalOverride
      ? getServerDrupalBaseUrl()
      : getApiUrl().replace(/\/jsonapi\/?$/, '');
    // Use /en/ prefix to avoid Drupal's language negotiation redirect.
    const endpoint = `${backendUrl}/en/api/saip/webform-submit`;

    const contentType = request.headers.get('content-type') || '';

    let backendResponse: Response;

    if (contentType.includes('multipart/form-data')) {
      // Parse the incoming FormData and rebuild it for Drupal.
      // This ensures clean boundary and proper file forwarding.
      const incomingFormData = await request.formData();
      const outgoingFormData = new FormData();

      for (const [key, value] of incomingFormData.entries()) {
        outgoingFormData.append(key, value);
      }

      backendResponse = await fetch(endpoint, {
        method: 'POST',
        body: outgoingFormData,
        // Don't set Content-Type — fetch auto-generates it with proper boundary.
      });
    } else {
      // Forward JSON as-is
      const body = await request.text();

      backendResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body,
      });
    }

    // Parse and relay response
    const responseContentType = backendResponse.headers.get('content-type') || '';

    if (!responseContentType.includes('application/json')) {
      const text = await backendResponse.text();
      console.error('[WEBFORM-PROXY] Non-JSON response from Drupal:', {
        status: backendResponse.status,
        endpoint,
        body: text.substring(0, 500),
      });
      return NextResponse.json(
        { data: { error: { message: `Server error (${backendResponse.status})` } } },
        { status: backendResponse.status >= 400 ? backendResponse.status : 500 },
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result, { status: backendResponse.status });
  } catch (error) {
    console.error('[WEBFORM-PROXY] Error:', error);
    return NextResponse.json(
      { data: { error: { message: 'Internal server error' } } },
      { status: 500 },
    );
  }
}
