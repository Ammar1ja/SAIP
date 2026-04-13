'use client';

import { useEffect, useRef, useState } from 'react';
import ArrowScroll from '@/components/molecules/ArrowScroll';
import { VideoCard, VideoCardProps } from '@/components/molecules/VideoCard';
import { useDirection } from '@/context/DirectionContext';
import { cn } from '@/lib/utils/cn';

const CARD_WIDTH = 464;

export interface VideoCarouselProps {
  heading: string;
  videos: VideoCardProps[];
  emptyLabel?: string;
  className?: string;
  onVideoClick?: (video: VideoCardProps) => void;
}

const VideoCarousel = ({
  heading,
  videos,
  emptyLabel = 'No items found.',
  className,
  onVideoClick,
}: VideoCarouselProps) => {
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
    let distance = CARD_WIDTH;

    if ((scrollDirection === 'left' && !isRtl) || (scrollDirection === 'right' && isRtl)) {
      distance = -distance;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
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
  }, []);

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex items-center justify-between gap-6">
        <h3 className="text-[30px] leading-[38px] font-medium text-neutral-900">{heading}</h3>
        {videos.length > 0 && (
          <div className="hidden md:flex flex-shrink-0">
            <ArrowScroll
              onScrollLeft={() => scroll('left')}
              onScrollRight={() => scroll('right')}
              disabledLeft={!canScrollLeft}
              disabledRight={!canScrollRight}
            />
          </div>
        )}
      </div>
      {videos.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-2 scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300"
          tabIndex={0}
          aria-label={heading}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="shrink-0 snap-start w-[464px] max-w-[90vw]"
              onClick={() => onVideoClick?.(video)}
            >
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">{emptyLabel}</div>
      )}
    </div>
  );
};

export default VideoCarousel;
