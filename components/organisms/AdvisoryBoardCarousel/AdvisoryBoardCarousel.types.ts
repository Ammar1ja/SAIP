import { PersonCardProps } from '@/components/molecules/PersonCard/PersonCard.types';
import { VideoCardProps } from '@/components/molecules/VideoCard';

export interface VideoForClick extends VideoCardProps {
  section: 'latest' | 'events';
  videoUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  publicationDate: string;
  content: string;
}

export interface AdvisoryBoardCarouselProps {
  heading: string;
  description?: string;
  description2?: string;
  people?: PersonCardProps[];
  videos?: VideoForClick[];
  comments?: Comment[];
  variant?: 'people' | 'videos' | 'comments';
  className?: string;
  onVideoClick?: (video: VideoForClick) => void;
}
