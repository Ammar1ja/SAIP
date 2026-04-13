import type { Meta, StoryObj } from '@storybook/nextjs';
import { Section } from '@/components/atoms/Section';
import { DirectionProvider } from '@/context/DirectionContext';

const meta: Meta<typeof Section> = {
  title: 'Atoms/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
          {
            id: 'region',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    background: {
      control: 'select',
      options: ['primary-50', 'neutral', 'white', 'primary'],
      description: 'Background color variant for the section container',
    },
    columns: {
      control: 'select',
      options: ['two', 'asymNarrowWide'],
      description: 'Column layout configuration for responsive grid behavior',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of the section content',
    },
    itemsAlign: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of items within flex/grid containers',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the section should take full viewport width',
    },
    rtlAwareAlign: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Alignment that automatically reverses in RTL languages',
    },
    responsiveAlignDirection: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Responsive alignment behavior on different screen sizes',
    },
    constrain: {
      control: 'boolean',
      description: 'Whether to apply max-width constraints to the section',
    },
    overlap: {
      control: 'boolean',
      description: 'Whether the section should overlap with adjacent sections',
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'default'],
      description: 'Padding size applied to the section container',
    },
    children: {
      control: 'text',
      description: 'Content to be rendered inside the section',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
    as: {
      control: 'select',
      options: ['section', 'div', 'main', 'article', 'aside'],
      description: 'HTML element to render as the section container',
    },
    role: {
      control: 'text',
      description: 'ARIA role for semantic meaning and accessibility',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for screen readers when section needs identification',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the section element',
    },
  },
  decorators: [
    (Story) => (
      <DirectionProvider dir="ltr">
        <Story />
      </DirectionProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    children: 'Default Section Content',
  },
};

export const WithBackground: Story = {
  args: {
    background: 'primary-50',
    children: 'Section with Light Background',
  },
};

export const WithColumns: Story = {
  args: {
    columns: 'two',
    children: (
      <>
        <div>Column 1</div>
        <div>Column 2</div>
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    children: 'Centered Section Content',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Section',
  },
};

export const WithPadding: Story = {
  args: {
    padding: 'medium',
    children: 'Section with Medium Padding',
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'bg-gray-100',
    children: 'Section with Custom Background',
  },
};

export const AsMain: Story = {
  args: {
    as: 'main',
    role: 'main',
    ariaLabel: 'Main content section',
    children: 'Main Content Section',
  },
};

export const RTL: Story = {
  decorators: [
    (Story) => (
      <DirectionProvider dir="rtl">
        <Story />
      </DirectionProvider>
    ),
  ],
  args: {
    rtlAwareAlign: 'right',
    children: 'RTL Section Content',
  },
};

export const Constrained: Story = {
  args: {
    constrain: true,
    children: 'Constrained Section with max-width limitations',
  },
};

export const WithOverlap: Story = {
  args: {
    overlap: true,
    background: 'primary',
    children: 'Overlapping Section Content',
  },
};

export const AsymmetricColumns: Story = {
  args: {
    columns: 'asymNarrowWide',
    children: (
      <>
        <div>Narrow Column</div>
        <div>Wide Column with more content that takes up more space</div>
      </>
    ),
  },
};

const PADDING_SIZES = [
  { padding: 'none' as const, label: 'No Padding' },
  { padding: 'small' as const, label: 'Small Padding' },
  { padding: 'medium' as const, label: 'Medium Padding' },
  { padding: 'large' as const, label: 'Large Padding' },
];

export const AllPaddingSizes: Story = {
  render: () => (
    <div className="space-y-4">
      {PADDING_SIZES.map(({ padding, label }) => (
        <Section key={padding} padding={padding} background="neutral">
          <div className="bg-blue-100 p-2">{label}</div>
        </Section>
      ))}
    </div>
  ),
};
