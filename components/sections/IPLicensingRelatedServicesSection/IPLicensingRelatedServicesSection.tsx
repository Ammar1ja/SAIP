import React from 'react';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import IPLicensingServiceCard from '@/components/molecules/IPLicensingServiceCard';
import { IP_LICENSING_RELATED_SERVICES } from './IPLicensingRelatedServicesSection.data';
import { IPLicensingRelatedServicesSectionProps } from './IPLicensingRelatedServicesSection.types';

const IPLicensingRelatedServicesSection = ({
  title = 'Related services',
  services = IP_LICENSING_RELATED_SERVICES,
}: IPLicensingRelatedServicesSectionProps) => (
  <Section className="mt-16">
    <Heading
      size="custom"
      as="h2"
      className="mb-8 font-body text-[48px] font-medium leading-[60px] tracking-[-0.02em] text-text-default"
    >
      {title}
    </Heading>

    <div className="space-y-10">
      {services.map((service, index) => (
        <IPLicensingServiceCard key={index} {...service} />
      ))}
    </div>
  </Section>
);

export default IPLicensingRelatedServicesSection;
