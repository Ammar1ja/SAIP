export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'search' | 'select' | 'date';
  displayAs?: 'default' | 'buttons';
  placeholder?: string;
  options?: FilterOption[];
  multiselect?: boolean;
  disabled?: boolean;
  variant?: 'single' | 'range';
  restrictFutureDates?: boolean;
}

export interface FiltersProps {
  /** Array of filter field configurations */
  fields: FilterField[];
  /** Current values for each filter field */
  values: Record<string, string | string[]>;
  /** Callback fired when any filter value changes */
  onChange?: (fieldId: string, value: string | string[]) => void;
  /** Callback fired when clear filters is clicked */
  onClear?: () => void;
  /** Whether to show the "Hide additional filters" button */
  showHideFilters?: boolean;
  /** Callback fired when hide filters button is clicked */
  onHideFilters?: () => void;
  /** Additional class names */
  className?: string;
  /** Optional className for actions row */
  actionsClassName?: string;
  /** Optional className for clear button */
  clearButtonClassName?: string;
  /** Disable clear filters button */
  isClearDisabled?: boolean;
  /** Number of columns in the filters grid */
  columns?: 1 | 2 | 3 | 4;
  /** Variant style for the filters container */
  variant?: 'default' | 'projects' | 'services' | 'faq' | 'media' | 'ipObservatory' | 'ipAgents';
  /** Number of main fields to show before accordion (for projects variant) */
  mainFieldsCount?: number;
}
