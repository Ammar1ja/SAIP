import React from 'react';
import Section from '@/components/atoms/Section';
import Card from '@/components/molecules/Card';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import Grid from '@/components/atoms/Grid';
import { QuickLinksProps } from './QuickLinks.types';
import { twMerge } from 'tailwind-merge';

const QuickLinks: React.FC<QuickLinksProps> = ({ title, links, className }) => (
  <Section background="primary" className={twMerge('py-16 w-full', className)} aria-label={title}>
    <div className="flex w-full max-w-screen-2xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:mx-auto">
      <h2 className="mb-8 font-body text-[48px] font-medium leading-[60px] tracking-[-0.02em] text-white md:mb-0 md:w-1/3 ltr:text-left rtl:text-right">
        {title}
      </h2>
      <Grid
        cols={{ base: 1, md: links.length > 1 ? 2 : 1, lg: links.length > 2 ? 3 : links.length }}
        gap="gap-6"
        className="w-full flex-1 justify-items-start md:w-fit md:ml-auto"
      >
        {links.map((link) => (
          <Card
            key={link.href}
            className={twMerge(
              // Figma: 344.5w (fill) × 168h, radius-lg, padding 48, space-between
              'relative h-[168px] w-[344px] max-w-full rounded-lg bg-white p-12 transition',
              'focus-within:ring-2 focus-within:ring-primary-500',
              'ltr:text-left rtl:text-right',
            )}
            tabIndex={0}
            aria-label={link.label}
          >
            <span className="block min-w-0 pr-20 text-lg font-medium text-neutral-900 rtl:pr-0 rtl:pl-20">
              {link.label}
            </span>
            <a
              href={link.href}
              aria-label={`Go to ${link.label}`}
              className="absolute bottom-12 flex h-10 w-20 items-center justify-center rounded-sm bg-neutral-100 transition hover:bg-primary-100 ltr:right-12 rtl:left-12"
            >
              <ArrowWide direction="right" size="smallWide" background="natural" shape="square" />
            </a>
          </Card>
        ))}
      </Grid>
    </div>
  </Section>
);

export default QuickLinks;
