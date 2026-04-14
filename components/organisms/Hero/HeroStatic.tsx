'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { useTranslations, useLocale } from 'next-intl';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import Image from '@/components/atoms/Image';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Link from 'next/link';
import { ChevronIcon } from '@/components/icons';
import Button from '@/components/atoms/Button';
import { Share } from 'lucide-react';
import { TextContent } from '@/components/atoms/TextConent/TextContent';
import LeadingIcon from '@/assets/images/leading_icon.svg';

const hero = cva(['h-[calc(100vh-72px)]', 'max-h-[520px]', 'relative', 'overflow-hidden'], {
  variants: {
    overlay: {
      true: 'after:absolute after:inset-0 after:bg-[rgba(9,42,30,0.80)] after:z-[1]',
      false: '',
    },
  },
  defaultVariants: {
    overlay: true,
  },
});

const titleSizes = cva(
  ['tracking-display-tight', 'max-w-[945px]', 'leading-tight', 'ltr:text-left', 'rtl:text-right'],
  {
    variants: {
      size: {
        default: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
        small: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      size: 'default',
      weight: 'medium',
    },
  },
);

/** Hero lead copy: overlay (image + dim) vs on-light hero */
const HERO_DESCRIPTION_STYLE = {
  white: {
    column: 'max-w-[628px] gap-5',
    type: 'text-[20px] leading-[30px] font-normal tracking-normal',
    richText: '[&_p]:mb-5 [&_p:last-child]:mb-0',
    color: 'text-white',
  },
  dark: {
    column: 'max-w-[720px] gap-4',
    type: 'text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]',
    richText: '[&_p]:mb-4 [&_p:last-child]:mb-0',
    color: 'text-gray-700',
  },
} as const;

export interface HeroStaticProps extends VariantProps<typeof hero> {
  title: string;
  description: string;
  secondDescription?: string;
  className?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  breadcrumbs?: BreadcrumbItem[];
  hideBreadcrumbsOnMobile?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  textColor?: 'white' | 'dark';
  showShareButton?: boolean;
  onShareClick?: () => void;
  titleSize?: 'default' | 'small';
  titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  descriptionClassName?: string;
  /** Merged last on the title heading (e.g. FAQ display overrides). */
  titleClassName?: string;
  /** Vertical alignment of the text content inside the hero */
  contentAlign?: 'center' | 'bottom';
  /** Merged onto inner LayoutWrapper (FAQ: px-0 when frame padding lives on the hero root). */
  layoutWrapperClassName?: string;
  /** Stack breadcrumbs above title with design gap; fixes absolute crumbs vs title spacing. */
  stackBreadcrumbsWithTitle?: boolean;
  /** Merged onto the title + description column; use to match frame gap (e.g. Figma spacing-8xl). */
  contentStackClassName?: string;
  /** Merged after default `mt-4 flex flex-col` on the description wrapper; use `!mt-0` when gap is on the stack. */
  descriptionWrapperClassName?: string;
  // Article-specific props
  publicationDate?: string;
  categories?: Array<{ id: string; name: string }>;
  variant?: 'default' | 'article';
}

export const HeroStatic = ({
  title,
  description,
  secondDescription,
  overlay,
  className,
  backgroundImage,
  showBackButton,
  backHref,
  backLabel = 'Back',
  backgroundColor,
  breadcrumbs,
  hideBreadcrumbsOnMobile = false,
  textColor = 'white',
  showShareButton = false,
  onShareClick,
  titleSize = 'default',
  titleWeight = 'medium',
  descriptionClassName,
  titleClassName,
  contentAlign = 'center',
  layoutWrapperClassName,
  stackBreadcrumbsWithTitle = false,
  contentStackClassName,
  descriptionWrapperClassName,
  publicationDate,
  categories,
  variant = 'default',
}: HeroStaticProps) => {
  const t = useTranslations('mediaCenter.news');
  const locale = useLocale();
  const titleFontWeight =
    titleWeight === 'normal'
      ? 400
      : titleWeight === 'medium'
        ? 500
        : titleWeight === 'semibold'
          ? 600
          : 700;
  const textColorClasses = textColor === 'white' ? 'text-white' : 'text-gray-900';

  const titleColorClasses = textColor === 'white' ? 'text-white' : 'text-gray-900';

  const titleStyle = {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontWeight: titleFontWeight,
  } as const;

  const desc = HERO_DESCRIPTION_STYLE[textColor];
  const descriptionIsHtml = typeof description === 'string' && description.includes('<');
  const hasBodyCopy =
    descriptionIsHtml || Boolean(description?.trim()) || Boolean(secondDescription?.trim());

  const formatPublicationDate = (dateStr: string) => {
    if (!dateStr) return '';

    const normalizeDate = (value: string) => {
      const trimmed = value.trim();
      const dotFormat = /^(\d{2})\.(\d{2})\.(\d{4})$/;
      const slashFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;

      const match = trimmed.match(dotFormat) || trimmed.match(slashFormat);
      if (match) {
        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);
        if (Number.isFinite(day) && Number.isFinite(month) && Number.isFinite(year)) {
          return new Date(Date.UTC(year, month - 1, day));
        }
      }

      return new Date(trimmed);
    };

    const date = normalizeDate(dateStr);
    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const isRtl = locale === 'ar' ? true : false;
  return (
    <div
      className={twMerge(
        hero({ overlay: !!backgroundImage && overlay }),
        backgroundColor,
        'px-4 py-6 md:py-10',
        className,
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            priority
            quality={80}
            loading="eager"
            className="!h-full"
            objectFit="cover"
            sizes="100vw"
          />
        </div>
      )}

      <LayoutWrapper
        className={twMerge(
          'relative z-10 h-full flex px-0 md:px-8',
          stackBreadcrumbsWithTitle
            ? 'w-full flex-col justify-end'
            : contentAlign === 'bottom'
              ? 'flex-col justify-between'
              : 'items-end sm:items-center pb-8 sm:pb-0',
          layoutWrapperClassName,
        )}
      >
        {stackBreadcrumbsWithTitle ? (
          <div
            className={twMerge(
              'flex w-full flex-col gap-16 ltr:text-left rtl:text-right',
              textColorClasses,
            )}
          >
            {showBackButton && backHref && (
              <Link href={backHref}>
                <Button
                  intent="neutral"
                  outline
                  ariaLabel={backLabel}
                  className="flex h-8 items-center gap-2 justify-start"
                >
                  <LeadingIcon
                    width={16}
                    height={16}
                    className={`${isRtl ? 'rotate-180 mt-1 ' : 'rotate-0 mb-1 '}`}
                  />
                  <span className="truncate">{backLabel}</span>
                </Button>
              </Link>
            )}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className={hideBreadcrumbsOnMobile ? 'hidden lg:block' : ''}>
                <Breadcrumbs
                  variant={textColor === 'dark' ? 'subpage' : 'hero'}
                  items={breadcrumbs}
                />
              </div>
            )}
            <div
              className={twMerge(
                'flex w-full flex-col gap-2 text-left rtl:text-right',
                contentStackClassName,
              )}
            >
              <h1
                className={twMerge(
                  titleSizes({ size: titleSize, weight: titleWeight }),
                  titleColorClasses,
                  titleClassName,
                  '!text-[48px]',
                )}
                style={titleStyle}
              >
                {title}
              </h1>

              {variant === 'article' ? (
                <div className="mt-2 flex flex-col gap-2">
                  {publicationDate && (
                    <div className="text-sm text-gray-500">
                      {t('publicationDate')}: {formatPublicationDate(publicationDate)}
                    </div>
                  )}
                  {categories && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 py-4">
                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                hasBodyCopy && (
                  <div
                    className={twMerge(
                      'mt-4 flex flex-col',
                      desc.column,
                      descriptionWrapperClassName,
                    )}
                  >
                    {descriptionIsHtml ? (
                      <TextContent
                        allowHtml
                        skipPresetStyles
                        className={twMerge(
                          descriptionClassName ? '' : desc.type,
                          'sm:text-left rtl:text-right',
                          desc.richText,
                          descriptionClassName,
                          desc.color,
                        )}
                      >
                        {description}
                      </TextContent>
                    ) : (
                      description?.trim() && (
                        <p
                          className={twMerge(
                            descriptionClassName ? '' : desc.type,
                            'sm:text-left rtl:text-right',
                            descriptionClassName,
                            desc.color,
                          )}
                        >
                          {description}
                        </p>
                      )
                    )}
                    {secondDescription?.trim() && (
                      <p
                        className={twMerge(
                          descriptionClassName ? '' : desc.type,
                          'sm:text-left rtl:text-right',
                          descriptionClassName,
                          desc.color,
                        )}
                      >
                        {secondDescription}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <>
            <div
              className={twMerge(
                'flex flex-col gap-[24px]',
                contentAlign === 'bottom' ? '' : 'absolute top-6 inset-x-0 px-0 md:px-8',
              )}
            >
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className={hideBreadcrumbsOnMobile ? 'hidden lg:block' : ''}>
                  <Breadcrumbs
                    variant={textColor === 'dark' ? 'subpage' : 'hero'}
                    items={breadcrumbs}
                  />
                </div>
              )}
              {showBackButton && backHref && (
                <Link href={backHref}>
                  <Button
                    intent="neutral"
                    outline
                    ariaLabel={backLabel}
                    className="flex h-8 items-center gap-2 justify-start"
                  >
                    <LeadingIcon
                      width={16}
                      height={16}
                      className={`${isRtl ? 'rotate-180 mt-1 ' : 'rotate-0 mb-1 '}`}
                    />
                    <span className="truncate">{backLabel}</span>
                  </Button>
                </Link>
              )}
            </div>

            <div
              className={twMerge(
                'flex w-full flex-col gap-2 text-left rtl:text-right',
                contentStackClassName,
                showBackButton ? 'pt-32 sm:pt-[124px]' : '',
                textColorClasses,
              )}
            >
              <h1
                className={twMerge(
                  titleSizes({ size: titleSize, weight: titleWeight }),
                  titleColorClasses,
                  titleClassName,
                )}
                style={titleStyle}
              >
                {title}
              </h1>

              {variant === 'article' ? (
                <div className="mt-2 flex flex-col gap-2">
                  {publicationDate && (
                    <div className="text-sm text-gray-500">
                      {t('publicationDate')}: {formatPublicationDate(publicationDate)}
                    </div>
                  )}
                  {categories && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 py-4">
                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-[#E5E7EB]"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                hasBodyCopy && (
                  <div
                    className={twMerge(
                      'mt-4 flex flex-col',
                      desc.column,
                      descriptionWrapperClassName,
                    )}
                  >
                    {descriptionIsHtml ? (
                      <TextContent
                        allowHtml
                        skipPresetStyles
                        className={twMerge(
                          descriptionClassName ? '' : desc.type,
                          'sm:text-left rtl:text-right',
                          desc.richText,
                          descriptionClassName,
                          desc.color,
                        )}
                      >
                        {description}
                      </TextContent>
                    ) : (
                      description?.trim() && (
                        <p
                          className={twMerge(
                            descriptionClassName ? '' : desc.type,
                            'sm:text-left rtl:text-right',
                            descriptionClassName,
                            desc.color,
                          )}
                        >
                          {description}
                        </p>
                      )
                    )}
                    {secondDescription?.trim() && (
                      <p
                        className={twMerge(
                          descriptionClassName ? '' : desc.type,
                          'sm:text-left rtl:text-right',
                          descriptionClassName,
                          desc.color,
                        )}
                      >
                        {secondDescription}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {showShareButton && (
          <div className="absolute bottom-6 right-4 z-20">
            <Button
              intent="primary"
              className="flex items-center gap-2 shadow-lg"
              ariaLabel="Share your opinion"
              onClick={onShareClick}
            >
              <Share className="w-5 h-5" />
              Share your opinion
            </Button>
          </div>
        )}
      </LayoutWrapper>
    </div>
  );
};

export default HeroStatic;
