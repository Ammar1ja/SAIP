/**
 * Locale Helper for Drupal API
 * Centralized locale handling for all Drupal API calls
 */

/**
 * Add locale prefix to Drupal JSON:API URL.
 *
 * Drupal's multi-language configuration on this project requires the language
 * prefix in the URL path for JSON:API to resolve. Without it Drupal falls
 * back to normal page routing and returns 404 HTML (observed on dev env,
 * producing errors like "Drupal API error: 404 Not Found - <!DOCTYPE html>").
 * Always prepend the language prefix, defaulting to /en when no locale is
 * supplied.
 *
 * @param locale - Current locale (e.g., 'en', 'ar')
 * @returns Locale prefix for URL (e.g., '/en', '/ar')
 *
 * @example
 * getLocalePrefix('en') // → '/en'
 * getLocalePrefix('ar') // → '/ar'
 */
export function getLocalePrefix(locale?: string): string {
  const normalized = (locale || 'en').toLowerCase();
  return `/${normalized}`;
}

/**
 * Build full Drupal API URL with locale support
 *
 * @param baseUrl - Drupal base URL
 * @param jsonApiPath - JSON:API path (usually '/jsonapi')
 * @param endpoint - API endpoint (e.g., '/node/homepage')
 * @param locale - Current locale
 * @returns Complete URL with locale
 *
 * @example
 * buildDrupalUrl('http://api.com', '/jsonapi', '/node/homepage', 'ar')
 * // → 'http://api.com/ar/jsonapi/node/homepage'
 */
export function buildDrupalUrl(
  baseUrl: string,
  jsonApiPath: string,
  endpoint: string,
  locale?: string,
): string {
  const localePrefix = getLocalePrefix(locale);
  return `${baseUrl}${localePrefix}${jsonApiPath}${endpoint}`;
}

/**
 * Log locale-aware API call for debugging
 */
export function logApiCall(endpoint: string, locale?: string, serviceName?: string): void {
  const localeLabel = locale || 'en';
  const service = serviceName ? `[${serviceName}]` : '';
  console.log(`🌍 ${service} Fetching from Drupal (locale: ${localeLabel}): ${endpoint}`);
}
