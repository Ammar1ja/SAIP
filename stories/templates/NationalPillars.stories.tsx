import type { Meta, StoryObj } from '@storybook/nextjs';
import { NationalPillars } from '@/components/organisms/NationalPillars/NationalPillars';

const meta = {
  title: 'Organisms/NationalPillars',
  component: NationalPillars,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof NationalPillars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
