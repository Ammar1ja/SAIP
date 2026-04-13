'use client';

import { useState } from 'react';
import DocumentSection from '@/components/organisms/DocumentSection';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import Section from '@/components/atoms/Section';

const verticalTabs = [
  { id: 'ip-licensing', label: 'IP licensing' },
  { id: 'ip-academy', label: 'IP Academy' },
  { id: 'ip-clinics', label: 'IP Clinics' },
  { id: 'ip-support-centers', label: 'National network of IP support centers' },
];

const verticalTabsData = [
  {
    id: 'ip-licensing',
    title: 'IP licensing',
    description:
      'Support and guidance for licensing intellectual property, including legal frameworks and best practices for maximizing the value of your IP assets.',
    image: { src: '/images/services/licensing.jpg', alt: 'IP licensing' },
    buttonHref: '/services/ip-licensing',
  },
  {
    id: 'ip-academy',
    title: 'IP Academy',
    description: (
      <>
        <p>
          Explore options knowledge-building options like <b>IP Academy</b>, or specialized support
          at <b>IP Clinics</b>.
        </p>
        <p>
          Through the training plan, the academy provides a diversified suite of specialized and
          qualitative programs which are likely to contribute to developing the relevant staff, and
          support the IP initiatives in the KSA and MENA.
        </p>
      </>
    ),
    image: { src: '/images/services/academy.jpg', alt: 'IP Academy' },
    buttonHref: '/services/ip-academy',
  },
  {
    id: 'ip-clinics',
    title: 'IP Clinics',
    description:
      'Specialized support centers offering expert help for managing your intellectual property, including clinics for direct assistance and tailored solutions.',
    image: { src: '/images/services/clinics.jpg', alt: 'IP Clinics' },
    buttonHref: '/services/ip-clinics',
  },
  {
    id: 'ip-support-centers',
    title: 'National network of IP support centers',
    description:
      'A comprehensive network of support centers across the country, providing access to resources, guidance, and assistance for all aspects of IP management.',
    image: { src: '/images/services/network.jpg', alt: 'National network of IP support centers' },
    buttonHref: '/services/ip-support-centers',
  },
];

interface ServicesEnablementSectionProps {
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

const ServicesEnablementSection = ({
  heading,
  description,
  image,
  infoHeading,
  infoDescription,
  verticalTabsData: propVerticalTabsData,
}: ServicesEnablementSectionProps) => {
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
    finalVerticalTabsData[0]?.id || 'ip-licensing',
  );

  return (
    <>
      <section id="ip-enablement">
        <DocumentSection
          heading={heading || 'IP Enablement'}
          description={
            description || (
              <>
                <p>
                  Support and services beyond the main intellectual property categories for anyone
                  seeking comprehensive IP solutions.
                </p>
                <p>
                  In Other IP Services you'll discover key offerings that don't fit into the primary
                  six categories but are vital for managing intellectual property.
                </p>
                <p>
                  Explore options knowledge-building options like <b>IP Academy</b>, or specialized
                  support at <b>IP Clinics</b>.
                </p>
              </>
            )
          }
          image={{
            src: image?.src || '/images/services/ip-enablement.jpg',
            alt: image?.alt || 'IP Enablement',
          }}
          alignEnabled
          alignDirection="auto"
        />
      </section>
      <Section id="about-ip-enablement">
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

export default ServicesEnablementSection;
