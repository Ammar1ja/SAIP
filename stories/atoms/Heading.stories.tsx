import type { Meta, StoryObj } from '@storybook/nextjs';
import Heading from '@/components/atoms/Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
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
            id: 'heading-order',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'],
      description: 'HTML element to render - controls semantic meaning for screen readers',
    },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Visual size of the heading - independent of HTML element',
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'white', 'primary', 'success', 'warning', 'error'],
      description: 'Color variant for the heading text',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight of the heading text',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the heading container',
    },
    children: {
      control: 'text',
      description: 'The heading text content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility when heading text needs clarification',
    },
    ariaLevel: {
      control: 'number',
      description: 'ARIA heading level when using non-semantic elements like div',
    },
    ariaDescribedby: {
      control: 'text',
      description: 'ID of element that describes this heading for screen readers',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the heading element',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: 'Default Heading',
    ariaLabel: 'Default heading example',
  },
};

export const H1: Story = {
  args: {
    as: 'h1',
    size: 'h1',
    children: 'Heading 1',
    ariaLabel: 'Heading 1 example',
  },
};

export const H2: Story = {
  args: {
    as: 'h2',
    size: 'h2',
    children: 'Heading 2',
    ariaLabel: 'Heading 2 example',
  },
};

export const H3: Story = {
  args: {
    as: 'h3',
    size: 'h3',
    children: 'Heading 3',
    ariaLabel: 'Heading 3 example',
  },
};

export const H4: Story = {
  args: {
    as: 'h4',
    size: 'h4',
    children: 'Heading 4',
    ariaLabel: 'Heading 4 example',
  },
};

export const H5: Story = {
  args: {
    as: 'h5',
    size: 'h5',
    children: 'Heading 5',
    ariaLabel: 'Heading 5 example',
  },
};

export const H6: Story = {
  args: {
    as: 'h6',
    size: 'h6',
    children: 'Heading 6',
    ariaLabel: 'Heading 6 example',
  },
};

export const WithColor: Story = {
  args: {
    size: 'h1',
    color: 'primary',
    children: 'Colored Heading',
    ariaLabel: 'Colored heading example',
  },
};

export const WithWeight: Story = {
  args: {
    size: 'h1',
    weight: 'bold',
    children: 'Bold Heading',
    ariaLabel: 'Bold heading example',
  },
};

export const Centered: Story = {
  args: {
    size: 'h1',
    align: 'center',
    children: 'Centered Heading',
    ariaLabel: 'Centered heading example',
  },
};

export const NonSemantic: Story = {
  args: {
    as: 'div',
    size: 'h2',
    ariaLevel: 2,
    children: 'Non-semantic Heading',
    ariaLabel: 'Non-semantic heading example',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    size: 'h1',
    children: 'Accessible Heading',
    ariaLabel: 'Custom Label',
    ariaDescribedby: 'description',
    id: 'test-heading',
  },
};
