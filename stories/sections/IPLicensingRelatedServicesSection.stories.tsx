import type { Meta, StoryObj } from '@storybook/react';
import IPLicensingRelatedServicesSection from '@/components/sections/IPLicensingRelatedServicesSection';
import { IP_LICENSING_RELATED_SERVICES } from '@/components/sections/IPLicensingRelatedServicesSection/IPLicensingRelatedServicesSection.data';

const meta: Meta<typeof IPLicensingRelatedServicesSection> = {
  title: 'Sections/IPLicensingRelatedServicesSection',
  component: IPLicensingRelatedServicesSection,
  parameters: {
    layout: 'fullscreen',
    tags: ['autodocs'],
    docs: {
      description: {
        component:
          'A section component that displays related services for IP Licensing page. Shows a heading followed by service cards with questions, descriptions, prices, and CTA buttons.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main heading for the section',
    },
    services: {
      control: 'object',
      description:
        'Array of service objects containing question, title, description, price, ctaLabel, and ctaHref',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IPLicensingRelatedServicesSection>;

export const Default: Story = {
  args: {
    title: 'Related services',
    services: IP_LICENSING_RELATED_SERVICES,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Available Services',
    services: IP_LICENSING_RELATED_SERVICES,
  },
};

export const SingleService: Story = {
  args: {
    title: 'Related services',
    services: [
      {
        question: 'Do you meet all the conditions?',
        title: 'IP agent license registration',
        description:
          'Become a certified IP Agent and represent clients in IP matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia.',
        price: '3000 SAR',
        ctaLabel: 'Go to SAIP Platform',
        ctaHref: '/saip-platform/ip-agent-registration',
      },
    ],
  },
};

export const MultipleServices: Story = {
  args: {
    title: 'Related services',
    services: [
      {
        question: 'Do you meet all the conditions?',
        title: 'IP agent license registration',
        description:
          'Become a certified IP Agent and represent clients in IP matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia.',
        price: '3000 SAR',
        ctaLabel: 'Go to SAIP Platform',
        ctaHref: '/saip-platform/ip-agent-registration',
      },
      {
        question: "Are you ready but haven't passed the exam yet?",
        title: 'IP agents exam',
        description:
          'The professional test for Agents is required to obtain a license for providing IP services. It aims to build specialized national professionals and includes knowledge, skills, practices, and real-life examples.',
        price: '1000 SAR',
        ctaLabel: 'Go to SAIP Platform',
        ctaHref: '/saip-platform/ip-agent-exam',
      },
      {
        question: 'Need additional IP services?',
        title: 'IP Consultation Services',
        description:
          'Get expert advice on intellectual property matters from certified professionals.',
        price: '500 SAR',
        ctaLabel: 'Book Consultation',
        ctaHref: '/consultation',
      },
    ],
  },
};

export const EmptyServices: Story = {
  args: {
    title: 'Related services',
    services: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the section with no services to demonstrate the empty state.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Comprehensive IP Licensing and Professional Development Services',
    services: IP_LICENSING_RELATED_SERVICES,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the section handles longer titles.',
      },
    },
  },
};
