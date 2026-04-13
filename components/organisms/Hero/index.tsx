import { cva, type VariantProps } from 'class-variance-authority';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { VideoPlayer } from '@/components/molecules/VideoPlayer';
import { allVideos, type VideoCmsProps } from '@/lib/dummyCms/allVideos';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
const VIDEO_IDS = ['1', '2', '3'];
const getVideos = async (): Promise<string[]> => VIDEO_IDS;
const getVideo = async (id: string): Promise<VideoCmsProps | undefined> =>
  allVideos.find((video) => video.id === id);

const hero = cva(
  ['w-full', 'min-w-0', 'h-[calc(100vh-72px)]', 'max-h-[528px]', 'relative', 'overflow-hidden'],
  {
    variants: {
      overlay: {
        true: 'after:absolute after:inset-0 after:bg-[rgba(9,42,30,0.80)] after:z-[1]',
        false: '',
      },
    },
    defaultVariants: {
      overlay: true,
    },
  },
);

export interface HeroProps extends VariantProps<typeof hero> {
  currentIndex?: number;
  className?: string;
  mode?: 'video' | 'static';
  title?: string;
  description?: string;
  backgroundImage?: string;
  videos?: Array<{ id: string; url: string; title?: string }>;
}

export const Hero = async ({
  currentIndex = 0,
  className,
  overlay,
  mode = 'video',
  title,
  description,
  backgroundImage,
  videos,
}: HeroProps) => {
  if (mode === 'video') {
    // If videos are provided from Drupal, use them
    if (videos && videos.length > 0) {
      if (currentIndex < 0 || currentIndex >= videos.length) {
        // Use first video as fallback
        currentIndex = 0;
      }

      const video = videos[currentIndex];

      if (!video) {
        return <div className="p-4 text-center">Video not found</div>;
      }

      return (
        <div className={twMerge(hero({ overlay, className }))}>
          <VideoPlayer
            totalItems={videos.length}
            currentIndex={currentIndex}
            videoSrc={video.url}
            title={video.title || title || ''}
            description={description || ''}
          />
        </div>
      );
    }

    // Fallback to local videos if no Drupal videos
    const videosIds = await getVideos();

    if (currentIndex < 0 || currentIndex >= videosIds.length) {
      notFound();
    }

    const videoId = videosIds[currentIndex]!;
    const video = await getVideo(videoId);

    if (!video) {
      return <div className="p-4 text-center">Video not found</div>;
    }

    return (
      <div className={twMerge(hero({ overlay, className }))}>
        <VideoPlayer
          totalItems={videosIds.length}
          currentIndex={currentIndex}
          videoSrc={video?.src ?? ''}
          title={title || video?.title || ''}
          description={description || video?.description || ''}
        />
      </div>
    );
  }

  return (
    <div
      className={twMerge(hero({ overlay, className }), 'px-4')}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LayoutWrapper className="relative z-10 flex h-full items-center">
        <div className="w-full max-w-screen-xl px-4 mx-auto">
          <h1 className="tracking-display-tight max-w-[945px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white text-center sm:ltr:text-left sm:rtl:text-right">
            {title}
          </h1>
          <p className="max-w-[720px] mt-4 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] text-white/90 text-center sm:ltr:text-start sm:rtl:text-end">
            {description}
          </p>
        </div>
      </LayoutWrapper>
    </div>
  );
};
