import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { containerStyles, imageStyles, textContainerStyles } from './PhotoContainer.styles';
import { Button } from '@/components/atoms/Button/Button';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
import { useTranslations } from 'next-intl';

interface PhotoContainerProps {
  image?: {
    src: string;
    alt: string;
  };
  title?: string;
  description: ReactNode;
  className?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
  buttonLabel2?: string;
  buttonHref2?: string;
  buttonAriaLabel2?: string;
  imageClassName?: string;
  contentClassName?: string;
  descriptionClassName?: string;
}

export const PhotoContainer: FC<PhotoContainerProps> = ({
  image,
  title,
  description,
  className,
  buttonLabel,
  buttonHref,
  buttonAriaLabel,
  buttonLabel2,
  buttonHref2,
  buttonAriaLabel2,
  imageClassName,
  contentClassName,
  descriptionClassName,
}) => {
  const tButtons = useTranslations('buttons');
  const downloadFileText = tButtons('downloadFile');
  const viewFileText = tButtons('viewFile');

  // ✅ FIX: Apply proxy logic for Drupal files to fix CORS and download issues
  // Check if button 1 (primary/download) is a Drupal file
  const isDrupalFile1 =
    buttonHref && buttonHref.startsWith('http') && buttonHref.includes('/sites/default/files/');

  // Check if button 2 (secondary/view) is a Drupal file
  const isDrupalFile2 =
    buttonHref2 && buttonHref2.startsWith('http') && buttonHref2.includes('/sites/default/files/');

  // Transform URLs for proxy (SECURITY: path-based approach)
  const getProxyUrl = (
    url: string | undefined,
    action: 'view' | 'download' = 'view',
  ): string | undefined => {
    if (!url) return url;

    const isDrupalFile = url.startsWith('http') && url.includes('/sites/default/files/');
    if (!isDrupalFile) return url;

    try {
      // Extract path from URL for security
      const urlObj = new URL(url);
      const filePath = urlObj.pathname;

      // Only proxy /sites/default/files/ paths
      if (!filePath.startsWith('/sites/default/files/')) {
        return url;
      }

      const encodedPath = encodeURIComponent(filePath);
      return `/api/proxy-file?path=${encodedPath}&action=${action}`;
    } catch {
      return url;
    }
  };

  // Button 1 (primary/download) URL
  const finalButtonHref = getProxyUrl(buttonHref, 'download');
  const shouldDownload1 = buttonLabel === downloadFileText && isDrupalFile1;

  // Button 2 (secondary/view) URL
  const finalButtonHref2 = getProxyUrl(buttonHref2, 'view');
  const shouldOpenInNewTab2 = buttonLabel2 === viewFileText && isDrupalFile2;

  return (
    <div className={twMerge(containerStyles(), className)}>
      <div className={textContainerStyles()}>
        {image && (
          <div className={twMerge(imageStyles(), imageClassName)}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div className={twMerge('space-y-4 px-4', contentClassName)}>
          {title && <h3 className="text-2xl font-medium text-gray-900">{title}</h3>}
          <div className="space-y-4">
            <p
              className={twMerge('text-lg text-gray-600 leading-relaxed', descriptionClassName)}
              dangerouslySetInnerHTML={{ __html: String(description) }}
            />
            <div className="flex flex-row space-x-4">
              {buttonLabel2 && finalButtonHref2 && (
                <Button
                  href={finalButtonHref2}
                  intent="secondary"
                  size="md"
                  ariaLabel={buttonAriaLabel2 || buttonLabel2}
                  className="max-w-fit"
                  fullWidth={false}
                  target={shouldOpenInNewTab2 ? '_blank' : undefined}
                >
                  {buttonLabel2 === viewFileText && <ViewFigmaIcon className="w-5 h-5" />}{' '}
                  {buttonLabel2}
                </Button>
              )}
              {buttonLabel && finalButtonHref && (
                <Button
                  href={finalButtonHref}
                  intent="primary"
                  size="md"
                  ariaLabel={buttonAriaLabel || buttonLabel}
                  className="max-w-fit"
                  fullWidth={false}
                  download={shouldDownload1 ? true : undefined}
                >
                  {buttonLabel === downloadFileText && (
                    <DownloadFigmaIcon className="w-5 h-5 text-white" />
                  )}{' '}
                  {buttonLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
