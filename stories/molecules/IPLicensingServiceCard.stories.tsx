import type { Meta, StoryObj } from '@storybook/react';
import IPLicensingServiceCard from '@/components/molecules/IPLicensingServiceCard';

const meta: Meta<typeof IPLicensingServiceCard> = {
  title: 'Molecules/IPLicensingServiceCard',
  component: IPLicensingServiceCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A service card component for IP Licensing page that displays a question on the left and a detailed service card on the right with icon, title, description, price, and CTA button.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text displayed on the left side',
    },
    title: {
      control: 'text',
      description: 'The service title displayed in the green section',
    },
    description: {
      control: 'text',
      description: 'The service description text',
    },
    price: {
      control: 'text',
      description: 'The service price displayed in bold',
    },
    ctaLabel: {
      control: 'text',
      description: 'The call-to-action button text',
    },
    ctaHref: {
      control: 'text',
      description: 'The URL for the CTA button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IPLicensingServiceCard>;

export const Default: Story = {
  args: {
    question: 'Do you meet all the conditions?',
    title: 'IP agent license registration',
    description:
      'Become a certified IP Agent and represent clients in IP matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia.',
    price: '3000 SAR',
    ctaLabel: 'Go to SAIP Platform',
    ctaHref: '/saip-platform/ip-agent-registration',
  },
};

export const IPAgentsExam: Story = {
  args: {
    question: "Are you ready but haven't passed the exam yet?",
    title: 'IP agents exam',
    description:
      'The professional test for Agents is required to obtain a license for providing IP services. It aims to build specialized national professionals and includes knowledge, skills, practices, and real-life examples.',
    price: '1000 SAR',
    ctaLabel: 'Go to SAIP Platform',
    ctaHref: '/saip-platform/ip-agent-exam',
  },
};

export const LongDescription: Story = {
  args: {
    question: 'Need comprehensive IP services?',
    title: 'Complete IP Services Package',
    description:
      'This comprehensive package includes patent filing, trademark registration, copyright protection, design registration, and ongoing IP consultation services. Perfect for businesses looking for complete intellectual property protection.',
    price: '5000 SAR',
    ctaLabel: 'Get Started',
    ctaHref: '/services/complete-package',
  },
};

export const ShortDescription: Story = {
  args: {
    question: 'Quick IP consultation?',
    title: 'IP Consultation',
    description: 'Get expert IP advice.',
    price: '500 SAR',
    ctaLabel: 'Book Now',
    ctaHref: '/consultation',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <IPLicensingServiceCard
        question="Do you meet all the conditions?"
        title="IP agent license registration"
        description="Become a certified IP Agent and represent clients in IP matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia."
        price="3000 SAR"
        ctaLabel="Go to SAIP Platform"
        ctaHref="/saip-platform/ip-agent-registration"
      />
      <IPLicensingServiceCard
        question="Are you ready but haven't passed the exam yet?"
        title="IP agents exam"
        description="The professional test for Agents is required to obtain a license for providing IP services. It aims to build specialized national professionals and includes knowledge, skills, practices, and real-life examples."
        price="1000 SAR"
        ctaLabel="Go to SAIP Platform"
        ctaHref="/saip-platform/ip-agent-exam"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows multiple IPLicensingServiceCard components stacked vertically, demonstrating how they appear together on the IP Licensing page.',
      },
    },
  },
};
