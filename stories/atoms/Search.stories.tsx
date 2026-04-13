import type { Meta, StoryObj } from '@storybook/nextjs';
import { Search } from '@/components/atoms/Search/Search';

const meta: Meta<typeof Search> = {
  title: 'Atoms/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the search input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    value: {
      control: 'text',
      description: 'Search value',
    },
    onChange: {
      description: 'Callback fired when the input value changes',
    },
    onSearch: {
      description: 'Callback fired when the search is submitted (Enter key)',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the search input',
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
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: 'Search',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Search products',
    placeholder: 'Type to search...',
  },
};

export const WithLabelAndValue: Story = {
  args: {
    label: 'Search products',
    placeholder: 'Type to search...',
    value: 'Example search',
  },
};

export const WithCustomAriaLabel: Story = {
  args: {
    label: 'Search products',
    placeholder: 'Type to search...',
    ariaLabel: 'Search through our product catalog',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Search products',
    placeholder: 'Search is currently disabled',
    disabled: true,
  },
};
