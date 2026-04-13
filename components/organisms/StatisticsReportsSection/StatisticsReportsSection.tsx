'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import Section from '../../atoms/Section/Section';
import { GradientBlock } from '../../atoms/GradientBlock';
import { FilterToggle } from '../../molecules/FilterToggle';
import { Filters } from '../../molecules/Filters';

import { getIPServicesFilterFields } from '../../../lib/data/ip-services-filter-fields';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  chronologicalPatentData,
  countryPatentData,
  applicantTypeData,
  statisticsTextContent,
} from './StatisticsReportsSection.data';
import { StatisticsReportsSectionProps } from './StatisticsReportsSection.types';

export const StatisticsReportsSection = ({
  className,
  tab = 'Patents',
  filter = 'Registration application',
  filterValues = {},
  onFilterChange,
  onFilterClear,
  isFilterOpen = false,
  onFilterToggle,
  chronologicalData: propsChronologicalData,
  countryData: propsCountryData,
  applicantData: propsApplicantData,
  textContent: propsTextContent,
}: StatisticsReportsSectionProps) => {
  const t = useTranslations('ipObservatory');
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';

  // Generate filter fields with translations
  const filterFields = useMemo(() => getIPServicesFilterFields(t), [t]);

  const getFilteredData = () => {
    // If data is provided via props, use it
    if (propsChronologicalData || propsCountryData || propsApplicantData || propsTextContent) {
      // Use propsTextContent if available, otherwise create locale-aware fallback
      const finalTextContent = propsTextContent || {
        chronologicalChart: {
          title: locale === 'ar' ? `${tab} - الرسوم البيانية` : `${tab} - Charts`,
          description:
            locale === 'ar'
              ? `الرسوم البيانية الإحصائية لـ ${tab}`
              : `Statistical charts for ${tab}`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            year: locale === 'ar' ? 'السنة' : 'Year',
          },
        },
        countryChart: {
          title: locale === 'ar' ? `${tab} حسب الدولة` : `${tab} by country`,
          description:
            locale === 'ar' ? `التوزيع حسب الدولة لـ ${tab}` : `Distribution by country for ${tab}`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            country: locale === 'ar' ? 'الدولة' : 'Country',
          },
        },
        applicantTypeChart: {
          title: locale === 'ar' ? `${tab} حسب نوع المتقدم` : `${tab} by applicant type`,
          description:
            locale === 'ar'
              ? `التوزيع حسب نوع المتقدم لـ ${tab}`
              : `Distribution by applicant type for ${tab}`,
          tooltip: {
            percentage: locale === 'ar' ? 'النسبة المئوية' : 'Percentage',
            type: locale === 'ar' ? 'النوع' : 'Type',
          },
        },
      };

      return {
        chronologicalData: propsChronologicalData || [],
        countryData: propsCountryData || [],
        applicantData: propsApplicantData || [],
        textContent: finalTextContent,
      };
    }

    // Fallback to hardcoded data
    if (tab === 'Patents') {
      if (filter === 'Registration application') {
        return {
          chronologicalData: chronologicalPatentData,
          countryData: countryPatentData,
          applicantData: applicantTypeData,
          textContent: statisticsTextContent,
        };
      } else {
        return {
          chronologicalData: [],
          countryData: [],
          applicantData: [],
          textContent: {
            chronologicalChart: {
              title: locale === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available',
              description:
                locale === 'ar'
                  ? 'لا توجد بيانات شهادات التسجيل متاحة للفترة المحددة.'
                  : 'No registration certificates data available for the selected period.',
              tooltip: {
                applications: locale === 'ar' ? 'الطلبات' : 'applications',
                year: locale === 'ar' ? 'السنة' : 'Year',
              },
            },
            countryChart: {
              title: locale === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available',
              description:
                locale === 'ar'
                  ? 'لا توجد بيانات شهادات التسجيل متاحة للفترة المحددة.'
                  : 'No registration certificates data available for the selected period.',
              tooltip: {
                applications: locale === 'ar' ? 'الطلبات' : 'applications',
                country: locale === 'ar' ? 'الدولة' : 'Country',
              },
            },
            applicantTypeChart: {
              title: locale === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available',
              description:
                locale === 'ar'
                  ? 'لا توجد بيانات شهادات التسجيل متاحة للفترة المحددة.'
                  : 'No registration certificates data available for the selected period.',
              tooltip: {
                percentage: locale === 'ar' ? 'النسبة المئوية' : 'Percentage',
                type: locale === 'ar' ? 'النوع' : 'Type',
              },
            },
          },
        };
      }
    }

    return {
      chronologicalData: [],
      countryData: [],
      applicantData: [],
      textContent: {
        chronologicalChart: {
          title: locale === 'ar' ? `${tab} - قريباً` : `${tab} - Coming Soon`,
          description:
            locale === 'ar'
              ? `ستكون البيانات الخاصة بـ ${tab} متاحة قريباً. يرجى المراجعة لاحقاً.`
              : `Data for ${tab} will be available soon. Please check back later.`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            year: locale === 'ar' ? 'السنة' : 'Year',
          },
        },
        countryChart: {
          title: locale === 'ar' ? `${tab} - قريباً` : `${tab} - Coming Soon`,
          description:
            locale === 'ar'
              ? `ستكون البيانات الخاصة بـ ${tab} متاحة قريباً. يرجى المراجعة لاحقاً.`
              : `Data for ${tab} will be available soon. Please check back later.`,
          tooltip: {
            applications: locale === 'ar' ? 'الطلبات' : 'applications',
            country: locale === 'ar' ? 'الدولة' : 'Country',
          },
        },
        applicantTypeChart: {
          title: locale === 'ar' ? `${tab} - قريباً` : `${tab} - Coming Soon`,
          description:
            locale === 'ar'
              ? `ستكون البيانات الخاصة بـ ${tab} متاحة قريباً. يرجى المراجعة لاحقاً.`
              : `Data for ${tab} will be available soon. Please check back later.`,
          tooltip: {
            percentage: locale === 'ar' ? 'النسبة المئوية' : 'Percentage',
            type: locale === 'ar' ? 'النوع' : 'Type',
          },
        },
      },
    };
  };

  const { chronologicalData, countryData, applicantData, textContent } = getFilteredData();

  const normalizeStatus = (value?: string) => {
    if (!value) return '';
    const normalized = value.toLowerCase();
    if (['active', 'نشط'].includes(normalized)) return 'active';
    if (['pending', 'قيد الانتظار', 'قيد التسجيل'].includes(normalized)) return 'pending';
    if (['registered', 'مسجل'].includes(normalized)) return 'active';
    if (['granted', 'ممنوح'].includes(normalized)) return 'active';
    return normalized;
  };

  const normalizeHistoryValue = (value?: string) => {
    if (!value) return '';
    const normalized = value.toLowerCase();
    if (['registered', 'granted', 'active', 'مسجل', 'ممنوح', 'نشط'].includes(normalized)) {
      return 'active';
    }
    if (['pending', 'قيد الانتظار', 'قيد التسجيل'].includes(normalized)) {
      return 'pending';
    }
    return normalized;
  };

  const parseFilterYear = (value?: string) => {
    if (!value) return null;
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) return isoDate.getFullYear();
    const match = value.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) {
      return Number(match[3]);
    }
    return null;
  };

  const filteredChronologicalData = useMemo(() => {
    const dateFilter = (filterValues?.date as string) || '';
    const statusFilter = normalizeStatus(filterValues?.status as string);
    const depositDateFilter = (filterValues?.depositDate as string) || '';
    const registrationHistory = (filterValues?.registrationHistory as string) || '';
    const grantHistory = (filterValues?.grantHistory as string) || '';
    const country = (filterValues?.country as string) || '';
    const category = (filterValues?.category as string) || '';
    const applicantType = (filterValues?.applicantType as string) || '';
    const fieldValue = (filterValues?.field as string) || '';
    const classification = (filterValues?.classification as string) || '';
    return chronologicalData.filter((entry) => {
      const effectiveDate = dateFilter || depositDateFilter;
      if (effectiveDate) {
        const year = parseFilterYear(effectiveDate);
        if (!year || entry.year !== year) return false;
      }
      if (statusFilter) {
        const entryStatus = normalizeStatus('status' in entry ? (entry as any).status : undefined);
        if (entryStatus && entryStatus !== statusFilter) return false;
      }
      if (registrationHistory) {
        const expected = registrationHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'registrationHistory' in entry ? (entry as any).registrationHistory : undefined,
        );
        const entryStatus = normalizeStatus('status' in entry ? (entry as any).status : undefined);
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (grantHistory) {
        const expected = grantHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'grantHistory' in entry ? (entry as any).grantHistory : undefined,
        );
        const entryStatus = normalizeStatus('status' in entry ? (entry as any).status : undefined);
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (country && country !== 'all' && 'country' in entry) {
        if (((entry as any).country || '') !== country) return false;
      }
      if (category && category !== 'all' && 'category' in entry) {
        if (((entry as any).category || '') !== category) return false;
      }
      if (applicantType && applicantType !== 'all' && 'applicantType' in entry) {
        if (((entry as any).applicantType || '') !== applicantType) return false;
      }
      if (fieldValue && fieldValue !== 'all' && 'fieldValue' in entry) {
        if (((entry as any).fieldValue || '') !== fieldValue) return false;
      }
      if (classification && classification !== 'all' && 'classification' in entry) {
        if (((entry as any).classification || '') !== classification) return false;
      }
      return true;
    });
  }, [
    chronologicalData,
    filterValues?.date,
    filterValues?.depositDate,
    filterValues?.status,
    filterValues?.registrationHistory,
    filterValues?.grantHistory,
    filterValues?.country,
    filterValues?.category,
    filterValues?.applicantType,
    filterValues?.field,
    filterValues?.classification,
  ]);

  const filteredCountryData = useMemo(() => {
    const statusFilter = normalizeStatus(filterValues?.status as string);
    const registrationHistory = (filterValues?.registrationHistory as string) || '';
    const grantHistory = (filterValues?.grantHistory as string) || '';
    const country = (filterValues?.country as string) || '';
    const category = (filterValues?.category as string) || '';
    const applicantType = (filterValues?.applicantType as string) || '';
    const fieldValue = (filterValues?.field as string) || '';
    const classification = (filterValues?.classification as string) || '';
    return countryData.filter((entry) => {
      const entryStatus = normalizeStatus('status' in entry ? (entry as any).status : undefined);
      if (statusFilter && entryStatus && entryStatus !== statusFilter) return false;
      if (registrationHistory) {
        const expected = registrationHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'registrationHistory' in entry ? (entry as any).registrationHistory : undefined,
        );
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (grantHistory) {
        const expected = grantHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'grantHistory' in entry ? (entry as any).grantHistory : undefined,
        );
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (country && country !== 'all' && 'country' in entry) {
        if (((entry as any).country || '') !== country) return false;
      }
      if (category && category !== 'all' && 'category' in entry) {
        if (((entry as any).category || '') !== category) return false;
      }
      if (applicantType && applicantType !== 'all' && 'applicantType' in entry) {
        if (((entry as any).applicantType || '') !== applicantType) return false;
      }
      if (fieldValue && fieldValue !== 'all' && 'fieldValue' in entry) {
        if (((entry as any).fieldValue || '') !== fieldValue) return false;
      }
      if (classification && classification !== 'all' && 'classification' in entry) {
        if (((entry as any).classification || '') !== classification) return false;
      }
      return true;
    });
  }, [
    countryData,
    filterValues?.status,
    filterValues?.registrationHistory,
    filterValues?.grantHistory,
    filterValues?.country,
    filterValues?.category,
    filterValues?.applicantType,
    filterValues?.field,
    filterValues?.classification,
  ]);

  const filteredApplicantData = useMemo(() => {
    const statusFilter = normalizeStatus(filterValues?.status as string);
    const registrationHistory = (filterValues?.registrationHistory as string) || '';
    const grantHistory = (filterValues?.grantHistory as string) || '';
    const country = (filterValues?.country as string) || '';
    const category = (filterValues?.category as string) || '';
    const applicantType = (filterValues?.applicantType as string) || '';
    const fieldValue = (filterValues?.field as string) || '';
    const classification = (filterValues?.classification as string) || '';
    return applicantData.filter((entry) => {
      const entryStatus = normalizeStatus('status' in entry ? (entry as any).status : undefined);
      if (statusFilter && entryStatus && entryStatus !== statusFilter) return false;
      if (registrationHistory) {
        const expected = registrationHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'registrationHistory' in entry ? (entry as any).registrationHistory : undefined,
        );
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (grantHistory) {
        const expected = grantHistory === 'pending' ? 'pending' : 'active';
        const entryHistory = normalizeHistoryValue(
          'grantHistory' in entry ? (entry as any).grantHistory : undefined,
        );
        if (entryHistory && entryHistory !== expected) return false;
        if (!entryHistory && entryStatus && entryStatus !== expected) return false;
      }
      if (country && country !== 'all' && 'country' in entry) {
        if (((entry as any).country || '') !== country) return false;
      }
      if (category && category !== 'all' && 'category' in entry) {
        if (((entry as any).category || '') !== category) return false;
      }
      if (applicantType && applicantType !== 'all' && 'applicantType' in entry) {
        if (((entry as any).applicantType || '') !== applicantType) return false;
      }
      if (fieldValue && fieldValue !== 'all' && 'fieldValue' in entry) {
        if (((entry as any).fieldValue || '') !== fieldValue) return false;
      }
      if (classification && classification !== 'all' && 'classification' in entry) {
        if (((entry as any).classification || '') !== classification) return false;
      }
      return true;
    });
  }, [
    applicantData,
    filterValues?.status,
    filterValues?.registrationHistory,
    filterValues?.grantHistory,
    filterValues?.country,
    filterValues?.category,
    filterValues?.applicantType,
    filterValues?.field,
    filterValues?.classification,
  ]);

  const sortedApplicantData = useMemo(() => {
    if (!applicantData || applicantData.length === 0) return applicantData;

    const sorted = [...applicantData].sort((a, b) => b.percentage - a.percentage);
    const lightGreen = '#88D8AD';
    const darkGreen = '#074D31';

    return sorted.map((entry, index) => ({
      ...entry,
      color: index === 0 ? lightGreen : darkGreen,
    }));
  }, [applicantData]);

  return (
    <section className={twMerge('bg-white', className)}>
      <div className="grid grid-cols-1">
        <section className="py-16">
          <h3 className="text-[30px] leading-[38px] md:text-[48px] md:leading-[60px] tracking-[-0.02em] font-medium text-[#161616] mb-6 max-w-[628px]">
            {textContent.chronologicalChart.title}
          </h3>
          <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
            <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[28px] text-[#384250] max-w-[628px]">
              {textContent.chronologicalChart.description}
            </p>
            {onFilterToggle && (
              <div className="self-start md:self-end">
                <FilterToggle
                  fields={filterFields}
                  values={filterValues}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  onToggle={onFilterToggle}
                  isOpen={isFilterOpen}
                />
              </div>
            )}
          </div>

          {onFilterToggle && onFilterChange && onFilterClear && (
            <div
              className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100 mb-6' : 'opacity-0 mb-0'}`}
            >
              <div
                className={`relative transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <Filters
                  fields={filterFields}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  values={filterValues}
                  showHideFilters={false}
                />
              </div>
            </div>
          )}

          <GradientBlock
            maxWidth="max-w-[1120px]"
            containerClassName="bg-[#fcfcfd] border border-[#d2d6db] rounded-3xl px-6 md:px-12 lg:px-20 py-10 md:py-14 lg:py-20"
            cardClassName="rounded-3xl shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] border-transparent"
          >
            <div className="flex flex-col gap-6">
              <h4 className="text-[18px] leading-[24px] font-bold text-[#2a2a2a]">
                {textContent.chronologicalChart.title}
              </h4>
              <div className="h-[240px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredChronologicalData}
                    margin={{ top: 5, right: 20, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="year"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                      formatter={(value: number) => [
                        `${value} ${textContent.chronologicalChart.tooltip.applications}`,
                        textContent.chronologicalChart.tooltip.applications,
                      ]}
                      labelFormatter={(label) =>
                        `${textContent.chronologicalChart.tooltip.year}: ${label}`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#25935f"
                      strokeWidth={3}
                      dot={{ fill: '#25935f', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#25935f', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GradientBlock>
        </section>
        <section className="py-16">
          <h3 className="text-[30px] leading-[38px] md:text-[48px] md:leading-[60px] tracking-[-0.02em] font-medium text-[#161616] mb-6 max-w-[628px]">
            {textContent.countryChart.title}
          </h3>
          <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
            <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[28px] text-[#384250] max-w-[628px]">
              {textContent.countryChart.description}
            </p>
            {onFilterToggle && (
              <div className="self-start md:self-end">
                <FilterToggle
                  fields={filterFields}
                  values={filterValues}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  onToggle={onFilterToggle}
                  isOpen={isFilterOpen}
                />
              </div>
            )}
          </div>

          {onFilterToggle && onFilterChange && onFilterClear && (
            <div
              className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100 mb-6' : 'opacity-0 mb-0'}`}
            >
              <div
                className={`relative transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <Filters
                  fields={filterFields}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  values={filterValues}
                  showHideFilters={false}
                />
              </div>
            </div>
          )}

          <GradientBlock
            maxWidth="max-w-[1120px]"
            containerClassName="bg-[#fcfcfd] border border-[#d2d6db] rounded-3xl px-6 md:px-12 lg:px-20 py-10 md:py-14 lg:py-20"
            cardClassName="rounded-3xl shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] border-transparent"
          >
            <div className="flex flex-col gap-6">
              <h4 className="text-[18px] leading-[24px] font-bold text-[#2a2a2a]">
                {textContent.countryChart.title}
              </h4>
              <div className="h-[240px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%" className="">
                  <BarChart
                    data={filteredCountryData}
                    margin={{ top: 5, right: 10, left: -30, bottom: 5 }}
                    maxBarSize={80}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="country"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                      formatter={(value: number) => [
                        `${value} ${textContent.countryChart.tooltip.applications}`,
                        textContent.countryChart.tooltip.applications,
                      ]}
                      labelFormatter={(label) =>
                        `${textContent.countryChart.tooltip.country}: ${label}`
                      }
                    />
                    <Bar dataKey="applications" radius={[4, 4, 0, 0]}>
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GradientBlock>
        </section>

        <section className="py-16">
          <h3 className="text-[30px] leading-[38px] md:text-[48px] md:leading-[60px] tracking-[-0.02em] font-medium text-[#161616] mb-6 max-w-[628px]">
            {textContent.applicantTypeChart.title}
          </h3>
          <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
            <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[28px] text-[#384250] max-w-[628px]">
              {textContent.applicantTypeChart.description}
            </p>
            {onFilterToggle && (
              <div className="self-start md:self-end">
                <FilterToggle
                  fields={filterFields}
                  values={filterValues}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  onToggle={onFilterToggle}
                  isOpen={isFilterOpen}
                />
              </div>
            )}
          </div>

          {onFilterToggle && onFilterChange && onFilterClear && (
            <div
              className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100 mb-6' : 'opacity-0 mb-0'}`}
            >
              <div
                className={`relative transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <Filters
                  fields={filterFields}
                  onChange={onFilterChange}
                  onClear={onFilterClear}
                  values={filterValues}
                  showHideFilters={false}
                />
              </div>
            </div>
          )}

          <GradientBlock
            maxWidth="max-w-[1120px]"
            containerClassName="bg-[#fcfcfd] border border-[#d2d6db] rounded-3xl px-6 md:px-12 lg:px-20 py-10 md:py-14 lg:py-20"
            cardClassName="rounded-3xl shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] border-transparent"
          >
            <div className="flex flex-col gap-6">
              <h4 className="text-[18px] leading-[24px] font-bold text-[#2a2a2a]">
                {textContent.applicantTypeChart.title}
              </h4>
              <div className="flex flex-col md:flex-row justify-center items-center h-[320px] relative z-10">
                <div className="w-full md:w-[60%] h-[240px] md:h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredApplicantData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="percentage"
                        isAnimationActive={false}
                      >
                        {sortedApplicantData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={entry.color}
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                        formatter={(value: number, name: string) => [
                          `${value}%`,
                          textContent.applicantTypeChart.tooltip.percentage,
                        ]}
                        labelFormatter={(label) =>
                          `${textContent.applicantTypeChart.tooltip.type}: ${label}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col flex-1 text-sm justify-center gap-2 p-4">
                  {sortedApplicantData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="flex flex-1 justify-between">
                        <span className="text-gray-700 px-2">{entry.type}</span>
                        <span className="font-semibold text-gray-900">{entry.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GradientBlock>
        </section>
      </div>
    </section>
  );
};

export default StatisticsReportsSection;
