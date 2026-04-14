'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';
import { ChevronIcon } from '@/components/icons';
import { Button } from '@/components/atoms/Button/Button';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
import { ExpandableTabProps } from './ExpandableTab.types';
import {
  expandableTabStyles,
  headerStyles,
  titleStyles,
  contentStyles,
  buttonStyles,
  chevronStyles,
} from './ExpandableTab.styles';
import FaqQuestionFeedback from '@/components/molecules/FaqQuestionFeedback/FaqQuestionFeedback';

export const ExpandableTab = ({
  title,
  description,
  image,
  isExpanded,
  onToggle,
  className,
  id,
  showFeedback = false,
  lastUpdate,
  buttonLabel,
  buttonHref,
  buttonAriaLabel,
  buttonLabel2,
  buttonHref2,
  buttonAriaLabel2,
  variant = 'default',
  isFirst = false,
  isLast = false,
}: ExpandableTabProps) => {
  const t = useTranslations('common.expandableTab');
  const tButtons = useTranslations('buttons');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      setDirection((window.document.dir || 'ltr') as 'ltr' | 'rtl');
    }
  }, []);

  return (
    <div
      className={twMerge(
        expandableTabStyles({ variant, isExpanded }),
        className,
        variant === 'minimal' ? '!shadow-none' : 'border-t border-t-[#D2D6DB]',
      )}
    >
      <div
        className={twMerge(
          headerStyles(),
          variant === 'bordered' || variant === 'minimal'
            ? 'bg-transparent hover:bg-transparent px-4 py-4 !shadow-none border-t !border-t-[#D2D6DB]'
            : 'bg-neutral-100 hover:bg-neutral-200 px-6 py-4',
        )}
        role="button"
        onClick={onToggle}
      >
        <h3 className={titleStyles({ isExpanded })}>{title}</h3>
        <button className={buttonStyles()}>
          {variant !== 'minimal' && (
            <span
              className={twMerge(
                'text-sm font-medium hidden md:inline',
                variant === 'bordered' ? 'hidden' : '',
              )}
            >
              {isExpanded ? t('hide') : t('showMore')}
            </span>
          )}
          <ChevronIcon
            className={twMerge(
              'w-4 h-4',
              variant === 'bordered' ? 'text-[#161616]' : 'text-neutral-400',
              chevronStyles({ isExpanded, direction }),
            )}
            aria-hidden="true"
          />
        </button>
      </div>
      <div
        className={twMerge(
          'grid transition-all duration-200',
          contentStyles({ variant, isExpanded }),
        )}
      >
        <div className="overflow-hidden">
          <div
            className={twMerge(
              'py-6 space-y-4 px-6',
              variant === 'bordered' && 'pt-2 pb-6 px-4 ltr:pr-12 rtl:pl-12 space-y-2',
            )}
          >
            {image && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              </div>
            )}
            <p
              className={twMerge(
                'text-sm leading-relaxed text-neutral-700 text-left rtl:text-right',
                variant === 'bordered' && 'text-base leading-6 text-text-primary-paragraph',
              )}
            >
              {description}
            </p>
            {showFeedback && isExpanded && id && (
              <FaqQuestionFeedback
                questionId={id}
                questionTitle={typeof title === 'string' ? title : ''}
                lastUpdate={lastUpdate}
              />
            )}
            {(buttonLabel || buttonLabel2) && (
              <div className="flex flex-col space-y-3">
                {buttonLabel2 && buttonHref2 && (
                  <Button
                    href={buttonHref2}
                    intent="secondary"
                    size="md"
                    ariaLabel={buttonAriaLabel2 || buttonLabel2}
                    className="w-full"
                    fullWidth
                  >
                    {buttonLabel2 === tButtons('viewFile') && <ViewFigmaIcon className="w-5 h-5" />}{' '}
                    {buttonLabel2}
                  </Button>
                )}
                {buttonLabel && buttonHref && (
                  <Button
                    href={buttonHref}
                    intent="primary"
                    size="md"
                    ariaLabel={buttonAriaLabel || buttonLabel}
                    className="w-full"
                    fullWidth
                  >
                    {buttonLabel === tButtons('downloadFile') && (
                      <DownloadFigmaIcon className="w-5 h-5" />
                    )}{' '}
                    {buttonLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
