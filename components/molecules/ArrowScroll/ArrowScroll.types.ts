export type ArrowScrollProps = {
  intent?: 'primary' | 'secondary';
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  disabledLeft?: boolean;
  disabledRight?: boolean;
  className?: string;
};
