'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';
import { SelectProps, SelectOption } from './Select.types';
import { selectContainer, chevronIcon } from './Select.styles';

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      value,
      placeholder,
      disabled,
      onChange,
      id,
      ariaLabel,
      required,
      isOpen: controlledIsOpen,
      onOpenChange,
      multiselect = false,
      selectLabel = 'Select',
      allLabel = 'All',
      selectedLabel = 'selected',
      noOptionsMessage = 'No options available',
      ...props
    },
    ref,
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen ?? internalIsOpen;
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectId = id || 'select-input';

    // Multiselect logic
    const isMulti = !!multiselect;
    const selectedValues = isMulti
      ? Array.isArray(value)
        ? value
        : value
          ? [value]
          : []
      : typeof value === 'string'
        ? value
        : '';
    const allSelected =
      isMulti &&
      options.length > 0 &&
      Array.isArray(selectedValues) &&
      selectedValues.length === options.length;

    // Handle outside click for custom dropdown
    useEffect(() => {
      if (!isOpen) return;
      const handleClick = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setInternalIsOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onOpenChange]);

    const handleDropdownToggle = () => {
      if (disabled) return;
      setInternalIsOpen((prev) => !prev);
      onOpenChange?.(!isOpen);
    };

    // Handle Escape key press to close dropdown
    useEffect(() => {
      if (!isOpen) return;
      const toggleBtn = document.activeElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setInternalIsOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (toggleBtn instanceof HTMLButtonElement) {
          toggleBtn.focus();
        }
      };
    }, [isOpen, onOpenChange]);

    // Focus trap and arrrow keys support for opened dropdown
    useEffect(() => {
      const dropdown = dropdownRef.current;

      if (!isOpen || !dropdown) return;

      const focusableElements = Array.from(
        dropdown.querySelectorAll<HTMLElement>('button, input, [href]'),
      ).filter((el) => !el.getAttribute('disabled'));

      const focusableCount = focusableElements.length;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableCount - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        const activeElement = document.activeElement;

        if (!(activeElement instanceof HTMLElement)) return;

        const index = focusableElements.indexOf(activeElement);

        if (e.key === 'Tab') {
          if (e.shiftKey && activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          focusableElements[(index + 1) % focusableCount].focus();
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusableElements[(index - 1 + focusableCount) % focusableCount].focus();
        }
      };

      dropdown.addEventListener('keydown', handleKeyDown);
      return () => dropdown.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Multiselect logic
    const handleMultiChange = (optionValue: string) => {
      if (!isMulti) return;
      let newValues: string[] = Array.isArray(selectedValues) ? [...selectedValues] : [];
      if (newValues.includes(optionValue)) {
        newValues = newValues.filter((v) => v !== optionValue);
      } else {
        newValues.push(optionValue);
      }
      onChange?.(newValues);
    };

    const handleAllChange = () => {
      if (!isMulti) return;
      if (allSelected) {
        onChange?.([]);
      } else {
        onChange?.(options.map((o) => o.value));
      }
    };

    // Single select logic
    const handleSingleChange = (optionValue: string) => {
      if (disabled) return;
      onChange?.(optionValue);
      setInternalIsOpen(false);
      onOpenChange?.(false);
    };

    // Label for button
    const getLabel = () => {
      if (isMulti) {
        if (selectedValues.length === 0) return placeholder || selectLabel;
        if (selectedValues.length === 1) {
          const opt = options.find((o) => o.value === selectedValues[0]);
          return opt?.label || placeholder || selectLabel;
        }
        if (allSelected) return allLabel;
        return `${selectedValues.length} ${selectedLabel}`;
      } else {
        if (!selectedValues || selectedValues === '') return placeholder || selectLabel;
        const opt = options.find((o) => o.value === selectedValues);
        return opt?.label || placeholder || selectLabel;
      }
    };

    const isPlaceholder =
      (isMulti && selectedValues.length === 0) ||
      (!isMulti && (!selectedValues || selectedValues === ''));

    const renderLabel = () => {
      if (!label) return null;
      // If label starts with *, make it red
      if (label.startsWith('*')) {
        return (
          <label htmlFor={selectId} className="text-gray-700 text-sm font-normal">
            <span className="shrink-0 text-red-500 me-[4px]">*</span>
            {label.slice(1).trim()}
          </label>
        );
      }
      return (
        <label htmlFor={selectId} className="text-gray-700 text-sm font-normal">
          {label}
          {required && (
            <span className="ms-[4px] shrink-0 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      );
    };

    return (
      <div className="flex flex-col gap-2" ref={ref}>
        {renderLabel()}
        <div className={twMerge(selectContainer(), className)} ref={dropdownRef}>
          <button
            type="button"
            className={twMerge(
              'w-full h-10 min-h-[40px] max-h-[40px] pl-4 pr-10 rounded-[4px] border border-[#9DA4AE] text-text-primary-paragraph text-base bg-white flex items-center justify-between cursor-pointer relative transition-[border-color,box-shadow,color] duration-200 ease-in-out',
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              isOpen && 'border-primary-500 ring-1 ring-primary-500/30',
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={selectId + '-dropdown'}
            onClick={handleDropdownToggle}
            disabled={disabled}
          >
            <span className={twMerge('truncate text-left', isPlaceholder && 'text-[#6C737F]')}>
              {getLabel()}
            </span>
            <ChevronDown
              className={twMerge(
                'absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 ease-in-out',
                isOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
          {isOpen && (
            <div
              id={selectId + '-dropdown'}
              role="listbox"
              className="absolute z-[9999] mt-1 w-full bg-white rounded-[4px] shadow-lg border border-[#9DA4AE] py-1 max-h-72 overflow-auto animate-fadeIn"
              style={{
                top: '100%',
                left: '0',
                width: '100%',
                minWidth: '200px',
                position: 'absolute',
              }}
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {noOptionsMessage}
                </div>
              ) : isMulti ? (
                <>
                  <label className="flex items-center px-4 py-2 cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleAllChange}
                      className="accent-black w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{allLabel}</span>
                  </label>
                  <div className="border-t border-gray-100 my-1" />
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className={twMerge(
                        'flex items-center px-4 py-2 cursor-pointer gap-2',
                        option.disabled && 'opacity-50 pointer-events-none',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => handleMultiChange(option.value)}
                        disabled={option.disabled}
                        className="accent-black w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </>
              ) : (
                <>
                  {options.map((option) => {
                    const isSelected = selectedValues === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        onClick={() => handleSingleChange(option.value)}
                        className={twMerge(
                          'w-full px-4 py-2 text-start text-base text-text-primary-paragraph transition-colors',
                          'hover:bg-[#F9FAFB] focus:bg-[#F9FAFB] focus:outline-none',
                          isSelected && 'bg-primary-50 font-medium text-text-default',
                          option.disabled && 'opacity-50 pointer-events-none',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
