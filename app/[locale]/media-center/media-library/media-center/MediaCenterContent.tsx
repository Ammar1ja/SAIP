'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TabVertical from '@/components/molecules/TabVertical';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { NewsContent } from './MediaCenterComponents/NewsContent';
import { VideosContent } from './MediaCenterComponents/VideosContent';
import { ArticlesContent } from './MediaCenterComponents/ArticlesContent';
import { NewsArticle } from '@/lib/drupal/services/news.service';
import { Article } from '@/lib/drupal/services/articles.service';
import { Video } from '@/lib/drupal/services/videos.service';
import { VideoFilterCategory } from '@/lib/drupal/services/video-filter-categories.service';

interface MediaCenterContentProps {
  newsArticles: NewsArticle[];
  newsCategories: Array<{ id: string; name: string }>;
  articles: Article[];
  videos: Video[];
  videoFilterCategories: VideoFilterCategory[];
  initialTab: 'news' | 'videos' | 'articles';
}

export function MediaCenterContent({
  newsArticles,
  newsCategories,
  articles,
  videos,
  videoFilterCategories,
  initialTab,
}: MediaCenterContentProps) {
  const t = useTranslations('mediaCenter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'news', label: t('tabs.news') },
    { id: 'videos', label: t('tabs.videos') },
    { id: 'articles', label: t('tabs.articles') },
  ];

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['news', 'videos', 'articles'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as 'news' | 'videos' | 'articles');
      return;
    }
    setActiveTab(initialTab);
  }, [searchParams, initialTab]);

  const handleTabChange = (tabId: string) => {
    if (!['news', 'videos', 'articles'].includes(tabId)) return;

    setActiveTab(tabId as 'news' | 'videos' | 'articles');

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsContent articles={newsArticles} categories={newsCategories} />;
      case 'videos':
        return <VideosContent videos={videos} filterCategories={videoFilterCategories} />;
      case 'articles':
        return <ArticlesContent articles={articles} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <LayoutWrapper className="py-8 md:py-12 lg:py-16 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:w-[302px] flex-shrink-0">
            <TabVertical
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              ariaLabel={t('navigationAriaLabel')}
              className="rounded-[16px] bg-white p-6 shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)] [&_ul[role='tablist']]:gap-0 [&_button[role='tab']]:px-3 [&_button[role='tab']]:py-2 [&_button[role='tab']]:text-[16px] [&_button[role='tab']]:leading-6 [&_button[aria-selected='true']]:font-semibold [&_button[aria-selected='true']]:text-[#161616] [&_button[aria-selected='true']]:before:w-[3px] [&_button[aria-selected='false']]:font-normal [&_button[aria-selected='false']]:text-[#384250]"
            />
          </div>

          <div className="flex-1 min-w-0 max-w-[954px]">{renderContent()}</div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
