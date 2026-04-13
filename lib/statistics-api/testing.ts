export function shouldUseExternalStatisticsApi(pageKey: string): boolean {
  if (process.env.NEXT_PUBLIC_USE_EXTERNAL_STATISTICS_API !== 'true') {
    return false;
  }

  const raw = process.env.NEXT_PUBLIC_EXTERNAL_STATISTICS_CATEGORIES;
  if (!raw || raw.trim() === '') {
    return true;
  }

  const allowed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return allowed.includes(pageKey);
}
