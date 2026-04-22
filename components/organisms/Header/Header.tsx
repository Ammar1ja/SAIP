'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import {
  saipLinks as fallbackSaipLinks,
  servicesLinks as fallbackServicesLinks,
  resourcesLinks as fallbackResourcesLinks,
  mediaCenterLinks as fallbackMediaCenterLinks,
  contactLinks as fallbackContactLinks,
} from './Header.data';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { NavigationData, MenuItem } from '@/lib/drupal/services/header.service';
import { useTranslations } from 'next-intl';
import { useVerificationBar } from '@/context/VerificationBarContext';
import { Search as SearchIcon, Mic, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { searchContent, SearchResult } from '@/lib/drupal/services/search.service';

const MobileNavHeader = dynamic(() => import('@/components/molecules/MobileNavHeader'), {
  ssr: false,
  loading: () => null,
});

const DropdownMenu = dynamic(() => import('@/components/molecules/DropdownMenu'), {
  ssr: false,
  loading: () => null,
});

const LanguageSwitcher = dynamic(() => import('@/components/molecules/LanguageSwitcher'), {
  ssr: false,
  loading: () => null,
});

interface HeaderProps {
  locale: string | undefined;
  navigationData?: NavigationData;
}

export default function Header({ locale, navigationData }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation.groups');
  const tMain = useTranslations('navigation.main');
  const tSearch = useTranslations('common.globalSearch');
  const { accordionHeight } = useVerificationBar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        setIsScrolled(scrollY > 10);
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelWrapperRef.current &&
        !panelWrapperRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const response = await searchContent(searchQuery, locale, { page: 1, pageSize: 6 });
        setSuggestions(response.results.slice(0, 2));
      } catch (error) {
        console.error('Search suggestions failed:', error);
        setSuggestions([]);
      } finally {
        setIsSuggesting(false);
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [isSearchOpen, searchQuery, locale]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setIsSearchOpen(false);
      const params = new URLSearchParams();
      params.set('q', trimmed);
      router.push(`/search?${params.toString()}`);
    },
    [router],
  );

  // Helper function to translate group names
  const translateGroup = (group?: string) => {
    if (!group) return undefined;
    // If group is already a key (e.g., "ipProtection"), translate it
    // If it's full text (fallback), return as-is
    return group.includes(' ') ? group : t(group);
  };

  // Use Drupal data if available, fallback to static data
  const saipLinks = navigationData?.saipLinks.length
    ? navigationData.saipLinks.map((item: MenuItem) => ({
        href: item.href,
        label: item.title,
        group: translateGroup(item.group),
      }))
    : fallbackSaipLinks;
  const servicesLinks = navigationData?.servicesLinks.length
    ? navigationData.servicesLinks.map((item: MenuItem) => ({
        href: item.href,
        label: item.title,
        group: translateGroup(item.group),
        icon: undefined,
      }))
    : fallbackServicesLinks;
  const resourcesLinks = navigationData?.resourcesLinks.length
    ? navigationData.resourcesLinks.map((item: MenuItem) => ({
        href: item.href,
        label: item.title,
        group: translateGroup(item.group),
        icon: undefined,
      }))
    : fallbackResourcesLinks;
  const mediaCenterLinks = navigationData?.mediaCenterLinks.length
    ? navigationData.mediaCenterLinks.map((item: MenuItem) => ({
        href: item.href,
        label: item.title,
        group: translateGroup(item.group),
      }))
    : fallbackMediaCenterLinks;
  const contactLinks = navigationData?.contactLinks.length
    ? navigationData.contactLinks.map((item: MenuItem) => ({
        href: item.href,
        label: item.title,
        group: translateGroup(item.group),
      }))
    : fallbackContactLinks;

  const allLinks = [
    ...saipLinks,
    ...servicesLinks,
    ...resourcesLinks,
    ...mediaCenterLinks,
    ...contactLinks,
  ];

  const tHome = useTranslations('home');
  const mobileNavTitle =
    allLinks.find((link) => link.href === pathname)?.label || tHome('heroTitle');

  const isHomePage = pathname === '/';

  const desktopTop = `${32 + accordionHeight}px`;

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 w-full min-w-0 overflow-x-clip bg-white transition-all duration-300 ease-in-out md:top-[var(--header-desktop-top)]',
        isScrolled ? 'shadow-md' : 'shadow-sm',
      )}
      style={
        {
          '--header-desktop-top': desktopTop,
        } as React.CSSProperties & { '--header-desktop-top': string }
      }
    >
      <MobileNavHeader
        title={mobileNavTitle}
        onBackClick={() => window.history.back()}
        locale={locale}
        showBackButton={!isHomePage}
      />

      <nav
        className="hidden lg:flex mx-auto h-[72px] max-w-screen-2xl items-stretch justify-between gap-3 overflow-x-visible px-4 md:px-6 xl:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-0.5 xl:gap-2">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex shrink-0 items-center self-stretch py-0"
          >
            <Image
              src="/images/saip-logo-color.svg"
              alt="SAIP Logo"
              width={150}
              height={120}
              className="mr-2 h-10 w-auto max-h-10 xl:mr-4"
              priority
            />
          </Link>

          <Link
            href="/"
            className={clsx(
              'relative inline-flex shrink-0 items-center self-stretch rounded-md px-3 text-base font-medium leading-6 transition-colors xl:px-6',
              pathname === `/`
                ? 'bg-green-700 text-white'
                : 'text-text-default hover:bg-green-50 hover:text-green-700',
            )}
          >
            {tMain('home')}
            {pathname === '/' && (
              <span
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[6px] bg-primary-400 rounded-full z-0"
                aria-hidden="true"
              />
            )}
          </Link>

          <DropdownMenu label={tMain('saip')} items={saipLinks} rootPath="/saip" />
          <DropdownMenu label={tMain('services')} items={servicesLinks} rootPath="/services" />
          <DropdownMenu label={tMain('resources')} items={resourcesLinks} rootPath="/resources" />
          <DropdownMenu
            label={tMain('mediaCenter')}
            items={mediaCenterLinks}
            rootPath="/media-center"
          />
          <DropdownMenu label={tMain('contactUs')} items={contactLinks} rootPath="/contact-us" />
        </div>

        <div className="flex min-h-0 shrink-0 items-stretch gap-2 xl:gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            ref={searchButtonRef}
            className={clsx(
              'relative inline-flex items-center gap-2 self-stretch rounded-md px-2 py-0 text-base font-medium leading-6 transition-colors focus-visible:ring-2 focus-visible:ring-green-500 xl:px-4',
              isSearchOpen
                ? 'bg-green-700 text-white'
                : 'text-text-default hover:bg-green-50 hover:text-green-700',
            )}
            aria-label={tMain('search')}
            aria-expanded={isSearchOpen}
            aria-controls="global-search-panel"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={22}
              height={22}
              className={clsx('shrink-0', isSearchOpen && 'invert')}
            />
            <span className="hidden xl:inline">{tMain('search')}</span>
            {isSearchOpen && (
              <span
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[6px] bg-primary-400 rounded-full z-0"
                aria-hidden="true"
              />
            )}
          </button>
          <LanguageSwitcher locale={locale} />
        </div>
      </nav>

      {isSearchOpen && (
        <div
          ref={panelWrapperRef}
          className="absolute left-0 right-0 top-full z-40"
          role="presentation"
        >
          <div className="container mx-auto px-4 md:px-8 pt-6">
            <div
              id="global-search-panel"
              ref={panelRef}
              role="region"
              aria-label={tSearch('modalLabel')}
              className="w-full rounded-[24px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.12)] px-10 py-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSearchSubmit(searchQuery);
                    }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div
                        className="h-10 border border-[#9DA4AE] rounded-sm bg-white flex items-center px-2 gap-2 
hover:border-[#676c72] 
focus-within:border-[#9DA4AE] focus-within:border-b-black"
                      >
                        <SearchIcon className="w-5 h-5 text-[#6C737F]" aria-hidden="true" />
                        <input
                          ref={inputRef}
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={tSearch('placeholder')}
                          className="flex-1 text-[16px] leading-[24px] text-[#384250] placeholder:text-[#6C737F] focus:outline-none"
                          aria-label={tSearch('placeholder')}
                        />
                        <button
                          type="button"
                          className="w-5 h-5 text-[#6C737F] hover:text-[#1F2A37]"
                          aria-label={tSearch('voiceSearch')}
                        >
                          <Mic className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="md"
                      ariaLabel={tSearch('searchButton')}
                      className="w-[83px] h-10 px-0"
                    >
                      {tSearch('searchButton')}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <p className="text-[14px] leading-[20px] font-semibold text-[#1B8354]">
                      {suggestions.length > 0 || isSuggesting
                        ? tSearch('suggestedSearches')
                        : tSearch('mostCommonSearches')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(suggestions.length > 0
                        ? suggestions.map((item) => ({
                            id: item.id,
                            label: item.title,
                          }))
                        : (['news', 'services', 'articles'] as const).map((key) => ({
                            id: key,
                            label: tSearch(`quickSearches.${key}`),
                          }))
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSearchSubmit(item.label)}
                          className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-[#F3F4F6] text-[14px] leading-[20px] text-[#1F2A37] hover:bg-[#E5E7EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8354]"
                        >
                          <SearchIcon className="w-4 h-4 text-[#1F2A37]" aria-hidden="true" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-transparent text-[#1F2A37] hover:bg-[#F3F4F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8354]"
                  aria-label={tSearch('closeSearch')}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
