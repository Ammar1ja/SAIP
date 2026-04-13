// stories/organisms/VideoPlayer.stories.tsx

import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayerContent } from '@/components/molecules/VideoPlayer/VideoPlayerContent';
import { VideoPlayerMedia } from '@/components/molecules/VideoPlayer/VideoPlayerMedia';
import { VideoPlayerNavigation } from '@/components/molecules/VideoPlayer/VideoPlayerNavigation';
import { VideoPlayerSubtitle } from '@/components/molecules/VideoPlayer/VideoPlayerSubtitle';
import { VideoPlayerTitle } from '@/components/molecules/VideoPlayer/VideoPlayerTitle';

const videoSources = ['/videos/homepage.mp4'];

const meta: Meta = {
  title: 'Molecules/VideoPlayer',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const navigateToSlide = (index: number) => {
      setCurrentIndex(index);
    };

    const togglePlay = () => {
      if (!videoRef.current) return;

      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };

    return (
      <div className="relative h-[600px] w-full overflow-hidden">
        <VideoPlayerMedia
          videoRef={videoRef}
          videoSrc={videoSources[currentIndex]}
          currentIndex={currentIndex}
          onPlay={handlePlay}
          onPause={handlePause}
          onCanPlay={() => {}}
        />

        <VideoPlayerContent>
          <VideoPlayerTitle>Main Title</VideoPlayerTitle>
          <VideoPlayerSubtitle>Description of video</VideoPlayerSubtitle>
        </VideoPlayerContent>

        <VideoPlayerNavigation
          currentIndex={currentIndex}
          totalItems={videoSources.length}
          isPlaying={isPlaying}
          navigateToSlide={navigateToSlide}
          togglePlay={togglePlay}
        />
      </div>
    );
  },
};

export const DefaultRTL: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const navigateToSlide = (index: number) => {
      setCurrentIndex(index);
    };

    const togglePlay = () => {
      if (!videoRef.current) return;

      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };

    return (
      <div className="relative h-[600px] w-full overflow-hidden">
        <VideoPlayerMedia
          videoRef={videoRef}
          videoSrc={videoSources[currentIndex]}
          currentIndex={currentIndex}
          onPlay={handlePlay}
          onPause={handlePause}
          onCanPlay={() => {}}
        />

        <VideoPlayerContent>
          <VideoPlayerTitle>Main Title</VideoPlayerTitle>
          <VideoPlayerSubtitle>Description of video</VideoPlayerSubtitle>
        </VideoPlayerContent>

        <VideoPlayerNavigation
          currentIndex={currentIndex}
          totalItems={videoSources.length}
          isPlaying={isPlaying}
          navigateToSlide={navigateToSlide}
          togglePlay={togglePlay}
        />
      </div>
    );
  },
  parameters: {
    direction: 'rtl',
  },
};

export const Paused: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(true);
    const navigateToSlide = (index: number) => setCurrentIndex(index);

    const togglePlay = () => {
      if (!videoRef.current) return;
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    };

    return (
      <div className="relative h-[600px] w-full overflow-hidden">
        <VideoPlayerMedia
          videoRef={videoRef}
          videoSrc={videoSources[currentIndex]}
          currentIndex={currentIndex}
          onPlay={handlePlay}
          onPause={handlePause}
          onCanPlay={() => {}}
        />
        <VideoPlayerContent>
          <VideoPlayerTitle>Paused Example</VideoPlayerTitle>
          <VideoPlayerSubtitle>Video starts in paused state</VideoPlayerSubtitle>
        </VideoPlayerContent>
        <VideoPlayerNavigation
          currentIndex={currentIndex}
          totalItems={videoSources.length}
          isPlaying={isPlaying}
          navigateToSlide={navigateToSlide}
          togglePlay={togglePlay}
        />
      </div>
    );
  },
};

export const ContentOnly: Story = {
  render: () => (
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-500">
      <VideoPlayerContent>
        <VideoPlayerTitle>Only Content</VideoPlayerTitle>
        <VideoPlayerSubtitle>No video rendered in this story</VideoPlayerSubtitle>
      </VideoPlayerContent>
    </div>
  ),
};
