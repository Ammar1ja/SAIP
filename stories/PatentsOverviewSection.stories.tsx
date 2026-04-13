import type { Meta, StoryObj } from '@storybook/nextjs';
import PatentsOverviewSection from '@/components/organisms/PatentsOverviewSection';
import { DirectionProvider } from '@/context/DirectionContext';

const meta: Meta<typeof PatentsOverviewSection> = {
  title: 'Organisms/PatentsOverviewSection',
  component: PatentsOverviewSection,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <DirectionProvider dir="ltr">
        <Story />
      </DirectionProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatentsOverviewSection>;

export const Default: Story = {
  args: {},
};
