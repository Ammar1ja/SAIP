import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

export const IntlDecorator = (Story: () => ReactNode) => {
  return (
    <NextIntlClientProvider locale="en" messages={{}}>
      <Story />
    </NextIntlClientProvider>
  );
};
