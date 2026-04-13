export interface SelectOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface SelectProps {
  /** Label text displayed above the select */
  label?: string;
  /** Array of options to display in the select */
  options: SelectOption[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Callback fired when selection changes */
  onChange?: (value: string | string[]) => void;
  /** HTML id attribute */
  id?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the select dropdown is open */
  isOpen?: boolean;
  /** Callback fired when the select is opened or closed */
  onOpenChange?: (isOpen: boolean) => void;
  /** Whether to allow multiple selection */
  multiselect?: boolean;
  /** Label for "Select" placeholder */
  selectLabel?: string;
  /** Label for "All" option in multiselect */
  allLabel?: string;
  /** Label for count of selected items in multiselect */
  selectedLabel?: string;
  /** Message to display when no options are available */
  noOptionsMessage?: string;
}
