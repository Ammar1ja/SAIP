'use client';

import React, { useRef, useState } from 'react';
import { VideoInfoCardProps } from './VideoInfoCard.types';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/atoms/Button/Button';
import Heading from '@/components/atoms/Heading';
import { IconPlay } from '@/components/molecules/VideoPlayer/IconPlay';
import { IconPause } from '@/components/molecules/VideoPlayer/IconPause';
const VideoInfoCard: React.FC<VideoInfoCardProps> = ({
  videoSrc,
  poster,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={twMerge(
        'flex flex-col md:flex-row gap-6 bg-transparent md:bg-neutral-50 rounded-2xl md:rounded-[24px] p-0 md:p-12 items-center',
        className,
      )}
    >
      <div
        className="group relative w-full md:min-w-0 md:w-[420px] md:h-[320px] lg:w-[560px] lg:h-[360px] xl:w-[737px] xl:h-[416px] h-[240px] rounded-2xl overflow-hidden cursor-pointer order-2 md:order-1"
        onClick={handleTogglePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTogglePlay();
          }
        }}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 rounded-2xl w-full h-full object-cover"
            src={videoSrc}
            poster={poster}
            preload="metadata"
            muted
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            aria-label={title || 'Video'}
          />
        ) : poster ? (
          <img
            src={poster}
            alt={title || 'Video thumbnail'}
            className="absolute inset-0 rounded-2xl w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 rounded-2xl bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500">No video available</span>
          </div>
        )}
        {(videoSrc || poster) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleTogglePlay();
              }}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-neutral-100 shadow-sm opacity-100 cursor-pointer"
            >
              {isPlaying ? <IconPause color="#161616" /> : <IconPlay color="#161616" />}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center h-full order-1 md:order-2">
        {title && (
          <Heading
            as="h3"
            size="custom"
            weight="medium"
            color="default"
            className={twMerge(
              'max-w-[423px] break-words text-[30px] leading-[38px] tracking-[-0.02em] sm:text-[36px] sm:leading-[44px]',
              ctaLabel && ctaHref ? 'mb-9' : 'mb-4',
            )}
          >
            {title}
          </Heading>
        )}
        {description && (
          <div className="text-[18px] leading-[28px] text-neutral-900 mb-6">{description}</div>
        )}
        {ctaLabel && ctaHref && (
          <Button
            href={ctaHref}
            intent="primary"
            size="md"
            ariaLabel={ctaLabel}
            className="max-w-fit"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoInfoCard;
