import { ReportsSection } from '@/components/sections/ReportsSection/ReportsSection';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ReportsSection> = {
  title: 'Sections/ReportsSection',
  component: ReportsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ReportsSection>;

export const Default: Story = {
  render: () => (
    <div className="bg-white min-h-screen">
      <ReportsSection reports={[]} categoryOptions={[]} reportTypeOptions={[]} />
    </div>
  ),
};
