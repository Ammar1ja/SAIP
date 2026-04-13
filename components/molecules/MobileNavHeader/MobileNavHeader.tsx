'use client';

import React, { useState } from 'react';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import { MobileNavDrawer } from './MobileNavDrawer';
import { twMerge } from 'tailwind-merge';

interface MobileNavHeaderProps {
  title: string;
  onBackClick?: () => void;
  locale?: string;
  className?: string;
  showBackButton?: boolean;
}

export const MobileNavHeader = ({
  title,
  onBackClick,
  locale,
  className,
  showBackButton = true,
}: MobileNavHeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div
        className={twMerge(
          'flex items-center justify-between px-4 py-4 bg-white shadow-sm lg:hidden',
          className,
        )}
      >
        {showBackButton ? (
          <button onClick={onBackClick} aria-label="Go back" className="rounded-md bg-gray-100 p-1">
            <ArrowWide direction="left" size="small" shape="square" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <span className="text-sm font-semibold truncate text-gray-900">{title}</span>

        <button
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md bg-gray-100 p-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="#161616"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        locale={locale}
      />
    </>
  );
};
