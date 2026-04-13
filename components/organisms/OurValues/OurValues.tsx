'use client';

import Section from '@/components/atoms/Section';
import { ourValues as fallbackValues } from './OurValues.data';
import ValueItem from '@/components/molecules/ValueItem';
import { twMerge } from 'tailwind-merge';

interface OurValuesProps {
  heading?: string;
  values?: Array<{
    title: string;
    icon: string;
    alt: string;
    description: string;
  }>;
  mobileLayout?: 'expanded' | 'compact';
}

export const OurValues = ({ heading, values, mobileLayout = 'expanded' }: OurValuesProps) => {
  const displayValues = values || fallbackValues;
  const displayHeading = heading || 'Our values';
  const isCompactMobile = mobileLayout === 'compact';

  return (
    <Section
      background="accent"
      className="relative z-10 -mt-20 pt-24 pb-12 lg:pt-28 lg:pb-16"
      align="center"
    >
      <div className="w-full">
        <h2 className="font-medium text-[36px] leading-[44px] tracking-[-0.72px] text-white mb-8 lg:text-5xl lg:leading-[60px] lg:tracking-[-0.96px] lg:mb-12">
          {displayHeading}
        </h2>

        <div
          className={twMerge(
            'text-white md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3',
            isCompactMobile
              ? 'flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
              : 'flex flex-col gap-6',
          )}
        >
          {displayValues.map((value) => (
            <ValueItem
              key={value.title}
              icon={value.icon}
              alt={value.alt}
              title={value.title}
              description={value.description}
              className={twMerge(
                isCompactMobile
                  ? 'w-[292px] min-w-[292px] shrink-0 md:min-w-0 md:h-[206px]'
                  : 'w-full md:h-[206px]',
              )}
              iconClassName="w-14 h-14 rounded-md p-2"
              titleClassName="text-[20px] leading-[30px] font-medium !text-white"
              descriptionClassName="text-[16px] leading-[24px] !text-white/80"
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
