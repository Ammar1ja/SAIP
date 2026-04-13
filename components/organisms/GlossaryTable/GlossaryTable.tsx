'use client';

import React from 'react';
import { GlossaryRow } from '@/components/molecules/GlossaryRow/GlossaryRow';
import { useDirection } from '@/context/DirectionContext';
import { useTranslations } from 'next-intl';
import type { GlossaryTableProps } from './GlossaryTable.types';

const thBase =
  'h-12 border border-border-natural-primary bg-neutral-100 px-4 py-2 text-xs font-medium leading-[18px] tracking-normal text-text-primary-paragraph';

export const GlossaryTable: React.FC<GlossaryTableProps> = ({ data }) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const t = useTranslations('ipGlossary.table');

  return (
    <table
      className="w-full min-w-0 table-auto border-collapse border-y border-border-natural-primary"
      dir={dir}
    >
      <thead>
        <tr>
          {isRtl ? (
            <>
              <th className={`${thBase} w-[50%] min-w-0 text-end`}>{t('arabic')}</th>
              <th className={`${thBase} w-[50%] min-w-0 text-start`}>{t('english')}</th>
              <th className="h-12 w-16 min-w-16 border border-border-natural-primary bg-neutral-100" />
            </>
          ) : (
            <>
              <th className={`${thBase} w-[50%] min-w-0 text-start`}>{t('english')}</th>
              <th className={`${thBase} w-[50%] min-w-0 text-end`}>{t('arabic')}</th>
              <th className="h-12 w-16 min-w-16 border border-border-natural-primary bg-neutral-100" />
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map((entry, index) => (
          <GlossaryRow
            key={index}
            index={index}
            english={entry.english}
            arabic={entry.arabic}
            description={entry.description}
            isRtl={isRtl}
          />
        ))}
      </tbody>
    </table>
  );
};
