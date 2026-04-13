'use client';

import React from 'react';
import { GeneralSecretariatCommitteeSectionProps } from './GeneralSecretariatCommitteeSection.types';

import { Button } from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Section from '@/components/atoms/Section';
import { useTranslations } from 'next-intl';

export const GeneralSecretariatCommitteeSection: React.FC<
  GeneralSecretariatCommitteeSectionProps
> = ({ title, description, responsibilities, ctaTitle, ctaButtonLabel, ctaButtonHref }) => {
  const t = useTranslations('ipGeneralSecretariat.committeeSection');

  return (
    <Section>
      <h2 className="mb-12 w-[628px] max-w-full font-body text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px]">
        {title}
      </h2>

      <div className="mb-12">
        <Heading
          size="custom"
          className="mb-6 w-[628px] max-w-full font-body text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[48px] md:leading-[60px]"
        >
          {t('about')}
        </Heading>
        <Paragraph
          variant="compact"
          className="!w-[720px] !max-w-[720px] font-body text-[18px] font-normal leading-[28px] tracking-normal text-text-primary-paragraph"
        >
          {description}
        </Paragraph>
      </div>

      <div className="mb-6">
        <Heading
          size="custom"
          className="mb-6 w-[628px] max-w-full font-body text-[30px] font-medium leading-[38px] tracking-[-0.02em] text-text-default md:text-[36px] md:leading-[44px]"
        >
          {t('responsibilities')}
        </Heading>
        {responsibilities && responsibilities.length > 0 ? (
          <div className="mb-6 grid w-full min-w-0 grid-cols-1 justify-items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {responsibilities.map((responsibility) => (
              <div
                key={responsibility.id}
                className="box-border flex h-auto min-h-[120px] w-full min-w-0 max-w-[410.67px] items-center overflow-visible rounded-lg border border-border-natural-primary bg-white p-6 shadow-none sm:h-[120px] sm:min-h-[120px] sm:max-h-[120px] sm:overflow-hidden"
              >
                <p className="m-0 w-full text-start font-body text-[16px] font-normal leading-6 tracking-normal text-text-primary-paragraph max-sm:line-clamp-none sm:line-clamp-3 sm:leading-5">
                  {responsibility.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No responsibilities available.</p>
        )}
      </div>

      <div className="flex min-h-[140px] w-full flex-col gap-12 rounded-xl bg-primary-800 p-12 md:flex-row md:items-center md:justify-between">
        <h3 className="min-w-0 max-w-[628px] font-body text-[36px] font-medium leading-[44px] tracking-[-0.02em] text-white">
          {ctaTitle}
        </h3>
        <Button
          intent="secondary"
          href={ctaButtonHref}
          ariaLabel={ctaButtonLabel}
          className="shrink-0 border-0 bg-white px-6 py-3 font-medium text-primary-800 hover:bg-neutral-50"
        >
          {ctaButtonLabel}
        </Button>
      </div>
    </Section>
  );
};
