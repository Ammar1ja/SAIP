'use client';

import { useRef, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import arabic from 'react-date-object/calendars/arabic';
import gregorian from 'react-date-object/calendars/gregorian';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import arabic_en from 'react-date-object/locales/arabic_en';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import { twMerge } from 'tailwind-merge';
import { container, labelStyle } from './DateRangePicker.styles';

interface DateRangePickerProps {
  onChange?: (range: { from: Date; to: Date } | undefined) => void;
  initialRange?: { from: Date; to: Date };
  label?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  defaultToHijri?: boolean;
  restrictFutureDates?: boolean;
}

export const DateRangePicker = ({
  onChange,
  label,
  value,
  placeholder,
  className,
  defaultToHijri,
  restrictFutureDates = false,
}: DateRangePickerProps) => {
  const locale = useLocale();
  const [range, setRange] = useState<DateObject[]>([]);
  const initialUseHijri = defaultToHijri !== undefined ? defaultToHijri : locale === 'ar';
  const [useHijri, setUseHijri] = useState(initialUseHijri);
  const containerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<{ closeCalendar: () => void } | null>(null);
  const hijriLocale = locale === 'ar' ? arabic_ar : arabic_en;
  const gregorianLocale = gregorian_en;

  // Update calendar type when locale changes
  useEffect(() => {
    if (defaultToHijri === undefined) {
      setUseHijri(locale === 'ar');
    }
  }, [locale, defaultToHijri]);
  // Initialize range from value prop
  useEffect(() => {
    if (value) {
      const [fromStr, toStr] = value.split('|');
      if (fromStr && toStr) {
        try {
          const from = new Date(fromStr);
          const to = new Date(toStr);
          if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
            const calendar = useHijri ? arabic : gregorian;
            const locale = useHijri ? hijriLocale : gregorianLocale;
            if (fromStr === toStr) {
              setRange([new DateObject({ date: from, calendar, locale })]);
            } else {
              setRange([
                new DateObject({ date: from, calendar, locale }),
                new DateObject({ date: to, calendar, locale }),
              ]);
            }
          } else {
            setRange([]);
          }
        } catch {
          setRange([]);
        }
      } else {
        setRange([]);
      }
    } else {
      setRange([]);
    }
  }, [value, useHijri]);

  const handleChange = (dates: DateObject | DateObject[] | null) => {
    if (Array.isArray(dates) && dates.length === 2) {
      setRange(dates);
      // Convert to Gregorian for backend
      const fromGregorian = dates[0].convert(gregorian, gregorian_en);
      const toGregorian = dates[1].convert(gregorian, gregorian_en);
      onChange?.({
        from: fromGregorian.toDate(),
        to: toGregorian.toDate(),
      });
    } else if (Array.isArray(dates) && dates.length === 1) {
      setRange(dates);
      // Handle single date selection
      const fromGregorian = dates[0].convert(gregorian, gregorian_en);
      onChange?.({
        from: fromGregorian.toDate(),
        to: fromGregorian.toDate(),
      });
    } else {
      setRange([]);
      onChange?.(undefined);
    }
  };

  const toggleCalendar = () => {
    const newUseHijri = !useHijri;
    setUseHijri(newUseHijri);
    // Convert current range to new calendar
    if (range.length > 0) {
      const calendar = newUseHijri ? arabic : gregorian;
      const locale = newUseHijri ? hijriLocale : gregorianLocale;
      const newRange = range.map(
        (d) =>
          new DateObject({
            date: d.toDate(),
            calendar,
            locale,
          }),
      );
      setRange(newRange);
    }
  };

  const handleToday = () => {
    const today = new DateObject({
      calendar: useHijri ? arabic : gregorian,
      locale: useHijri ? hijriLocale : gregorianLocale,
    });
    handleChange([today, today]);
    datePickerRef.current?.closeCalendar();
  };

  const getTodayDate = () => {
    return new DateObject({
      calendar: useHijri ? arabic : gregorian,
      locale: useHijri ? hijriLocale : gregorianLocale,
    });
  };

  const formatDisplayValue = () => {
    const resolvePlaceholder = () => {
      if (placeholder) return placeholder;
      if (useHijri && locale === 'ar') return 'اختر النطاق';
      return 'Select date range';
    };

    if (range.length === 2) {
      const format = useHijri ? 'DD/MM/YYYY' : 'DD.MM.YYYY';
      const suffix = useHijri ? (locale === 'ar' ? ' هـ' : ' AH') : '';
      const date1 = range[0].format(format);
      const date2 = range[1].format(format);

      if (date1 === date2) {
        return `${date1}${suffix}`;
      }

      return `${date1}${suffix}-${date2}${suffix}`;
    }
    if (range.length === 1) {
      const format = useHijri ? 'DD/MM/YYYY' : 'DD.MM.YYYY';
      const suffix = useHijri ? (locale === 'ar' ? ' هـ' : ' AH') : '';
      return `${range[0].format(format)}${suffix}`;
    }
    return resolvePlaceholder();
  };

  return (
    <div className={twMerge(container(), className)} ref={containerRef}>
      {label && <label className={twMerge(labelStyle(), 'text-start')}>{label}</label>}

      <DatePicker
        ref={datePickerRef}
        value={range}
        onChange={handleChange}
        range
        rangeHover
        {...(restrictFutureDates && { maxDate: getTodayDate() })}
        calendar={useHijri ? arabic : gregorian}
        locale={useHijri ? hijriLocale : gregorianLocale}
        calendarPosition="bottom-start"
        format={useHijri ? 'DD/MM/YYYY' : 'DD.MM.YYYY'}
        containerClassName="w-full"
        className={twMerge('rmdp-prime', useHijri && 'rmdp-rtl')}
        arrow={true}
        highlightToday={true}
        render={(_, openCalendar) => (
          <div
            className="w-full h-10 border border-[#9DA4AE] rounded-sm px-4 py-0 text-base bg-white focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 focus:border-black hover:border-[#9CA3AF] placeholder:text-text-secondary-paragraph cursor-pointer flex items-center text-start transition-all duration-200 ease-in-out"
            onClick={openCalendar}
          >
            <svg
              className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span
              className={range.length === 0 ? 'text-text-secondary-paragraph' : 'text-text-default'}
            >
              {formatDisplayValue()}
            </span>
          </div>
        )}
      >
        {/* Footer with Today and Calendar Toggle buttons */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleToday}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {useHijri ? 'اليوم' : 'Today'}
          </button>
          <button
            type="button"
            onClick={toggleCalendar}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {locale === 'ar' ? (useHijri ? 'ميلادي' : 'هجري') : useHijri ? 'Gregorian' : 'Hijri'}
          </button>
        </div>
      </DatePicker>
    </div>
  );
};
