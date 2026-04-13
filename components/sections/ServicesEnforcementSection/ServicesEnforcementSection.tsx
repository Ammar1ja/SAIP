'use client';

import { useState } from 'react';
import DocumentSection from '@/components/organisms/DocumentSection';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import Section from '@/components/atoms/Section';

const verticalTabs = [
  { id: 'ip-infringement', label: 'IP infringement', href: '/services/ip-infringement' },
  {
    id: 'general-secretariat',
    label: 'General secretariat of IP dispute resolution committees',
    href: '/services/general-secretariat',
  },
];

const verticalTabsData = [
  {
    id: 'ip-infringement',
    title: 'IP infringement',
    description: (
      <>
        <p>
          To ensures compliance with Saudi Arabia's IP laws, protecting the rights of creators,
          innovators, and businesses. Cases of infringement are handled promptly and fairly,
          safeguarding IP and supporting a transparent and innovative ecosystem.
        </p>
        <p>
          Beneficiaries can use this service to maintain the integrity of their IP assets and seek
          appropriate legal remedies.
        </p>
        <p>
          <b>General secretariat of IP dispute resolution committees</b>
        </p>
      </>
    ),
    image: { src: '/images/services/infringement.jpg', alt: 'IP infringement' },
    buttonHref: '/services/ip-infringement',
  },
  {
    id: 'general-secretariat',
    title: 'General secretariat of IP dispute resolution committees',
    description: (
      <>
        <p>
          To ensures compliance with Saudi Arabia's IP laws, protecting the rights of creators,
          innovators, and businesses. Cases of infringement are handled promptly and fairly,
          safeguarding IP and supporting a transparent and innovative ecosystem. Beneficiaries can
          use this service to maintain the integrity of their IP assets and seek appropriate legal
          remedies.
        </p>
      </>
    ),
    image: {
      src: '/images/services/secretariat.jpg',
      alt: 'General secretariat of IP dispute resolution committees',
    },
    buttonHref: '/services/ip-general-secretariat',
  },
];

interface ServicesEnforcementSectionProps {
  heading?: string;
  description?: string | React.ReactNode;
  image?: { src: string; alt: string };
  infoHeading?: string;
  infoDescription?: string;
  verticalTabsData?: Array<{
    id: string;
    title: string;
    description: string | React.ReactNode;
    image?: { src: string; alt: string };
    buttonLabel?: string;
    buttonHref?: string;
    buttonAriaLabel?: string;
  }>;
}

const ServicesEnforcementSection = ({
  heading,
  description,
  image,
  infoHeading,
  infoDescription,
  verticalTabsData: propVerticalTabsData,
}: ServicesEnforcementSectionProps) => {
  // Use prop data or fallback to hardcoded data
  const finalVerticalTabsData = propVerticalTabsData || verticalTabsData;

  const formatTabLabel = (id: string, title?: string): string => {
    if (title && title.trim()) {
      return title;
    }
    return id
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate tabs from data (use data IDs and titles)
  const dynamicVerticalTabs = finalVerticalTabsData.map((tab) => ({
    id: tab.id,
    label: formatTabLabel(tab.id, tab.title),
    href: tab.buttonHref || '#',
  }));

  // Initialize with first tab ID from data
  const [activeVerticalTab, setActiveVerticalTab] = useState(
    finalVerticalTabsData[0]?.id || 'ip-infringement',
  );

  return (
    <>
      <section id="ip-enforcement">
        <DocumentSection
          heading={heading || 'IP enforcement & dispute'}
          description={
            description || (
              <>
                <p>
                  IP enforcement is essential for protecting innovations and ensuring fair use
                  through the processes for handling disputes, addressing infringements, and
                  enforcing IP rights effectively.
                </p>
                <p>
                  With enforcement framework, IP are safeguarded, ensuring compliance with Saudi
                  Arabia's IP regulations. This includes addressing Intellectual Property
                  Infringements and supporting resolution through the General Secretariat of
                  Intellectual Property Dispute Resolution Committees, which ensures fair and
                  efficient handling of IP-related conflicts.
                </p>
              </>
            )
          }
          image={{
            src: image?.src || '/images/services/enforcement.jpg',
            alt: image?.alt || 'IP enforcement & dispute',
          }}
          alignEnabled
          alignDirection="auto"
        />
      </section>
      <Section id="about-enforcement">
        <ServicesInformation
          tabs={dynamicVerticalTabs}
          data={finalVerticalTabsData}
          activeTab={activeVerticalTab}
          onTabChange={setActiveVerticalTab}
          title={infoHeading}
          description={infoDescription}
        />
      </Section>
    </>
  );
};

export default ServicesEnforcementSection;
