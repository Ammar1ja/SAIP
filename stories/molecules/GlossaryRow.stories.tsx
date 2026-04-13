import { GlossaryRow } from '@/components/molecules/GlossaryRow/GlossaryRow';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GlossaryRow> = {
  title: 'Molecules/GlossaryRow',
  component: GlossaryRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlossaryRow>;

export const Default: Story = {
  render: () => (
    <table className="w-full table-auto ">
      <tbody>
        <GlossaryRow
          index={0}
          english="Applicant"
          arabic="Arabic words"
          description="Description of Arabic word"
        />
      </tbody>
    </table>
  ),
};

export const DefaultRTL: Story = {
  render: () => (
    <table className="w-full  ">
      <tbody>
        <GlossaryRow
          index={1}
          english="Applicant"
          arabic="Arabic words"
          description="Description of Arabic word"
        />
      </tbody>
    </table>
  ),
  parameters: {
    direction: 'rtl',
  },
};
