'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { Search } from '@/components/atoms/Search/Search';
import { Select } from '@/components/atoms/Select/Select';
import { FilterOption, FiltersProps } from './Filters.types';
import {
  filtersContainer,
  filtersGrid,
  filtersActions,
  clearFilters,
  hideFilters,
} from './Filters.styles';
import { DateSelect } from './DateSelect';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';

export const Filters = ({
  fields,
  values,
  onChange,
  onClear,
  showHideFilters = true,
  onHideFilters,
  className,
  actionsClassName,
  clearButtonClassName,
  isClearDisabled = false,
  columns,
  variant = 'default',
  mainFieldsCount = 4,
}: FiltersProps) => {
  const t = useTranslations('common.filters');
  const [isExpanded, setIsExpanded] = useState(false);

  // Use translations with fallbacks
  const clearFiltersLabel = t('clearFilters');
  const selectLabel = t('select');
  const allLabel = t('all');
  const selectedLabel = t('selected');
  const hideFiltersLabel = isExpanded
    ? t('hideFilters')
    : t('showFilters') || 'Show additional filters';
  const noOptionsMessage = t('noOptionsAvailable');
  const noServicesMessage = t('noServicesAvailable');
  const handleChange = (fieldId: string, multiselect?: boolean) => (value: string | string[]) => {
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  const isAccordionMode = variant === 'projects' && fields.length > mainFieldsCount;
  const mainFields = isAccordionMode ? fields.slice(0, mainFieldsCount) : fields;
  const additionalFields = isAccordionMode ? fields.slice(mainFieldsCount) : [];

  const mainGridColumns = variant === 'projects' && isAccordionMode ? 4 : columns || fields.length;
  const additionalGridColumns =
    variant === 'projects' && isAccordionMode ? 3 : columns || additionalFields.length;
  const gridSpacing = variant === 'faq' ? 'faq' : variant === 'ipAgents' ? 'ipAgents' : 'default';
  const mainGridTemplate =
    variant === 'faq' && mainGridColumns === 3 ? '3-faq' : (mainGridColumns as 1 | 2 | 3 | 4);
  const additionalGridTemplate =
    variant === 'faq' && additionalGridColumns === 3
      ? '3-faq'
      : (additionalGridColumns as 1 | 2 | 3 | 4);

  const handleToggleFilters = () => {
    setIsExpanded(!isExpanded);
    onHideFilters?.();
  };

  const renderField = (field: any) => {
    const value = values[field.id] ?? (field.multiselect ? [] : '');

    if (field.type === 'search') {
      return (
        <Search
          key={field.id}
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={handleChange(field.id)}
          placeholder={field.placeholder}
        />
      );
    }

    if (field.type === 'select') {
      if (field.displayAs === 'buttons') {
        const currentValue = typeof value === 'string' ? value : '';
        return (
          <div key={field.id} className="flex w-full flex-col gap-2">
            <label className="text-sm font-normal text-[#161616]">{field.label}</label>
            <div className="grid grid-cols-2 gap-2">
              {(field.options || []).map((option: FilterOption) => {
                const isActive = currentValue === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange?.(field.id, option.value)}
                    className={twMerge(
                      'h-10 rounded-md border px-4 text-[18px] leading-[28px] font-medium transition-colors',
                      isActive
                        ? 'border-[#D2D6DB] bg-white text-[#161616]'
                        : 'border-[#D2D6DB] bg-white text-[#161616] hover:border-[#98A2B3]',
                    )}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      // Use specific message for service-related dropdowns, generic for others
      const emptyMessage = field.id.toLowerCase().includes('service')
        ? noServicesMessage
        : noOptionsMessage;

      return (
        <Select
          key={field.id}
          id={field.id}
          label={field.label}
          value={value}
          onChange={handleChange(field.id, field.multiselect)}
          placeholder={field.placeholder}
          options={field.options || []}
          multiselect={field.multiselect}
          disabled={field.disabled}
          selectLabel={selectLabel}
          allLabel={allLabel}
          selectedLabel={selectedLabel}
          noOptionsMessage={emptyMessage}
        />
      );
    }

    if (field.type === 'date') {
      if (field.variant === 'range') {
        return (
          <DateRangePicker
            key={field.id}
            label={field.label}
            value={value as string}
            onChange={(range) => {
              if (range?.from && range?.to) {
                const from = range.from.toISOString();
                const to = range.to.toISOString();
                if (onChange) {
                  onChange(field.id, `${from}|${to}`);
                }
              } else if (range?.from) {
                // Handle single date selection
                const from = range.from.toISOString();
                if (onChange) {
                  onChange(field.id, `${from}|${from}`);
                }
              } else {
                if (onChange) {
                  onChange(field.id, '');
                }
              }
            }}
            placeholder={field.placeholder}
            restrictFutureDates={field.restrictFutureDates}
          />
        );
      }

      return (
        <DateSelect
          key={field.id}
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={handleChange(field.id)}
          placeholder={field.placeholder}
          restrictFutureDates={field.restrictFutureDates}
        />
      );
    }

    return null;
  };

  const isProjectsVariant = variant === 'projects';

  return (
    <div className={twMerge(filtersContainer({ variant }), className)}>
      <div
        className={twMerge(
          isProjectsVariant && mainGridColumns === 4
            ? 'grid grid-cols-1 md:flex md:flex-nowrap md:justify-start gap-4 w-full'
            : filtersGrid({
                columns: mainGridTemplate as 1 | 2 | 3 | 4 | '3-faq',
                spacing: gridSpacing,
              }),
        )}
      >
        {mainFields.map((field) => (
          <div
            key={field.id}
            className={
              isProjectsVariant && mainGridColumns === 4
                ? 'w-full md:w-[calc((100%-48px)/4)] md:flex-shrink-0'
                : ''
            }
          >
            {renderField(field)}
          </div>
        ))}
      </div>

      {isAccordionMode && additionalFields.length > 0 && (
        <div
          className={twMerge(
            'overflow-visible transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
          )}
          style={isExpanded ? {} : { overflow: 'hidden' }}
        >
          <div
            className={twMerge(
              isProjectsVariant && additionalGridColumns === 3
                ? 'grid grid-cols-1 md:flex md:flex-nowrap md:justify-start gap-4 w-full'
                : filtersGrid({
                    columns: additionalGridTemplate as 1 | 2 | 3 | 4 | '3-faq',
                    spacing: gridSpacing,
                  }),
            )}
          >
            {additionalFields.map((field) => (
              <div
                key={field.id}
                className={
                  isProjectsVariant && additionalGridColumns === 3
                    ? 'w-full md:w-[calc((100%-32px)/3)] md:flex-shrink-0'
                    : ''
                }
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={twMerge(
          filtersActions({
            variant: variant === 'faq' ? 'faq' : variant === 'ipAgents' ? 'ipAgents' : 'default',
          }),
          actionsClassName,
        )}
      >
        {variant === 'ipAgents' ? (
          onClear && (
            <button
              type="button"
              onClick={onClear}
              disabled={isClearDisabled}
              className={twMerge(
                clearFilters(),
                'justify-self-start text-start',
                isClearDisabled && 'opacity-50 cursor-not-allowed',
                clearButtonClassName,
              )}
            >
              {clearFiltersLabel}
            </button>
          )
        ) : (
          <>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={isClearDisabled}
                className={twMerge(
                  clearFilters(),
                  isClearDisabled && 'opacity-50 cursor-not-allowed',
                  clearButtonClassName,
                )}
              >
                {clearFiltersLabel}
              </button>
            )}

            {isAccordionMode && additionalFields.length > 0 && (
              <button type="button" onClick={handleToggleFilters} className={hideFilters()}>
                {hideFiltersLabel}
                <ChevronUp
                  className={twMerge(
                    'w-4 h-4 transition-transform duration-200 ease-in-out',
                    isExpanded ? 'rotate-180' : '',
                  )}
                  aria-hidden="true"
                />
              </button>
            )}
            {!isAccordionMode && showHideFilters && onHideFilters && (
              <button type="button" onClick={onHideFilters} className={hideFilters()}>
                {hideFiltersLabel}
                <ChevronUp
                  className="w-4 h-4 transition-transform duration-200 ease-in-out"
                  aria-hidden="true"
                />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
