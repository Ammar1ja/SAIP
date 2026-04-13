import { forwardRef } from 'react';
import { CheckboxProps } from './Checkbox.types';
import { checkboxContainer, checkboxField, checkboxLabel } from './Checkbox.styles';
import { twMerge } from 'tailwind-merge';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, checked, onChange, required = false, className, ...props }, ref) => {
    return (
      <div className={checkboxContainer()}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={twMerge(checkboxField(), className)}
          {...props}
        />
        {label && (
          <label htmlFor={id} className={checkboxLabel()}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
