import { IPGlossarySection } from '@/components/sections/IPGlossarySection/IPGlossarySection';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IPGlossarySection> = {
  title: 'Sections/IPGlossarySection',
  component: IPGlossarySection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IPGlossarySection>;

export const Default: Story = {
  render: () => <IPGlossarySection glossaryTerms={[]} acronyms={[]} />,
};

export const RTL: Story = {
  render: () => <IPGlossarySection glossaryTerms={[]} acronyms={[]} />,
  parameters: {
    direction: 'rtl',
  },
};
