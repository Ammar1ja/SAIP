import type { Meta, StoryObj } from '@storybook/nextjs';
import PatentsGuideSection from '@/components/organisms/PatentsGuideSection';

const meta: Meta<typeof PatentsGuideSection> = {
  title: 'Organisms/PatentsGuideSection',
  component: PatentsGuideSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatentsGuideSection>;

export const Default: Story = {
  args: {},
};
