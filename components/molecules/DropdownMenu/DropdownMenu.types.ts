import { IconProps } from '@/components/atoms/Icon';

/**
 * DropdownMenu item interface
 */
export interface DropdownMenuItem {
  /** Link URL */
  href: string;
  /** Link label */
  label: string;
  /** Item group (for multi-column layout) */
  group?: string;
  /** Item locale */
  locale?: string;
  /** Item icon */
  icon?: IconProps;
  /** Item description */
  description?: string;
  /** Item is disabled */
  disabled?: boolean;
}

/**
 * DropdownMenu component props
 */
export interface DropdownMenuProps {
  /** Menu label */
  label: string;
  /** Menu items */
  items: DropdownMenuItem[];
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for the menu */
  ariaLabel?: string;
  /** ARIA described by */
  ariaDescribedby?: string;
  /** Role of the menu */
  role?: string;
  /** ID of the menu */
  id?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** On open change handler */
  onOpenChange?: (isOpen: boolean) => void;
  /** On item select handler */
  onItemSelect?: (item: DropdownMenuItem) => void;
}

/**
 * DropdownMenu variant types
 */
export type DropdownMenuVariant = 'default' | 'multiColumn' | 'compact' | 'fullWidth';
