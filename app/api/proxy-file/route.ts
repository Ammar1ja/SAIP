import { NextRequest, NextResponse } from 'next/server';
import { getServerDrupalBaseUrl, getApiUrl } from '@/lib/drupal/config';

/**
 * Proxy for downloading files from Drupal backend
 * Needed to avoid CORS and mixed content (HTTPS frontend → HTTP backend) issues
 *
 * SECURITY: Only proxies files from whitelisted SAIP backend domains
 * Uses path-based approach to prevent open proxy vulnerabilities
 */

const shouldLog = process.env.NODE_ENV !== 'production';
const debugLog = (...args: unknown[]) => {
  if (shouldLog) {
    console.log(...args);
  }
};

// Whitelist of allowed backend domains for SAIP infrastructure
const ALLOWED_BACKEND_HOSTS = [
  'gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa',
  'gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa',
  'gp-saip-portals-website-backend-v3.staging.internal.saip.gov.sa',
  'gp-saip-portals-website-backend-v3.production.internal.saip.gov.sa',
  'website-backend-v3.saip-portals.svc.cluster.local',
  'localhost', // For local development
];

const getAllowedBackendHosts = (): string[] => {
  const hosts = new Set(ALLOWED_BACKEND_HOSTS);
  const internalUrl = process.env.DRUPAL_INTERNAL_URL?.trim();

  if (internalUrl) {
    try {
      hosts.add(new URL(internalUrl).hostname);
    } catch {
      // Ignore invalid internal URL format and keep static allowlist only.
    }
  }

  return Array.from(hosts);
};

// Whitelist of allowed file paths (must start with one of these)
const ALLOWED_PATH_PREFIXES = ['/sites/default/files/'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');
    const action = searchParams.get('action') || 'view'; // default to 'view'
    const rangeHeader = request.headers.get('range');

    debugLog('🔽 [PROXY-FILE] Request received:', { filePath, action, rangeHeader });

    // Validate path parameter exists
    if (!filePath) {
      debugLog('❌ [PROXY-FILE] Missing path parameter');
      return NextResponse.json(
        { error: 'Missing path parameter. Use ?path=/sites/default/files/...' },
        { status: 400 },
      );
    }

    // SECURITY: Validate path starts with allowed prefix
    const isAllowedPath = ALLOWED_PATH_PREFIXES.some((prefix) => filePath.startsWith(prefix));
    if (!isAllowedPath) {
      debugLog('❌ [PROXY-FILE] Invalid path prefix:', filePath);
      return NextResponse.json(
        { error: 'Invalid file path. Only /sites/default/files/ is allowed.' },
        { status: 403 },
      );
    }

    // SECURITY: Prevent path traversal attacks
    if (filePath.includes('..') || filePath.includes('//')) {
      debugLog('❌ [PROXY-FILE] Path traversal attempt detected:', filePath);
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    // Construct absolute URL using trusted backend URL.
    // Prefer the public URL (same as JSON:API fetches) unless DRUPAL_INTERNAL_URL
    // is explicitly set — the in-cluster service fallback may not be reachable
    // from this pod.
    const internalOverride = process.env.DRUPAL_INTERNAL_URL?.trim();
    const backendBaseUrl = internalOverride
      ? getServerDrupalBaseUrl()
      : getApiUrl().replace(/\/jsonapi\/?$/, '');
    const absoluteUrl = `${backendBaseUrl}${filePath}`;

    // SECURITY: Validate the constructed URL is from allowed host
    const urlObj = new URL(absoluteUrl);
    const allowedHosts = getAllowedBackendHosts();
    if (!allowedHosts.includes(urlObj.hostname)) {
      debugLog('❌ [PROXY-FILE] Unauthorized host:', urlObj.hostname);
      return NextResponse.json({ error: 'Unauthorized backend host' }, { status: 403 });
    }

    debugLog('📡 [PROXY-FILE] Fetching from backend:', absoluteUrl);
    debugLog('📡 [PROXY-FILE] URL protocol:', urlObj.protocol);
    debugLog('✅ [PROXY-FILE] Host validated:', urlObj.hostname);

    // Fetch file from Drupal backend (server-side, bypasses browser CORS/mixed content)
    // Use longer timeout for large files (120 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const upstreamHeaders = new Headers();
    if (rangeHeader) {
      // Preserve byte-range requests for media playback on mobile browsers.
      upstreamHeaders.set('Range', rangeHeader);
    }

    const response = await fetch(absoluteUrl, {
      signal: controller.signal,
      headers: upstreamHeaders,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('Content-Type') || 'unknown';
    const contentLength = response.headers.get('Content-Length') || 'unknown';

    debugLog('📥 [PROXY-FILE] Backend response:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      contentLength,
      allHeaders: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      debugLog('❌ [PROXY-FILE] Backend returned error:');
      debugLog('❌ [PROXY-FILE] Status:', response.status);
      debugLog('❌ [PROXY-FILE] First 200 chars:', errorText.slice(0, 200));
      return NextResponse.json(
        {
          error: 'Failed to fetch file from backend',
          status: response.status,
          details: errorText.slice(0, 200),
        },
        { status: response.status },
      );
    }

    // ⚠️ KILLER DEBUG: Check if upstream returns HTML instead of PDF
    if (contentType.includes('text/html')) {
      const htmlPreview = await response.text();
      debugLog('⚠️ [PROXY-FILE] WARNING: Upstream returned HTML instead of file!');
      debugLog('⚠️ [PROXY-FILE] HTML preview:', htmlPreview.slice(0, 300));
      return NextResponse.json(
        {
          error: 'Backend returned HTML instead of file (VPN/Auth/Redirect issue)',
          htmlPreview: htmlPreview.slice(0, 300),
        },
        { status: 502 },
      );
    }

    // Extract filename from URL
    const urlParts = absoluteUrl.split('/');
    const filename = decodeURIComponent(urlParts[urlParts.length - 1].split('?')[0]);
    const filenameLower = filename.toLowerCase();

    // Normalize content-type for common image formats (Android is stricter with SVG)
    let resolvedContentType = response.headers.get('Content-Type') || 'application/octet-stream';
    if (filenameLower.endsWith('.svg')) {
      resolvedContentType = 'image/svg+xml';
    } else if (filenameLower.endsWith('.png')) {
      resolvedContentType = 'image/png';
    } else if (filenameLower.endsWith('.jpg') || filenameLower.endsWith('.jpeg')) {
      resolvedContentType = 'image/jpeg';
    } else if (filenameLower.endsWith('.webp')) {
      resolvedContentType = 'image/webp';
    } else if (filenameLower.endsWith('.mp4')) {
      resolvedContentType = 'video/mp4';
    } else if (filenameLower.endsWith('.webm')) {
      resolvedContentType = 'video/webm';
    } else if (filenameLower.endsWith('.ogg')) {
      resolvedContentType = 'video/ogg';
    } else if (filenameLower.endsWith('.mov')) {
      resolvedContentType = 'video/quicktime';
    }

    debugLog(`✅ [PROXY-FILE] Streaming file (${action}):`, filename, `(${contentLength} bytes)`);

    // ✅ Use Response constructor for better streaming compatibility
    // NextResponse has issues with ReadableStream in some environments
    if (!response.body) {
      console.error('❌ [PROXY-FILE] Response body is null!');
      return NextResponse.json({ error: 'File stream not available' }, { status: 500 });
    }

    // Set Content-Disposition based on action
    // - 'inline' for view (opens in browser)
    // - 'attachment' for download (forces download)
    const contentDisposition =
      action === 'download'
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`;

    const headers = new Headers({
      'Content-Type': resolvedContentType,
      'Content-Disposition': contentDisposition,
      'Cache-Control':
        action === 'view' ? 'public, max-age=3600, stale-while-revalidate=86400' : 'no-cache',
      Vary: 'Range',
    });

    // Only set Content-Length if it exists (some streams don't have it)
    const contentLengthHeader = response.headers.get('Content-Length');
    if (contentLengthHeader) {
      headers.set('Content-Length', contentLengthHeader);
    }

    // Preserve range/byte serving headers required by iOS/Android media players.
    const passthroughHeaders = [
      'Accept-Ranges',
      'Content-Range',
      'ETag',
      'Last-Modified',
      'Expires',
    ];
    passthroughHeaders.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        headers.set(headerName, headerValue);
      }
    });

    // Use standard Response for better stream handling
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('❌ [PROXY-FILE] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
