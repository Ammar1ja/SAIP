import type { Meta, StoryObj } from '@storybook/nextjs';
import PatentsMediaSection from '@/components/organisms/PatentsMediaSection';

const meta: Meta<typeof PatentsMediaSection> = {
  title: 'Organisms/PatentsMediaSection',
  component: PatentsMediaSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatentsMediaSection>;

export const Default: Story = {
  args: {},
};
