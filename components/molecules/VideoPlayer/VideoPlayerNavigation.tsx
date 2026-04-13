'use client';

import { IconPause } from '@/components/molecules/VideoPlayer/IconPause';
import { IconPlay } from '@/components/molecules/VideoPlayer/IconPlay';
import { VideoPlayerPlayToggleButton } from '@/components/molecules/VideoPlayer/VideoPlayerPlayToggleButton';
import Arrow from '@/components/atoms/Arrow';
import { VideoPlayerNavigationProps } from './VideoPlayerNavigation.types';

const VideoDots = ({
  totalItems,
  currentIndex,
  navigateToSlide,
}: Pick<VideoPlayerNavigationProps, 'totalItems' | 'currentIndex' | 'navigateToSlide'>) => (
  <div className="absolute bottom-[56px] left-0 right-0 z-30 mx-auto flex max-w-[800px] justify-center gap-2">
    {Array.from({ length: totalItems }).map((_, index) => (
      <button
        key={index}
        onClick={() => navigateToSlide(index)}
        aria-label={`Move to video ${index + 1}`}
        className="focus:outline-none"
      >
        <div
          className={`h-3 w-3 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'bg-button-background-primary-default'
              : 'bg-white hover:cursor-pointer'
          }`}
        />
      </button>
    ))}
  </div>
);

const VideoControls = ({
  currentIndex,
  totalItems,
  isPlaying,
  navigateToSlide,
  togglePlay,
}: VideoPlayerNavigationProps) => {
  const isPrevDisabled = currentIndex === 0 || totalItems <= 1;
  const isNextDisabled = currentIndex === totalItems - 1 || totalItems <= 1;
  const prevIndex = Math.max(0, currentIndex - 1);
  const nextIndex = Math.min(totalItems - 1, currentIndex + 1);

  return (
    <div className="absolute bottom-8 z-20 w-full px-4">
      <div className="mx-auto flex max-w-screen-xl items-center justify-end gap-2 sm:justify-end sm:pr-8 sm:rtl:pl-8 pr-0">
        <button
          disabled={isPrevDisabled}
          onClick={() => !isPrevDisabled && navigateToSlide(prevIndex)}
          className="hidden sm:block focus:outline-none"
          aria-label="Previous video"
        >
          <Arrow
            direction="left"
            size="small"
            shape="round_sm"
            background={isPrevDisabled ? 'disabled' : 'natural'}
          />
        </button>

        <VideoPlayerPlayToggleButton
          ariaLabel={isPlaying ? 'Pause video' : 'Play video'}
          onClick={togglePlay}
        >
          {isPlaying ? <IconPause color="#161616" /> : <IconPlay color="#161616" />}
        </VideoPlayerPlayToggleButton>

        <button
          disabled={isNextDisabled}
          onClick={() => !isNextDisabled && navigateToSlide(nextIndex)}
          className="hidden sm:block focus:outline-none"
          aria-label="Next video"
        >
          <Arrow
            direction="right"
            size="small"
            shape="round_sm"
            background={isNextDisabled ? 'disabled' : 'natural'}
          />
        </button>
      </div>
    </div>
  );
};

export const VideoPlayerNavigation = (props: VideoPlayerNavigationProps) => {
  return (
    <>
      <VideoDots
        totalItems={props.totalItems}
        currentIndex={props.currentIndex}
        navigateToSlide={props.navigateToSlide}
      />
      <VideoControls {...props} />
    </>
  );
};
