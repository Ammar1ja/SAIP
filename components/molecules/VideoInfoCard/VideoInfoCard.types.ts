import { ReactNode } from 'react';

export interface VideoInfoCardProps {
  videoSrc: string;
  poster?: string;
  title?: string;
  description?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}
