export interface VideoPlayerNavigationProps {
  currentIndex: number;
  totalItems: number;
  isPlaying: boolean;
  navigateToSlide: (index: number) => void;
  togglePlay: () => void;
}
