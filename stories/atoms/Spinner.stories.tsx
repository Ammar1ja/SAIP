import type { Meta, StoryObj } from '@storybook/nextjs';
import Spinner from '@/components/atoms/Spinner/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'number' },
      description: 'Size of the spinner in pixels - controls width and height',
    },
    colorClass: {
      control: { type: 'text' },
      description: 'Tailwind CSS color class for the spinner (e.g., text-blue-500)',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for styling the spinner container',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for screen readers describing the loading state',
    },
    role: {
      control: 'text',
      description: 'ARIA role attribute - typically "status" for loading indicators',
    },
    ariaLive: {
      control: 'select',
      options: ['polite', 'assertive', 'off'],
      description: 'ARIA live region behavior for screen reader announcements',
    },
    ariaHidden: {
      control: 'boolean',
      description: 'Whether to hide spinner from screen readers (for decorative use)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    ariaLabel: 'Loading content',
  },
};

export const Small: Story = {
  args: {
    size: 24,
    ariaLabel: 'Loading small content',
  },
};

export const Large: Story = {
  args: {
    size: 80,
    ariaLabel: 'Loading large content',
  },
};

export const CustomColor: Story = {
  args: {
    colorClass: 'text-red-500',
    ariaLabel: 'Loading with custom color',
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gray-100 rounded p-8',
    ariaLabel: 'Loading with background',
  },
};

export const WithAriaLabel: Story = {
  args: {
    ariaLabel: 'Loading user data...',
  },
};

export const InContext: Story = {
  render: () => (
    <div className="p-8 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Loading Content</h3>
      <div className="flex items-center justify-center py-12">
        <Spinner ariaLabel="Loading page content" />
      </div>
      <p className="text-gray-600 text-center">Please wait while we load your data...</p>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  args: {
    colorClass: 'text-white',
    ariaLabel: 'Loading on dark background',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const ButtonLoading: Story = {
  render: () => (
    <button
      type="button"
      disabled
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg opacity-70 cursor-not-allowed"
      aria-label="Processing request"
    >
      <Spinner size={16} colorClass="text-white" ariaHidden />
      Processing...
    </button>
  ),
};

export const CardLoading: Story = {
  render: () => (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      </div>
      <div className="flex justify-center py-8">
        <Spinner ariaLabel="Loading card content" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {[
        { size: 16, label: '16px' },
        { size: 32, label: '32px (default)' },
        { size: 48, label: '48px' },
        { size: 64, label: '64px' },
      ].map(({ size, label }) => (
        <div key={size} className="text-center">
          <Spinner size={size} ariaLabel={`${label} spinner`} />
          <p className="text-sm mt-2">{label}</p>
        </div>
      ))}
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[
        { color: 'text-blue-500', name: 'Blue' },
        { color: 'text-green-500', name: 'Green' },
        { color: 'text-red-500', name: 'Red' },
        { color: 'text-purple-500', name: 'Purple' },
      ].map(({ color, name }) => (
        <div key={color} className="text-center">
          <Spinner colorClass={color} ariaLabel={`${name} spinner`} />
          <p className="text-sm mt-2">{name}</p>
        </div>
      ))}
    </div>
  ),
};

export const AccessibleSpinner: Story = {
  args: {
    ariaLabel: 'Loading user profile data',
    role: 'status',
    ariaLive: 'polite',
  },
};
