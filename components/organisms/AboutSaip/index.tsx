'use client';

import { Button } from '@/components/atoms/Button/Button';
import ContentBlock from '@/components/molecules/ContentBlock';
import Section from '@/components/atoms/Section';
import Image from 'next/image';
import { useDirection } from '@/context/DirectionContext';
import { AboutSaipProps } from './AboutSaip.types';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/routes';

export const AboutSaip = ({ heading, text, image }: AboutSaipProps) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const locale = useLocale();
  const t = useTranslations('buttons');

  return (
    <Section
      columns="two"
      itemsAlign="center"
      rtlAwareAlign={isRtl ? 'right' : 'left'}
      responsiveAlignDirection={isRtl ? 'right' : 'left'}
      className="px-4 md:px-8 lg:px-0 py-2 md:py-4 lg:py-8 max-w-screen-xl mx-auto"
    >
      <div className="flex flex-col order-1 lg:order-2 justify-center">
        <ContentBlock heading={heading} text={text} className="text-left rtl:text-right" />
        <div className="mt-6 md:mt-8 lg:mt-10 flex md:justify-start justify-center w-full">
          <Button
            href={ROUTES.SAIP.ABOUT}
            ariaLabel={t('readMoreAboutSAIP')}
            className="w-full lg:w-auto"
          >
            {t('readMoreAboutSAIP')}
          </Button>
        </div>
      </div>
      <div className="relative w-full aspect-[3/2] lg:aspect-[708/474] mx-auto order-2 lg:order-1">
        <Image
          src={image}
          alt="SAIP Logo"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
    </Section>
  );
};
