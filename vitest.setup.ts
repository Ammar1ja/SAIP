import '@testing-library/jest-dom';
import React, { type ReactNode } from 'react';
import { beforeAll, vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      search: 'Search',
      arabicAlphabet: 'Arabic alphabet',
      filterByLetter: 'Filter by letter',
      clearFilters: 'Clear filters',
      all: 'ALL',
      noServicesAvailable: 'No services available',
      noItemsFound: 'No items found matching your filters.',
      hide: 'Hide',
      showMore: 'Show more',
      title: 'Accessibility tools',
      highContrast: 'Toggle high contrast mode',
      fontSize: 'Toggle font size',
      contrastEnabled: 'High contrast enabled',
      contrastDisabled: 'High contrast disabled',
      fontSizeLarge: 'Large font size',
      fontSizeNormal: 'Normal font size',
    };
    return translations[key] || key;
  },
  useLocale: () => (typeof document !== 'undefined' && document.documentElement.lang) || 'en',
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: ({
      children,
      ...props
    }: {
      children: ReactNode;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.createElement('a', props, children),
    redirect: vi.fn(),
    usePathname: () => '/',
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
    getPathname: () => '/',
  }),
}));

beforeAll(() => {
  // Setup before all tests
});
