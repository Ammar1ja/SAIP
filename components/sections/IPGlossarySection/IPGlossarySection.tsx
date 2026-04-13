'use client';

import React, { useState, useEffect } from 'react';
import { GlossaryTable } from '@/components/organisms/GlossaryTable/GlossaryTable';
import { GlossaryTabs } from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import { LetterFilterGroup } from '@/components/molecules/LetterFilterGroup/LetterFilterGroup';
import { ARABIC_LETTERS, ENGLISH_LETTERS } from './IPGlossary.data';
import Pagination from '@/components/atoms/Pagination';
import { Table, type TableColumn } from '@/components/organisms/Table';
import { GlossaryTermData, AcronymData } from '@/lib/drupal/services/ip-glossary.service';
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 10;
const ARABIC_TOGGLE_STORAGE_KEY = 'ipGlossary_arabicToggle';

interface IPGlossarySectionProps {
  glossaryTerms: GlossaryTermData[];
  acronyms: AcronymData[];
}

export const IPGlossarySection: React.FC<IPGlossarySectionProps> = ({
  glossaryTerms,
  acronyms,
}) => {
  const t = useTranslations('ipGlossary');
  const [activeTab, setActiveTab] = useState<'Glossary' | 'Acronyms'>('Glossary');
  const [activeLetter, setActiveLetter] = useState<string>('ALL');

  const [isArabic, setIsArabic] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ARABIC_TOGGLE_STORAGE_KEY);
      return saved === 'true';
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLetters = isArabic ? ARABIC_LETTERS : ENGLISH_LETTERS;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ARABIC_TOGGLE_STORAGE_KEY, String(isArabic));
    }
  }, [isArabic]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeLetter, activeTab, searchQuery]);

  const filteredGlossary = glossaryTerms.filter((entry) => {
    let matchesLetter = true;
    if (activeLetter !== 'ALL') {
      if (isArabic) {
        matchesLetter = entry.arabic.trim().startsWith(activeLetter);
      } else {
        matchesLetter = entry.english.toUpperCase().startsWith(activeLetter);
      }
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch =
        entry.english.toLowerCase().includes(query) ||
        entry.arabic.includes(query) ||
        entry.description.toLowerCase().includes(query);
    }

    return matchesLetter && matchesSearch;
  });

  const filteredAcronyms = acronyms.filter((entry) => {
    let matchesLetter = true;
    if (activeLetter !== 'ALL') {
      if (isArabic) {
        matchesLetter = entry.arabicName.trim().startsWith(activeLetter);
      } else {
        matchesLetter =
          entry.englishName.toUpperCase().startsWith(activeLetter) ||
          entry.acronym.toUpperCase().startsWith(activeLetter);
      }
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch =
        entry.acronym.toLowerCase().includes(query) ||
        entry.englishName.toLowerCase().includes(query) ||
        entry.arabicName.includes(query);
    }

    return matchesLetter && matchesSearch;
  });

  const totalGlossaryPages = Math.ceil(filteredGlossary.length / ITEMS_PER_PAGE);
  const totalAcronymsPages = Math.ceil(filteredAcronyms.length / ITEMS_PER_PAGE);

  const paginatedGlossary = filteredGlossary.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const paginatedAcronyms = filteredAcronyms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleArabicToggle = () => {
    setIsArabic((prev) => !prev);
    setActiveLetter('ALL');
  };

  const handleClearFilters = () => {
    setActiveLetter('ALL');
    setSearchQuery('');
  };

  // Define columns for acronyms table with translations
  const acronymsColumns: TableColumn<AcronymData>[] = [
    {
      key: 'acronym',
      header: t('table.acronym'),
      align: 'left',
    },
    {
      key: 'englishName',
      header: t('table.englishName'),
      align: 'left',
    },
    {
      key: 'arabicName',
      header: t('table.arabicName'),
      align: 'right',
    },
  ];

  // Translated tabs
  const tabLabels = {
    Glossary: t('tabs.glossary'),
    Acronyms: t('tabs.acronyms'),
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto box-border flex min-w-0 w-full max-w-[1280px] flex-col gap-6 px-4 xl:px-0">
        <GlossaryTabs
          tabs={['Glossary', 'Acronyms']}
          tabLabels={tabLabels}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'Glossary' | 'Acronyms')}
          indicatorInsetPx={16}
        />

        {activeTab === 'Glossary' && (
          <>
            <LetterFilterGroup
              letters={currentLetters}
              selectedLetter={activeLetter}
              onSelect={(letter) => setActiveLetter(letter)}
              onClear={handleClearFilters}
              isArabic={isArabic}
              onArabicToggle={handleArabicToggle}
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
            />
            <h2 className="text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
              {t('totalNumber')}: {filteredGlossary.length}
            </h2>
            <GlossaryTable data={paginatedGlossary} />
            {totalGlossaryPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalGlossaryPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {activeTab === 'Acronyms' && (
          <>
            <LetterFilterGroup
              letters={currentLetters}
              selectedLetter={activeLetter}
              onSelect={(letter) => setActiveLetter(letter)}
              onClear={handleClearFilters}
              isArabic={isArabic}
              onArabicToggle={handleArabicToggle}
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
            />
            <h2 className="text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
              {t('totalNumber')}: {filteredAcronyms.length}
            </h2>
            <Table columns={acronymsColumns} data={paginatedAcronyms} />
            {totalAcronymsPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalAcronymsPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};
