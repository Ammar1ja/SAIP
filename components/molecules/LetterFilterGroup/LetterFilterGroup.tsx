'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LetterFilterGroupProps } from './LetterFilterGroup.types';
import { LetterFilterButton } from '@/components/atoms/LetterFilterButton/LetterFilterButton';
import Search from '@/components/atoms/Search';
import { ToggleSwitch } from '@/components/atoms/ToggleSwitch/ToggleSwitch';

import {
  groupWrapper,
  topRow,
  searchColumn,
  letterTitle,
  letterList,
  clearFiltersButton,
} from './LetterFilterGroup.styles';

export const LetterFilterGroup: React.FC<LetterFilterGroupProps> = ({
  letters,
  selectedLetter,
  onSelect,
  onClear,
  isArabic,
  onArabicToggle,
  searchQuery,
  onSearchChange,
}) => {
  const t = useTranslations('ipGlossary');

  return (
    <div className={groupWrapper()}>
      <div className={topRow()}>
        <div className="space-y-6">
          <div className={searchColumn()}>
            <div className="w-full max-w-[384px]">
              <Search
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                label={t('search')}
                placeholder={t('search')}
              />
            </div>
            <div className="flex items-center justify-end w-full lg:w-auto">
              <ToggleSwitch
                checked={isArabic}
                onChange={onArabicToggle}
                label={t('arabicAlphabet')}
                ariaLabel={t('arabicAlphabet')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className={letterTitle()}>{t('filterByLetter')}</p>
            <div className={letterList()}>
              <LetterFilterButton
                label={t('all')}
                selected={selectedLetter === 'ALL'}
                onClick={() => onSelect('ALL')}
                className="w-auto min-w-0 max-w-none px-4 whitespace-nowrap"
              />
              {letters.map((letter) => (
                <LetterFilterButton
                  key={letter}
                  label={letter}
                  selected={selectedLetter === letter}
                  onClick={() => onSelect(letter)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button type="button" onClick={onClear} className={clearFiltersButton()}>
            {t('clearFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};
