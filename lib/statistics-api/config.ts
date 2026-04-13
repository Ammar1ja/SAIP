/**
 * Statistics API base URL. When not set, fetch functions will throw or return empty
 * so callers can fall back to Drupal/fallback data.
 */
export function getStatisticsApiBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_STATISTICS_API_URL;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url.replace(/\/$/, '');
}

export function isStatisticsApiConfigured(): boolean {
  return getStatisticsApiBaseUrl() !== null;
}
