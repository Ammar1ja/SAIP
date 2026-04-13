import { FilterButtonGroup } from '@/components/molecules/FilterButtonGroup/FilterButtonGroup';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FilterButtonGroup> = {
  title: 'Molecules/FilterButtonGroup',
  component: FilterButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: { type: 'object' } },
    activeTab: { control: 'text' },
    onTabChange: { action: 'onTabChange' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterButtonGroup>;

export const Default: Story = {
  args: {
    tabs: ['Registration application', 'Registration certificates'],
    activeTab: 'Registration application',
  },
};
