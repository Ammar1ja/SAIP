/**
 * Locale Helper for Drupal API
 * Centralized locale handling for all Drupal API calls
 */

/**
 * Add locale prefix to Drupal JSON:API URL
 *
 * @param locale - Current locale (e.g., 'en', 'ar')
 * @returns Locale prefix for URL (e.g., '', '/ar')
 *
 * @example
 * getLocalePrefix('en') // → ''
 * getLocalePrefix('ar') // → '/ar'
 */
export function getLocalePrefix(locale?: string): string {
  // English is default, no prefix needed
  if (!locale || locale === 'en') {
    return '';
  }

  // Arabic and other languages need prefix
  return `/${locale}`;
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
