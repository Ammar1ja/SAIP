import type { Meta, StoryObj } from '@storybook/nextjs';
import { DateRangePicker } from '@/components/molecules/DateRangePicker/DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: () => <DateRangePicker />,
};
