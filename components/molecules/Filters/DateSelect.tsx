'use client';

import React, { useId, useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useLocale } from 'next-intl';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import arabic from 'react-date-object/calendars/arabic';
import gregorian from 'react-date-object/calendars/gregorian';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import arabic_en from 'react-date-object/locales/arabic_en';
import gregorian_en from 'react-date-object/locales/gregorian_en';

interface DateSelectProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultToHijri?: boolean;
  restrictFutureDates?: boolean;
}

export const DateSelect: React.FC<DateSelectProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  defaultToHijri,
  restrictFutureDates = false,
}) => {
  const locale = useLocale();
  const generatedId = useId();
  const inputId = id || generatedId;
  const initialUseHijri = defaultToHijri !== undefined ? defaultToHijri : locale === 'ar';
  const [useHijri, setUseHijri] = useState(initialUseHijri);
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);
  const [_isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<{ closeCalendar: () => void } | null>(null);
  const hijriLocale = locale === 'ar' ? arabic_ar : arabic_en;
  const gregorianLocale = gregorian_en;

  // Update calendar type when locale changes
  useEffect(() => {
    if (defaultToHijri === undefined) {
      setUseHijri(locale === 'ar');
    }
  }, [locale, defaultToHijri]);

  // Initialize date from value prop
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const dateObj = new DateObject({
            date,
            calendar: useHijri ? arabic : gregorian,
            locale: useHijri ? hijriLocale : gregorianLocale,
          });
          setSelectedDate(dateObj);
        } else {
          setSelectedDate(null);
        }
      } catch {
        setSelectedDate(null);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value, useHijri]);

  const handleChange = (date: DateObject | DateObject[] | null) => {
    const singleDate = Array.isArray(date) ? date[0] : date;
    setSelectedDate(singleDate);
    if (singleDate) {
      // Always save as ISO string (Gregorian) for backend compatibility
      const gregorianDate = singleDate.convert(gregorian, gregorian_en);
      onChange(gregorianDate.toDate().toISOString());
    } else {
      onChange('');
    }
  };

  const toggleCalendar = () => {
    setUseHijri(!useHijri);
    // Convert the current date to the new calendar system
    if (selectedDate) {
      const newDate = new DateObject({
        date: selectedDate.toDate(),
        calendar: !useHijri ? arabic : gregorian,
        locale: !useHijri ? hijriLocale : gregorianLocale,
      });
      setSelectedDate(newDate);
    }
  };

  const handleToday = () => {
    const today = new DateObject({
      calendar: useHijri ? arabic : gregorian,
      locale: useHijri ? hijriLocale : gregorianLocale,
    });
    handleChange(today);
    datePickerRef.current?.closeCalendar();
  };

  const todayDate = new DateObject({
    calendar: useHijri ? arabic : gregorian,
    locale: useHijri ? hijriLocale : gregorianLocale,
  });

  const getDisplayValue = () => {
    if (selectedDate) {
      const format = useHijri ? 'DD/MM/YYYY' : 'DD.MM.YYYY';
      return selectedDate.format(format) + (useHijri ? (locale === 'ar' ? ' هـ' : ' AH') : '');
    }
    return useHijri
      ? locale === 'ar'
        ? 'اختر التاريخ'
        : placeholder || 'Select date'
      : placeholder || 'Select date';
  };

  return (
    <div className={twMerge('flex flex-col gap-1 relative', className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700 mb-1 text-start">
        {label}
      </label>

      <DatePicker
        ref={datePickerRef}
        value={selectedDate}
        onChange={handleChange}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        {...(restrictFutureDates && { maxDate: todayDate })}
        calendar={useHijri ? arabic : gregorian}
        locale={useHijri ? hijriLocale : gregorianLocale}
        calendarPosition="bottom-start"
        format={useHijri ? 'DD/MM/YYYY' : 'DD.MM.YYYY'}
        containerClassName="w-full"
        className={twMerge('rmdp-prime', useHijri && 'rmdp-rtl')}
        arrow={false}
        render={(_, openCalendar) => (
          <div
            className="w-full border border-neutral-200 rounded px-5 py-3 text-base bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-neutral-400 cursor-pointer text-start"
            onClick={openCalendar}
          >
            {getDisplayValue()}
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
