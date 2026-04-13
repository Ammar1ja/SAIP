export interface PhotoContainerProps {
  image: {
    src: string;
    alt: string;
  };
  title?: string;
  description?: React.ReactNode;
  className?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
}
