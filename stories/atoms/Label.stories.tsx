import type { Meta, StoryObj } from '@storybook/nextjs';
import Label from '@/components/atoms/Label/Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
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
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'disabled'],
      description: 'Color and style variant indicating the state or type of the label',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant controlling font size and spacing',
    },
    required: {
      control: 'boolean',
      description: 'Whether to show a required indicator (typically an asterisk)',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the form control this label is associated with',
    },
    as: {
      control: 'select',
      options: ['label', 'span'],
      description: 'HTML element to render - label for form controls, span for general text',
    },
    children: {
      control: 'text',
      description: 'The label text content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility when label text needs clarification',
    },
    ariaDescribedby: {
      control: 'text',
      description: 'ID of element that provides additional description for this label',
    },
    role: {
      control: 'text',
      description: 'ARIA role for semantic meaning when using non-label elements',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Default Label',
  },
};

export const WithVariant: Story = {
  args: {
    variant: 'success',
    children: 'Success Label',
  },
};

export const WithSize: Story = {
  args: {
    size: 'lg',
    children: 'Large Label',
  },
};

export const Required: Story = {
  args: {
    required: true,
    children: 'Required Field',
  },
};

export const FormLabel: Story = {
  args: {
    as: 'label',
    htmlFor: 'input-field',
    children: 'Form Label',
  },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <input
        id="input-field"
        type="text"
        className="border border-gray-300 rounded px-3 py-2"
        placeholder="Enter text here"
      />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    className: 'text-primary-500 font-semibold',
    children: 'Custom Styled Label',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    ariaLabel: 'Custom accessible label',
    ariaDescribedby: 'description',
    role: 'status',
    children: 'Accessible Label',
  },
  render: (args) => (
    <div>
      <Label {...args} />
      <div id="description" className="text-sm text-gray-600 mt-1">
        This is additional description text for the label
      </div>
    </div>
  ),
};

const LABEL_VARIANTS = [
  { variant: 'default' as const, label: 'Default Variant' },
  { variant: 'success' as const, label: 'Success Variant' },
  { variant: 'warning' as const, label: 'Warning Variant' },
  { variant: 'error' as const, label: 'Error Variant' },
  { variant: 'disabled' as const, label: 'Disabled Variant' },
];

const LABEL_SIZES = [
  { size: 'sm' as const, label: 'Small Label' },
  { size: 'md' as const, label: 'Medium Label' },
  { size: 'lg' as const, label: 'Large Label' },
];

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      {LABEL_VARIANTS.map(({ variant, label }) => (
        <Label key={variant} variant={variant}>
          {label}
        </Label>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-3">
      {LABEL_SIZES.map(({ size, label }) => (
        <Label key={size} size={size}>
          {label}
        </Label>
      ))}
    </div>
  ),
};

export const RequiredFormExample: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <Label as="label" htmlFor="email" required>
          Email Address
        </Label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label as="label" htmlFor="password" required variant="error">
          Password
        </Label>
        <input
          id="password"
          type="password"
          className="mt-1 block w-full border border-red-300 rounded px-3 py-2"
          placeholder="Enter your password"
        />
        <div className="text-sm text-red-600 mt-1">Password is required</div>
      </div>
    </div>
  ),
};
