import type { Meta, StoryObj } from '@storybook/nextjs';
import IPLicensingOverviewSection from '@/components/sections/IPLicensingOverviewSection';

const meta: Meta<typeof IPLicensingOverviewSection> = {
  title: 'Sections/IPLicensingOverviewSection',
  component: IPLicensingOverviewSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomData: Story = {
  args: {
    guideData: {
      title: 'Custom Guide Title',
      description: 'Custom guide description for testing purposes.',
      image: {
        src: '/images/placeholder-document.png',
        alt: 'Custom document',
      },
      viewFileLabel: 'View custom file',
      viewFileHref: '#',
      downloadFileLabel: 'Download custom file',
      downloadFileHref: '#',
    },
    requirements: [
      {
        number: 1,
        text: 'Custom requirement 1.',
      },
      {
        number: 2,
        text: 'Custom requirement 2.',
      },
    ],
  },
};
