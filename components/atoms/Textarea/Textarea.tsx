import { forwardRef } from 'react';
import { TextareaProps } from './Textarea.types';
import { textareaContainer, textareaField, textareaLabel, textareaHelper } from './Textarea.styles';
import { twMerge } from 'tailwind-merge';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { id, label, value, onChange, placeholder, required = false, className, helperText, ...props },
    ref,
  ) => {
    const renderLabel = () => {
      if (!label) return null;
      // If label starts with *, make it red
      if (label.startsWith('*')) {
        return (
          <label htmlFor={id} className={textareaLabel()}>
            <span className="shrink-0 text-red-500 me-[4px]">*</span>
            {label.slice(1).trim()}
          </label>
        );
      }
      return (
        <label htmlFor={id} className={textareaLabel()}>
          {required && <span className="shrink-0 text-red-500 me-[4px]">*</span>}
          {label}
        </label>
      );
    };

    return (
      <div className={textareaContainer()}>
        {renderLabel()}
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={twMerge(textareaField(), className)}
          rows={4}
          {...props}
        />
        {helperText && <p className={textareaHelper()}>{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
