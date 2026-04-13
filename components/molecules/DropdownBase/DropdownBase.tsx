'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { DropdownBaseProps } from './DropdownBase.types';
import { dropdownBase, button, menu } from './DropdownBase.styles';

/**
 * DropdownBase component
 */
export const DropdownBase = React.forwardRef<HTMLDivElement, DropdownBaseProps>(
  ({ buttonContent, children, label, className }, ref) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
          document.removeEventListener('mousedown', handleClickOutside);
        }
      };
    }, []);

    return (
      <div ref={dropdownRef} className={twMerge(dropdownBase({ className }))}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={button()}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={label}
        >
          {buttonContent}
        </button>

        {open && (
          <div role="menu" className={menu({ position: isRTL ? 'right' : 'left' })}>
            {children}
          </div>
        )}
      </div>
    );
  },
);

DropdownBase.displayName = 'DropdownBase';
