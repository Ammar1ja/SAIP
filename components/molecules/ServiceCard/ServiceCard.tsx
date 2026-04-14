'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
import { twMerge } from 'tailwind-merge';
import { useTranslations, useLocale } from 'next-intl';
import { normalizeServiceTypeKey } from '@/lib/drupal/utils';

export interface ServiceCardDetail {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  href?: string;
}

export interface ServiceCardProps {
  title: string;
  labels?: string[];
  labelVariants?: ('default' | 'success' | 'warning' | 'error')[];
  showLabelDots?: boolean;
  targetGroups?: string[];
  reportType?: string;
  reportTypeLabel?: string;
  description?: string;
  publicationDate?: string;
  publicationNumber?: string;
  durationDate?: string;
  postingDate?: string;
  postingDuration?: string;
  onClick?: () => void;
  primaryButtonLabel?: React.ReactNode;
  primaryButtonHref?: string;
  primaryButtonDownload?: boolean;
  primaryButtonOnClick?: () => void;
  primaryButtonClassName?: string;
  secondaryButtonLabel?: React.ReactNode;
  secondaryButtonHref?: string;
  secondaryButtonDownload?: boolean;
  secondaryButtonOnClick?: () => void;
  secondaryButtonClassName?: string;
  className?: string;
  href?: string;
  titleBg?: 'default' | 'green';
  variant?:
    | 'default'
    | 'detailed'
    | 'report'
    | 'services'
    | 'training'
    | 'movables'
    | 'consultation';
  details?: ServiceCardDetail[];
  buttonVariant?: 'default' | 'compact';
  imageUrl?: string;
}

const ServiceCard = ({
  title,
  labels,
  labelVariants,
  showLabelDots = false,
  description,
  reportType,
  reportTypeLabel,
  publicationDate,
  publicationNumber,
  durationDate,
  postingDate,
  postingDuration,
  onClick,
  primaryButtonLabel,
  primaryButtonHref,
  primaryButtonDownload,
  primaryButtonOnClick,
  primaryButtonClassName,
  secondaryButtonLabel,
  secondaryButtonHref,
  secondaryButtonDownload,
  secondaryButtonOnClick,
  secondaryButtonClassName,
  className,
  href,
  titleBg = 'default',
  variant = 'default',
  details,
  buttonVariant = 'default',
  imageUrl,
}: ServiceCardProps) => {
  const t = useTranslations('common.labels');
  const tButtons = useTranslations('ipLicensing');
  const tCommonButtons = useTranslations('common.buttons');
  const tServiceTypes = useTranslations('common.filters.serviceTypeOptions');
  const tIpCategories = useTranslations('common.filters.ipCategoryOptions');
  const tMovablesTable = useTranslations('movablesPlatform.table');
  const locale = useLocale();

  const downloadFileText = tButtons('downloadFile');
  const viewFileText = tButtons('viewFile');
  const getLabelVariantClasses = (variant?: 'default' | 'success' | 'warning' | 'error') => {
    switch (variant) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-700';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-700';
      case 'error':
        return 'bg-error-50 border-error-200 text-error-700';
      default:
        return '';
    }
  };

  const getLabelDotClasses = (variant?: 'default' | 'success' | 'warning' | 'error') => {
    switch (variant) {
      case 'success':
        return 'bg-success-700';
      case 'warning':
        return 'bg-warning-700';
      case 'error':
        return 'bg-error-700';
      default:
        return 'bg-[#4b5565]';
    }
  };

  // Translate hardcoded English button labels from Drupal
  const translatedPrimaryLabel =
    typeof primaryButtonLabel === 'string'
      ? primaryButtonLabel === 'Download file'
        ? tButtons('downloadFile')
        : primaryButtonLabel === 'Download'
          ? tButtons('downloadFile')
          : primaryButtonLabel === 'View details'
            ? tCommonButtons('viewDetails')
            : primaryButtonLabel
      : primaryButtonLabel;
  const translatedSecondaryLabel =
    typeof secondaryButtonLabel === 'string'
      ? secondaryButtonLabel === 'View file' || secondaryButtonLabel === 'View'
        ? tButtons('viewFile')
        : secondaryButtonLabel
      : secondaryButtonLabel;

  const resolvedPrimaryHref = primaryButtonHref || href;
  // Normalize href - convert empty strings, '#', or whitespace-only strings to undefined
  const normalizedHref =
    resolvedPrimaryHref &&
    typeof resolvedPrimaryHref === 'string' &&
    resolvedPrimaryHref !== '#' &&
    resolvedPrimaryHref.trim() !== ''
      ? resolvedPrimaryHref.trim()
      : undefined;
  const labelSuggestsDownload =
    typeof translatedPrimaryLabel === 'string' &&
    translatedPrimaryLabel.toLowerCase().includes('download');
  const hrefSuggestsDownload =
    typeof normalizedHref === 'string' &&
    /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i.test(normalizedHref);
  const shouldDownload =
    typeof primaryButtonDownload === 'boolean'
      ? primaryButtonDownload
      : labelSuggestsDownload || hrefSuggestsDownload;

  // For downloads from external Drupal backend, use Next.js API proxy to enable download
  // This solves cross-origin download issues (download attribute only works for same-origin)
  // SECURITY: Uses path-based approach
  const getDownloadUrl = (url: string | undefined): string | undefined => {
    if (!url || !shouldDownload) return url;

    // Check if URL is from Drupal backend (starts with http and contains /sites/default/files/)
    const isDrupalFile = url.startsWith('http') && url.includes('/sites/default/files/');

    if (isDrupalFile) {
      try {
        const urlObj = new URL(url);
        const filePath = urlObj.pathname;

        if (!filePath.startsWith('/sites/default/files/')) {
          return url;
        }

        const encodedPath = encodeURIComponent(filePath);
        return `/api/proxy-file?path=${encodedPath}&action=download`;
      } catch {
        return url;
      }
    }

    return url;
  };

  const downloadUrl = getDownloadUrl(normalizedHref);

  // Check if secondary button href is a file
  const normalizedSecondaryHref =
    secondaryButtonHref &&
    typeof secondaryButtonHref === 'string' &&
    secondaryButtonHref !== '#' &&
    secondaryButtonHref.trim() !== ''
      ? secondaryButtonHref.trim()
      : undefined;
  const secondaryHrefIsFile =
    typeof normalizedSecondaryHref === 'string' &&
    /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i.test(normalizedSecondaryHref);
  const secondaryLabelSuggestsDownload =
    typeof translatedSecondaryLabel === 'string' &&
    (translatedSecondaryLabel.toLowerCase().includes('download') ||
      translatedSecondaryLabel === downloadFileText);
  const secondaryLabelSuggestsView =
    typeof translatedSecondaryLabel === 'string' &&
    (/\bview\b/i.test(translatedSecondaryLabel) || translatedSecondaryLabel.includes('عرض'));
  const shouldDownloadSecondary =
    typeof secondaryButtonDownload === 'boolean'
      ? secondaryButtonDownload
      : secondaryLabelSuggestsDownload || secondaryHrefIsFile;

  // ✅ FIX: Apply proxy logic to secondary button (View) as well!
  // This fixes 404 errors when viewing PDF files from Drupal
  const isDrupalSecondaryFile = normalizedSecondaryHref
    ? normalizedSecondaryHref.startsWith('http') &&
      normalizedSecondaryHref.includes('/sites/default/files/')
    : false;

  const getSecondaryUrl = (
    url: string | undefined,
    action: 'view' | 'download' = 'view',
  ): string | undefined => {
    if (!url) return url;
    if (url.startsWith('/api/proxy-file')) return url;

    if (isDrupalSecondaryFile) {
      try {
        const urlObj = new URL(url);
        const filePath = urlObj.pathname;

        if (!filePath.startsWith('/sites/default/files/')) {
          return url;
        }

        const encodedPath = encodeURIComponent(filePath);
        return `/api/proxy-file?path=${encodedPath}&action=${action}`;
      } catch {
        return url;
      }
    }

    return url;
  };

  const secondaryUrl = getSecondaryUrl(
    normalizedSecondaryHref,
    shouldDownloadSecondary ? 'download' : 'view',
  );

  // For Drupal files (View button), open in new tab
  // For other external links, also open in new tab
  const secondaryButtonTarget = shouldDownloadSecondary
    ? undefined
    : isDrupalSecondaryFile ||
        (normalizedSecondaryHref &&
          !secondaryHrefIsFile &&
          normalizedSecondaryHref.startsWith('http'))
      ? '_blank'
      : undefined;
  const showDownloadIcon =
    typeof translatedPrimaryLabel === 'string' &&
    (translatedPrimaryLabel === downloadFileText || shouldDownload);
  const showViewIcon =
    typeof translatedSecondaryLabel === 'string' &&
    (translatedSecondaryLabel === viewFileText ||
      secondaryHrefIsFile ||
      isDrupalSecondaryFile ||
      secondaryLabelSuggestsView);

  if (variant === 'report') {
    return (
      <Card
        variant="news"
        border
        shadow={false}
        className={twMerge(
          'flex flex-col h-full overflow-hidden rounded-2xl p-6 max-w-none gap-6 min-h-[334px] hover:shadow-none',
          className,
        )}
      >
        <div className="flex w-full min-h-[118px] h-[118px] items-end rounded-md bg-primary-50 p-6">
          <h3 className="text-text-lg font-medium text-text-default tracking-normal line-clamp-3">
            {title}
          </h3>
        </div>

        <div className="flex-1 space-y-2 text-[14px] leading-[20px] text-text-secondary-paragraph text-left rtl:text-right">
          {publicationNumber && (
            <div>
              {t('publicationNumber')}: {publicationNumber}
            </div>
          )}
          {durationDate && (
            <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {t('durationDate')}: {durationDate}
            </div>
          )}
          {reportType && (
            <div>
              {reportTypeLabel || t('reportType')}: {reportType}
            </div>
          )}
          {publicationDate && (
            <div>
              {t('publicationDate')}: {publicationDate}
            </div>
          )}
        </div>

        {labels && labels?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map((label, idx) => (
              <Label key={`${label}-${idx}`} className="text-xs px-2 py-0.5">
                {label}
              </Label>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {translatedSecondaryLabel && (
            <Button
              href={secondaryUrl}
              download={shouldDownloadSecondary}
              onClick={secondaryButtonOnClick}
              intent="secondary"
              size="md"
              className="flex-1 min-w-0 min-h-[40px] inline-flex items-center justify-center whitespace-nowrap flex-nowrap border border-[#D2D6DB] px-2 md:px-3 gap-1.5 text-[14px] md:text-[15px] leading-6"
              target={secondaryButtonTarget}
              ariaLabel={
                typeof translatedSecondaryLabel === 'string'
                  ? translatedSecondaryLabel
                  : viewFileText
              }
            >
              {showViewIcon ? (
                <>
                  <ViewFigmaIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {translatedSecondaryLabel}
                </>
              ) : (
                translatedSecondaryLabel
              )}
            </Button>
          )}
          {translatedPrimaryLabel && (
            <Button
              href={downloadUrl}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className="flex-1 min-w-0 min-h-[40px] inline-flex items-center justify-center whitespace-nowrap flex-nowrap px-2 md:px-3 gap-1.5 text-[14px] md:text-[15px] leading-6"
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : downloadFileText
              }
            >
              {showDownloadIcon ? (
                <>
                  <DownloadFigmaIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {translatedPrimaryLabel}
                </>
              ) : (
                translatedPrimaryLabel
              )}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (variant === 'training' && details) {
    const renderTrainingValue = (value: string | string[]) => {
      if (Array.isArray(value)) {
        return (
          <div className="flex items-center gap-2 text-[16px] leading-[24px] text-[#384250]">
            <span>{value[0]}</span>
            <span className="w-px h-4 bg-[#d2d6db]" aria-hidden="true" />
            <span>{value[1]}</span>
          </div>
        );
      }

      return <span className="break-words text-[16px] leading-[24px] text-[#384250]">{value}</span>;
    };

    return (
      <Card
        border={false}
        shadow={false}
        className={twMerge(
          'flex h-auto min-h-0 flex-col gap-6 self-stretch max-w-none rounded-lg border border-[#d2d6db] bg-white p-6 lg:h-[440px] lg:min-h-[440px] lg:max-h-[440px]',
          className,
        )}
      >
        <div className="flex h-[118px] w-full items-end rounded-md bg-[#F3F4F6] p-6">
          <h3 className="line-clamp-2 text-[18px] font-medium leading-[28px] tracking-[0] text-text-default">
            {title}
          </h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#079455] text-white">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-1 break-words text-[18px] font-medium leading-[28px] tracking-[0] text-[#1F2A37]">
                    {item.label}
                  </div>
                  {renderTrainingValue(item.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto flex w-full flex-wrap items-center gap-3 sm:flex-nowrap">
          {translatedSecondaryLabel && (
            <Button
              href={secondaryButtonHref}
              download={shouldDownloadSecondary}
              onClick={secondaryButtonOnClick}
              intent="secondary"
              outline
              size="md"
              className="h-10 w-full justify-center px-4 text-base font-medium sm:w-auto sm:flex-none"
              target={secondaryButtonTarget}
              ariaLabel={
                typeof translatedSecondaryLabel === 'string'
                  ? translatedSecondaryLabel
                  : viewFileText
              }
            >
              {translatedSecondaryLabel}
            </Button>
          )}
          {translatedPrimaryLabel && (
            <Button
              href={downloadUrl || normalizedHref}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className="h-10 w-full justify-center px-4 text-base font-medium sm:w-auto sm:flex-none"
              disabled={!downloadUrl && !normalizedHref}
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : shouldDownload
                    ? downloadFileText
                    : tCommonButtons('viewDetails')
              }
            >
              {translatedPrimaryLabel}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (variant === 'detailed' && details) {
    const leftColumnDetails = details.slice(0, 3);
    const categoryDetail = details[3];

    const renderDetailValue = (item: ServiceCardDetail) => {
      if (!item.value) return null;
      if (item.href) {
        return (
          <a
            href={item.href}
            className="text-[#384250] text-sm leading-5 underline underline-offset-2 break-all"
          >
            {item.value}
          </a>
        );
      }

      return (
        <div className="text-[#384250] text-sm leading-5 break-words mt-[7px]">{item.value}</div>
      );
    };

    const categoryValues = Array.isArray(categoryDetail?.value)
      ? categoryDetail.value
      : typeof categoryDetail?.value === 'string' && categoryDetail.value.includes(',')
        ? categoryDetail.value
            .split(',')
            .map((cat) => cat.trim())
            .filter(Boolean)
        : categoryDetail?.value
          ? [categoryDetail.value]
          : [];

    const hasActionButtons = !!(translatedSecondaryLabel || translatedPrimaryLabel);
    const fillsParent =
      typeof className === 'string' &&
      (/\bh-full\b/.test(className) || /\b!h-full\b/.test(className));

    return (
      <div
        className={twMerge(
          'box-border flex w-full max-w-none flex-col overflow-hidden rounded-xl border border-border-natural-primary bg-[#F9FAFB] p-6 ',
          hasActionButtons
            ? 'min-h-[196px] h-auto shrink-0'
            : fillsParent
              ? 'h-full min-h-0 max-h-none shrink-0'
              : 'h-[196px] min-h-[196px] max-h-[196px] shrink-0',
          className,
        )}
      >
        <h3 className="line-clamp-2 shrink-0 text-[18px] font-medium leading-[28px] text-[#1f2a37]">
          {title}
        </h3>
        {description && (
          <div
            className="mt-3 shrink-0 text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <div
          className={twMerge(
            'min-h-0 overflow-y-auto [scrollbar-gutter:stable]',
            hasActionButtons ? 'mt-3 max-h-[min(360px,70vh)]' : 'mt-3 flex-1',
          )}
          aria-label="Service details"
        >
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <div className="flex flex-col gap-3">
              {leftColumnDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#079455] text-white">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[16px] font-medium leading-5 text-[#1F2A37]">
                      {item.label}
                    </div>
                    {renderDetailValue(item)}
                  </div>
                </div>
              ))}
            </div>
            {categoryDetail && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#079455] text-white">
                  {categoryDetail.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 text-[16px] font-medium leading-5 text-[#1F2A37]">
                    {categoryDetail.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryValues.map((cat, idx) => (
                      <span
                        key={`${cat}-${idx}`}
                        className="rounded-full border border-[#e5e7eb] bg-white px-2 py-[2px] text-[10px] font-semibold leading-[14px] text-[#1f2a37]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasActionButtons && (
          <div className="mt-3 flex shrink-0 flex-wrap gap-3 border-t border-border-natural-secondary/60 pt-3">
            {translatedSecondaryLabel && (
              <Button
                href={secondaryButtonHref}
                onClick={secondaryButtonOnClick}
                intent="secondary"
                size="md"
                className="flex-1 min-h-[40px] inline-flex items-center justify-center whitespace-nowrap"
                target={secondaryButtonTarget}
                ariaLabel={
                  typeof translatedSecondaryLabel === 'string'
                    ? translatedSecondaryLabel
                    : viewFileText
                }
              >
                {showViewIcon ? (
                  <>
                    <ViewFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                    {translatedSecondaryLabel}
                  </>
                ) : (
                  translatedSecondaryLabel
                )}
              </Button>
            )}
            {translatedPrimaryLabel && (
              <Button
                href={downloadUrl}
                download={shouldDownload}
                onClick={primaryButtonOnClick || onClick}
                intent="primary"
                size={buttonVariant === 'compact' ? 'sm' : 'md'}
                className={`${
                  buttonVariant === 'compact'
                    ? 'w-auto min-w-[120px] min-h-[32px]'
                    : 'flex-1 min-h-[40px]'
                } inline-flex items-center justify-center whitespace-nowrap`}
                ariaLabel={
                  typeof translatedPrimaryLabel === 'string'
                    ? translatedPrimaryLabel
                    : downloadFileText
                }
              >
                {showDownloadIcon ? (
                  <>
                    <DownloadFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                    {translatedPrimaryLabel}
                  </>
                ) : (
                  translatedPrimaryLabel
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'services') {
    const resolveServiceLabel = (rawLabel: string) => {
      const trimmed = rawLabel?.trim();
      if (!trimmed) return rawLabel;
      if (locale === 'ar' && /[\u0600-\u06FF]/.test(trimmed)) return trimmed;

      const serviceTypePrefixRegex = /^common\.filters\.serviceTypeOptions\./i;
      const categoryPrefixRegex = /^common\.filters\.ipCategoryOptions\./i;
      let key = trimmed;
      if (serviceTypePrefixRegex.test(trimmed)) {
        key = trimmed.replace(serviceTypePrefixRegex, '').trim();
      } else if (categoryPrefixRegex.test(trimmed)) {
        key = trimmed.replace(categoryPrefixRegex, '').trim();
      }
      const keyLower = key.toLowerCase();

      const normalizedServiceType = normalizeServiceTypeKey(key);
      if (normalizedServiceType) {
        return tServiceTypes(normalizedServiceType as any, { defaultValue: key });
      }

      const categoryKeyMap: Record<string, string> = {
        patents: 'Patents',
        trademarks: 'Trademarks',
        copyright: 'Copyright',
        copyrights: 'Copyright',
        designs: 'Designs',
        'plant varieties': 'Plant Varieties',
        'plant-varieties': 'Plant Varieties',
        'layout designs': 'Layout Designs',
        'layout-designs': 'Layout Designs',
        'layout designs of integrated circuits': 'Layout Designs',
        'topographic designs': 'Layout Designs',
        'براءات الاختراع': 'Patents',
        'العلامات التجارية': 'Trademarks',
        'حقوق النشر': 'Copyright',
        التصاميم: 'Designs',
        'الأصناف النباتية': 'Plant Varieties',
        'التصاميم الطبوغرافية': 'Layout Designs',
      };
      if (!['general', 'service'].includes(keyLower)) {
        const categoryKey = categoryKeyMap[keyLower] || key;
        if (categoryKeyMap[keyLower]) {
          const translatedCategory = tIpCategories(categoryKey as any, { defaultValue: '' });
          if (translatedCategory) return translatedCategory;
        }
      }

      return key;
    };

    return (
      <Card
        border={false}
        shadow={false}
        className={twMerge(
          'flex flex-col gap-6 h-full rounded-2xl bg-white border border-[#d2d6db] p-6',
          className,
        )}
      >
        <div className="flex h-[242px] flex-col gap-4">
          <div className="bg-neutral-100 rounded-md p-4 h-[118px] flex items-end">
            <h3 className="text-[18px] leading-[28px] font-medium text-[#161616] line-clamp-3">
              {title}
            </h3>
          </div>
          {labels && labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {labels.map((label, idx) => (
                <span
                  key={`${label}-${idx}`}
                  className="inline-flex items-center h-6 px-2 text-[12px] leading-[18px] font-medium text-[#1f2a37] bg-[#f9fafb] border border-[#e5e7eb] rounded-full"
                >
                  {resolveServiceLabel(label)}
                </span>
              ))}
            </div>
          )}
          {description && (
            <p className="h-[72px] text-[16px] leading-[24px] text-[#384250] line-clamp-3">
              {description}
            </p>
          )}
        </div>
        {translatedPrimaryLabel && (
          <div className="mt-auto">
            <Button
              href={downloadUrl || normalizedHref}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className="inline-flex w-full md:w-fit h-10 px-4 text-base font-medium"
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : shouldDownload
                    ? downloadFileText
                    : tCommonButtons('viewDetails')
              }
            >
              {showDownloadIcon ? (
                <>
                  <DownloadFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                  {translatedPrimaryLabel}
                </>
              ) : (
                translatedPrimaryLabel
              )}
            </Button>
          </div>
        )}
      </Card>
    );
  }

  if (variant === 'movables') {
    const statusLabel = labels?.[0];
    const statusVariant = labelVariants?.[0];
    const statusPillClasses = twMerge(
      'inline-flex items-center gap-1 h-6 px-2 rounded-full border text-[14px] leading-[20px] font-medium',
      getLabelVariantClasses(statusVariant),
      statusVariant === 'default' && 'text-[#1f2a37] bg-[#f9fafb] border-[#e5e7eb]',
    );
    const statusDotClasses = twMerge(
      'inline-block h-2 w-2 rounded-full',
      getLabelDotClasses(statusVariant),
    );

    return (
      <Card
        border={false}
        shadow={false}
        className={twMerge(
          'flex flex-col gap-4 rounded-2xl bg-white border border-[#d2d6db] p-4 max-w-none',
          className,
        )}
      >
        <div className="bg-primary-50 rounded-md p-4 h-[118px] flex items-end">
          <h3 className="text-[18px] leading-[28px] font-medium text-[#161616] line-clamp-3">
            {title}
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[14px] leading-[20px] text-[#6c737f] flex flex-col gap-2">
            {postingDuration && (
              <div>
                {tMovablesTable('postingDuration')}: {postingDuration}
              </div>
            )}
            {postingDate && (
              <div>
                {tMovablesTable('postingDate')}: {postingDate}
              </div>
            )}
          </div>

          {statusLabel && (
            <span className={twMerge(statusPillClasses, 'self-start')}>
              <span aria-hidden="true" className={statusDotClasses} />
              <span>{statusLabel}</span>
            </span>
          )}
        </div>

        {translatedPrimaryLabel && (
          <div className="pt-1">
            <Button
              href={downloadUrl || normalizedHref}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className="inline-flex w-full min-h-[44px] px-4 text-base font-medium"
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : shouldDownload
                    ? downloadFileText
                    : tCommonButtons('viewDetails')
              }
            >
              {showDownloadIcon ? (
                <>
                  <DownloadFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                  {translatedPrimaryLabel}
                </>
              ) : (
                translatedPrimaryLabel
              )}
            </Button>
          </div>
        )}
      </Card>
    );
  }

  if (variant === 'consultation') {
    return (
      <Card
        variant="news"
        border
        shadow={false}
        className={twMerge(
          'flex h-full min-h-[266px] w-full max-w-none flex-col rounded-lg bg-white p-6 hover:shadow-none',
          className,
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[118px] items-end rounded-md bg-[#F2F4F7] p-4">
            <h3 className="line-clamp-3 text-start text-[18px] font-medium leading-[28px] text-text-default">
              {title}
            </h3>
          </div>

          {(durationDate || publicationDate) && (
            <p className="text-[14px] font-normal leading-[20px] text-text-secondary-paragraph">
              {durationDate || publicationDate}
            </p>
          )}
        </div>

        {translatedPrimaryLabel && (
          <div className="mt-auto flex pt-4">
            <Button
              href={downloadUrl || normalizedHref}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className={twMerge(
                'h-10 w-full px-4 text-base font-medium leading-6 !rounded-[4px] sm:w-auto sm:flex-none',
                primaryButtonClassName,
              )}
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : shouldDownload
                    ? downloadFileText
                    : tCommonButtons('viewDetails')
              }
            >
              {translatedPrimaryLabel}
            </Button>
          </div>
        )}
      </Card>
    );
  }

  // If href is provided and no primaryButtonHref, make entire card clickable
  const cardHref = href && !primaryButtonHref ? href : undefined;
  const handleCardClick = cardHref
    ? () => {
        // Navigation handled by Link wrapper
      }
    : onClick;

  const cardContent = (
    <Card
      variant="default"
      border
      shadow={false}
      className={twMerge(
        'flex flex-col h-full min-h-[320px] overflow-hidden rounded-md p-2',
        cardHref ? 'cursor-pointer hover:shadow-lg transition-shadow' : '',
        className,
      )}
      onClick={handleCardClick}
      interactive={!!cardHref}
    >
      {imageUrl && (
        <div className="relative w-full h-[160px] mb-2 rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <div
        className={twMerge(
          titleBg === 'green' ? 'bg-primary-50 text-neutral-900' : 'bg-neutral-100 text-gray-900',
          'flex items-end min-h-[100px] p-3 pb-3 rounded-md font-semibold text-md w-full text-left rtl:text-right',
        )}
      >
        <span className="line-clamp-3">{title}</span>
      </div>
      <div className="px-3 pt-3 pb-1 flex flex-col flex-1">
        {publicationNumber && (
          <div className="text-gray-600 text-sm mb-1 font-medium">{publicationNumber}</div>
        )}
        {reportType && (
          <div className="text-gray-500 text-sm mb-1">
            {locale === 'ar' ? 'النوع' : 'Type'}: {reportType}
          </div>
        )}
        {durationDate && (
          <div className="text-gray-500 text-sm mb-1">
            {locale === 'ar' ? 'تاريخ النشر' : 'Publication date'}: {durationDate}
          </div>
        )}
        {postingDuration && (
          <div className="text-gray-500 text-sm mb-1">
            {locale === 'ar' ? 'مدة النشر' : 'Posting duration'}: {postingDuration}
          </div>
        )}
        {postingDate && (
          <div className="text-gray-500 text-sm mb-1">
            {locale === 'ar' ? 'تاريخ النشر' : 'Posting date'}: {postingDate}
          </div>
        )}
        {description && (
          <div
            className="text-gray-700 text-sm line-clamp-3 text-left rtl:text-right mb-3 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      {/* Publication date + buttons at bottom */}
      <div className="px-3 pb-3 mt-auto">
        {publicationDate && (
          <div className="mb-2 text-sm text-gray-500 flex items-center gap-1">
            <span>{t('publicationDate')}:</span>
            <span>{publicationDate}</span>
          </div>
        )}
        {labels && labels?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {labels.map((label, idx) => (
              <span
                key={`${label}-${idx}`}
                className={twMerge(
                  'inline-flex items-center h-6 px-2 py-0 text-[12px] leading-[18px] font-medium gap-1 rounded-md border',
                  getLabelVariantClasses(labelVariants?.[idx]),
                )}
              >
                {showLabelDots && (
                  <span
                    aria-hidden="true"
                    className={twMerge(
                      'inline-block h-2 w-2 rounded-full',
                      getLabelDotClasses(labelVariants?.[idx]),
                    )}
                  />
                )}
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}
        <div
          className="flex flex-col sm:flex-row gap-2 w-full"
          onClick={(e) => {
            // Stop propagation when clicking buttons to prevent card navigation
            if (cardHref) {
              e.stopPropagation();
            }
          }}
        >
          {translatedSecondaryLabel && (
            <Button
              href={secondaryUrl}
              onClick={secondaryButtonOnClick}
              intent="secondary"
              outline
              size="md"
              target={secondaryButtonTarget}
              className={twMerge(
                'flex-1 min-w-0 min-h-[40px] inline-flex items-center justify-center whitespace-nowrap',
                secondaryButtonClassName,
              )}
              ariaLabel={
                typeof translatedSecondaryLabel === 'string'
                  ? translatedSecondaryLabel
                  : viewFileText
              }
            >
              {showViewIcon ? (
                <>
                  <ViewFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                  {translatedSecondaryLabel}
                </>
              ) : (
                translatedSecondaryLabel
              )}
            </Button>
          )}
          {translatedPrimaryLabel && (
            <Button
              href={downloadUrl}
              download={shouldDownload}
              onClick={primaryButtonOnClick || onClick}
              intent="primary"
              size="md"
              className={twMerge(
                'flex-1 min-w-0 min-h-[40px] inline-flex items-center justify-center whitespace-nowrap',
                primaryButtonClassName,
              )}
              ariaLabel={
                typeof translatedPrimaryLabel === 'string'
                  ? translatedPrimaryLabel
                  : shouldDownload
                    ? downloadFileText
                    : tCommonButtons('viewDetails')
              }
            >
              {showDownloadIcon ? (
                <>
                  <DownloadFigmaIcon className="w-5 h-5" aria-hidden="true" />{' '}
                  {translatedPrimaryLabel}
                </>
              ) : (
                translatedPrimaryLabel
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  // Wrap in Link if href is provided and no primaryButtonHref
  if (cardHref) {
    return (
      <Link href={cardHref} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ServiceCard;
