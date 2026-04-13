'use client';

import { useRef, useState, useEffect } from 'react';
import { wrapper, heading, cardsRow, carouselItem } from './AdvisoryBoardCarousel.styles';
import { AdvisoryBoardCarouselProps, VideoForClick } from './AdvisoryBoardCarousel.types';
import { PersonCard } from '@/components/molecules/PersonCard';
import { VideoCard } from '@/components/molecules/VideoCard';
import { CommentCard } from '@/components/molecules/CommentCard';
import ArrowScroll from '@/components/molecules/ArrowScroll';
import Section from '@/components/atoms/Section';
import ContentBlock from '@/components/molecules/ContentBlock';
import { useDirection } from '@/context/DirectionContext';
import { cn } from '@/lib/utils/cn';

const AdvisoryBoardCarousel = ({
  heading: title,
  description: desc,
  description2: desc2,
  people,
  videos,
  comments,
  variant = 'people',
  className,
  onVideoClick,
}: AdvisoryBoardCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const hasDescription = Boolean(desc) || Boolean(desc2);
  const cardWidth = variant === 'videos' ? 464 : 350;
  const itemCount =
    variant === 'people'
      ? people?.length || 0
      : variant === 'videos'
        ? videos?.length || 0
        : comments?.length || 0;

  const updateScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    const absoluteScrollLeft = Math.ceil(Math.abs(scrollLeft));
    const maxScrollableDistance = scrollWidth - clientWidth;

    setCanScrollLeft(absoluteScrollLeft > 0);
    setCanScrollRight(absoluteScrollLeft < maxScrollableDistance);

    if (variant === 'people' && itemCount > 0) {
      const style = window.getComputedStyle(scrollRef.current);
      const gapValue = parseFloat(style.gap || '24');
      const firstItem = scrollRef.current.firstElementChild as HTMLElement | null;
      const itemWidth = firstItem?.getBoundingClientRect().width || cardWidth;
      const index = Math.round(absoluteScrollLeft / (itemWidth + gapValue));
      setActiveIndex(Math.max(0, Math.min(itemCount - 1, index)));
    }
  };

  const scroll = (scrollDirection: 'left' | 'right') => {
    if (!scrollRef.current) return;
    let distance = cardWidth;

    if ((scrollDirection === 'left' && !isRtl) || (scrollDirection === 'right' && isRtl)) {
      distance = -distance;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const style = window.getComputedStyle(scrollRef.current);
    const gapValue = parseFloat(style.gap || '24');
    const firstItem = scrollRef.current.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem?.getBoundingClientRect().width || cardWidth;
    const target = index * (itemWidth + gapValue);
    scrollRef.current.scrollTo({ left: isRtl ? -target : target, behavior: 'smooth' });
  };

  useEffect(() => {
    updateScroll();
    const ref = scrollRef.current;
    if (!ref) return;
    ref.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    return () => {
      ref.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [itemCount, variant]);

  const resolvedPadding = isRtl ? 'pl-0 md:pl-0' : 'pr-0 md:pr-0';

  return (
    <Section
      className={cn('max-w-aligned-container', resolvedPadding, className)}
      background={variant === 'comments' ? 'neutral' : 'white'}
      padding={variant === 'videos' ? 'small' : 'default'}
      fullWidth
      rtlAwareAlign={isRtl ? 'left' : 'right'}
      responsiveAlignDirection={isRtl ? 'left' : 'right'}
    >
      <div
        className={cn(
          variant === 'videos' ? 'mb-4' : 'mb-6',
          'max-w-screen-xl',
          isRtl ? 'pl-4 md:pl-8' : 'pr-4 md:pr-8',
        )}
      >
        <div
          className={cn(
            'flex justify-between gap-6',
            variant === 'videos' ? 'items-center' : 'items-end',
          )}
        >
          {hasDescription ? (
            <ContentBlock
              heading={title}
              text={desc2 ? `${desc}<br/><br/>${desc2}` : desc || ''}
              className="max-w-3xl "
              lineHeight="none"
            />
          ) : (
            <h2 className="min-w-0 truncate text-[30px] leading-[36px] font-medium text-text-default">
              {title}
            </h2>
          )}

          <div className="hidden md:flex flex-shrink-0">
            <ArrowScroll
              onScrollLeft={() => scroll('left')}
              onScrollRight={() => scroll('right')}
              disabledLeft={!canScrollLeft}
              disabledRight={!canScrollRight}
            />
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={cardsRow()}
        tabIndex={0}
        aria-label={
          variant === 'people'
            ? 'Advisory board members list'
            : variant === 'videos'
              ? 'Video content list'
              : 'Comments list'
        }
      >
        {variant === 'people' &&
          people?.map((person) => (
            <div key={person.name} className={carouselItem()}>
              <PersonCard {...person} variant="carousel" />
            </div>
          ))}
        {variant === 'videos' &&
          videos?.map((video) => {
            const { section, ...videoCardProps } = video;
            return (
              <div
                key={video.id}
                className={carouselItem({ size: 'videos' })}
                onClick={() => onVideoClick?.(video)}
              >
                <VideoCard {...videoCardProps} />
              </div>
            );
          })}
        {variant === 'comments' &&
          comments?.map((comment) => (
            <div key={comment.id} className={carouselItem()}>
              <CommentCard comment={comment} />
            </div>
          ))}
      </div>
      {variant === 'people' && itemCount > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {Array.from({ length: itemCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                index === activeIndex ? 'bg-[#1B8354]' : 'bg-[#D1D5DB]',
              )}
            />
          ))}
        </div>
      )}
    </Section>
  );
};

export default AdvisoryBoardCarousel;
