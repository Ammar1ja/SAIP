export interface VideoData {
  videoSrc: string;
  videoPoster: string;
  description: string;
}

export interface GuideData {
  guideTitle: string;
  guideCards: any[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface InformationLibrarySectionProps {
  title?: string;
  video: VideoData;
  guide: GuideData;
  guideMaxCards?: number;
  guideMobileVariant?: 'carousel' | 'single';
  guideMobileMaxCards?: number;
}
