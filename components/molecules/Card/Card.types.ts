import React from 'react';
import { ReactNode } from 'react';

/**
 * Card component variant types
 */
export type CardVariant = 'blurred' | 'mission' | 'news' | 'default' | 'pillar' | 'value' | 'wide';

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show shadow */
  shadow?: boolean;
  /** Card variant */
  variant?: CardVariant;
  /** Whether to show border */
  border?: boolean;
  /** Whether the card is interactive */
  interactive?: boolean;
  /** ARIA role override */
  role?: string;
  /** Accessible label for the card */
  ariaLabel?: string;
  /** ID of the element that labels the card */
  ariaLabelledby?: string;
  /** Tab index override */
  tabIndex?: number;
}
