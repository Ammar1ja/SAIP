import type { Meta, StoryObj } from '@storybook/nextjs';
import CardContent from '@/components/atoms/CardContent';

const meta: Meta<typeof CardContent> = {
  title: 'Atoms/CardContent',
  component: CardContent,
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
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'compact', 'project'],
      description: 'Visual variant of the card content affecting styling and layout',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant controlling padding and spacing inside the card',
    },
    titleSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the title text when title prop is provided',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card responds to hover and click interactions',
    },
    title: {
      control: 'text',
      description: 'Optional title text displayed at the top of the card',
    },
    description: {
      control: 'text',
      description: 'Optional description text displayed below the title',
    },
    children: {
      control: 'text',
      description: 'Main content to be displayed inside the card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for customizing card appearance',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function - only works when interactive is true',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardContent>;

export const Default: Story = {
  args: {
    children: 'Default Card Content',
  },
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    children: 'Bordered Card Content',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'Elevated Card Content with shadow',
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    children: 'Compact Card Content with reduced padding',
  },
};

export const Project: Story = {
  args: {
    variant: 'project',
    children: 'Project Card Content with specialized styling',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: 'Card Content with Title',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a description of the card content',
    children: 'Card Content with Description',
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    onClick: () => {
      console.log('Card clicked!');
    },
    children: 'Interactive Card Content - Click me!',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    titleSize: 'lg',
    title: 'Large Card',
    children: 'Large sized card content with more spacing',
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    titleSize: 'sm',
    title: 'Small Card',
    children: 'Small sized card content with compact spacing',
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200',
    title: 'Custom Styled Card',
    children: 'Card Content with Custom Background Gradient',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    'aria-label': 'Product information card',
    'aria-description': 'Contains details about the selected product',
    role: 'region',
    title: 'Product Details',
    children: 'Accessible Card Content with proper ARIA attributes',
  },
};
