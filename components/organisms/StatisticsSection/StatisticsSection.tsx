'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StatisticsSectionProps } from './StatisticsSection.types';
import Button from '@/components/atoms/Button';
import Grid from '@/components/atoms/Grid';
import Heading from '@/components/atoms/Heading';
import Section from '@/components/atoms/Section';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const StatisticsCard = dynamic(() => import('./StatisticsCard'), {
  ssr: false,
});

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  title,
  ctaLabel,
  ctaHref,
  stats,
  columns = 3,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [shouldRenderCharts, setShouldRenderCharts] = useState(false);
  const t = useTranslations('buttons');
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const INITIAL_ITEMS_COUNT = columns;
  const hasMoreItems = stats.length > INITIAL_ITEMS_COUNT;
  const displayedStats = showAll ? stats : stats.slice(0, INITIAL_ITEMS_COUNT);
  const hasPatentsOverviewLayout =
    !showAll &&
    displayedStats.length === 3 &&
    displayedStats[0]?.chartType === 'line' &&
    displayedStats[1]?.chartType === 'line' &&
    displayedStats[2]?.chartType === 'pie';

  // Use translation as fallback if ctaLabel is not provided or is the default English string
  const translatedCtaLabel =
    ctaLabel && ctaLabel !== 'View more statistics' ? ctaLabel : t('viewMoreStatistics');

  // Determine button label
  let buttonLabel: string;
  if (showAll) {
    buttonLabel = t('viewLess');
  } else {
    buttonLabel = translatedCtaLabel;
  }

  useEffect(() => {
    if (shouldRenderCharts) return;
    const target = sectionRef.current;
    if (!target || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setShouldRenderCharts(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) {
          setShouldRenderCharts(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldRenderCharts]);

  const renderCardSkeleton = (idx: number) => (
    <div
      key={`stats-skeleton-${idx}`}
      className="rounded-2xl border border-neutral-200 bg-white min-h-[248px] animate-pulse"
      aria-hidden="true"
    />
  );

  return (
    <div ref={sectionRef}>
      {/* Desktop version */}
      <div className="hidden md:block">
        <Section className="max-w-[1343px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-12">
            <Heading
              as="h2"
              size="custom"
              weight="medium"
              color="default"
              className="text-display-lg"
            >
              {title}
            </Heading>
            {(hasMoreItems || ctaHref) && (
              <div className="w-full md:w-auto">
                {hasMoreItems ? (
                  <Button
                    intent="secondary"
                    outline
                    onClick={() => setShowAll(!showAll)}
                    ariaLabel={buttonLabel}
                    className="w-full md:w-auto"
                  >
                    {buttonLabel}
                  </Button>
                ) : (
                  <Button
                    intent="secondary"
                    outline
                    href={ctaHref}
                    ariaLabel={translatedCtaLabel}
                    className="w-full md:w-auto"
                  >
                    {translatedCtaLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
          {hasPatentsOverviewLayout ? (
            <div className="mx-auto grid w-full max-w-[1279px] grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[356px_356px_519px] xl:justify-center">
              {shouldRenderCharts ? (
                <>
                  <div className="h-[248px] w-full xl:w-[356px]">
                    <StatisticsCard {...displayedStats[0]} />
                  </div>
                  <div className="h-[248px] w-full xl:w-[356px]">
                    <StatisticsCard {...displayedStats[1]} />
                  </div>
                  <div className="h-[248px] w-full lg:col-span-2 xl:col-span-1 xl:w-[519px]">
                    <StatisticsCard {...displayedStats[2]} />
                  </div>
                </>
              ) : (
                <>
                  {renderCardSkeleton(0)}
                  {renderCardSkeleton(1)}
                  {renderCardSkeleton(2)}
                </>
              )}
            </div>
          ) : (
            <Grid cols={{ base: 1, md: columns, lg: columns }} gap="gap-6">
              {shouldRenderCharts
                ? displayedStats.map((stat, idx) => <StatisticsCard key={idx} {...stat} />)
                : displayedStats.map((_, idx) => renderCardSkeleton(idx))}
            </Grid>
          )}
        </Section>
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <Section background="white">
          <Heading
            as="h2"
            size="custom"
            weight="medium"
            color="default"
            className="mb-8 text-4xl leading-11"
          >
            {title}
          </Heading>
          <div className="space-y-4">
            {shouldRenderCharts
              ? displayedStats.map((stat, idx) => <StatisticsCard key={idx} {...stat} />)
              : displayedStats.map((_, idx) => renderCardSkeleton(idx))}
          </div>
          {hasMoreItems && (
            <Button
              intent="secondary"
              outline
              onClick={() => setShowAll(!showAll)}
              ariaLabel={buttonLabel}
              className="mt-6 w-full"
              fullWidth
            >
              {buttonLabel}
            </Button>
          )}
        </Section>
      </div>
    </div>
  );
};

export default StatisticsSection;
