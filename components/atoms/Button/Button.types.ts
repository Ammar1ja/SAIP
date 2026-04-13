import React from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  outline?: boolean;
  /** Whether to show underline on hover */
  underline?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Accessible label for the button */
  ariaLabel: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** The URL to navigate to */
  href?: string;
  /** Target for anchor links */
  target?: string;
  /** Rel for anchor links */
  rel?: string;
  /** Whether to trigger download (renders as <a> instead of Next.js Link) */
  download?: boolean | string;
  /** Button intent */

  intent?: 'primary' | 'secondary' | 'neutral' | 'transparent' | 'outline';

  /** Button size (`mdWide` = 40px height + lg horizontal padding/gap — Figma primary “hug”) */
  size?: 'sm' | 'md' | 'lg' | 'mdWide';
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA role */
  role?: string;
  /** ARIA expanded state */
  ariaExpanded?: boolean;
  /** ARIA controls */
  ariaControls?: string;
  /** ARIA pressed state */
  ariaPressed?: boolean;
  /** ARIA describedby */
  ariaDescribedby?: string;
  loading?: boolean;
}

/** Button component variant types */
export type ButtonVariant = 'primary' | 'secondary';

/** Button component size types */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'mdWide';
