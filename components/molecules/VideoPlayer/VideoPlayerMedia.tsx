'use client';

import { RefObject } from 'react';

interface VideoPlayerMediaProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  currentIndex: number;
  onPlay: () => void;
  onPause: () => void;
  onCanPlay: () => void;
}

export const VideoPlayerMedia = ({
  videoRef,
  videoSrc,
  currentIndex,
  onPlay,
  onPause,
  onCanPlay,
}: VideoPlayerMediaProps) => {
  if (!videoSrc || !videoSrc.trim()) return null;

  return (
    <video
      ref={videoRef}
      preload="metadata"
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      src={videoSrc}
      key={`video-${currentIndex}`}
      onPlay={onPlay}
      onPause={onPause}
      onCanPlay={onCanPlay}
    />
  );
};
