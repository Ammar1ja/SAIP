import type { Meta, StoryObj } from '@storybook/nextjs';
import { Select } from '@/components/atoms/Select/Select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the select',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    onChange: {
      description: 'Callback fired when selection changes',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Tender activity',
    options: defaultOptions,
    placeholder: 'Select',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Tender activity',
    options: defaultOptions,
    value: 'option2',
    placeholder: 'Select',
  },
};

export const Required: Story = {
  args: {
    label: 'Tender activity',
    options: defaultOptions,
    placeholder: 'Select',
    required: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Tender activity',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Tender activity',
    options: defaultOptions,
    placeholder: 'Select is disabled',
    disabled: true,
  },
};

export const Multiselect: Story = {
  args: {
    label: 'Category',
    options: [
      { value: 'cat1', label: 'Category 1' },
      { value: 'cat2', label: 'Category 2' },
      { value: 'cat3', label: 'Category 3' },
      { value: 'cat4', label: 'Category 4' },
    ],
    multiselect: true,
    value: ['cat1', 'cat3'],
    placeholder: 'Select categories',
  },
};

export const SingleCustom: Story = {
  args: {
    label: 'Service type',
    options: [
      { value: 'type1', label: 'Type 1' },
      { value: 'type2', label: 'Type 2' },
      { value: 'type3', label: 'Type 3' },
    ],
    value: 'type2',
    placeholder: 'Select type',
  },
};

export const LongOptions: Story = {
  args: {
    label: 'Very long options',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `val${i + 1}`,
      label: `Option with a very long label number ${i + 1}`,
    })),
    multiselect: true,
    value: ['val2', 'val10'],
    placeholder: 'Select...',
  },
};
