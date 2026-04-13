'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useContrast } from '@/context/ContrastContext';
import { AccessibilityToolsProps } from './AccessibilityTools.types';
import { accessibilityTools, accessibilityButton, heading } from './AccessibilityTools.styles';
import { useTranslations } from 'next-intl';

const FONT_SIZE_KEY = 'saip-font-size';

/**
 * AccessibilityTools component
 */
export const AccessibilityTools = React.forwardRef<HTMLDivElement, AccessibilityToolsProps>(
  ({ className }, ref) => {
    const t = useTranslations('accessibility');
    const { highContrast, toggleContrast } = useContrast();
    const [largeFontSize, setLargeFontSize] = useState(false);

    // Initialize font size from localStorage
    useEffect(() => {
      const stored = localStorage.getItem(FONT_SIZE_KEY) === 'large';
      setLargeFontSize(stored);
      if (stored) {
        document.documentElement.classList.add('large-font');
      }
    }, []);

    const toggleFontSize = () => {
      const newValue = !largeFontSize;
      setLargeFontSize(newValue);
      document.documentElement.classList.toggle('large-font', newValue);
      localStorage.setItem(FONT_SIZE_KEY, newValue ? 'large' : 'normal');
    };

    return (
      <div ref={ref} className={twMerge(accessibilityTools({ className }))}>
        <h4 className={heading()}>{t('title')}</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleContrast}
            className={twMerge(
              accessibilityButton(),
              highContrast && 'bg-white/20 ring-2 ring-white/50',
            )}
            aria-label={t('highContrast')}
            aria-pressed={highContrast}
            title={highContrast ? t('contrastEnabled') : t('contrastDisabled')}
          >
            <Image
              src="/icons/contrast.svg"
              alt=""
              width={20}
              height={20}
              className="invert brightness-0"
            />
          </button>
          <button
            type="button"
            onClick={toggleFontSize}
            className={twMerge(
              accessibilityButton(),
              largeFontSize && 'bg-white/20 ring-2 ring-white/50',
            )}
            aria-label={t('fontSize')}
            aria-pressed={largeFontSize}
            title={largeFontSize ? t('fontSizeLarge') : t('fontSizeNormal')}
          >
            <Image
              src="/icons/text-size.svg"
              alt=""
              width={20}
              height={20}
              className="invert brightness-0"
            />
          </button>
        </div>
      </div>
    );
  },
);

AccessibilityTools.displayName = 'AccessibilityTools';
