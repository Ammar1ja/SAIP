'use client';

import { FC } from 'react';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import { PRO_QUALIFICATION_ITEMS } from './ProQualificationSection.data';
import { ProQualificationSectionProps } from './ProQualificationSection.types';
import { useTranslations } from 'next-intl';

const ProQualificationSection: FC<ProQualificationSectionProps> = ({
  items = PRO_QUALIFICATION_ITEMS,
  heroTitle = 'Professional qualifications',
  heroDescription = 'Professional qualifications aim to support the professional development of specialists and practitioners in the domains of IP.',
}) => {
  const t = useTranslations('ipAcademy.qualifications');
  const tCommon = useTranslations('common.filters');

  return (
    <>
      <HeroStatic
        title={heroTitle}
        description={heroDescription}
        backgroundImage="/images/ip-academy/hero.jpg"
      />

      <Section padding="medium" constrain={false} className="xl:!px-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium py-12 leading-[60px] tracking-[-0.96px]">
          {tCommon('totalNumber')}: {items.length}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-auto min-h-[280px] flex-col gap-6 rounded-lg border border-[#D2D6DB] bg-white p-6 shadow-none focus-within:ring-2 focus-within:ring-primary-500 md:h-[318px] md:min-h-[318px] md:max-h-[318px]"
              tabIndex={0}
              aria-label={item.title}
            >
              <div className="flex h-[118px] shrink-0 items-end rounded-md bg-[#F3F4F6] !p-[16px]">
                <h3 className="text-[18px] leading-[28px] tracking-normal font-medium text-text-default">
                  {item.title}
                </h3>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden text-[16px] leading-[24px] font-normal text-text-primary-paragraph line-clamp-4">
                {item.description}
              </div>
              <div className="flex shrink-0">
                <Button
                  href={item.link}
                  intent="primary"
                  size="md"
                  ariaLabel={`${t('readMore')} ${item.title}`}
                >
                  {t('readMore')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default ProQualificationSection;
