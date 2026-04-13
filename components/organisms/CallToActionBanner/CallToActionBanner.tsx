'use client';

import { Button } from '@/components/atoms/Button/Button';
import Section from '@/components/atoms/Section';
import { CallToActionBannerProps } from './CallToActionBanner.types';
import { twMerge } from 'tailwind-merge';

const CallToActionBanner = ({
  title,
  buttonLabel,
  buttonHref,
  buttonOnClick,
  className,
}: CallToActionBannerProps) => {
  return (
    <Section
      background="transparent"
      padding="none"
      outerClassName={twMerge('bg-primary-800 text-white', className)}
      className="flex min-h-[140px] w-full flex-col gap-12 py-12 md:flex-row md:items-center md:justify-between"
    >
      <h2 className="min-w-0 max-w-[628px] text-start font-body text-[36px] font-medium leading-[44px] tracking-[-0.02em] text-white">
        {title}
      </h2>
      <Button
        href={buttonHref}
        onClick={buttonOnClick}
        intent="secondary"
        size="lg"
        className="shrink-0 border-0 bg-white px-8 py-3 font-medium text-primary-800 hover:bg-neutral-50"
        ariaLabel={buttonLabel}
      >
        {buttonLabel}
      </Button>
    </Section>
  );
};

export default CallToActionBanner;
