'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface VideoPlayerProps {
  videoSrc: string;
  title: string;
  description: string;
  currentIndex: number;
  totalItems: number;
}

export function useVideoPlayer({
  videoSrc,
  currentIndex,
}: Pick<VideoPlayerProps, 'videoSrc' | 'currentIndex'>) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const navigateToSlide = (index: number) => {
    router.push(`?heroVideoIndex=${index}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc?.trim()) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'metadata';

      const playVideo = async (attempt = 0) => {
        try {
          await video.play();
          setIsPlaying(true);
        } catch (err: any) {
          // Unsupported/empty source is a data issue, avoid noisy console spam in runtime.
          if (err?.name === 'NotSupportedError') {
            setIsPlaying(false);
            return;
          }
          if (attempt < 2) {
            // Mobile browsers may reject early autoplay while media is still buffering.
            window.setTimeout(
              () => {
                void playVideo(attempt + 1);
              },
              400 * (attempt + 1),
            );
            return;
          }
          console.error('Cannot play video:', err);
          setIsPlaying(false);
        }
      };

      void playVideo();
    }
  }, [videoSrc, currentIndex]);

  const handleCanPlay = () => {
    if (!videoRef.current || !videoSrc?.trim()) return;
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error('Błąd odtwarzania:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  return {
    videoRef,
    isPlaying,
    navigateToSlide,
    togglePlay,
    handlePlay,
    handlePause,
    handleCanPlay,
  };
}
