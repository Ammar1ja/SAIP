import { ReactNode, HTMLAttributes, MouseEvent, KeyboardEvent } from 'react';
import { VariantProps } from 'class-variance-authority';
import { cardContent } from './CardContent.styles';

/**
 * CardContent variant types - matches the variants defined in styles
 */
export type CardContentVariant = 'default' | 'compact' | 'bordered' | 'elevated' | 'project';

/**
 * CardContent size types
 */
export type CardContentSize = 'sm' | 'md' | 'lg';

/**
 * Title size types
 */
export type TitleSize = 'sm' | 'md' | 'lg';

/**
 * Grid item type for project variant
 */
export interface GridItem {
  id: string;
  content: ReactNode;
  ariaLabel?: string;
}

/**
 * CardContent component props
 */
export interface CardContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContent> {
  /** The content to be rendered inside the card */
  children?: ReactNode;
  /** Additional class names to be applied to the card */
  className?: string;
  /** Additional class names to be applied to the title */
  titleClassName?: string;
  /** Additional class names to be applied to the description */
  descriptionClassName?: string;
  /** Additional class names to be applied to the icon */
  iconClassName?: string;
  /** The variant of the card content */
  variant?: CardContentVariant;
  /** The size of the card content */
  size?: CardContentSize;
  /** The size of the title */
  titleSize?: TitleSize;
  /** Content to be rendered in the header section (for project variant) */
  headerContent?: ReactNode;
  /** Content to be rendered in the grid section (for project variant) */
  gridContent?: GridItem[];
  /** Optional title for the card */
  title?: string;
  /** Optional description for the card */
  description?: string;
  /** Optional icon to display in the card */
  icon?: ReactNode;
  /** Whether the card is interactive */
  interactive?: boolean;
  /** Optional click handler */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Optional ARIA label for accessibility */
  ariaLabel?: string;
  /** Optional ARIA description for accessibility */
  ariaDescription?: string;
  /** Optional test ID for testing */
  testId?: string;
  /** Role for accessibility */
  role?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}
