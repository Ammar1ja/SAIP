'use client';

import React, { useState } from 'react';
import { ChevronIcon } from '@/components/icons';
import { GlossaryRowProps } from './GlossaryRow.types';

export const GlossaryRow: React.FC<GlossaryRowProps & { index: number }> = ({
  english,
  arabic,
  description,
  index,
  isRtl = false,
}) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const isEven = index % 2 === 1;

  return (
    <>
      <tr className={`${isEven ? 'bg-neutral-50' : 'bg-white'} cursor-pointer transition`}>
        {isRtl ? (
          <>
            <td
              onClick={() => setIsOpen((prev) => !prev)}
              className="min-h-16 w-[50%] min-w-0 border-b border-border-natural-primary px-4 py-3 text-end align-top text-base font-normal leading-6 text-text-default break-words [overflow-wrap:anywhere]"
            >
              {arabic}
            </td>
            <td
              onClick={() => setIsOpen((prev) => !prev)}
              className="min-h-16 w-[50%] min-w-0 border-b border-border-natural-primary px-4 py-3 text-start align-top text-base font-normal leading-6 text-text-default break-words [overflow-wrap:anywhere]"
            >
              {english}
            </td>
          </>
        ) : (
          <>
            <td
              onClick={() => setIsOpen((prev) => !prev)}
              className="min-h-16 w-[50%] min-w-0 border-b border-border-natural-primary px-4 py-3 text-start align-top text-base font-normal leading-6 text-text-default break-words [overflow-wrap:anywhere]"
            >
              {english}
            </td>
            <td
              onClick={() => setIsOpen((prev) => !prev)}
              className="min-h-16 w-[50%] min-w-0 border-b border-border-natural-primary px-4 py-3 text-end align-top text-base font-normal leading-6 text-text-default break-words [overflow-wrap:anywhere]"
            >
              {arabic}
            </td>
          </>
        )}
        <td className="min-h-16 w-16 min-w-16 border-b border-border-natural-primary align-middle text-center">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Collapse row details' : 'Expand row details'}
            className="inline-flex size-5 items-center justify-center text-[#161616]"
          >
            <ChevronIcon
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </td>
      </tr>

      {isOpen ? (
        <tr className={`${isEven ? 'bg-neutral-50' : 'bg-white'}`}>
          <td
            colSpan={2}
            className={`min-h-10 border-b border-border-natural-primary px-4 py-3 text-sm font-normal leading-5 text-text-primary-paragraph break-words [overflow-wrap:anywhere] ${
              isRtl ? 'text-end' : 'text-start'
            }`}
          >
            {description}
          </td>
          <td className="min-h-10 w-16 min-w-16 border-b border-border-natural-primary" />
        </tr>
      ) : null}
    </>
  );
};
