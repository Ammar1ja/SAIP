'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PublicationsSectionProps } from './PublicationsSection.types';
import ServiceCard from '@/components/molecules/ServiceCard';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Section from '@/components/atoms/Section';
import TextContent from '@/components/atoms/TextConent';
import ArrowScroll from '@/components/molecules/ArrowScroll';
import { useDirection } from '@/context/DirectionContext';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/routes';

const PublicationsSection: React.FC<PublicationsSectionProps> = ({
  title,
  description,
  cards,
  ctaLabel,
  ctaHref,
}) => {
  const t = useTranslations('buttons');
  const publicationsHref = ROUTES.RESOURCES.TOOLS_AND_RESEARCH.PUBLICATIONS.ROOT;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';

  const updateScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const absoluteScrollLeft = Math.ceil(Math.abs(scrollLeft));
    const maxScrollableDistance = scrollWidth - clientWidth;
    setCanScrollLeft(absoluteScrollLeft > 0);
    setCanScrollRight(absoluteScrollLeft < maxScrollableDistance);
  };

  const scroll = (scrollDirection: 'left' | 'right') => {
    if (!scrollRef.current) return;
    let distance = 410; // Card width in desktop design

    if ((scrollDirection === 'left' && !isRtl) || (scrollDirection === 'right' && isRtl)) {
      distance = -distance;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    // Initial check with small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateScroll();
    }, 100);

    ref.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);

    return () => {
      clearTimeout(timer);
      ref.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [cards]);

  const resolvedPadding = isRtl ? 'pl-0 md:pl-0' : 'pr-0 md:pr-0';

  // Use translation as fallback if ctaLabel is not provided or is the default English string
  const translatedCtaLabel =
    ctaLabel && ctaLabel !== 'View more publication' && ctaLabel !== 'View more publications'
      ? ctaLabel
      : t('viewMorePublications');

  return (
    <Section
      columns="asymNarrowWide"
      background="neutral"
      fullWidth
      rtlAwareAlign={isRtl ? 'left' : 'right'}
      responsiveAlignDirection={isRtl ? 'left' : 'right'}
      className={`max-w-aligned-container ${resolvedPadding}`}
    >
      <div className="flex flex-col justify-between gap-4">
        <div>
          <Heading
            as="h2"
            size="custom"
            weight="medium"
            color="default"
            className="text-4xl leading-11 md:text-display-lg"
          >
            {title}
          </Heading>
          {description && (
            <TextContent
              className="mt-12 max-w-copy-narrow text-text-lg font-normal leading-[1.75rem] tracking-normal text-text-primary-paragraph [&_p+p]:mt-[18px]"
              allowHtml={true}
            >
              {description}
            </TextContent>
          )}
        </div>
        <ArrowScroll
          onScrollLeft={() => scroll('left')}
          onScrollRight={() => scroll('right')}
          disabledLeft={!canScrollLeft}
          disabledRight={!canScrollRight}
          className="hidden lg:flex"
        />
      </div>

      <div className="flex flex-col min-w-0">
        {translatedCtaLabel && (
          <div className="hidden md:flex justify-end mb-4 px-4 md:px-6 lg:px-8">
            <Button
              intent="secondary"
              outline
              href={publicationsHref}
              ariaLabel={translatedCtaLabel}
            >
              {translatedCtaLabel}
            </Button>
          </div>
        )}
        <div
          ref={scrollRef}
          className="flex w-full gap-6 overflow-x-auto snap-x snap-mandatory py-1 items-stretch px-4 md:px-6 lg:px-8 mb-4 md:mb-0"
        >
          {cards.map((card, idx) => (
            <div key={idx} className="w-[330px] sm:w-[410px] shrink-0 snap-start">
              <ServiceCard
                {...card}
                labels={[]}
                variant="report"
                className="h-[294px] !min-h-[294px]"
              />
            </div>
          ))}
        </div>
        {translatedCtaLabel && (
          <div className="md:hidden w-full px-4 md:px-6 lg:px-8">
            <Button
              intent="secondary"
              outline
              href={publicationsHref}
              ariaLabel={translatedCtaLabel}
              fullWidth
            >
              {translatedCtaLabel}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default PublicationsSection;
