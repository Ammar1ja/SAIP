'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';

interface LanguageSwitcherProps {
  locale?: string;
  locales?: Record<string, string>;
}

export const LanguageSwitcher = ({
  locale = 'en',
  locales = {
    en: 'English',
    ar: 'العربية',
  },
}: LanguageSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  const searchParams = useSearchParams();

  const handleToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      setDirection(window.document.dir as 'ltr' | 'rtl');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getHrefWithParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('heroVideoIndex');
    params.delete('featuredNewsIndex');
    const paramsString = params.toString();
    return paramsString ? `${pathname}?${paramsString}` : pathname;
  };

  const getTargetLocale = () => {
    const availableLocales = Object.keys(locales);
    return availableLocales.find((code) => code !== locale) || availableLocales[0];
  };

  const targetLocale = getTargetLocale();

  const handleLocaleChange = (code: string) => {
    if (code === locale) {
      setOpen(false);
      return;
    }

    router.replace(getHrefWithParams(), { locale: code });
    // With localePrefix='never' the URL often stays identical.
    // Force refresh so server components re-render in the new locale.
    router.refresh();
    setOpen(false);
  };

  return (
    <>
      <div ref={ref} className="relative hidden h-full min-w-0 max-w-full lg:block">
        <div
          className={clsx(
            'relative flex h-full min-w-0 max-w-full items-center justify-center rounded-md px-2 text-base font-medium leading-6 transition-colors xl:px-4',
            open && 'bg-[#F1F3F5]',
          )}
        >
          <button
            onClick={handleToggle}
            type="button"
            className="relative z-10 flex h-full min-w-0 max-w-full cursor-pointer items-center gap-1.5 py-0 text-base font-medium leading-6 text-text-default focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 xl:gap-2"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={open ? 'language-menu-desktop' : undefined}
          >
            <Image src="/icons/language.svg" alt="" width={22} height={22} className="shrink-0" />
            <span className="min-w-0 truncate">{locales[targetLocale]}</span>
          </button>

          {open && (
            <span
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[6px] bg-neutral-800 rounded-full z-0"
              aria-hidden="true"
            />
          )}
        </div>

        {open && (
          <div
            id="language-menu-desktop"
            role="menu"
            className={clsx(
              'absolute z-50 mt-2 w-52 rounded-md bg-white p-4 shadow-2xl ring-1 ring-gray-200 border border-green-100',
              'ltr:right-0 rtl:left-0',
            )}
          >
            <h3 className="mb-2 px-2 text-sm font-bold text-green-700">Select language</h3>
            <ul className="space-y-1 overflow-auto max-h-60">
              {Object.entries(locales).map(([code, label]) => (
                <li key={code}>
                  <button
                    type="button"
                    role="menuitem"
                    className={clsx(
                      'block w-full text-left rounded-md px-3 py-2 text-sm text-gray-800',
                      'hover:bg-green-50 hover:text-green-700',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
                      code === locale && 'bg-green-50 text-green-800 font-semibold',
                    )}
                    onClick={() => handleLocaleChange(code)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile / tablet (also used inside drawer) */}
      <div className="min-w-0 max-w-full lg:hidden">
        <button
          type="button"
          className="flex min-w-0 max-w-full items-center gap-2 py-2 text-left text-base font-medium leading-6 text-text-default focus:outline-none"
          onClick={handleToggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={open ? 'language-menu-mobile' : undefined}
        >
          <Image src="/icons/language.svg" alt="" width={22} height={22} className="shrink-0" />
          <span className="min-w-0 truncate">{locales[targetLocale]}</span>
        </button>

        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={() => setOpen(false)}
            id="language-menu-mobile"
          >
            <div
              className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-gray-800 size-9 absolute top-5 ltr:right-5 rtl:left-5 font-semibold"
                aria-label="Close language selector"
              >
                ✕
              </button>
              <div className="flex items-center justify-center text-center font-semibold text-green-700 text-lg h-9 mb-4">
                Select language
              </div>

              <ul className="space-y-2 overflow-auto max-h-60">
                {Object.entries(locales).map(([code, label]) => (
                  <li key={code}>
                    <button
                      type="button"
                      className={clsx(
                        'block w-full text-center rounded-md px-3 py-2 text-base font-medium',
                        'hover:bg-green-50 hover:text-green-700',
                        code === locale && 'bg-green-50 text-green-800 font-semibold',
                      )}
                      onClick={() => handleLocaleChange(code)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
