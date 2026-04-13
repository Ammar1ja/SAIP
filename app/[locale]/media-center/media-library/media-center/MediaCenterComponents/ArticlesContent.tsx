'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewsArticleCard } from '@/components/organisms/NewsArticleCard';
import { FilterField } from '@/components/molecules/Filters/Filters.types';
import { Article } from '@/lib/drupal/services/articles.service';
import Paragraph from '@/components/atoms/Paragraph';
import Pagination from '@/components/atoms/Pagination';
import { Button } from '@/components/atoms/Button';
import { useTranslations } from 'next-intl';

interface ArticlesContentProps {
  articles: Article[];
}

export function ArticlesContent({ articles }: ArticlesContentProps) {
  const router = useRouter();
  const t = useTranslations('mediaCenter.articles');
  const tCommon = useTranslations('common.labels');
  const tFilters = useTranslations('common.filters');

  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    search: '',
    date: '',
    category: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const handlePoliciesClick = () => {
    router.push('/media-center/media-library/media-center/articles-policies');
  };

  // Extract unique categories from articles
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    articles.forEach((article) => {
      article.categories.forEach((cat) => {
        categories.add(cat.name);
      });
    });
    return Array.from(categories).map((cat) => ({
      value: cat.toLowerCase(),
      label: cat,
    }));
  }, [articles]);

  const filterFields: FilterField[] = [
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search',
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      placeholder: 'Select date range',
      variant: 'range',
      restrictFutureDates: true,
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select',
      multiselect: true,
      options: categoryOptions,
    },
  ];

  const getFilteredArticles = () => {
    let filteredArticles = [...articles];

    if (filterValues.search) {
      const searchTerm = (filterValues.search as string).toLowerCase();
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm),
      );
    }

    if (
      filterValues.category &&
      Array.isArray(filterValues.category) &&
      filterValues.category.length > 0
    ) {
      filteredArticles = filteredArticles.filter((article) =>
        article.categories.some((category) =>
          filterValues.category.includes(category.name.toLowerCase()),
        ),
      );
    }

    if (filterValues.date) {
      const filterDate = filterValues.date as string;
      filteredArticles = filteredArticles.filter((article) => article.publishDate === filterDate);
    }

    return filteredArticles;
  };

  const filteredArticles = getFilteredArticles();
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <>
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {useIsMobile() ? (
          <>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-default">
              {t('title')}
            </h1>
            <Paragraph className="text-text-primary-paragraph">{t('description')}</Paragraph>
            <div className="w-full py-4">
              <Button
                intent="outline"
                onClick={handlePoliciesClick}
                ariaLabel={t('policies')}
                fullWidth
              >
                {t('policies')}
              </Button>
            </div>
            <MobileFilters
              fields={filterFields}
              values={filterValues}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              searchFieldId="search"
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-text-default">
                {t('title')}
              </h1>
              <Button intent="outline" onClick={handlePoliciesClick} ariaLabel={t('policies')}>
                {t('policies')}
              </Button>
            </div>
            <Paragraph className="text-text-primary-paragraph">{t('description')}</Paragraph>
            <Filters
              fields={filterFields}
              values={filterValues}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              columns={3}
              variant="media"
              showHideFilters={false}
            />
          </>
        )}
      </div>

      <div className="space-y-4 mt-4 md:space-y-6 md:mt-6 lg:space-y-8 lg:mt-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium py-12 leading-[60px] tracking-[-0.96px]">
          {tFilters('totalNumber')}: {filteredArticles.length}
        </h2>

        {currentArticles.map((article) => (
          <NewsArticleCard
            key={article.id}
            title={article.title}
            date={article.publishDate}
            excerpt={article.excerpt}
            categories={article.categories}
            imageUrl={article.image}
            href={`/media-center/media-library/media-center/articles/${article.id}`}
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
            ariaLabel="Articles pagination"
          />
        </div>
      )}
    </>
  );
}
