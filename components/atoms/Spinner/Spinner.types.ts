export interface SpinnerProps {
  /** Size of the spinner in pixels */
  size?: number;
  /** Tailwind color class */
  colorClass?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA role attribute */
  role?: string;
  /** ARIA live region behavior */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** Whether to hide from screen readers */
  ariaHidden?: boolean;
}
