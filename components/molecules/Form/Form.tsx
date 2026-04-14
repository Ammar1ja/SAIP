'use client';

import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Checkbox } from '@/components/atoms/Checkbox';
import { FormProps, FormField } from './Form.types';
import { formContainer, formGrid, formActions, formPhoneInputWrapper } from './Form.styles';
import { useTranslations } from 'next-intl';
import { ChevronIcon } from '@/components/icons';
import { CircleInfoOutlineIcon } from '@/components/icons/services';
import { useDirection } from '@/context/DirectionContext';

export const Form = ({
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel = 'Submit',
  submitIntent = 'primary',
  className,
  columns = 1,
}: FormProps) => {
  const t = useTranslations('common.form');
  const dir = useDirection();
  const isRtl = dir === 'rtl';
  const handleChange = (fieldId: string) => (value: string | boolean | string[]) => {
    onChange(fieldId, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const gridColumns = columns || fields.length;

  return (
    <form onSubmit={handleSubmit} className={twMerge(formContainer(), className)}>
      <p className="text-sm text-gray-600">{t('requiredFields')}</p>

      <div className={formGrid({ columns: gridColumns as 1 | 2 | 3 | 4 })}>
        {fields.map((field) => {
          const value = values[field.id] ?? (field.type === 'checkbox' ? false : '');

          if (field.type === 'text' || field.type === 'email') {
            return (
              <Input
                key={field.id}
                id={field.id}
                label={field.label}
                value={value as string}
                onChange={handleChange(field.id)}
                placeholder={field.placeholder}
                type={field.type}
                required={field.required}
                className={field.className}
              />
            );
          }

          if (field.type === 'tel') {
            if (field.options && field.options.length > 0) {
              const phoneValue = (value as string) || '';
              const defaultPrefix = field.options[0]?.value || '';

              let prefix = defaultPrefix;
              let number = '';

              if (phoneValue) {
                if (phoneValue.includes(' ')) {
                  const parts = phoneValue.split(' ');
                  const potentialPrefix = parts[0];
                  const isValidPrefix = field.options.some((opt) => opt.value === potentialPrefix);
                  if (isValidPrefix) {
                    prefix = potentialPrefix;
                    number = parts.slice(1).join(' ');
                  } else {
                    prefix = defaultPrefix;
                    number = phoneValue;
                  }
                } else {
                  const foundPrefix = field.options.find((opt) => phoneValue.startsWith(opt.value));
                  if (foundPrefix) {
                    prefix = foundPrefix.value;
                    number = phoneValue.substring(foundPrefix.value.length).trim();
                  } else {
                    prefix = defaultPrefix;
                    number = phoneValue;
                  }
                }
              }

              const handlePrefixChange = (newPrefix: string | string[]) => {
                const prefixValue = Array.isArray(newPrefix) ? newPrefix[0] : newPrefix;
                if (prefixValue) {
                  const newValue = number ? `${prefixValue} ${number}`.trim() : prefixValue;
                  onChange(field.id, newValue);
                }
              };

              const handleNumberChange = (newNumber: string) => {
                const currentPrefix = prefix || defaultPrefix;
                const newValue = newNumber ? `${currentPrefix} ${newNumber}`.trim() : currentPrefix;
                onChange(field.id, newValue);
              };

              const [isPrefixOpen, setIsPrefixOpen] = useState(false);
              const prefixDropdownRef = useRef<HTMLDivElement>(null);

              useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                  if (
                    prefixDropdownRef.current &&
                    !prefixDropdownRef.current.contains(event.target as Node)
                  ) {
                    setIsPrefixOpen(false);
                  }
                };

                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
              }, []);

              const selectedOption =
                field.options.find((opt) => opt.value === prefix) || field.options[0];

              return (
                <div key={field.id} className="flex flex-col space-y-2">
                  {field.label && (
                    <label
                      htmlFor={`${field.id}-number`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label.startsWith('*') ? (
                        <>
                          <span className="shrink-0 text-red-500 me-[4px]">*</span>
                          {field.label.slice(1).trim()}
                        </>
                      ) : (
                        <>
                          {field.required && (
                            <span className="shrink-0 text-red-500 me-[4px]">*</span>
                          )}
                          {field.label}
                        </>
                      )}
                    </label>
                  )}
                  <div
                    className={twMerge(
                      formPhoneInputWrapper(),
                      field.className,
                      'overflow-visible',
                    )}
                  >
                    <div className="relative flex-shrink-0  self-stretch" ref={prefixDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsPrefixOpen(!isPrefixOpen)}
                        className="flex justify-center items-center gap-1 py-0.5 px-4 rounded-none bg-[#F3F4F6] border-none shadow-none h-full w-full min-w-[100px] pl-4 pr-4 relative"
                      >
                        <span className="text-center flex-1 truncate">{selectedOption?.label}</span>
                        <ChevronIcon
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isPrefixOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isPrefixOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded shadow-lg border border-gray-200 py-2 max-h-72 overflow-auto">
                          {field.options.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handlePrefixChange(option.value);
                                setIsPrefixOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={twMerge('flex-1 border-gray-300', isRtl ? 'border-r' : 'border-l')}
                    >
                      <input
                        id={`${field.id}-number`}
                        value={number}
                        onChange={(e) => handleNumberChange(e.target.value)}
                        placeholder={field.placeholder}
                        type="tel"
                        dir="auto"
                        className={twMerge(
                          'w-full px-4 py-2 outline-none border-none placeholder-gray-400 h-full',
                          isRtl && 'text-right',
                        )}
                        required={field.required}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Input
                key={field.id}
                id={field.id}
                label={field.label}
                value={value as string}
                onChange={handleChange(field.id)}
                placeholder={field.placeholder}
                type={field.type}
                required={field.required}
                className={field.className}
              />
            );
          }

          if (field.type === 'select') {
            return (
              <Select
                key={field.id}
                id={field.id}
                label={field.label}
                value={value as string}
                onChange={handleChange(field.id)}
                placeholder={field.placeholder}
                options={field.options || []}
                required={field.required}
                className={field.className}
              />
            );
          }

          if (field.type === 'textarea') {
            const showHelperIcon =
              (field.id === 'requestDetails' || field.id === 'purpose') && field.helperText;

            return (
              <div key={field.id}>
                <Textarea
                  id={field.id}
                  label={field.label}
                  value={value as string}
                  onChange={handleChange(field.id)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={field.className}
                  helperText={showHelperIcon ? undefined : field.helperText}
                />
                {showHelperIcon && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                    <CircleInfoOutlineIcon
                      className="size-[13.33px] shrink-0 text-[#384250]"
                      aria-hidden
                    />
                    <span>{field.helperText}</span>
                  </p>
                )}
              </div>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <Checkbox
                key={field.id}
                id={field.id}
                label={field.label}
                checked={value as boolean}
                onChange={handleChange(field.id)}
                required={field.required}
                className={field.className}
              />
            );
          }

          return null;
        })}
      </div>

      <div className={formActions()}>
        <Button
          type="submit"
          intent={submitIntent}
          className="w-full sm:w-auto !rounded-[4px] font-medium leading-6"
          ariaLabel={`Submit ${submitLabel}`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
