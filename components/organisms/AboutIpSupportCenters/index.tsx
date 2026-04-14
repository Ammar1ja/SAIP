'use client';

import { Button } from '@/components/atoms/Button/Button';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useDirection } from '@/context/DirectionContext';
import { AboutIpSupportCentersProps } from './AboutIpSupportCenters.types';
import { useTranslations } from 'next-intl';
import { contentBlock } from '@/components/molecules/ContentBlock/ContentBlock.styles';

const paragraphClassName =
  'm-0 text-left rtl:text-right text-[18px] leading-[28px] font-normal tracking-normal text-text-primary-paragraph';

const AboutIpSupportCenters = ({ heading, paragraphs, image }: AboutIpSupportCentersProps) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const t = useTranslations('ipSupportCenters');
  const nonEmptyParagraphs = paragraphs.map((p) => p.trim()).filter(Boolean);

  return (
    <Section
      columns="two"
      itemsAlign="center"
      rtlAwareAlign={isRtl ? 'right' : 'left'}
      responsiveAlignDirection={isRtl ? 'right' : 'left'}
      className="px-4 md:px-8 lg:px-0 py-2 md:py-4 lg:py-8 max-w-screen-xl mx-auto"
    >
      <div className="flex flex-col order-1 lg:order-2 justify-center">
        <div
          className={twMerge(
            contentBlock({ textAlign: 'left', lineHeight: 'normal' }),
            'text-left rtl:text-right !space-y-0',
          )}
        >
          <Heading
            as="h2"
            size="h2"
            weight="medium"
            className="!text-3xl md:!text-3xl lg:!text-5xl leading-normal !tracking-tide text-left rtl:text-right !w-full"
          >
            {heading}
          </Heading>
          <div className="mt-3 flex flex-col gap-6">
            {nonEmptyParagraphs.map((body, index) => (
              <p key={index} className={paragraphClassName}>
                {body}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-6 md:mt-8 lg:mt-10 flex md:justify-start justify-center w-full">
          <Button
            href="/services/ip-support-centers"
            ariaLabel={t('readMoreAbout')}
            className="w-full lg:w-auto"
          >
            {t('readMoreAbout')}
          </Button>
        </div>
      </div>
      <div className="relative w-full aspect-[3/2] lg:aspect-[708/474] mx-auto order-2 lg:order-1">
        {image && (
          <Image
            src={image}
            alt="TISC Logo"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        )}
      </div>
    </Section>
  );
};

export default AboutIpSupportCenters;
