'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  Filter,
  Mic,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import Pagination from '@/components/atoms/Pagination';
import { cn } from '@/lib/utils/cn';
import { searchContent, SearchResult } from '@/lib/drupal/services/search.service';
import { useIsMobile } from '@/hooks/useIsMobile';

const UI_PAGE_SIZE = 12;
const API_PAGE_SIZE = 200;

const categoryKeys = [
  'patents',
  'trademarks',
  'copyrights',
  'designs',
  'plantVarieties',
  'layoutDesigns',
  'ipLicensing',
  'ipAcademy',
  'ipClinics',
  'ipSupportCenters',
  'ipInfringement',
  'ipDisputeResolution',
];

const normalizeValue = (value: string) => value.toLowerCase().trim();

const parseDateValue = (value?: string) => {
  if (!value) return 0;
  const direct = Date.parse(value);
  if (!Number.isNaN(direct)) return direct;

  const match = value.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const parsed = new Date(year, month, day).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

const GlobalSearchCard = ({
  result,
  actionLabel,
  categoryLabel,
  isMobile,
}: {
  result: SearchResult;
  actionLabel: string;
  categoryLabel?: string;
  isMobile?: boolean;
}) => {
  const tags = [categoryLabel, result.type].filter(Boolean);

  return (
    <div
      className={cn(
        'bg-white border border-[#D2D6DB] rounded-2xl flex flex-col',
        isMobile ? 'p-4 gap-4' : 'p-6 gap-6',
      )}
    >
      {isMobile ? (
        <div className="rounded-md bg-neutral-100 text-[#161616] p-3 min-h-[96px] flex items-end">
          <h3 className="text-[18px] leading-[28px] font-medium line-clamp-3">{result.title}</h3>
        </div>
      ) : (
        <h3 className="text-[18px] leading-[28px] font-medium text-[#161616]">{result.title}</h3>
      )}
      {result.description && (
        <p
          className={cn(
            'text-[#384250] line-clamp-3',
            isMobile ? 'text-sm leading-5' : 'text-base leading-6',
          )}
        >
          {result.description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center h-6 px-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] text-[12px] leading-[18px] font-medium text-[#1F2A37]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex">
        <Button
          href={result.url}
          size="md"
          className={cn(isMobile ? 'w-full justify-center' : 'px-4')}
          ariaLabel={actionLabel}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default function GlobalSearchPage() {
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common.globalSearch');
  const tCommon = useTranslations('common.searchModal');
  const isRtl = useLocale() === 'ar';
  const isMobile = useIsMobile();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page') || '1') || 1;

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [sortOption, setSortOption] = useState<'relevance' | 'newest' | 'oldest'>('relevance');
  const [isTypeSectionOpen, setIsTypeSectionOpen] = useState(true);
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQueryInput(initialQuery);
    setActiveQuery(initialQuery);
    setCurrentPage(initialPage);
  }, [initialQuery, initialPage]);

  useEffect(() => {
    if (!activeQuery || activeQuery.trim().length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    searchContent(activeQuery, locale, { page: 1, pageSize: API_PAGE_SIZE, fetchAll: true })
      .then((response) => {
        if (!isMounted) return;
        setResults(response.results);
        setTotal(response.total);
      })
      .catch(() => {
        if (!isMounted) return;
        setResults([]);
        setTotal(0);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeQuery, locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      setDraftCategories(selectedCategories);
      setDraftTypes(selectedTypes);
    }
  }, [isFilterOpen, selectedCategories, selectedTypes]);

  const categoryOptions = useMemo(
    () =>
      categoryKeys.map((key) => ({
        key,
        label: t(`categories.${key}`),
      })),
    [t],
  );

  const typeOptions = useMemo(() => {
    const base = [
      t('typeOptions.services'),
      t('typeOptions.guidelines'),
      t('typeOptions.faqs'),
      t('typeOptions.news'),
      t('typeOptions.articles'),
      t('typeOptions.reports'),
      t('typeOptions.publications'),
      t('typeOptions.lawsRegulations'),
      t('typeOptions.projects'),
      t('typeOptions.about'),
      t('typeOptions.pages'),
    ].filter((label) => label && !label.startsWith('globalSearch.typeOptions.'));

    const resultTypes = results
      .map((item) => item.type)
      .filter(Boolean)
      .map((item) => item.trim());

    const unique = new Map<string, string>();
    [...base, ...resultTypes].forEach((label) => {
      const key = normalizeValue(label);
      if (!unique.has(key)) {
        unique.set(key, label);
      }
    });

    return Array.from(unique.values());
  }, [results, t]);

  const filteredResults = useMemo(() => {
    let list = [...results];

    if (selectedCategories.length > 0) {
      list = list.filter(
        (item) => item.categoryKey && selectedCategories.includes(item.categoryKey),
      );
    }

    if (selectedTypes.length > 0) {
      const normalizedTypes = selectedTypes.map(normalizeValue);
      list = list.filter((item) => normalizedTypes.includes(normalizeValue(item.type || '')));
    }

    if (sortOption !== 'relevance') {
      list.sort((a, b) => {
        const dateA = parseDateValue(a.createdDate);
        const dateB = parseDateValue(b.createdDate);
        return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
      });
    }

    return list;
  }, [results, selectedCategories, selectedTypes, sortOption]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * UI_PAGE_SIZE;
    return filteredResults.slice(start, start + UI_PAGE_SIZE);
  }, [filteredResults, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / UI_PAGE_SIZE));
  const hasActiveFilters = selectedCategories.length > 0 || selectedTypes.length > 0;
  const resultCount = hasActiveFilters ? filteredResults.length : total;

  const handleSearchSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const nextQuery = queryInput.trim();
    setActiveQuery(nextQuery);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    const basePath = locale ? `/${locale}/search` : '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const runSearchWithValue = (value: string) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;
    setQueryInput(nextQuery);
    setActiveQuery(nextQuery);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', nextQuery);
    params.set('page', '1');
    const basePath = locale ? `/${locale}/search` : '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    if (activeQuery) {
      params.set('q', activeQuery);
    }
    const basePath = locale ? `/${locale}/search` : '/search';
    router.push(`${basePath}?${params.toString()}`);
  };

  const toggleDraftCategory = (key: string) => {
    setDraftCategories((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const toggleDraftType = (value: string) => {
    setDraftTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const clearFilters = () => {
    setDraftCategories([]);
    setDraftTypes([]);
    setSelectedCategories([]);
    setSelectedTypes([]);
    setCurrentPage(1);
    setTypeSearch('');
    setShowAllTypes(false);
  };

  const applyFilters = () => {
    setSelectedCategories(draftCategories);
    setSelectedTypes(draftTypes);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const filteredTypeOptions = typeOptions.filter((option) =>
    normalizeValue(option).includes(normalizeValue(typeSearch)),
  );
  const visibleTypeOptions = showAllTypes ? filteredTypeOptions : filteredTypeOptions.slice(0, 3);
  const hiddenTypeCount = Math.max(0, filteredTypeOptions.length - visibleTypeOptions.length);

  const selectedCount = selectedCategories.length + selectedTypes.length;
  const draftCount = draftCategories.length + draftTypes.length;

  return (
    <div className="min-h-screen bg-white" aria-busy={isLoading}>
      <section className={cn(isMobile ? 'px-4 py-6' : 'px-20 py-10')}>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-10 border border-[#9DA4AE] rounded-sm bg-white flex items-center px-2 gap-2">
              <SearchIcon className="w-5 h-5 text-[#6C737F]" aria-hidden="true" />
              <input
                type="search"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 text-[16px] leading-[24px] text-[#384250] placeholder:text-[#6C737F] focus:outline-none"
                aria-label={t('placeholder')}
              />
              <button
                type="button"
                className="w-5 h-5 text-[#6C737F] hover:text-[#1F2A37]"
                aria-label={t('voiceSearch')}
              >
                <Mic className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          {isMobile ? (
            <>
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="h-11 w-11 rounded-sm bg-[#1B8354] text-white inline-flex items-center justify-center"
                aria-label={t('filter')}
              >
                <Filter className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="submit"
                className="h-11 w-11 rounded-sm bg-[#1B8354] text-white inline-flex items-center justify-center"
                aria-label={t('searchButton')}
              >
                <SearchIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Button type="submit" size="md" ariaLabel={t('searchButton')}>
              {t('searchButton')}
            </Button>
          )}
        </form>

        {isMobile && !activeQuery && (
          <div className="mt-4">
            <p className="text-sm leading-5 font-semibold text-[#1B8354]">
              {t('mostCommonSearches')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['news', 'services', 'articles'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => runSearchWithValue(t(`quickSearches.${key}`))}
                  className="h-8 px-3 rounded-full bg-[#F3F4F6] text-sm leading-5 text-[#1F2A37]"
                >
                  {t(`quickSearches.${key}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className={cn(isMobile ? 'px-4 pb-16' : 'px-20 pb-20')}>
        <div
          className={cn(
            'mb-8',
            isMobile ? 'space-y-4' : 'mb-10 flex items-start justify-between gap-6',
          )}
        >
          <div>
            <h1
              className={cn(
                isMobile
                  ? 'text-3xl leading-[38px]'
                  : 'text-[36px] leading-[44px] tracking-[-0.72px]',
                'font-medium text-[#0D121C]',
              )}
            >
              {t('resultsTitle', { query: activeQuery || t('placeholder') })}
            </h1>
            <p
              className="text-[16px] leading-[24px] text-[#6C737F] mt-2"
              role="status"
              aria-live="polite"
            >
              {t('resultsCount', { count: resultCount })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={filterRef}>
              {!isMobile && (
                <button
                  type="button"
                  className="h-10 px-4 rounded-sm bg-[#0D121C] text-white flex items-center gap-2 text-[16px] leading-[24px] font-medium"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  aria-expanded={isFilterOpen}
                  aria-controls="global-search-filter-panel"
                >
                  <Filter className="w-5 h-5" aria-hidden="true" />
                  {t('filter')}
                  <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
              {isFilterOpen && (
                <div
                  id="global-search-filter-panel"
                  className={cn(
                    isMobile
                      ? 'fixed inset-0 z-[90] w-full bg-white'
                      : 'absolute z-20 mt-2 w-80 rounded-sm border border-[#D2D6DB] bg-white shadow-sm',
                    !isMobile && (isRtl ? 'left-0' : 'right-0'),
                  )}
                  role="dialog"
                  aria-modal="false"
                >
                  {isMobile && (
                    <div className="h-[92px] border-b border-[#E5E7EB] flex items-center justify-between px-4">
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="h-8 w-8 rounded-sm bg-[#F3F4F6] inline-flex items-center justify-center"
                        aria-label={t('closeSearch')}
                      >
                        <ChevronLeft className="w-5 h-5 text-[#161616]" />
                      </button>
                      <p className="text-sm font-semibold text-[#161616]">{t('filter')}</p>
                      <div className="w-8" />
                    </div>
                  )}

                  {isMobile ? (
                    <div className="h-[calc(100vh-92px)] overflow-y-auto p-4">
                      <div className="px-2 py-4 space-y-3">
                        <button
                          type="button"
                          onClick={() => setIsCategorySectionOpen((prev) => !prev)}
                          className="w-full h-14 px-4 rounded-sm border border-[#D2D6DB] flex items-center justify-between text-[#161616] text-base"
                        >
                          {t('categoryLabel')}
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isCategorySectionOpen && 'rotate-180',
                            )}
                          />
                        </button>
                        <div className={cn('space-y-2', !isCategorySectionOpen && 'hidden')}>
                          {categoryOptions.map((option) => (
                            <label
                              key={option.key}
                              className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-[#F9FAFB] text-[14px] leading-[20px] text-[#161616]"
                            >
                              <input
                                type="checkbox"
                                checked={draftCategories.includes(option.key)}
                                onChange={() => toggleDraftCategory(option.key)}
                                className="h-4 w-4 rounded border-[#6C737F] text-[#0D121C] focus:ring-[#0D121C]"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#D2D6DB]" />

                      <div className="px-2 py-4 space-y-3">
                        <button
                          type="button"
                          onClick={() => setIsTypeSectionOpen((prev) => !prev)}
                          className="w-full h-14 px-4 rounded-sm border border-[#D2D6DB] flex items-center justify-between text-[#161616] text-base"
                        >
                          {t('typeLabel')}
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isTypeSectionOpen && 'rotate-180',
                            )}
                          />
                        </button>
                        <div className={cn(!isTypeSectionOpen && 'hidden')}>
                          <div className="px-2">
                            <div className="h-10 border border-[#9DA4AE] rounded-sm bg-white flex items-center px-2 gap-2 ">
                              <SearchIcon className="w-5 h-5 text-[#6C737F]" aria-hidden="true" />
                              <input
                                type="search"
                                value={typeSearch}
                                onChange={(e) => setTypeSearch(e.target.value)}
                                placeholder={t('searchTypePlaceholder')}
                                className="flex-1 text-[16px] leading-[24px] text-[#384250] placeholder:text-[#6C737F] focus:outline-none"
                              />
                              {typeSearch && (
                                <button
                                  type="button"
                                  onClick={() => setTypeSearch('')}
                                  className="text-[#6C737F] hover:text-[#1F2A37]"
                                  aria-label={t('clearSearch')}
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {visibleTypeOptions.map((option) => (
                              <label
                                key={option}
                                className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-[#F9FAFB] text-[14px] leading-[20px] text-[#161616]"
                              >
                                <input
                                  type="checkbox"
                                  checked={draftTypes.includes(option)}
                                  onChange={() => toggleDraftType(option)}
                                  className="h-4 w-4 rounded border-[#6C737F] text-[#0D121C] focus:ring-[#0D121C]"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                          {hiddenTypeCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAllTypes((prev) => !prev)}
                              className="flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#161616] px-2"
                            >
                              {t('showMore', { count: hiddenTypeCount })}
                              <ChevronDown
                                className={cn(
                                  'w-5 h-5 transition-transform',
                                  showAllTypes && 'rotate-180',
                                )}
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[720px] overflow-y-auto">
                      <div className="px-2 py-4">
                        <p className="px-2 text-[14px] leading-[20px] font-semibold text-[#384250]">
                          {t('categoryLabel')} ({draftCategories.length})
                        </p>
                        <div className="mt-3 space-y-2">
                          {categoryOptions.map((option) => (
                            <label
                              key={option.key}
                              className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-[#F9FAFB] text-[14px] leading-[20px] text-[#161616]"
                            >
                              <input
                                type="checkbox"
                                checked={draftCategories.includes(option.key)}
                                onChange={() => toggleDraftCategory(option.key)}
                                className="h-4 w-4 rounded border-[#6C737F] text-[#0D121C] focus:ring-[#0D121C]"
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#D2D6DB]" />

                      <div className="px-2 py-4">
                        <p className="px-2 text-[14px] leading-[20px] font-semibold text-[#384250]">
                          {t('typeLabel')} ({draftTypes.length})
                        </p>
                        <div className="mt-3 px-2">
                          <div className="h-10 border border-[#9DA4AE] rounded-sm bg-white flex items-center px-2 gap-2">
                            <SearchIcon className="w-5 h-5 text-[#6C737F]" aria-hidden="true" />
                            <input
                              type="search"
                              value={typeSearch}
                              onChange={(e) => setTypeSearch(e.target.value)}
                              placeholder={t('searchTypePlaceholder')}
                              className="flex-1 text-[16px] leading-[24px] text-[#384250] placeholder:text-[#6C737F] focus:outline-none"
                            />
                            {typeSearch && (
                              <button
                                type="button"
                                onClick={() => setTypeSearch('')}
                                className="text-[#6C737F] hover:text-[#1F2A37]"
                                aria-label={t('clearSearch')}
                              >
                                <X className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          {visibleTypeOptions.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-[#F9FAFB] text-[14px] leading-[20px] text-[#161616]"
                            >
                              <input
                                type="checkbox"
                                checked={draftTypes.includes(option)}
                                onChange={() => toggleDraftType(option)}
                                className="h-4 w-4 rounded border-[#6C737F] text-[#0D121C] focus:ring-[#0D121C]"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                        {hiddenTypeCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowAllTypes((prev) => !prev)}
                            className="mt-3 ml-2 flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#161616]"
                          >
                            {t('showMore', { count: hiddenTypeCount })}
                            <ChevronDown
                              className={cn(
                                'w-5 h-5 transition-transform',
                                showAllTypes && 'rotate-180',
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-[#E5E7EB] px-2 py-2">
                    <div
                      className={cn('flex items-center justify-center gap-6', isMobile && 'py-3')}
                    >
                      <Button
                        size="md"
                        onClick={applyFilters}
                        ariaLabel={t('applyFilters', { count: draftCount })}
                      >
                        {t('applyFilters', { count: draftCount })}
                      </Button>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="h-10 px-4 rounded-sm bg-[#F3F4F6] text-[16px] leading-[24px] font-medium text-[#161616]"
                      >
                        {t('clearFilters')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={sortRef}>
              <button
                type="button"
                className="h-10 px-4 rounded-sm border border-[#D2D6DB] bg-white text-[#161616] flex items-center gap-2 text-[16px] leading-[24px] font-medium"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-expanded={isSortOpen}
                aria-controls="global-search-sort-panel"
              >
                {t('sort')}
                <ArrowUpDown className="w-5 h-5" aria-hidden="true" />
              </button>
              {isSortOpen && (
                <div
                  id="global-search-sort-panel"
                  className={cn(
                    'absolute z-20 mt-2 w-48 rounded-sm border border-[#D2D6DB] bg-white shadow-sm',
                    isRtl ? 'left-0' : 'right-0',
                  )}
                  role="menu"
                >
                  {(['relevance', 'newest', 'oldest'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortOption(option);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-[14px] leading-[20px] text-[#161616] hover:bg-[#F9FAFB]',
                        sortOption === option && 'bg-[#F3F4F6] font-medium',
                      )}
                      role="menuitemradio"
                      aria-checked={sortOption === option}
                    >
                      {t(`sortOptions.${option}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="py-16 text-center text-[#6C737F]">{tCommon('searching')}</div>
        )}

        {!isLoading && activeQuery && filteredResults.length === 0 && (
          <div className="py-24 flex flex-col items-center text-center text-[#6C737F]">
            <div className="w-14 h-14 rounded-md bg-[#079455] flex items-center justify-center">
              <SearchIcon className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h3 className={cn('mt-6 font-medium text-[#161616]', 'text-[30px] leading-[38px]')}>
              {t('noResultsTitle')}
            </h3>
            <p
              className={cn(
                'mt-4 text-[#384250]',
                isMobile
                  ? 'text-lg leading-7 max-w-[343px]'
                  : 'text-[18px] leading-[28px] max-w-[468px]',
              )}
            >
              {t('noResultsDescription')}
            </p>
          </div>
        )}

        {!isLoading && !activeQuery && (
          <div className="py-24 flex flex-col items-center text-center text-[#6C737F]">
            <SearchIcon className="w-14 h-14 text-[#6C737F]" aria-hidden="true" />
            <h3 className="mt-6 text-[24px] leading-[32px] font-medium text-[#1F2A37]">
              {t('startTypingTitle')}
            </h3>
            <p className="mt-3 text-[16px] leading-[24px] max-w-md">
              {t('startTypingDescription')}
            </p>
          </div>
        )}

        {!isLoading && activeQuery && filteredResults.length > 0 && (
          <div className="space-y-6">
            {paginatedResults.map((result) => (
              <GlobalSearchCard
                key={`${result.typeKey}-${result.id}`}
                result={result}
                categoryLabel={
                  result.categoryKey
                    ? t(`categories.${result.categoryKey}`)
                    : result.category || undefined
                }
                actionLabel={t('actionLabel')}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredResults.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}
