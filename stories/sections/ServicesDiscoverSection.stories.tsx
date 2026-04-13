import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import ServicesDiscoverSection from '@/components/sections/ServicesDiscoverSection';

const meta: Meta<typeof ServicesDiscoverSection> = {
  title: 'sections/ServicesDiscoverSection',
  component: ServicesDiscoverSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ServicesDiscoverSection>;

const mockServicesData = [
  {
    id: '1',
    title: 'Trademark Search',
    description: 'Search for registered ',
    icon: '/icons/roles/aim.svg',
  },
  {
    id: '2',
    title: 'Patent Application',
    description: 'Submit your patent applications',
    icon: '/icons/roles/aim.svg',
  },
];

const mockVerticalTabs = [
  { id: 'info', label: 'Information' },
  { id: 'faq', label: 'FAQ' },
];

const mockVerticalTabsData = [
  {
    id: 'info',
    title: 'Information',
    description: 'Here is detailed information about our services.',
    image: { src: '/images/photo-container.png', alt: 'Info' },
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Frequently Asked Questions will go here.',
    image: { src: '/images/photo-container.png', alt: 'FAQ' },
  },
];

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('info');

    return (
      <ServicesDiscoverSection
        discoverHeading="Discover Our Services"
        servicesData={mockServicesData}
        infoHeading="Information You Need"
        infoDescription="Find all the details about our services here."
        verticalTabs={mockVerticalTabs}
        verticalTabsData={mockVerticalTabsData}
        activeVerticalTab={activeTab}
        setActiveVerticalTab={setActiveTab}
        serviceDirectorySection={{
          heading: 'Service Directory',
          description: 'Browse our complete service directory.',
          buttonLabel: 'View Directory',
          buttonHref: '/services',
        }}
      />
    );
  },
};
