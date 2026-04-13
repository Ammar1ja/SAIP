'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewsArticleCard } from '@/components/organisms/NewsArticleCard';
import { FilterField } from '@/components/molecules/Filters/Filters.types';
import Paragraph from '@/components/atoms/Paragraph';
import Pagination from '@/components/atoms/Pagination';
import { NewsArticle } from '@/lib/drupal/services/news.service';

interface NewsContentProps {
  articles: NewsArticle[];
  categories: Array<{ id: string; name: string }>;
}

export function NewsContent({ articles, categories }: NewsContentProps) {
  const t = useTranslations('mediaCenter.news');

  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    search: '',
    date: '',
    category: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use categories from Drupal taxonomy instead of extracting from articles
  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
    }));
  }, [categories]);

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues({
      search: '',
      date: '',
      category: [],
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterFields: FilterField[] = [
    {
      id: 'search',
      label: t('search'),
      type: 'search',
      placeholder: t('searchPlaceholder'),
    },
    {
      id: 'date',
      label: t('date'),
      type: 'date',
      placeholder: t('datePlaceholder'),
      variant: 'range',
      restrictFutureDates: true,
    },
    {
      id: 'category',
      label: t('category'),
      type: 'select',
      placeholder: t('categoryPlaceholder'),
      multiselect: true,
      options: categoryOptions,
    },
  ];

  const normalizeDateToLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const parts = dateString.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsed = new Date(year, month, day);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    return null;
  };

  const isDateInRange = (dateString: string, rangeString: string | undefined): boolean => {
    if (!rangeString || !rangeString.trim()) return true;

    const [fromStr, toStr] = rangeString.split('|');
    if (!fromStr || !toStr) return true;

    const articleDate = parseDate(dateString);
    const fromDate = parseDate(fromStr);
    const toDate = parseDate(toStr);

    if (!articleDate || !fromDate || !toDate) {
      return true;
    }

    const articleDateStr = normalizeDateToLocal(articleDate);
    const fromDateStr = normalizeDateToLocal(fromDate);
    const toDateStr = normalizeDateToLocal(toDate);

    return articleDateStr >= fromDateStr && articleDateStr <= toDateStr;
  };

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (filterValues.search) {
      const searchTerm = (filterValues.search as string).toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm),
      );
    }

    if (filterValues.date && typeof filterValues.date === 'string' && filterValues.date.trim()) {
      result = result.filter((article) => {
        if (!article.publishDate) return false;
        return isDateInRange(article.publishDate, filterValues.date as string);
      });
    }

    // Only filter by category if user selected specific categories (not "All")
    if (
      filterValues.category &&
      Array.isArray(filterValues.category) &&
      filterValues.category.length > 0 &&
      filterValues.category.length < categoryOptions.length // "All" means all categories selected
    ) {
      result = result.filter((article) =>
        article.categories.some((category) =>
          filterValues.category.includes(category.name.toLowerCase()),
        ),
      );
    }

    return result;
  }, [articles, filterValues, categoryOptions.length]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <>
      <div className="space-y-4 md:space-y-6 lg:space-y-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-default">
          {t('title')}
        </h1>
        <Paragraph className="text-text-primary-paragraph">{t('description')}</Paragraph>
        {useIsMobile() ? (
          <MobileFilters
            fields={filterFields}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            searchFieldId="search"
          />
        ) : (
          <Filters
            fields={filterFields}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            columns={3}
            variant="media"
            showHideFilters={false}
          />
        )}
      </div>

      <div className="space-y-4 mt-4 md:space-y-6 md:mt-6 lg:mt-10 lg:space-y-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium py-12 leading-[60px] tracking-[-0.96px]">
          {t('totalNumber')}: {filteredArticles.length}
        </h2>
        {currentArticles.map((article) => (
          <NewsArticleCard
            key={article.id}
            title={article.title}
            date={article.publishDate}
            excerpt={article.excerpt}
            categories={article.categories}
            imageUrl={article.image}
            href={article.href}
            className="border border-gray-200"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            siblingCount={1}
            ariaLabel={t('paginationAriaLabel')}
          />
        </div>
      )}
    </>
  );
}
