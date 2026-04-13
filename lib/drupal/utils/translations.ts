/**
 * Translation helper functions for Drupal services
 * Provides hardcoded translations when Drupal data is not available
 */

/**
 * Get "Information library" translation based on locale
 */
export function getInformationLibraryTitle(locale?: string): string {
  return locale === 'ar' ? 'مكتبة المعلومات' : 'Information library';
}
