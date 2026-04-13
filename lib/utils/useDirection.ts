import { getLocale } from 'next-intl/server';

const getDirection = async () => {
  const locale = await getLocale();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];

  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
};

export default getDirection;
