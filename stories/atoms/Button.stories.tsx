import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from '@/components/atoms/Button';
import { ArrowRight } from 'lucide-react';
import Spinner from '@/components/atoms/Spinner';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
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
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
    layout: 'centered',
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    underline: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '200px', width: 'fit-content' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    intent: 'primary',
    ariaLabel: 'Primary button example',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    intent: 'secondary',
    ariaLabel: 'Secondary button example',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
    ariaLabel: 'Small button example',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
    ariaLabel: 'Large button example',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    ariaLabel: 'Full width button example',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    ariaLabel: 'Disabled button example',
  },
};

export const WithUnderline: Story = {
  args: {
    children: 'Underlined Button',
    underline: true,
    ariaLabel: 'Underlined button example',
  },
};

export const AsLink: Story = {
  args: {
    children: 'Button as Link',
    href: '/example',
    ariaLabel: 'Button as link example',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="mr-2">→</span>
        Button with Icon
      </>
    ),
    ariaLabel: 'Button with icon example',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    children: 'Accessible Button',
    ariaLabel: 'Custom Label',
    ariaExpanded: true,
    ariaControls: 'menu',
    ariaPressed: true,
    ariaDescribedby: 'description',
  },
};

export const Default: Story = {
  args: {
    href: '/',
    children: 'Default Button',
    ariaLabel: 'Default button',
  },
};

export const WithIconNextStep: Story = {
  args: {
    href: '/',
    children: (
      <>
        Next Step <ArrowRight className="ml-2 h-4 w-4" />
      </>
    ),
    intent: 'primary',
    ariaLabel: 'Next step',
  },
};

export const Loading: Story = {
  args: {
    href: '/',
    children: <Spinner colorClass="text-white-100" />,
    intent: 'primary',
    disabled: true,
    className: 'p-6 opacity-70 cursor-not-allowed',
  },
};
