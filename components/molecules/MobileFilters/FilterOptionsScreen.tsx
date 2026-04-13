'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from '@/components/atoms/Search/Search';
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';
import { DateSelect } from '../Filters/DateSelect';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import { FilterField } from '../Filters/Filters.types';

interface FilterOptionsScreenProps {
  field: FilterField;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onHasSelectionChange?: (hasSelection: boolean) => void;
}

interface SelectFilterOptionsContentProps {
  field: FilterField;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onHasSelectionChange?: (hasSelection: boolean) => void;
}

const SelectFilterOptionsContent = ({
  field,
  value,
  onChange,
  onHasSelectionChange,
}: SelectFilterOptionsContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('common.filters');
  const isMultiSelect = field.multiselect ?? false;
  const currentValue = value ?? (isMultiSelect ? [] : '');
  const hasSelection = isMultiSelect
    ? Array.isArray(currentValue) && currentValue.length > 0
    : currentValue !== '';

  useEffect(() => {
    onHasSelectionChange?.(hasSelection);
  }, [hasSelection, onHasSelectionChange]);

  const filteredOptions = useMemo(() => {
    if (!field.options) {
      return [];
    }
    if (!searchQuery.trim()) {
      return field.options;
    }
    const query = searchQuery.toLowerCase();
    return field.options.filter((option) => option.label.toLowerCase().includes(query));
  }, [field.options, searchQuery]);

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (isMultiSelect) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (checked) {
        onChange([...currentArray, optionValue]);
      } else {
        onChange(currentArray.filter((v) => v !== optionValue));
      }
    } else {
      onChange(checked ? optionValue : '');
    }
  };

  const isOptionChecked = (optionValue: string): boolean => {
    if (isMultiSelect) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      return currentArray.includes(optionValue);
    }
    return currentValue === optionValue;
  };

  const showAllOption = isMultiSelect;
  const allChecked = isMultiSelect
    ? Array.isArray(currentValue) && currentValue.length === 0
    : currentValue === '';

  const handleAllChange = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Search
          id={`filter-search-${field.id}`}
          label=""
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('search')}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showAllOption && (
          <div className="mb-2">
            <Checkbox
              id={`filter-all-${field.id}`}
              label={t('all')}
              checked={allChecked}
              onChange={handleAllChange}
            />
          </div>
        )}

        {filteredOptions.map((option) => (
          <div key={option.value} className="mb-2">
            <Checkbox
              id={`filter-${field.id}-${option.value}`}
              label={option.label}
              checked={isOptionChecked(option.value)}
              onChange={(checked) => handleOptionChange(option.value, checked)}
              disabled={option.disabled}
            />
          </div>
        ))}

        {filteredOptions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>{t('noItemsFound') || 'No results found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const FilterOptionsScreen = ({
  field,
  value,
  onChange,
  onHasSelectionChange,
}: FilterOptionsScreenProps) => {
  if (field.type !== 'select' && field.type !== 'date') {
    return null;
  }

  if (field.type === 'date') {
    const dateValue = typeof value === 'string' ? value : '';

    return (
      <div className="p-4">
        {field.variant === 'range' ? (
          <DateRangePicker
            label={field.label}
            value={dateValue}
            placeholder={field.placeholder}
            restrictFutureDates={field.restrictFutureDates}
            onChange={(range) => {
              if (range?.from && range?.to) {
                onChange(`${range.from.toISOString()}|${range.to.toISOString()}`);
                onHasSelectionChange?.(true);
                return;
              }

              onChange('');
              onHasSelectionChange?.(false);
            }}
          />
        ) : (
          <DateSelect
            id={`filter-date-${field.id}`}
            label={field.label}
            value={dateValue}
            placeholder={field.placeholder}
            restrictFutureDates={field.restrictFutureDates}
            onChange={(nextValue) => {
              onChange(nextValue);
              onHasSelectionChange?.(Boolean(nextValue));
            }}
          />
        )}
      </div>
    );
  }

  if (!field.options) {
    return null;
  }

  return (
    <SelectFilterOptionsContent
      field={field}
      value={value}
      onChange={onChange}
      onHasSelectionChange={onHasSelectionChange}
    />
  );
};
