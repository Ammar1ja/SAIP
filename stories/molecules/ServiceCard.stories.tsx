import type { Meta, StoryObj } from '@storybook/nextjs';
import ServiceCard from '@/components/molecules/ServiceCard';

const meta: Meta<typeof ServiceCard> = {
  title: 'Molecules/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ServiceCard>;

export const Default: Story = {
  args: {
    title: 'Standard Service',
    labels: ['Internal', 'Confidential'],
    description: 'This is a default description of the service card displaying a summary.',
    publicationNumber: '123-456',
    durationDate: '15 Jun 2025 - 17 Jun 2025',
    publicationDate: '05 Jan 2024',
    primaryButtonLabel: 'Details',
    secondaryButtonLabel: 'Download',
  },
};

export const GreenTitle: Story = {
  args: {
    ...Default.args,
    title: 'Green Title Section',
    titleBg: 'green',
  },
};

export const WithOnlyPrimaryButton: Story = {
  args: {
    ...Default.args,
    secondaryButtonLabel: undefined,
  },
};

export const WithOnlySecondaryButton: Story = {
  args: {
    ...Default.args,
    primaryButtonLabel: undefined,
  },
};

export const Detailed: Story = {
  args: {
    variant: 'detailed',
    title: 'Detailed Service Card',
    details: [
      {
        icon: ':)',
        label: 'Document',
        value: 'PDF File',
      },
      {
        icon: ':)',
        label: 'Date',
        value: '05 Jan 2024',
      },
    ],
    primaryButtonLabel: 'View Details',
    secondaryButtonLabel: 'Download',
  },
};

export const LongText: Story = {
  args: {
    ...Default.args,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed bibendum augue. Ut pellentesque, nisl ac malesuada aliquet, mauris odio consequat nisl, in pulvinar magna turpis quis nibh.`,
  },
};
