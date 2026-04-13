'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronIcon } from '@/components/icons';
import { twMerge } from 'tailwind-merge';
import { useDirection } from '@/context/DirectionContext';
import { useVerificationBar } from '@/context/VerificationBarContext';
import VerificationInfoItem from '@/components/molecules/VerificationInfoItem';
import { useTranslations } from 'next-intl';

export const VerificationBar = () => {
  const { isExpanded, setIsExpanded, setAccordionHeight } = useVerificationBar();
  const accordionRef = useRef<HTMLDivElement>(null);
  const dir = useDirection() || 'ltr';
  const t = useTranslations('verificationBar');

  useEffect(() => {
    const accordionElement = accordionRef.current;
    if (!accordionElement) return;

    if (isExpanded) {
      const measureHeight = () => {
        const originalMaxHeight = accordionElement.style.maxHeight;
        accordionElement.style.maxHeight = 'none';
        const height = accordionElement.scrollHeight;
        accordionElement.style.maxHeight = originalMaxHeight;
        setAccordionHeight(height);
      };

      const timeoutId = setTimeout(measureHeight, 50);
      return () => clearTimeout(timeoutId);
    } else {
      setAccordionHeight(0);
    }
  }, [isExpanded, setAccordionHeight]);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] hidden w-full min-w-0 bg-neutral-100 text-gray-900 md:block">
      <div className="w-full bg-neutral-100">
        <div className="mx-auto h-8 max-h-8 min-h-8 max-w-screen-2xl px-4 md:px-8">
          <div className="flex h-full min-h-0 max-h-8 items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/images/Country_Flags.svg"
                alt="Saudi Arabia Flag"
                width={20}
                height={15}
                className="object-contain"
              />
              <span className="font-body text-sm font-medium text-text-default">
                {t('officialWebsite')}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-2 text-sm text-green-700 hover:underline focus:outline-none cursor-pointer"
              aria-expanded={isExpanded}
              aria-controls="verification-accordion"
            >
              {t('howYouKnow')}
              <ChevronIcon
                className={twMerge(
                  'w-3.5 h-3.5 transition-transform duration-300 text-green-700',
                  isExpanded ? 'rotate-180' : '',
                )}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={accordionRef}
        id="verification-accordion"
        className={twMerge(
          'w-full bg-neutral-100 text-gray-900 overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <VerificationInfoItem
                icon={
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-green-700 bg-neutral-100">
                    <Image
                      src="/images/chains.svg"
                      alt="Chain link icon"
                      width={18}
                      height={18}
                      className="h-[17.5px] w-[17.5px] object-contain"
                    />
                  </div>
                }
                title={t('govSaTitle')}
                description={
                  <>
                    {t('govSaDescription')}{' '}
                    <span className="font-semibold text-green-700">.gov.sa</span>.
                  </>
                }
                highlightText=".gov.sa"
              />
            </div>
            <div>
              <VerificationInfoItem
                icon={
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#079455]">
                    <Image
                      src="/images/lock_icon.svg"
                      alt="Lock icon"
                      width={20}
                      height={24}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                }
                title={t('httpsTitle')}
                description={<>{t('httpsDescription')}</>}
                highlightText="HTTPS"
              />
            </div>
          </div>
          {/* White block - aligned with content above */}
          <div className="mt-6 rounded-md bg-white px-12 py-2">
            <VerificationInfoItem
              className="items-center gap-[18px]"
              icon={
                <Image
                  src="/images/fingerprint.svg"
                  alt="Fingerprint icon"
                  width={21}
                  height={31}
                  className="object-contain"
                />
              }
              description={
                <>
                  {t('registeredOn')}{' '}
                  <a href="#" className="font-semibold text-green-700 hover:underline">
                    20240709062
                  </a>
                </>
              }
              descriptionClassName="!m-0 font-body text-base font-medium leading-6 text-text-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBar;
