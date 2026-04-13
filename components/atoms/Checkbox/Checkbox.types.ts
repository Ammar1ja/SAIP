import { InputHTMLAttributes } from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> {
  id: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}
