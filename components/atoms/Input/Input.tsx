import { forwardRef } from 'react';
import { InputProps } from './Input.types';
import { inputContainer, inputField, inputLabel } from './Input.styles';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      placeholder,
      type = 'text',
      required = false,
      className,
      ...props
    },
    ref,
  ) => {
    const renderLabel = () => {
      if (!label) return null;
      // If label starts with *, make it red
      if (label.startsWith('*')) {
        return (
          <label htmlFor={id} className={inputLabel()}>
            <span className="shrink-0 text-red-500 me-[4px]">*</span>
            {label.slice(1).trim()}
          </label>
        );
      }
      return (
        <label htmlFor={id} className={inputLabel()}>
          {required && <span className="shrink-0 text-red-500 me-[4px]">*</span>}
          {label}
        </label>
      );
    };

    return (
      <div className={inputContainer()}>
        {renderLabel()}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={twMerge(inputField(), className)}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
