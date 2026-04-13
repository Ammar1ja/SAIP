import { FilterButton } from '@/components/atoms/FilterButton/FilterButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FilterButton> = {
  title: 'Atoms/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: { type: 'text' } },
    active: { control: { type: 'boolean' } },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterButton>;

export const Default: Story = {
  args: {
    label: 'Registration application',
    active: false,
  },
};

export const Active: Story = {
  args: {
    label: 'Registration certificates',
    active: true,
  },
};

export const CustomClass: Story = {
  args: {
    label: 'Custom Styled',
    active: false,
    className: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  },
};
