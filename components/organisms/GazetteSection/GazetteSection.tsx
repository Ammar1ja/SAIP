'use client';

import { Button } from '@/components/atoms/Button/Button';
import Heading from '@/components/atoms/Heading';
import Section from '@/components/atoms/Section';
import { useDirection } from '@/context/DirectionContext';
import Image from 'next/image';
import TextContent from '@/components/atoms/TextConent';

interface GazetteSectionProps {
  heading: string;
  text: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: React.ReactNode;
  id: string;
  imageSrc: string;
  imageAlt: string;
  isReversed?: boolean;
  mobileFullWidth?: boolean;
}

const GazetteSection = ({
  heading,
  text,
  buttonText,
  buttonHref,
  buttonIcon,
  id,
  imageSrc,
  imageAlt,
  isReversed = false,
  mobileFullWidth = false,
}: GazetteSectionProps) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const highlightDate = (value: string) =>
    value.replace(/(\d{2}\/\d{2}\/\d{4})/g, '<span class="font-medium">$1</span>');
  const highlightedText = highlightDate(text);

  const textBlocks = (() => {
    const mergeTransitionOnlyBlock = (blocks: string[]) => {
      const normalized: string[] = [];
      for (let i = 0; i < blocks.length; i++) {
        const current = blocks[i].trim();
        const next = blocks[i + 1]?.trim();
        if (/^(Whether|سواء)$/i.test(current) && next) {
          normalized.push(`${current} ${next}`);
          i++;
        } else {
          normalized.push(current);
        }
      }
      return normalized.filter(Boolean);
    };
    const paragraphMatches = [...highlightedText.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => match[1].trim())
      .filter(Boolean);
    if (paragraphMatches.length > 0) return mergeTransitionOnlyBlock(paragraphMatches);

    const emptyLineBlocks = highlightedText
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter(Boolean);
    if (emptyLineBlocks.length > 1) return emptyLineBlocks;

    const transitionSplit = highlightedText.split(/(?<=\.)\s+(?=(?:Whether\b|سواء\b))/i);
    if (transitionSplit.length > 1) {
      return mergeTransitionOnlyBlock(transitionSplit.map((block) => block.trim()).filter(Boolean));
    }

    return emptyLineBlocks;
  })();

  return (
    <Section
      id={id}
      background={isReversed ? 'white' : 'neutral'}
      padding="none"
      fullWidth
      constrain={false}
      className="!px-0"
    >
      <div
        className={`mx-auto flex w-full max-w-[1280px] flex-col gap-10 xl:flex-row xl:gap-12 ${
          isReversed
            ? 'px-4 md:px-8 py-10 md:py-16 lg:py-20'
            : 'px-4 md:px-8 py-10 md:py-16 lg:py-20 xl:pr-0'
        }`}
      >
        <div
          className={`flex w-full max-w-[604px] flex-col justify-center ${
            isReversed ? 'order-2 lg:order-2' : 'order-1'
          } ${!isReversed ? 'xl:max-w-[524px]' : ''}`}
        >
          <div className="flex w-full flex-col gap-6 text-left rtl:text-right">
            <Heading
              size="h2"
              as="h2"
              weight="medium"
              className="m-0 text-[32px] leading-[40px] md:text-[40px] md:leading-[52px] lg:text-[48px] lg:leading-[60px] tracking-[-0.96px]"
            >
              {heading}
            </Heading>
            <div className="flex flex-col gap-[18px]">
              {textBlocks.map((block, index) => (
                <TextContent
                  key={`${id}-text-block-${index}`}
                  allowHtml
                  className="columns-1 [column-count:1] [column-gap:0] text-[18px] leading-[28px] text-text-primary-paragraph [&_p]:m-0"
                >
                  {block}
                </TextContent>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-start">
            <Button
              href={buttonHref}
              ariaLabel={buttonText}
              intent="primary"
              className="w-fit gap-0"
            >
              {buttonIcon && (
                <span className="me-2 inline-flex h-[19px] w-[19px] shrink-0 items-center justify-center [&>img]:h-[19px] [&>img]:w-[19px] [&>svg]:h-[19px] [&>svg]:w-[19px]">
                  {buttonIcon}
                </span>
              )}
              {buttonText}
            </Button>
          </div>
        </div>
        <div
          className={`relative ${
            isReversed
              ? 'order-1 lg:order-1 w-full lg:w-[628px] aspect-[628/348] lg:h-[348px] rounded-l-3xl overflow-hidden p-6 sm:p-10 lg:p-20'
              : 'order-2 box-border w-full aspect-[708/474] xl:w-[708px] xl:basis-[708px] xl:shrink-0 xl:h-[474px] rounded-l-[24px] overflow-hidden bg-neutral-100 xl:translate-x-0 xl:mr-[calc(-1*(100vw-1280px)/2)] 2xl:mr-0'
          }`}
        >
          {isReversed ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 628px"
              className="object-contain"
            />
          ) : (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
        </div>
      </div>
    </Section>
  );
};

export default GazetteSection;
