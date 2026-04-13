/**
 * IP Services Filter Fields
 * Basic filter configuration for IP Observatory Services statistics
 */

type TranslationFn = (key: string) => string;

export const getIPServicesFilterFields = (t?: TranslationFn) => {
  const translate = t || ((key: string) => key);

  return [
    {
      id: 'date',
      type: 'date' as const,
      label: translate('charts.filters.date') || 'Date',
      placeholder: translate('charts.filters.selectDate') || 'Select date',
    },
    {
      id: 'status',
      type: 'select' as const,
      label: translate('charts.filters.status') || 'Status',
      placeholder: translate('charts.filters.selectStatus') || 'Select status',
      options: [
        { label: translate('charts.filters.active') || 'Active', value: 'Active' },
        { label: translate('charts.filters.pending') || 'Pending', value: 'Pending' },
      ],
    },
  ];
};

// Legacy export for backward compatibility (English only)
export const IP_SERVICES_FILTER_FIELDS = getIPServicesFilterFields();
