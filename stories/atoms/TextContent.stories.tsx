import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextContent } from '@/components/atoms/TextConent/TextContent';

const meta: Meta<typeof TextContent> = {
  title: 'Atoms/TextContent',
  component: TextContent,
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
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant controlling font size and line height',
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'white', 'primary', 'success', 'warning', 'error'],
      description: 'Color variant for the text content',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight of the text content',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the container',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'strong', 'em'],
      description: 'HTML element to render as the text container',
    },
    children: {
      control: 'text',
      description: 'The text content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility when text needs clarification',
    },
    ariaDescribedby: {
      control: 'text',
      description: 'ID of element that provides additional description for this text',
    },
    role: {
      control: 'text',
      description: 'ARIA role for semantic meaning when using non-semantic elements',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the text element',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextContent>;

export const Default: Story = {
  args: {
    children: 'Default Text Content',
  },
};

export const WithSize: Story = {
  args: {
    size: 'lg',
    children: 'Large Text Content',
  },
};

export const WithColor: Story = {
  args: {
    color: 'primary',
    children: 'Colored Text Content',
  },
};

export const WithWeight: Story = {
  args: {
    weight: 'bold',
    children: 'Bold Text Content',
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'italic',
    children: 'Italic Text Content',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    ariaLabel: 'Custom accessible label',
    ariaDescribedby: 'description',
    role: 'status',
    children: 'Accessible Text Content',
  },
  render: (args) => (
    <div>
      <TextContent {...args} />
      <div id="description" className="text-sm text-gray-600 mt-2">
        This is additional description text for accessibility.
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <TextContent size="sm">Small text content</TextContent>
      <TextContent size="md">Medium text content (default)</TextContent>
      <TextContent size="lg">Large text content</TextContent>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-3">
      <TextContent color="default">Default color text</TextContent>
      <TextContent color="muted">Muted color text</TextContent>
      <TextContent color="primary">Primary color text</TextContent>
      <TextContent color="success">Success color text</TextContent>
      <TextContent color="warning">Warning color text</TextContent>
      <TextContent color="error">Error color text</TextContent>
    </div>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <div className="space-y-3">
      <TextContent weight="normal">Normal weight text</TextContent>
      <TextContent weight="medium">Medium weight text</TextContent>
      <TextContent weight="semibold">Semibold weight text</TextContent>
      <TextContent weight="bold">Bold weight text</TextContent>
    </div>
  ),
};

export const AllAlignments: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <TextContent align="left" className="w-full border border-gray-200 p-4">
        Left aligned text content
      </TextContent>
      <TextContent align="center" className="w-full border border-gray-200 p-4">
        Center aligned text content
      </TextContent>
      <TextContent align="right" className="w-full border border-gray-200 p-4">
        Right aligned text content
      </TextContent>
    </div>
  ),
};

export const DifferentElements: Story = {
  render: () => (
    <div className="space-y-3">
      <TextContent as="p">Paragraph element</TextContent>
      <TextContent as="span">Span element</TextContent>
      <TextContent as="div">Div element</TextContent>
      <TextContent as="strong" weight="bold">
        Strong element
      </TextContent>
      <TextContent as="em" className="italic">
        Emphasized element
      </TextContent>
    </div>
  ),
};

export const WhiteTextOnDark: Story = {
  args: {
    color: 'white',
    children: 'White text on dark background',
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

export const StatusText: Story = {
  args: {
    role: 'status',
    ariaLabel: 'System status message',
    color: 'success',
    weight: 'medium',
    children: 'Operation completed successfully',
  },
};

export const LongTextContent: Story = {
  args: {
    children:
      'This is a longer text content example to demonstrate how the TextContent component handles multiple lines of text with proper line height and spacing. It should maintain good readability across different screen sizes and text lengths.',
    className: 'max-w-md',
  },
};
