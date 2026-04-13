export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
}
