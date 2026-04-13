'use client';

import React from 'react';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import Grid from '@/components/atoms/Grid';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/routes';
import { Link } from '@/i18n/navigation';

interface RelatedPagesSectionProps {
  title?: string;
  pages?: { title: string; href: string }[];
  background?:
    | 'primary-25'
    | 'primary-50'
    | 'neutral'
    | 'neutral-25'
    | 'white'
    | 'primary'
    | 'accent'
    | 'transparent';
}

const RelatedPagesSection: React.FC<RelatedPagesSectionProps> = ({
  title,
  pages,
  background = 'neutral',
}) => {
  const t = useTranslations('common.relatedPages');

  const defaultPages = [
    { title: t('faqs'), href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.FAQ.ROOT },
    { title: t('guidelines'), href: ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.GUIDELINES.ROOT },
    { title: t('ipClinics'), href: ROUTES.SERVICES.IP_CLINICS },
    { title: t('ipAcademy'), href: ROUTES.SERVICES.IP_ACADEMY },
    {
      title: t('lawsAndRegulations'),
      href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.SYSTEMS_AND_REGULATIONS.ROOT,
    },
    {
      title: t('internationalTreaties'),
      href: ROUTES.RESOURCES.LOWS_AND_REGULATIONS.ITERNATIONAL_TREATIES.ROOT,
    },
  ];

  const displayTitle = title || t('title');
  const displayPagesRaw = pages && pages.length > 0 ? pages : defaultPages;
  const displayPages = displayPagesRaw.filter((item, index, arr) => {
    return (
      arr.findIndex(
        (candidate) => candidate.title === item.title && candidate.href === item.href,
      ) === index
    );
  });

  return (
    <Section background={background}>
      <Heading
        size="custom"
        as="h2"
        weight="medium"
        color="default"
        className="mb-8 font-body text-[48px] font-medium leading-[60px] tracking-[-0.02em] text-text-default"
      >
        {displayTitle}
      </Heading>

      {/* Desktop version */}
      <div className="hidden lg:block">
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="gap-6">
          {displayPages.map((item, index) => (
            <Card
              key={`${item.href}-${item.title}-${index}`}
              className="flex flex-col justify-between h-[140px] p-6 rounded-2xl border border-neutral-200 overflow-hidden"
            >
              <span className="text-lg font-medium">{item.title}</span>
              <div className="flex justify-end">
                <Button
                  intent="secondary"
                  href={item.href}
                  ariaLabel={`Go to ${item.title}`}
                  className="w-20 h-10 px-4 flex items-center justify-center shrink-0"
                >
                  <ArrowWide
                    direction="right"
                    size="smallWide"
                    background={'natural'}
                    shape="square"
                  />
                </Button>
              </div>
            </Card>
          ))}
        </Grid>
      </div>

      {/* Mobile version */}
      <div className="lg:hidden">
        <Grid cols={{ base: 1 }} gap="gap-6">
          {displayPages.map((item, index) => (
            <Link
              key={`${item.href}-${item.title}-${index}`}
              href={item.href}
              aria-label={`Go to ${item.title}`}
              className="block w-full"
            >
              <Card className="flex w-full max-w-none cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-6 shadow-card transition-shadow duration-200 hover:shadow-md">
                <span className="text-center text-lg font-medium text-text-default">
                  {item.title}
                </span>
              </Card>
            </Link>
          ))}
        </Grid>
      </div>
    </Section>
  );
};

export default RelatedPagesSection;
