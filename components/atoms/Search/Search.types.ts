import { InputHTMLAttributes } from 'react';

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** Additional CSS classes */
  className?: string;
  /** Label text displayed above the search input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Search value */
  value?: string;
  /** On value change handler */
  onChange?: (value: string) => void;
  /** On search submit handler */
  onSearch?: (value: string) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** ARIA label for the search input */
  ariaLabel?: string;
}
