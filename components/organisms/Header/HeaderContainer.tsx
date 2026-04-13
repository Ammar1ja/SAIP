/**
 * Server Component wrapper for Header
 * Fetches navigation data from Drupal and passes to client Header
 */

import { getNavigationData } from '@/lib/drupal/services/header.service';
import Header from './Header';

interface HeaderContainerProps {
  locale?: string;
}

export default async function HeaderContainer({ locale }: HeaderContainerProps) {
  const navigationData = await getNavigationData(locale);

  return <Header locale={locale} navigationData={navigationData} />;
}
