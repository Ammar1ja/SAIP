import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '../i18n';

export default getRequestConfig(async ({ locale = defaultLocale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
  locale,
}));
