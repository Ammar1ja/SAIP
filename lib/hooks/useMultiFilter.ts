import { useMemo } from 'react';

interface UseMultiFilterProps<T> {
  data: T[];
  filterValues: Record<string, string | string[]>;
  fieldMap: Record<string, keyof T>;
  searchFn?: (item: T, search: string) => boolean;
}

// Helper function to filter data - not a hook
export function filterData<T>(
  data: T[],
  filterValues: Record<string, string | string[]>,
  fieldMap: Record<string, keyof T>,
  searchFn?: (item: T, search: string) => boolean,
): T[] {
  return data.filter((item) => {
    // Search logic
    const search = typeof filterValues.search === 'string' ? filterValues.search.toLowerCase() : '';
    const matchesSearch =
      !search ||
      (searchFn
        ? searchFn(item, search)
        : Object.values(item as Record<string, unknown>).some(
            (v) => typeof v === 'string' && v.toLowerCase().includes(search),
          ));

    // Multiselect logic for each mapped field
    const allFieldsMatch = Object.entries(fieldMap).every(([filterKey, dataKey]) => {
      if (filterKey === 'search') return true;
      const filterVal = filterValues[filterKey];
      if (!filterVal) return true;
      if (Array.isArray(filterVal)) {
        return filterVal.length === 0 || filterVal.includes(String(item[dataKey]));
      }
      return String(item[dataKey]) === filterVal;
    });

    return matchesSearch && allFieldsMatch;
  });
}

// Actual hook that uses useMemo properly
export function useMultiFilter<T>({
  data,
  filterValues,
  fieldMap,
  searchFn,
}: UseMultiFilterProps<T>) {
  return useMemo(() => {
    return filterData(data, filterValues, fieldMap, searchFn);
  }, [data, filterValues, fieldMap, searchFn]);
}
