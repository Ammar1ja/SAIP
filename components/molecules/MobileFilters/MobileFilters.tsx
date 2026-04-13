'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from '@/components/atoms/Search/Search';
import { Filter } from 'lucide-react';
import { FilterField, FilterOption } from '../Filters/Filters.types';
import { FilterModal } from './FilterModal';

interface MobileFiltersProps {
  fields: FilterField[];
  values: Record<string, string | string[]>;
  onChange: (fieldId: string, value: string | string[]) => void;
  onClear: () => void;
  searchFieldId?: string;
}

export const MobileFilters = ({
  fields,
  values,
  onChange,
  onClear,
  searchFieldId = 'search',
}: MobileFiltersProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const t = useTranslations('common.filters');

  // Get search field
  const searchField = fields.find((f) => f.id === searchFieldId && f.type === 'search');
  // Get filter fields (exclude search)
  const filterFields = fields.filter((f) => !(f.id === searchFieldId && f.type === 'search'));

  // Count active filters
  const activeFiltersCount = filterFields.reduce((count, field) => {
    const value = values[field.id];
    if (field.type === 'select' && field.multiselect) {
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    }
    return count + (value && value !== '' ? 1 : 0);
  }, 0);

  const handleSearchChange = (value: string) => {
    if (searchField) {
      onChange(searchFieldId, value);
    }
  };

  return (
    <>
      <div className="w-full p-4 bg-white rounded-2xl border border-[#d2d6db] md:hidden">
        <div className="flex gap-3">
          {searchField && (
            <div className="flex-1">
              <Search
                id={searchField.id}
                label=""
                value={(values[searchFieldId] as string) || ''}
                onChange={handleSearchChange}
                placeholder={searchField.placeholder || t('search')}
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="relative flex-shrink-0 w-11 h-11 bg-primary-700 rounded-sm flex items-center justify-center text-white hover:bg-primary-800 transition-colors"
            aria-label={t('filters') || 'Filters'}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary-700 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        fields={filterFields}
        values={values}
        onChange={onChange}
        onClear={onClear}
      />
    </>
  );
};
