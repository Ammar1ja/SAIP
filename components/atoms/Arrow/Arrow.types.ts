import { VariantProps } from 'class-variance-authority';
import { arrow } from './Arrow.styles';

/**
 * Arrow direction types
 */
export type ArrowDirection = 'right' | 'left';

/**
 * Arrow background types
 */
export type ArrowBackground =
  | 'primary'
  | 'natural'
  | 'disabled'
  | 'transparent'
  | 'none'
  | 'transparentDisabled';

/**
 * Arrow size types
 */
export type ArrowSize = 'small' | 'medium' | 'smallWide';

/**
 * Arrow shape types
 */
export type ArrowShape = 'round' | 'round_sm' | 'square';

/**
 * Arrow component props
 */
export interface ArrowProps extends VariantProps<typeof arrow> {
  /** Arrow direction */
  direction?: ArrowDirection;
  /** Arrow background style */
  background?: ArrowBackground;
  /** Arrow size */
  size?: ArrowSize;
  /** Arrow shape */
  shape?: ArrowShape;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Aria label */
  ariaLabel?: string;
  /** Render as div instead of button (use when Arrow is inside another button) */
  asChild?: boolean;
}
