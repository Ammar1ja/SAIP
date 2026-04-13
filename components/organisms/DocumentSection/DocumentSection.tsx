'use client';

import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import { InlineSvgIcon } from '@/components/atoms/ButtonIcon';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { DocumentSectionProps } from './DocumentSection.types';
import { documentSectionWithImageTextRhythmLayout } from './DocumentSection.textRhythm';
import { useDirection } from '@/context/DirectionContext';
import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

function DocumentSectionDescription({
  description,
  className,
}: {
  description: string | ReactNode;
  className?: string;
}) {
  const base = cn('text-lg text-gray-700 lg:max-w-2xl', className);
  if (typeof description === 'string') {
    return <div className={base} dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return <div className={base}>{description}</div>;
}

const DocumentSection = ({
  heading,
  description,
  headingClassName,
  descriptionClassName,
  buttons = [],
  variant = 'with-image',
  background = 'white',
  imagePosition = 'right',
  mobileImageFirst = false,
  alignEnabled = false,
  alignDirection = 'right',
  image,
  className,
  sectionPadding,
  sectionOuterClassName,
  itemsAlign,
  textRhythm = 'even',
  id,
}: DocumentSectionProps) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';

  if (variant === 'buttons-only') {
    return (
      <Section
        id={id}
        columns="two"
        background={background}
        padding={sectionPadding ?? 'default'}
        outerClassName={sectionOuterClassName}
        itemsAlign={itemsAlign}
        className={cn(className)}
      >
        <div className="flex flex-col justify-center gap-8">
          {heading?.trim() ? (
            <h2 className={cn('text-2xl md:text-3xl font-medium text-gray-900', headingClassName)}>
              {heading}
            </h2>
          ) : null}
          {description &&
            (typeof description === 'string' ? (
              <div
                className={cn('text-lg text-gray-700 lg:max-w-2xl', descriptionClassName)}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div className={cn('text-lg text-gray-700 lg:max-w-2xl', descriptionClassName)}>
                {description}
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-4 justify-center items-start lg:items-center">
          {buttons.length > 0 &&
            buttons.map((btn, idx) => (
              <Button
                key={btn.label + idx}
                href={btn.href}
                ariaLabel={btn.ariaLabel || btn.label}
                className={`w-full sm:w-auto shrink-0 whitespace-nowrap lg:w-80 ${btn.className || ''}`}
                intent={btn.intent || 'primary'}
                size={btn.size ?? 'md'}
                outline={btn.outline}
                download={btn.download}
                target={btn.target}
              >
                {btn.icon && (
                  <span className="inline-flex shrink-0 items-center [color:inherit]">
                    {typeof btn.icon === 'string' &&
                    (btn.icon.startsWith('http') || btn.icon.startsWith('/')) ? (
                      <InlineSvgIcon
                        src={btn.icon}
                        alt={btn.ariaLabel || btn.label}
                        className="w-5 h-5"
                      />
                    ) : (
                      btn.icon
                    )}
                  </span>
                )}
                {btn.label}
              </Button>
            ))}
        </div>
      </Section>
    );
  }

  const textOrder = [
    mobileImageFirst ? 'order-2' : 'order-1',
    imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1',
  ].join(' ');
  const imageOrder = [
    mobileImageFirst ? 'order-1' : 'order-2',
    imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2',
  ].join(' ');

  const resolvedAlign =
    alignDirection === 'auto'
      ? imagePosition === 'left'
        ? isRtl
          ? 'right'
          : 'left'
        : isRtl
          ? 'left'
          : 'right'
      : alignDirection;

  const imageRoundedClass =
    imagePosition === 'right'
      ? isRtl
        ? 'lg:rounded-r-xl lg:rounded-l-none'
        : 'lg:rounded-l-xl lg:rounded-r-none'
      : imagePosition === 'left'
        ? isRtl
          ? 'lg:rounded-l-xl lg:rounded-r-none'
          : 'lg:rounded-r-xl lg:rounded-l-none'
        : '';

  const withImageTextLayout = documentSectionWithImageTextRhythmLayout[textRhythm];

  return (
    <Section
      id={id}
      columns="two"
      background={background}
      fullWidth={alignEnabled}
      rtlAwareAlign={alignEnabled ? resolvedAlign : undefined}
      responsiveAlignDirection={alignEnabled ? resolvedAlign : undefined}
      padding={sectionPadding ?? 'default'}
      itemsAlign={itemsAlign}
      outerClassName={twMerge(
        alignEnabled ? 'min-w-0 overflow-x-clip' : undefined,
        sectionOuterClassName,
      )}
      className={twMerge(
        alignEnabled &&
          cn('w-full min-w-0 max-w-screen-xl mx-auto overflow-x-clip px-4 md:px-8 lg:px-8'),
        className,
      )}
    >
      <div
        className={cn(
          `flex min-w-0 flex-col ${textOrder} justify-center`,
          withImageTextLayout.stackGap,
        )}
      >
        {heading?.trim() ? (
          <h2
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900',
              headingClassName,
            )}
          >
            {heading}
          </h2>
        ) : null}
        {description && (
          <DocumentSectionDescription
            description={description}
            className={cn(withImageTextLayout.descriptionOffset, descriptionClassName)}
          />
        )}
        {buttons.length > 0 && (
          <div
            className={cn(
              'flex flex-col sm:flex-row sm:flex-wrap gap-4',
              withImageTextLayout.actionsOffset,
            )}
          >
            {buttons.map((btn, idx) => (
              <Button
                key={btn.label + idx}
                href={btn.href}
                ariaLabel={btn.ariaLabel || btn.label}
                className={`w-full sm:w-auto shrink-0 whitespace-nowrap ${btn.className || ''}`}
                intent={btn.intent || 'primary'}
                size={btn.size ?? 'md'}
                outline={btn.outline}
                download={btn.download}
                target={btn.target}
              >
                {btn.icon && (
                  <span className="inline-flex shrink-0 items-center [color:inherit]">
                    {typeof btn.icon === 'string' &&
                    (btn.icon.startsWith('http') || btn.icon.startsWith('/')) ? (
                      <InlineSvgIcon
                        src={btn.icon}
                        alt={btn.ariaLabel || btn.label}
                        className="w-5 h-5"
                      />
                    ) : (
                      btn.icon
                    )}
                  </span>
                )}
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {image && (
        <div
          className={cn(
            'relative',
            alignEnabled ? 'w-full min-w-0 overflow-hidden' : 'w-screen md:w-full',
            image.aspect || 'aspect-[3/2] lg:aspect-[708/474] h-[320px] md:h-[400px] lg:h-[474px]',
            alignEnabled ? 'mx-0 max-w-full' : '-mx-4 md:mx-auto',
            imageOrder,
            image.wrapperClassName,
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'object-cover',
              alignEnabled ? cn('max-lg:rounded-2xl', imageRoundedClass) : 'md:rounded-2xl',
              image.className,
            )}
            priority={image.priority}
          />
        </div>
      )}
    </Section>
  );
};

export default DocumentSection;
