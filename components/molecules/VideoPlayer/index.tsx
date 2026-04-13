'use client';
import { VideoPlayerSubtitle } from '@/components/molecules/VideoPlayer/VideoPlayerSubtitle';
import { VideoPlayerTitle } from '@/components/molecules/VideoPlayer/VideoPlayerTitle';
import { useVideoPlayer, VideoPlayerProps } from './useVideoPlayer';
import { VideoPlayerContent } from './VideoPlayerContent';
import { VideoPlayerMedia } from './VideoPlayerMedia';
import { VideoPlayerNavigation } from './VideoPlayerNavigation';

export const VideoPlayer = ({
  videoSrc,
  title,
  description,
  currentIndex,
  totalItems,
}: VideoPlayerProps) => {
  const {
    videoRef,
    isPlaying,
    navigateToSlide,
    togglePlay,
    handlePlay,
    handlePause,
    handleCanPlay,
  } = useVideoPlayer({
    videoSrc,
    currentIndex,
  });

  return (
    <>
      <VideoPlayerMedia
        videoRef={videoRef}
        videoSrc={videoSrc}
        currentIndex={currentIndex}
        onPlay={handlePlay}
        onPause={handlePause}
        onCanPlay={handleCanPlay}
      />

      <VideoPlayerContent>
        <VideoPlayerTitle>{title}</VideoPlayerTitle>
        <VideoPlayerSubtitle>{description}</VideoPlayerSubtitle>
      </VideoPlayerContent>

      <VideoPlayerNavigation
        currentIndex={currentIndex}
        totalItems={totalItems}
        isPlaying={isPlaying}
        navigateToSlide={navigateToSlide}
        togglePlay={togglePlay}
      />
    </>
  );
};
