'use client';

import { useState } from 'react';
import DocumentSection from '@/components/organisms/DocumentSection';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import Section from '@/components/atoms/Section';
import { useTranslations } from 'next-intl';

const verticalTabs = [
  {
    id: 'patents',
    label: 'Patents',
    href: '/services/patents',
  },
  {
    id: 'trademarks',
    label: 'Trademarks',
    href: '/services/trademarks',
  },
  {
    id: 'copyrights',
    label: 'Copyrights',
    href: '/services/copyrights',
  },
  {
    id: 'designs',
    label: 'Designs',
    href: '/services/designs',
  },
  {
    id: 'layout-designs-and-integrated-circuits',
    label: 'Layout designs and Integrated Circuits',
    href: '/services/layout-designs-and-integrated-circuits',
  },
  {
    id: 'plant-varieties',
    label: 'Plant Varieties',
    href: '/services/plant-varieties',
  },
];

const verticalTabsData = [
  {
    id: 'patents',
    title: 'Patents',
    description:
      'Patents are a type of intellectual property that grants inventors exclusive rights to their inventions for a limited period of time.',
    image: { src: '/images/services/patents.jpg', alt: 'Patents' },
    buttonLabel: 'Go to Patents',
    buttonHref: '/services/patents',
    buttonAriaLabel: 'Go to Patents',
  },
  {
    id: 'trademarks',
    title: 'Trademarks',
    description:
      'Trademarks are a type of intellectual property that grants inventors exclusive rights to their inventions for a limited period of time.',
    image: { src: '/images/services/plant.jpg', alt: 'Trademarks' },
    buttonLabel: 'Go to Trademarks',
    buttonHref: '/services/trademarks',
    buttonAriaLabel: 'Go to Trademarks',
  },
  {
    id: 'copyrights',
    title: 'Copyrights',
    description: (
      <>
        <p>
          Copyright grants creators exclusive rights to use and control their work, preventing
          unauthorized use by others.
        </p>
        <p>
          An author is the creator of a work, identified by their name unless stated otherwise. For
          anonymous or pseudonymous works, the publisher may represent the author. This term also
          includes contributors like scriptwriters and dialogue authors in visual or audio projects.
        </p>
      </>
    ),
    image: { src: '/images/services/copyrights.jpg', alt: 'Copyrights' },
    buttonLabel: 'Go to Copyrights',
    buttonHref: '/services/copyrights',
    buttonAriaLabel: 'Go to Copyrights',
  },
  {
    id: 'designs',
    title: 'Designs',
    description:
      'Design encompasses creations focused on the decorative or aesthetic appearance of an object. It can include three-dimensional elements like shapes or surfaces, as well as two-dimensional aspects such as graphics, lines, or colors.',
    image: { src: '/images/services/designs.jpg', alt: 'Designs' },
    buttonLabel: 'Go to Designs',
    buttonHref: '/services/designs',
    buttonAriaLabel: 'Go to Designs',
  },
  {
    id: 'layout-designs-and-integrated-circuits',
    title: 'Layout designs and Integrated Circuits',
    description:
      'An integrated circuit is a small electronic circuit created to perform a specific function. It is commonly used in electronic devices, where its components — at least one of which is active and their connections are integrated into a single piece of material. These components are arranged in a three-dimensional layout for efficient manufacturing.',
    image: {
      src: '/images/services/layout-designs.jpg',
      alt: 'Layout designs and Integrated Circuits',
    },
    buttonLabel: 'Go to Layout designs and Integrated Circuits',
    buttonHref: '/services/layout-designs-and-integrated-circuits',
    buttonAriaLabel: 'Go to Layout designs and Integrated Circuits',
  },
  {
    id: 'plant-varieties',
    title: 'Plant Varieties',
    description:
      'Plant varieties are specific subsets within a botanical taxon, classified as one of the simplest identifiable forms. They are defined by the consistent expression of traits resulting from a single genotype or a specific set of genotypes. A plant variety is distinguished from other plant groups by these unique characteristics and its ability to reproduce while preserving these traits unchanged.',
    image: { src: '/images/services/plant.jpg', alt: 'Plant Varieties' },
    buttonLabel: 'Go to Plant Varieties',
    buttonHref: '/services/plant-varieties',
    buttonAriaLabel: 'Go to Plant Varieties',
  },
];
interface ServicesProtectionSectionProps {
  heading?: string;
  description?: string | React.ReactNode;
  image?: { src: string; alt: string };
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

const ServicesProtectionSection = ({
  heading,
  description,
  image,
  verticalTabsData: propVerticalTabsData,
}: ServicesProtectionSectionProps) => {
  const tNav = useTranslations('servicesOverview.nav');
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
    finalVerticalTabsData[0]?.id || 'patents',
  );

  return (
    <>
      <section id="ip-protection">
        <DocumentSection
          heading={heading || 'IP protection & management'}
          description={
            description || (
              <>
                <p>
                  The six main IP services are: Patents, Trademarks, Copyrights, Integrated
                  Circuits, Designs and Plants.
                </p>
                <p>Each section provides detailed information and related services.</p>
                <p>
                  No matter which IP category you're dealing with, you'll find all the essential
                  tools and guidance here.
                </p>
              </>
            )
          }
          image={{
            src: image?.src || '/images/services/service-directory.jpg',
            alt: image?.alt || 'IP protection & management',
            aspect:
              'aspect-[3/2] h-[320px] md:h-[400px] lg:aspect-[708/474] lg:h-auto lg:max-h-[474px] lg:min-h-0 xl:aspect-auto xl:h-[474px] xl:max-h-[474px] xl:min-h-[474px]',
            wrapperClassName:
              'w-full min-w-0 max-w-full max-xl:mx-auto max-xl:max-w-[min(100%,708px)] xl:ms-auto xl:max-w-none xl:w-full xl:shrink-0',
          }}
          alignEnabled
          alignDirection="auto"
          className="px-4 md:px-8 max-w-[1280px] mx-auto lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_708px]"
        />
      </section>
      <Section id="about-ip-services">
        <ServicesInformation
          title={tNav('aboutIpServices')}
          tabs={dynamicVerticalTabs}
          data={finalVerticalTabsData}
          activeTab={activeVerticalTab}
          onTabChange={setActiveVerticalTab}
        />
      </Section>
    </>
  );
};

export default ServicesProtectionSection;
