'use client';

import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Video } from '../data/videos.data';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function VideoPlayer({ video, isOpen, onClose, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  return (
    <div
      className={twMerge(
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90',
        className,
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full max-w-4xl mx-4">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[80vh]"
            poster={video.thumbnail}
            controls={false}
            preload="metadata"
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div
              ref={progressRef}
              className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div className="h-full bg-white rounded-full w-0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                  aria-label="Play/Pause"
                >
                  <Play className="w-6 h-6" />
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={handleVolumeToggle}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                  aria-label="Toggle volume"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Video info */}
                <div className="text-white text-sm">
                  <div className="font-medium">{video.title}</div>
                  <div className="text-gray-300">Published: {video.publishData}</div>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex  gap-2">
          {video.categories.map((category) => (
            <span
              key={category.id}
              className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
