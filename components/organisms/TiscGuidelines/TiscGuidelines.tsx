'use client';

import React from 'react';
import Section from '@/components/atoms/Section';
import ServiceCard from '@/components/molecules/ServiceCard';
import { Button } from '@/components/atoms/Button/Button';
import { tiscGuidelinesData } from './TiscGuidelines.data';

const TiscGuidelines = () => {
  return (
    <Section background="white" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">TISC guidelines</h2>
          <Button
            href="/guidelines"
            intent="secondary"
            outline
            size="md"
            className="self-start md:self-auto"
            ariaLabel="Go to Guidelines"
          >
            Go to Guidelines
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {tiscGuidelinesData.map((guideline, index) => (
            <ServiceCard key={index} {...guideline} titleBg="green" className="min-h-[350px]" />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TiscGuidelines;
