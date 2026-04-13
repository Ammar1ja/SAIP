'use client';

import DocumentSection from '@/components/organisms/DocumentSection/DocumentSection';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

export interface IpSearchEngineSectionProps {
  title: string;
  buttonLabel: string;
  link: string;
  imageSrc: string;
  imageAlt: string;
}

export const IpSearchEngineSection = ({
  title,
  buttonLabel,
  link,
  imageSrc,
  imageAlt,
}: IpSearchEngineSectionProps) => {
  const isMobile = useIsMobile();

  const ipRegex = /IP/i;
  const ipMatch = title.match(ipRegex);
  const hasSecondPart = ipMatch && ipMatch.index !== undefined && ipMatch.index > 0;

  let firstPart = '';
  let secondPart = '';

  if (hasSecondPart && ipMatch.index !== undefined) {
    firstPart = title.substring(0, ipMatch.index).trim();
    secondPart = title.substring(ipMatch.index);
  }

  return (
    <DocumentSection
      id="ip-search"
      heading=""
      descriptionClassName="contents"
      description={
        <h2 className="max-w-[604px] text-[36px] font-normal leading-[44px] tracking-[-0.02em] text-text-default">
          {hasSecondPart ? (
            <>
              {firstPart && <span dangerouslySetInnerHTML={{ __html: firstPart }} />}
              <span
                className="mt-9 block text-[48px] font-medium leading-[60px] tracking-[-0.02em] text-text-default"
                dangerouslySetInnerHTML={{ __html: secondPart }}
              />
            </>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: title }} />
          )}
        </h2>
      }
      buttons={[
        {
          label: buttonLabel,
          href: link,
          target: '_blank',
          intent: 'primary',
          size: 'mdWide',
          icon: <SquareArrowOutUpRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />,
        },
      ]}
      background={isMobile ? 'primary-50' : 'white'}
      imagePosition="right"
      alignEnabled={true}
      alignDirection="auto"
      image={{
        src: imageSrc,
        alt: imageAlt,
        aspect: isMobile
          ? undefined
          : 'aspect-[3/2] h-[320px] md:h-[400px] lg:aspect-[708/474] lg:h-auto lg:max-h-[474px] lg:min-h-0 xl:aspect-auto xl:h-[474px] xl:max-h-[474px] xl:min-h-[474px]',
        priority: true,
        /* lg–xl: вписываемся в колонку; xl+: колонка ровно 708px → кадр 708×474 как в Figma */
        wrapperClassName:
          'w-full min-w-0 max-w-full max-xl:mx-auto max-xl:max-w-[min(100%,708px)] xl:ms-auto xl:max-w-none xl:w-full xl:shrink-0',
      }}
      className="px-4 md:px-8 max-w-[1280px] mx-auto lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_708px]"
    />
  );
};
