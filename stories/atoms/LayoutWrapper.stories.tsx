import type { Meta, StoryObj } from '@storybook/nextjs';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';

const meta: Meta<typeof LayoutWrapper> = {
  title: 'Atoms/LayoutWrapper',
  component: LayoutWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      disable: false,
      config: {
        rules: [
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
    variant: {
      control: 'select',
      options: ['default', 'narrow', 'wide'],
      description: 'Layout width variant - controls max-width and container constraints',
    },
    children: {
      control: false,
      description: 'React children elements to be wrapped in the layout container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for customizing the wrapper styling',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'main', 'article', 'aside'],
      description: 'HTML element to render as the wrapper container',
    },
    role: {
      control: 'text',
      description: 'ARIA role attribute for semantic meaning and accessibility',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutWrapper>;

const ExampleContent = () => (
  <div className="bg-blue-100 p-8 text-center rounded-lg border border-blue-200">
    <h3 className="text-lg font-semibold mb-2">Example Content</h3>
    <p className="text-gray-700">This content is wrapped in a LayoutWrapper component</p>
  </div>
);

export const Default: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'default',
  },
};

export const Narrow: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'narrow',
  },
};

export const Wide: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'wide',
  },
};

export const AsSection: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'default',
    as: 'section',
    role: 'region',
  },
};

export const AsMain: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'default',
    as: 'main',
    role: 'main',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: <ExampleContent />,
    variant: 'default',
    className: 'bg-yellow-50 border-2 border-yellow-200 rounded-xl',
  },
};
