import { ComponentType } from 'react';

/**
 * Icon background types
 */
export type IconBackground = 'none' | 'white' | 'light' | 'dark' | 'green' | 'transparent';

/**
 * Icon size types
 */
export type IconSize = 'small' | 'medium' | 'large';

interface SVGProps {
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  focusable?: boolean | 'true' | 'false';
}

export interface BaseIconProps {
  /** Source URL for image icon */
  src?: string;
  /** React component for SVG icon */
  component?: ComponentType<SVGProps>;
  /** Alternative text for the icon */
  alt?: string;
  /** Background style of the icon */
  background?: IconBackground;
  /** Size of the icon container */
  size?: IconSize;
  /** Size of the SVG icon inside the container (defaults to size if not provided) */
  svgSize?: IconSize;
  /** Additional class names */
  className?: string;
}

/**
 * Props for the static (non-interactive) version of the Icon
 */
export interface StaticIconProps extends BaseIconProps {
  /** Whether the icon should be hidden from screen readers */
  ariaHidden?: boolean;
}

/**
 * Props for the interactive version of the Icon
 */
export interface IconProps extends BaseIconProps {
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the icon should be interactive */
  interactive?: boolean;
  /** ARIA role */
  role?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Whether the icon should be hidden from screen readers */
  ariaHidden?: boolean;
  /** ARIA pressed state */
  ariaPressed?: boolean;
  /** ARIA expanded state */
  ariaExpanded?: boolean;
  /** ID of the element controlled by this icon */
  ariaControls?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}
