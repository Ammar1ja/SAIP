'use client';

import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ImageExportCardProps } from '@/components/molecules/ImageExportCard/ImageExportCard.types';
import { Button } from '@/components/atoms/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  containerStyles,
  imageStyles,
  wrapperStyles,
} from '@/components/molecules/ImageExportCard/ImageExportCard.styles';

export const ImageExportCard: FC<ImageExportCardProps> = ({
  title,
  description,
  downloads,
  image,
  className,
}) => {
  const isMobile = useIsMobile();
  const t = useTranslations('branding');

  const formatLabels: Record<string, string> = {
    svg: t('downloadSvg'),
    png: t('downloadPng'),
    jpg: t('downloadJpg'),
  };

  const availableDownloads =
    downloads &&
    Object.entries(downloads).filter(([, href]) => typeof href === 'string' && href.trim() !== '');
  const preferredFormats = ['svg', 'png', 'jpg'];
  const preferredDownload =
    availableDownloads?.find(([format]) => preferredFormats.includes(format)) ||
    availableDownloads?.[0];

  return (
    <>
      <div className={twMerge(containerStyles(), className)}>
        <div className={wrapperStyles()}>
          <div className="flex flex-col justify-center gap-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-text-default">
              {title}
            </h2>
            <div className="text-text-primary-paragraph text-lg font-normal">{description}</div>
            {isMobile ? (
              preferredDownload ? (
                <Button
                  intent="secondary"
                  outline
                  size="md"
                  href={preferredDownload[1] as string}
                  download
                  className="w-full"
                  ariaLabel={t('downloadLogo') || 'Download logo'}
                >
                  {t('downloadLogo') || 'Download logo'}
                </Button>
              ) : (
                <Button
                  intent="secondary"
                  outline
                  size="md"
                  className="w-full"
                  ariaLabel={t('downloadLogo') || 'Download logo'}
                  disabled
                >
                  {t('downloadLogo') || 'Download logo'}
                </Button>
              )
            ) : (
              <div className="flex flex-row justify-start gap-4">
                {availableDownloads && availableDownloads.length > 0
                  ? availableDownloads.map(([format, href]) => (
                      <Button
                        intent="secondary"
                        outline
                        key={format}
                        href={href}
                        className="w-full md:w-auto"
                        ariaLabel={formatLabels[format] || `Download ${format.toUpperCase()}`}
                      >
                        {formatLabels[format] || `Download ${format.toUpperCase()}`}
                      </Button>
                    ))
                  : ['svg', 'png', 'jpg'].map((format) => (
                      <Button
                        intent="secondary"
                        outline
                        size="md"
                        key={format}
                        className="w-full md:w-auto"
                        ariaLabel={formatLabels[format] || `Download ${format.toUpperCase()}`}
                        disabled
                      >
                        {formatLabels[format] || `Download ${format.toUpperCase()}`}
                      </Button>
                    ))}
              </div>
            )}
          </div>
          <div className={imageStyles()}>
            <Image {...image} fill className="object-contain object-center" />
          </div>
        </div>
      </div>
    </>
  );
};
