'use client';

import { FC } from 'react';
import { Card } from '@/components/molecules/Card/Card';
import Section from '@/components/atoms/Section';
import { AdvantagesSectionProps, Advantage } from './IpAcademyAdvantagesSection.types';
import { ADVANTAGES, getAdvantageIcon } from './IpAcademyAdvantagesSection.data';
import Heading from '@/components/atoms/Heading';
import { useTranslations } from 'next-intl';

interface AdvantageDataFromDrupal {
  title: string;
  description: string;
}

interface ExtendedAdvantagesSectionProps extends AdvantagesSectionProps {
  advantagesData?: AdvantageDataFromDrupal[];
}

const renderAdvantageCard = (item: Advantage) => (
  <Card
    key={item.title}
    variant="default"
    border
    shadow
    className="flex flex-col items-start h-full"
  >
    {item.icon()}
    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
    <p className="text-base text-neutral-700">{item.description}</p>
  </Card>
);

const renderAdvantagesList = (advantages?: Advantage[]) => {
  if (!advantages?.length) {
    return <p className="col-span-3 text-center text-neutral-500">No advantages available.</p>;
  }
  return advantages.map(renderAdvantageCard);
};

const AdvantagesSection: FC<ExtendedAdvantagesSectionProps> = ({ advantages, advantagesData }) => {
  const t = useTranslations('ipAcademy');

  // Use advantagesData from Drupal if provided, otherwise use static advantages
  const resolvedAdvantages: Advantage[] = advantagesData
    ? advantagesData.map((adv) => ({
        ...adv,
        icon: getAdvantageIcon,
      }))
    : advantages || ADVANTAGES;

  return (
    <Section padding="large">
      <Heading
        as="h2"
        size="custom"
        className="mb-8 text-[30px] leading-[38px] md:text-[36px] md:leading-[44px] tracking-[-0.02em] font-medium text-text-default"
        aria-label={t('keyAdvantages')}
      >
        {t('keyAdvantages')}
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderAdvantagesList(resolvedAdvantages)}
      </div>
    </Section>
  );
};

export default AdvantagesSection;
