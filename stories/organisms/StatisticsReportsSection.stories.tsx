import type { Meta, StoryObj } from '@storybook/react';
import { StatisticsReportsSection } from '@/components/organisms/StatisticsReportsSection';

const meta: Meta<typeof StatisticsReportsSection> = {
  title: 'Organisms/StatisticsReportsSection',
  component: StatisticsReportsSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatisticsReportsSection>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gray-50',
  },
};
