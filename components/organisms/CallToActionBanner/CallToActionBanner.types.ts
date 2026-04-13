export interface CallToActionBannerProps {
  title: string;
  buttonLabel: string;
  buttonHref?: string;
  buttonOnClick?: () => void;
  className?: string;
}
