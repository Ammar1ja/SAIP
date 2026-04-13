'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';

import { VideoCard } from '@/components/molecules/VideoCard';
import Pagination from '@/components/atoms/Pagination';
import { FilterField } from '@/components/molecules/Filters/Filters.types';
import Paragraph from '@/components/atoms/Paragraph';
import { useTranslations } from 'next-intl';
import { Video } from '@/lib/drupal/services/videos.service';
import { VideoFilterCategory } from '@/lib/drupal/services/video-filter-categories.service';
import VideoCarousel from '@/components/organisms/VideoCarousel';

interface VideosContentProps {
  videos: Video[];
  filterCategories: VideoFilterCategory[];
}

export function VideosContent({ videos, filterCategories }: VideosContentProps) {
  const t = useTranslations('mediaCenter.videos');
  const tCommon = useTranslations('common.labels');
  const tFilters = useTranslations('common.filters');
  const tIpCategories = useTranslations('common.filters.ipCategoryOptions');
  const tVideoCategories = useTranslations('mediaCenter.videos.categories');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCategoryKey = (value: string) => {
    const normalized = value.toLowerCase().trim();
    const map: Record<string, string> = {
      'the latest from saip': 'latest',
      'آخر أخبار الهيئة': 'latest',
      'events & conferences': 'events',
      'الفعاليات والمؤتمرات': 'events',
      'intellectual property': 'intellectualProperty',
      'الملكية الفكرية': 'intellectualProperty',
      'ip agents': 'ipAgents',
      'وكلاء الملكية الفكرية': 'ipAgents',
      'ip services': 'ipServices',
      'خدمات الملكية الفكرية': 'ipServices',
    };
    return map[normalized] || '';
  };

  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    search: '',
    date: '',
    category: [],
  });

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({
      search: '',
      date: '',
      category: [],
    });
  };

  const categoryOptions = useMemo(() => {
    if (filterCategories && filterCategories.length > 0) {
      return filterCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
    }

    const fallback = [
      'General',
      'Trademarks',
      'Patents',
      'Copyrights',
      'Designs',
      'Topographic designs of Integrated Circuits',
      'Plants varieties',
      'IP academy',
      'IP clinics',
      'IP licensing',
      'IP infringement',
      'General secretariat of IP dispute resolution committees',
      'National network of IP support centers',
    ];

    return fallback.map((name) => ({ value: name, label: name }));
  }, [filterCategories]);

  const filterFields: FilterField[] = [
    {
      id: 'search',
      label: tFilters('search'),
      type: 'search',
      placeholder: tFilters('search'),
    },
    {
      id: 'date',
      label: tFilters('date'),
      type: 'date',
      placeholder: tFilters('selectDateRange'),
      variant: 'range',
      restrictFutureDates: true,
    },
    {
      id: 'category',
      label: tFilters('category'),
      type: 'select',
      placeholder: tFilters('select'),
      multiselect: false,
      options: categoryOptions,
    },
  ];

  const getFilteredVideos = () => {
    let filteredVideos = [...videos];

    if (filterValues.search) {
      const searchTerm = (filterValues.search as string).toLowerCase();
      filteredVideos = filteredVideos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm),
      );
    }

    if (filterValues.category) {
      const selectedIds = Array.isArray(filterValues.category)
        ? filterValues.category
        : [filterValues.category];

      if (
        selectedIds.length === 0 ||
        (filterCategories.length > 0 && selectedIds.length === filterCategories.length)
      ) {
        return filteredVideos;
      }

      filteredVideos = filteredVideos.filter((video) => {
        const videoIds = video.videoFilterCategories.map((cat) => cat.id);
        return selectedIds.some((id) => videoIds.includes(id));
      });
    }

    if (filterValues.date && typeof filterValues.date === 'string') {
      const [fromRaw, toRaw] = filterValues.date.split('|');
      const parseDate = (value?: string) => {
        if (!value) return null;
        const direct = new Date(value);
        if (!isNaN(direct.getTime())) return direct;
        const parts = value.split('.');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const parsed = new Date(`${year}-${month}-${day}`);
          if (!isNaN(parsed.getTime())) return parsed;
        }
        return null;
      };
      const fromDate = parseDate(fromRaw);
      const toDate = parseDate(toRaw || fromRaw);

      if (fromDate && toDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        filteredVideos = filteredVideos.filter((video) => {
          const videoDate = parseDate(video.publishDate);
          if (!videoDate) return false;
          return videoDate >= start && videoDate <= end;
        });
      }
    }

    return filteredVideos;
  };

  const filteredVideos = getFilteredVideos();
  const hasActiveFilters = Boolean(
    filterValues.search ||
      filterValues.date ||
      (Array.isArray(filterValues.category) && filterValues.category.length > 0) ||
      (typeof filterValues.category === 'string' && filterValues.category),
  );
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues]);

  const mapVideoToCard = (video: Video) => ({
    id: video.id,
    title: video.title,
    publishDate: video.publishDate,
    thumbnail: video.image,
    videoUrl: video.videoUrl,
    videoType: video.videoType,
    logoSrc: '/images/saip-logo-mark-png.png',
    categories:
      video.videoCategories.length > 0
        ? video.videoCategories
        : video.ipCategories.map((cat) => ({
            id: cat.id,
            name: tIpCategories(cat.name as any, { defaultValue: cat.name }),
          })),
    href: `/media-center/media-library/media-center/videos/${video.id}`,
  });

  const parseDate = (value?: string) => {
    if (!value) return null;
    const direct = new Date(value);
    if (!isNaN(direct.getTime())) return direct;
    const parts = value.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsed = new Date(`${year}-${month}-${day}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return null;
  };

  const latestVideos = [...videos].sort((a, b) => {
    const aDate = parseDate(a.publishDate);
    const bDate = parseDate(b.publishDate);
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return bDate.getTime() - aDate.getTime();
  });
  const eventsVideos = videos.filter((video) =>
    video.videoCategories.some((cat) => getCategoryKey(cat.name) === 'events'),
  );
  const intellectualPropertyVideos = videos.filter((video) =>
    video.videoCategories.some((cat) => getCategoryKey(cat.name) === 'intellectualProperty'),
  );
  const ipAgentsVideos = videos.filter((video) =>
    video.videoCategories.some((cat) => getCategoryKey(cat.name) === 'ipAgents'),
  );
  const ipServicesVideos = videos.filter((video) => video.ipCategories.length > 0);
  const featuredVideo = !hasActiveFilters ? latestVideos[0] || videos[0] : null;
  const sections = [
    { key: 'latest', title: tVideoCategories('latest'), videos: latestVideos },
    { key: 'events', title: tVideoCategories('events'), videos: eventsVideos },
    {
      key: 'intellectualProperty',
      title: tVideoCategories('intellectualProperty'),
      videos: intellectualPropertyVideos,
    },
    { key: 'ipAgents', title: tVideoCategories('ipAgents'), videos: ipAgentsVideos },
    { key: 'ipServices', title: tVideoCategories('ipServices'), videos: ipServicesVideos },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
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
            fields={filterFields.map((field) =>
              field.id === 'category' ? { ...field, multiselect: true } : field,
            )}
            values={filterValues}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            columns={3}
            variant="media"
            showHideFilters={false}
          />
        )}
      </div>

      <div className="space-y-4 mt-4 md:space-y-6 md:mt-6 lg:space-y-8 lg:mt-8">
        <h2 className="text-3xl md:text-[36px] md:leading-[44px] font-medium py-6 lg:py-12 tracking-[-0.72px]">
          {tCommon('totalNumber')}: {hasActiveFilters ? filteredVideos.length : videos.length}
        </h2>

        {hasActiveFilters ? (
          <>
            {paginatedVideos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedVideos.map((video) => {
                    const card = mapVideoToCard(video);
                    return (
                      <VideoCard
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        publishDate={card.publishDate}
                        thumbnail={card.thumbnail}
                        categories={card.categories}
                        href={card.href}
                        logoSrc={card.logoSrc}
                      />
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      siblingCount={1}
                      ariaLabel={t('paginationAriaLabel')}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-neutral-400 italic">{tFilters('noItemsFound')}</div>
            )}
          </>
        ) : (
          <div className="space-y-10">
            {featuredVideo && (
              <VideoCard
                {...mapVideoToCard(featuredVideo)}
                variant="featured"
                className="max-w-[954px]"
              />
            )}
            {sections.map((section) => (
              <VideoCarousel
                key={section.key}
                heading={section.title}
                videos={section.videos.map((video) => mapVideoToCard(video))}
                emptyLabel={tFilters('noItemsFound')}
                className="max-w-[954px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
