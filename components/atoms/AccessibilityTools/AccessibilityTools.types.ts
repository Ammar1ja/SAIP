import { ReactNode } from 'react';

/**
 * AccessibilityTools component props
 */
export interface AccessibilityToolsProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * AccessibilityButton component props
 */
export interface AccessibilityButtonProps {
  /** Button label */
  label: string;
  /** Button icon source */
  iconSrc: string;
  /** Button icon alt text */
  iconAlt: string;
  /** Button click handler */
  onClick: () => void;
  /** Additional CSS classes */
  className?: string;
}
