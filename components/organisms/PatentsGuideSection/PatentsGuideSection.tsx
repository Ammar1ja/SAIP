'use client';

import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';
import { PATENTS_GUIDE_CARDS } from '@/app/[locale]/services/patents/patentsGuide.data';

const PatentsGuideSection = () => (
  <Section>
    <Heading
      as="h2"
      size="custom"
      weight="medium"
      color="default"
      className="mb-6 flex flex-wrap items-center justify-between gap-4 text-4xl leading-11"
    >
      Patents guide
      <Button
        intent="secondary"
        href="/resources/guidelines"
        ariaLabel="Go to Guidelines"
        className="shrink-0"
      >
        Go to Guidelines
      </Button>
    </Heading>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PATENTS_GUIDE_CARDS.map((item, idx) => (
        <ServiceCard key={idx} {...item} variant="report" />
      ))}
    </div>
  </Section>
);

export default PatentsGuideSection;
