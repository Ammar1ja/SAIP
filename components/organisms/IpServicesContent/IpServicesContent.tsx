'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GlossaryTabs from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import { StatisticsReportsSection } from '@/components/organisms/StatisticsReportsSection';
import FilterButtonGroup from '@/components/molecules/FilterButtonGroup/FilterButtonGroup';
import Section from '@/components/atoms/Section/Section';
import { FilterToggle } from '@/components/molecules/FilterToggle';
import { Table, TableColumn } from '@/components/organisms/Table';
import {
  IPObservatoryServicesData,
  IpServiceData,
} from '@/lib/drupal/services/ip-observatory-services.service';
import Button from '@/components/atoms/Button';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Filters } from '@/components/molecules/Filters';
import { LastUpdateBar } from '@/components/atoms/LastUpdateBar';

interface IpServicesContentProps {
  data: IPObservatoryServicesData;
}

export default function IpServicesContent({ data }: IpServicesContentProps) {
  const t = useTranslations('ipObservatory');
  const tCategories = useTranslations('ipCategories.names');

  // Detect current locale from window
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';

  const [activeTab, setActiveTab] = useState(data.tabs[0]);
  const [activeFilter, setActiveFilter] = useState(data.filters[0]);

  // Create tab labels object for translations
  const tabLabels: Record<string, string> = {};
  data.tabs.forEach((tab) => {
    tabLabels[tab] = tCategories(tab as any) || tab;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTabsFilterValues({});
  };
  const [tableFilterValues, setTableFilterValues] = useState<Record<string, any>>({});
  const [tabsFilterValues, setTabsFilterValues] = useState<Record<string, any>>({});
  const [glossaryFilterValues, setGlossaryFilterValues] = useState<Record<string, any>>({});
  const [buttonGroupFilterValues, setButtonGroupFilterValues] = useState<Record<string, any>>({});
  const [statisticsFilterValues, setStatisticsFilterValues] = useState<
    Record<string, string | string[]>
  >({});
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);
  const [isTabsFilterOpen, setIsTabsFilterOpen] = useState(true); // Open by default
  const [isGlossaryFilterOpen, setIsGlossaryFilterOpen] = useState(false);
  const [isButtonGroupFilterOpen, setIsButtonGroupFilterOpen] = useState(false);
  const [isStatisticsFilterOpen, setIsStatisticsFilterOpen] = useState(false);

  // Get chart data for active tab and filter
  const registrationType =
    activeFilter === 'Registration certificates' || activeFilter === 'شهادات التسجيل'
      ? 'certificate'
      : 'application';

  // Fallback: If no data for current locale, try to use any available data
  const activeTabChartData = data.tabsChartData?.[activeTab]?.[registrationType] ||
    // Fallback to opposite registration type if current one is empty
    data.tabsChartData?.[activeTab]?.[
      registrationType === 'application' ? 'certificate' : 'application'
    ] || {
      chronological: [],
      country: [],
      applicant: [],
      textContent: {
        chronologicalChart: {
          title: locale === 'ar' ? `${activeTab} - الرسوم البيانية` : `${activeTab} - Charts`,
          description:
            locale === 'ar'
              ? `الرسوم البيانية الإحصائية لـ ${activeTab}`
              : `Statistical charts for ${activeTab}`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            year: locale === 'ar' ? 'السنة' : 'Year',
          },
        },
        countryChart: {
          title: locale === 'ar' ? `${activeTab} حسب الدولة` : `${activeTab} by country`,
          description:
            locale === 'ar'
              ? `التوزيع حسب الدولة لـ ${activeTab}`
              : `Distribution by country for ${activeTab}`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            country: locale === 'ar' ? 'الدولة' : 'Country',
          },
        },
        applicantTypeChart: {
          title:
            locale === 'ar' ? `${activeTab} حسب نوع المتقدم` : `${activeTab} by applicant type`,
          description:
            locale === 'ar'
              ? `التوزيع حسب نوع المتقدم لـ ${activeTab}`
              : `Distribution by applicant type for ${activeTab}`,
          tooltip: {
            percentage: locale === 'ar' ? 'النسبة المئوية' : 'Percentage',
            type: locale === 'ar' ? 'النوع' : 'Type',
          },
        },
      },
    };

  const chartFilterValues = {
    ...tabsFilterValues,
    ...statisticsFilterValues,
  };

  const [sortField, setSortField] = useState<keyof IpServiceData>('classificationName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleTableFilterChange = (fieldId: string, value: any) => {
    setTableFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleTableFilterClear = () => {
    setTableFilterValues({});
  };

  const handleTableFilterToggle = () => {
    setIsTableFilterOpen((prev) => !prev);
  };

  const handleTabsFilterChange = (fieldId: string, value: any) => {
    setTabsFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleTabsFilterClear = () => {
    setTabsFilterValues({});
  };

  const handleTabsFilterToggle = () => {
    setIsTabsFilterOpen((prev) => !prev);
  };

  const handleGlossaryFilterChange = (fieldId: string, value: any) => {
    setGlossaryFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleGlossaryFilterClear = () => {
    setGlossaryFilterValues({});
  };

  const handleGlossaryFilterToggle = () => {
    setIsGlossaryFilterOpen((prev) => !prev);
  };

  const handleButtonGroupFilterChange = (fieldId: string, value: any) => {
    setButtonGroupFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleButtonGroupFilterClear = () => {
    setButtonGroupFilterValues({});
  };

  const handleButtonGroupFilterToggle = () => {
    setIsButtonGroupFilterOpen((prev) => !prev);
  };

  const handleStatisticsFilterChange = (fieldId: string, value: any) => {
    setStatisticsFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleStatisticsFilterClear = () => {
    setStatisticsFilterValues({});
  };

  const handleStatisticsFilterToggle = () => {
    setIsStatisticsFilterOpen((prev) => !prev);
  };

  const handleSort = (field: keyof IpServiceData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const currentTabFilterFields = data.tabsFilterFields?.[activeTab] || [];

  const normalizeStatus = (value?: string) => {
    if (!value) return '';
    const normalized = value.toLowerCase();
    if (['active', 'نشط'].includes(normalized)) return 'active';
    if (['pending', 'قيد الانتظار', 'قيد التسجيل'].includes(normalized)) return 'pending';
    if (['registered', 'مسجل'].includes(normalized)) return 'active';
    if (['granted', 'ممنوح'].includes(normalized)) return 'active';
    return normalized;
  };

  const normalizeValue = (value?: string) => (value ? value.toString().trim().toLowerCase() : '');

  const getSelectedLabel = (fieldId: string, value: string) => {
    const field = currentTabFilterFields.find((item) => item.id === fieldId);
    const option = field?.options?.find((opt) => opt.value === value);
    return option?.label || '';
  };

  const matchesFilterValue = (fieldId: string, selectedValue: string, rowValue?: string) => {
    if (!selectedValue || selectedValue === 'all') return true;
    const normalizedRow = normalizeValue(rowValue);
    const normalizedSelected = normalizeValue(selectedValue);
    const label = normalizeValue(getSelectedLabel(fieldId, selectedValue));
    if (!normalizedRow) return false;
    return normalizedRow === normalizedSelected || (label && normalizedRow === label);
  };

  const filteredData = data.tableData.filter((item) => {
    const date = tableFilterValues.date as string;
    const status = tableFilterValues.status as string;
    const itemStatusKey = normalizeStatus(item.status);

    if (date && item.date !== date) {
      return false;
    }

    if (status && status !== '' && item.status !== status) {
      const statusKey = normalizeStatus(status);
      if (statusKey && itemStatusKey !== statusKey) {
        return false;
      }
    }

    // Apply tab-specific filters
    const depositDate = tabsFilterValues.depositDate as string;
    const registrationHistory = tabsFilterValues.registrationHistory as string;
    const grantHistory = tabsFilterValues.grantHistory as string;
    const country = tabsFilterValues.country as string;
    const category = tabsFilterValues.category as string;
    const applicantType = tabsFilterValues.applicantType as string;
    const field = tabsFilterValues.field as string;
    const classification = tabsFilterValues.classification as string;

    // Filter by deposit date
    if (depositDate) {
      if (item.date) {
        try {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          const filterDate = new Date(depositDate).toISOString().split('T')[0];
          if (itemDate !== filterDate) {
            return false;
          }
        } catch (e) {
          if (item.date !== depositDate) {
            return false;
          }
        }
      } else {
        return false;
      }
    }

    if (registrationHistory && registrationHistory !== 'all') {
      const expected = registrationHistory === 'pending' ? 'pending' : 'active';
      if (itemStatusKey !== expected) return false;
    }

    if (grantHistory && grantHistory !== 'all') {
      const expected = grantHistory === 'pending' ? 'pending' : 'active';
      if (itemStatusKey !== expected) return false;
    }

    if (country && country !== 'all') {
      if (!matchesFilterValue('country', country, item.country)) {
        return false;
      }
    }

    if (category && category !== 'all') {
      if (!matchesFilterValue('category', category, item.category)) {
        return false;
      }
    }

    if (applicantType && applicantType !== 'all') {
      if (!matchesFilterValue('applicantType', applicantType, item.applicantType)) {
        return false;
      }
    }

    if (field && field !== 'all') {
      if (!matchesFilterValue('field', field, item.fieldValue)) {
        return false;
      }
    }

    if (classification && classification !== 'all') {
      const classificationValue = item.classification || item.classificationName;
      if (!matchesFilterValue('classification', classification, classificationValue)) {
        return false;
      }
    }

    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    return 0;
  });

  const tableColumns: TableColumn<IpServiceData>[] = [
    {
      key: 'classificationName',
      header: t('table.classificationName') || 'Classification name',
      align: 'left',
      width: 'min-w-0 w-1/2',
      renderCell: (value, row) => (
        <div
          className="cursor-pointer hover:text-primary-700 transition-colors"
          onClick={() => handleSort('classificationName')}
        >
          {value}
          {sortField === 'classificationName' && (
            <span className="ml-2 text-primary-600">
              {sortDirection === 'asc' ? (
                <ChevronUp className="w-4 h-4 inline" />
              ) : (
                <ChevronDown className="w-4 h-4 inline" />
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'registrationNumber',
      header: t('table.registrationNumber') || 'Number of application or registration certificate',
      align: 'right',
      width: 'min-w-0 w-1/2',
      renderCell: (value, row) => (
        <div
          className="cursor-pointer hover:text-primary-700 transition-colors"
          onClick={() => handleSort('registrationNumber')}
        >
          {value}
          {sortField === 'registrationNumber' && (
            <span className="ml-2 text-primary-600">
              {sortDirection === 'asc' ? (
                <ChevronUp className="w-4 h-4 inline" />
              ) : (
                <ChevronDown className="w-4 h-4 inline" />
              )}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Section className="mt-12" padding="none">
        <div className="max-w-4xl">
          <h2 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[60px] font-medium md:tracking-[-0.96px] mb-4">
            {data.overview.heading}
          </h2>
          <p className="text-base md:text-[18px] md:leading-[28px] text-gray-600">
            {data.overview.description}
          </p>
        </div>
      </Section>
      <Section>
        <div>
          <h3 className="text-[32px] leading-[40px] md:text-[36px] md:leading-[44px] font-medium md:tracking-[-0.72px] text-gray-900 mb-3">
            {t('ipCategories.title') || 'IP Categories'}
          </h3>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 max-w-screen-sm text-base md:text-[18px] md:leading-[28px]">
              {t('ipCategories.description') ||
                'Select from different types of intellectual property categories including patents, trademarks, copyrights, designs, plant varieties, and topographic designs of integrated circuits.'}
            </p>
          </div>

          <GlossaryTabs
            tabs={data.tabs}
            tabLabels={tabLabels}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {currentTabFilterFields.length > 0 && (
            <div className="mt-6">
              <Filters
                fields={currentTabFilterFields}
                onChange={handleTabsFilterChange}
                onClear={handleTabsFilterClear}
                values={tabsFilterValues}
                showHideFilters={false}
                variant="ipObservatory"
                actionsClassName="mt-4 justify-start"
                clearButtonClassName="text-[#9da4ae] text-sm font-medium hover:text-[#6c737f]"
                columns={
                  currentTabFilterFields.length <= 2
                    ? 2
                    : currentTabFilterFields.length <= 3
                      ? 3
                      : 3
                }
              />
            </div>
          )}
        </div>
        <div className="mt-16">
          <h3 className="text-[32px] leading-[40px] md:text-[36px] md:leading-[44px] font-medium md:tracking-[-0.72px] text-gray-900 mb-3">
            {t('registrationTypes.title') || 'Registration Types'}
          </h3>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 max-w-screen-sm text-base md:text-[18px] md:leading-[28px]">
              {t('registrationTypes.description') ||
                'Choose between registration applications and registration certificates to filter and view relevant intellectual property services and documentation.'}
            </p>
          </div>

          <FilterButtonGroup
            tabs={data.filters}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>
        <StatisticsReportsSection
          tab={activeTab}
          filter={activeFilter}
          filterValues={chartFilterValues}
          onFilterChange={handleStatisticsFilterChange}
          onFilterClear={handleStatisticsFilterClear}
          isFilterOpen={isStatisticsFilterOpen}
          onFilterToggle={handleStatisticsFilterToggle}
          chronologicalData={activeTabChartData.chronological}
          countryData={activeTabChartData.country}
          applicantData={activeTabChartData.applicant}
          textContent={activeTabChartData.textContent}
        />
      </Section>

      <Section background="white" padding="default">
        <div
          className={`max-w-7xl mx-auto transition-all duration-300 ease-in-out ${tableFilterValues.date || tableFilterValues.status ? 'mt-32' : 'mt-0'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[30px] leading-[38px] md:text-4xl md:leading-[48px] font-medium text-gray-900 flex-shrink-0">
              {t('table.title') || 'Table'}
            </h3>
            <div className="flex items-center gap-3 flex-shrink-0">
              <FilterToggle
                fields={data.filterFields}
                values={tableFilterValues}
                onChange={handleTableFilterChange}
                onClear={handleTableFilterClear}
                onToggle={handleTableFilterToggle}
                isOpen={isTableFilterOpen}
              />
              <Button
                intent="secondary"
                ariaLabel={t('table.sort') || 'Sort'}
                className="flex items-center gap-2"
                onClick={() => handleSort(sortField)}
              >
                <ArrowUpDown className="w-4 h-4" />
                {t('table.sort') || 'Sort'}{' '}
                <ChevronUp
                  className={`w-4 h-4 transition-transform duration-200 ease-in-out ${sortDirection === 'asc' ? 'rotate-0' : '-rotate-180'}`}
                />
              </Button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${isTableFilterOpen ? 'opacity-100 mb-6' : 'opacity-0 mb-0'}`}
          >
            <div
              className={`relative transition-all duration-300 ease-in-out ${isTableFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <Filters
                fields={data.filterFields}
                onChange={handleTableFilterChange}
                onClear={handleTableFilterClear}
                values={tableFilterValues}
                showHideFilters={false}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={tableColumns}
              data={sortedData}
              rules="horizontal"
              className="min-w-full bg-white"
            />
          </div>

          {data.lastDataUpdate && (
            <div className="mt-6 max-w-[846px] mx-auto">
              <LastUpdateBar
                date={data.lastDataUpdate}
                label={t('lastDataUpdate')}
                className="py-2 px-4"
                textClassName="text-[18px] leading-[28px] text-neutral-600"
              />
            </div>
          )}

          {sortedData.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">
                {t('table.noData') || 'No data found matching your filters.'}
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
