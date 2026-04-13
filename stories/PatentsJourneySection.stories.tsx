import type { Meta, StoryObj } from '@storybook/nextjs';
import PatentsJourneySection from '@/components/organisms/PatentsJourneySection';

const meta: Meta<typeof PatentsJourneySection> = {
  title: 'Organisms/PatentsJourneySection',
  component: PatentsJourneySection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatentsJourneySection>;

export const Default: Story = {
  args: {},
};
