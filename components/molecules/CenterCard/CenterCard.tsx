'use client';

import React from 'react';
import Image from 'next/image';
import { LocationPinIcon } from '@/components/icons/services';
import { twMerge } from 'tailwind-merge';
import { CenterCardProps } from './CenterCard.types';
import { useTranslations } from 'next-intl';

const CenterCard = ({ logo, name, location, email, website, className }: CenterCardProps) => {
  const t = useTranslations('ipSupportCenters.centers');
  return (
    <div
      className={twMerge(
        'box-border mx-auto flex h-[600px] min-h-[600px] max-h-[600px] w-full min-w-0 max-w-[410px] flex-col rounded-lg border border-border-natural-primary bg-white p-[24px] shadow-card',
        className,
      )}
    >
      <div className="mb-[24px] flex flex-col items-center justify-center gap-[24px] text-center">
        <div className="relative h-[250px] w-full min-w-0 max-w-full overflow-hidden rounded-md">
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            className="object-contain object-center"
            sizes="(max-width: 410px) 100vw, 362px"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      </div>

      {/* Contact block — fills remaining height under Figma 600px card */}
      <div className="flex min-h-0 flex-1 flex-col gap-[24px] rounded-lg bg-gray-50 p-[24px]">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-primary-600 p-1.5 text-white">
            <LocationPinIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{t('location')}</div>
            <div className="text-sm text-gray-700">{location}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-primary-600 p-1.5 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{t('email')}</div>
            <a
              href={`mailto:${email}`}
              className="break-all text-sm text-primary-600 hover:underline"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-primary-600 p-1.5 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{t('website')}</div>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-primary-600 hover:underline"
            >
              {website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterCard;
