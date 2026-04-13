export type InlineAlertVariant = 'default' | 'info' | 'error' | 'warning' | 'success';
export type InlineAlertRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Simplified button props for Server Component compatibility (no onClick, no HTMLAttributes)
export type AlertButtonProps = {
  /** Accessible label for the button */
  ariaLabel: string;
  /** Button content */
  children: React.ReactNode;
  /** The URL to navigate to */
  href?: string;
  /** Target for anchor links */
  target?: string;
  /** Rel for anchor links */
  rel?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether to trigger download */
  download?: boolean | string;
  /** Button intent */
  intent?: 'primary' | 'secondary' | 'neutral' | 'transparent' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button should take full width */
  fullWidth?: boolean;
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
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Special action type - if 'back', will use browser history.back() */
  action?: 'back';
};

export type InlineAlertContent = {
  /** Main text heading of the alert */
  title?: string;
  /** Optional description `ReactNode` providing additional context for the alert */
  description?: React.ReactNode;
  /** Stores basic alert actions */
  actions?: {
    /** Main action button props (Server Component compatible - no onClick) */
    primary?: AlertButtonProps;
    /** Secondary action button props (Server Component compatible - no onClick) */
    secondary?: AlertButtonProps;
  };
  /** Additional `ReactNode` elements rendered below action buttons */
  additionalActions?: React.ReactNode;
  /** Custom children content */
  children?: React.ReactNode;
};

export type InlineAlertProps = {
  /** Content of the alert, including title, optional description, and action buttons */
  alertContent?: InlineAlertContent;
  /** Visual variant of the alert, controlling colors, icon, and overall appearance (e.g. "default", "info", "error", "warning", "success") */
  variant?: InlineAlertVariant;
  /** Determines whether the alert should be displayed in an emphasized style, featuring a colorful background, title and border based on provided `variant` prop */
  emphasized?: boolean;
  /** Determines whether the alert container should be bordered */
  bordered?: boolean;
  /** Determines border raduis of the alert container (e.g. "none", "sm", "md", "lg", "xl") */
  radius?: InlineAlertRadius;
  /** Determines whether the alert container should have a shadow */
  shadow?: boolean;
  /** Uncontrolled: sets the initial open state of the alert */
  defaultOpen?: boolean;
  /** Controlled: controls the open state of the alert */
  isOpen?: boolean;
  /** Called when the alert close button is clicked */
  onClose?: () => void;
  /** Sets `role` for the alert container */
  role?: string;
  /** Sets `aria-labelledby` on the alert container to associate it with the title */
  ariaLabelledby?: string;
  /** Sets `aria-describedby` on the alert container to associate it with the description */
  ariaDescribedby?: string;
  /** Additional CSS alert container classes */
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;
