'use client';

import { twMerge } from 'tailwind-merge';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export interface VideoCardProps {
  id: string | number;
  title: string;
  publishDate: string;
  thumbnail: string;
  categories?: Array<{ id: string; name: string }>;
  labels?: string[];
  href?: string;
  logoSrc?: string;
  videoUrl?: string;
  videoType?: 'local' | 'remote';
  variant?: 'default' | 'featured';
  className?: string;
  onClick?: () => void;
}

export const VideoCard = ({
  title,
  publishDate,
  thumbnail,
  categories = [],
  labels = [],
  href,
  logoSrc,
  videoUrl,
  videoType = 'local',
  variant = 'default',
  className,
  onClick,
}: VideoCardProps) => {
  const tLabels = useTranslations('common.labels');
  const resolvedLabels = labels.length > 0 ? labels : categories.map((category) => category.name);
  const logo = logoSrc || '/images/saip-logo-mark-png.png';
  const hasInlineVideo = variant === 'featured' && Boolean(videoUrl) && videoType === 'local';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolume = () => setIsMuted(videoEl.muted);
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('volumechange', handleVolume);
    return () => {
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('volumechange', handleVolume);
    };
  }, []);

  const handleControlClick = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    if (!hasInlineVideo) return;
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const handlePlayPause = (event: MouseEvent<HTMLButtonElement>) => {
    handleControlClick(event, () => {
      const videoEl = videoRef.current;
      if (!videoEl) return;
      if (videoEl.paused) {
        void videoEl.play();
      } else {
        videoEl.pause();
      }
    });
  };

  const handleVolumeToggle = (event: MouseEvent<HTMLButtonElement>) => {
    handleControlClick(event, () => {
      const videoEl = videoRef.current;
      if (!videoEl) return;
      videoEl.muted = !videoEl.muted;
      setIsMuted(videoEl.muted);
    });
  };

  const handleFullscreen = (event: MouseEvent<HTMLButtonElement>) => {
    handleControlClick(event, () => {
      const videoEl = videoRef.current;
      if (!videoEl) return;
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else {
        void videoEl.requestFullscreen();
      }
    });
  };

  const renderTags = (size: 'default' | 'featured' = 'default') =>
    resolvedLabels.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {resolvedLabels.map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            className={twMerge(
              'h-6 px-2 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-800 flex items-center',
              size === 'featured' && 'text-neutral-700',
            )}
          >
            {label}
          </span>
        ))}
      </div>
    );

  const content =
    variant === 'featured' ? (
      <>
        <div className="relative flex-1 min-w-0">
          <div className="relative h-[325px] lg:h-[325px] rounded-t-lg overflow-hidden">
            {hasInlineVideo ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={thumbnail || '/images/photo-container.png'}
                preload="metadata"
                muted
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={thumbnail || '/images/photo-container.png'}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute top-3 left-3 bg-white rounded h-12 w-12 flex items-center justify-center">
              <img src={logo} alt="" className="h-8 w-8" />
            </div>
          </div>
          <div className="bg-neutral-200 h-14 flex items-center justify-between px-4 rounded-b-lg">
            <div className="flex items-center gap-3 text-neutral-700">
              <button
                type="button"
                className="p-1 rounded hover:bg-white/60 transition-colors"
                onClick={handleVolumeToggle}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-white/60 transition-colors"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <button
              type="button"
              className="p-1 rounded hover:bg-white/60 transition-colors"
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="bg-[#F7FDF9] rounded-lg p-4 flex flex-col justify-end gap-4 w-full lg:w-[302px]">
          <div className="space-y-2">
            <h3 className="font-medium text-[18px] leading-[28px] text-neutral-900 line-clamp-2">
              {title}
            </h3>
            {renderTags('featured')}
          </div>
          {publishDate && (
            <div className="text-sm text-neutral-500">
              {tLabels('publicationDate')}: {publishDate}
            </div>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="relative h-[250px] rounded-lg overflow-hidden p-2 bg-transparent">
          <div className="absolute inset-2 rounded-lg overflow-hidden">
            <img
              src={thumbnail || '/images/photo-container.png'}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[rgba(7,148,85,0.2)]" aria-hidden="true" />
          </div>
          <div className="absolute top-2 left-2 bg-white rounded h-12 w-12 flex items-center justify-center">
            <img src={logo} alt="" className="h-8 w-8" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-neutral-100 rounded h-10 w-10 flex items-center justify-center shadow-sm">
              <Play className="w-5 h-5 text-neutral-900" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-[18px] leading-[28px] text-neutral-900 line-clamp-2">
            {title}
          </h3>
          {publishDate && (
            <div className="text-sm text-neutral-500">
              {tLabels('publicationDate')}: {publishDate}
            </div>
          )}
          {renderTags()}
        </div>
      </>
    );

  const wrapperClass = twMerge(
    variant === 'featured'
      ? 'bg-white rounded-2xl border border-neutral-200 overflow-hidden w-full flex flex-col lg:flex-row gap-4 p-6'
      : 'bg-white rounded-2xl border border-neutral-200 overflow-hidden w-full p-6 flex flex-col gap-4 h-[410px]',
    onClick && 'cursor-pointer',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={wrapperClass}>
      {content}
    </div>
  );
};
