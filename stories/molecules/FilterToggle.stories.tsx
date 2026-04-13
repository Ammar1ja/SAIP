import { FilterToggle } from '@/components/molecules/FilterToggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FilterToggle> = {
  title: 'Molecules/FilterToggle',
  component: FilterToggle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      action: 'changed',
      description: 'Called when a filter value changes',
    },
    onClear: {
      action: 'cleared',
      description: 'Called when filters are cleared',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterToggle>;

const mockFields = [
  { id: 'date', type: 'date', label: 'Deposit date', placeholder: 'Select date' },
  {
    id: 'history',
    type: 'select',
    label: 'Grant history',
    placeholder: 'Select',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
  },
];

export const Default: Story = {
  args: {
    fields: mockFields,
    values: {},
    onChange: (id, value) => console.log('Filter changed:', id, value),
    onClear: () => console.log('Clear filters'),
  },
};

export const WithInitialValues: Story = {
  args: {
    fields: mockFields,
    values: {
      date: '2024-01-15',
      history: '2',
    },
    onChange: (id, value) => console.log('Filter changed:', id, value),
    onClear: () => console.log('Clear filters'),
  },
};
