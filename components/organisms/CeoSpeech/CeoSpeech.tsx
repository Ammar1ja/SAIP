'use client';

import { useState } from 'react';
import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import { CeoSpeechProps } from './CeoSpeech.types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const CeoSpeech = ({
  title = 'CEO Speech',
  quote,
  image,
  caption,
  captionHighlight,
  description,
  isExpanded: externalIsExpanded,
  onExpandedChange,
}: CeoSpeechProps) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const tButtons = useTranslations('buttons');
  const isControlled = typeof externalIsExpanded === 'boolean';
  const isExpanded = isControlled ? externalIsExpanded : internalIsExpanded;

  const normalizedDescription = description
    .flatMap((para) =>
      para
        .replace(/<br\s*\/?>/gi, '\n')
        .split(/\n+/)
        .map((part) => part.trim())
        .filter(Boolean),
    )
    .filter(Boolean);
  const firstParagraph = normalizedDescription[0] || '';
  const remainingParagraphs = normalizedDescription.slice(1);

  return (
    <Section>
      <div className="w-full max-w-[1280px] px-4 mx-auto">
        <h2 className="text-center mb-12 font-medium text-5xl leading-[60px] tracking-[-0.96px]">
          {title}
        </h2>

        <blockquote className="lg:hidden bg-[#F3F4F6] text-[18px] font-medium leading-[28px] px-6 py-6 rounded-2xl mb-8 md:mb-12 md:px-20 md:py-12 relative max-w-4xl mx-auto text-text-display text-center">
          <span className="absolute -left-5 -top-5 text-neutral-400 text-[120px] leading-none pointer-events-none font-medium">
            “
          </span>
          {quote}
        </blockquote>

        <div className="hidden lg:block mx-auto mb-12 w-full max-w-[846px] min-h-[130px] rounded-2xl bg-neutral-50 p-5">
          <div className="relative px-16">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 text-[128px] leading-[32px] text-[#14573A] pointer-events-none"
            >
              ”
            </span>
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 text-[128px] leading-[32px] text-[#14573A] pointer-events-none"
            >
              “
            </span>
            <p className="text-[20px] leading-[30px] font-normal text-primary-paragraph text-left">
              {quote}
            </p>
          </div>
        </div>

        <div className="lg:hidden grid grid-cols-1 gap-1 items-start">
          <figure className="flex flex-col items-center">
            <div className="relative aspect-[3/4] w-[500px] max-w-full rounded-2xl overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <figcaption className="mt-4 text-md text-center text-gray-600">
              {caption}
              {captionHighlight && (
                <>
                  <br />
                  <span className="font-medium">{captionHighlight}</span>
                </>
              )}
            </figcaption>
          </figure>

          {/* Mobile version */}
          <div className="lg:hidden py-6 space-y-4 text-left text-[16px] leading-[24px] text-text-primary-paragraph">
            <p>{firstParagraph}</p>
            {isExpanded && (
              <>
                {remainingParagraphs.map((para, idx) => (
                  <p key={idx + 1}>{para}</p>
                ))}
              </>
            )}
            {remainingParagraphs.length > 0 && (
              <Button
                intent="secondary"
                outline
                onClick={() => {
                  const nextExpanded = !isExpanded;
                  if (!isControlled) {
                    setInternalIsExpanded(nextExpanded);
                  }
                  onExpandedChange?.(nextExpanded);
                }}
                ariaLabel={isExpanded ? tButtons('showLess') : tButtons('readAll')}
                className="w-full"
                fullWidth
              >
                {isExpanded ? tButtons('showLess') : tButtons('readAll')}
              </Button>
            )}
          </div>
        </div>

        <div className="hidden lg:flex mx-auto w-full max-w-[1062px] items-start gap-16">
          <figure className="box-border w-[416px] shrink-0">
            <div className="box-border h-[524px] w-full rounded-lg p-[10px]">
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="object-cover"
                  fill
                  sizes="396px"
                />
              </div>
            </div>
            <figcaption className="mt-4 space-y-1 text-[16px] leading-[24px] text-primary-paragraph">
              <p>{caption}</p>
              {captionHighlight && <p>{captionHighlight}</p>}
            </figcaption>
          </figure>

          <div className="w-[582px] space-y-2 text-[16px] leading-[24px] text-primary-paragraph">
            {normalizedDescription.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
