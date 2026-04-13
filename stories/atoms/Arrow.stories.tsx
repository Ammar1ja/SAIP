import type { Meta, StoryObj } from '@storybook/nextjs';
import Arrow from '@/components/atoms/Arrow';

const meta: Meta<typeof Arrow> = {
  title: 'Atoms/Arrow',
  component: Arrow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Arrow direction.',
    },
    background: {
      control: 'select',
      options: ['primary', 'natural', 'disabled', 'transparent', 'transparentDisabled'],
      description: 'Background style of the arrow.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'smallWide'],
      description: 'Size of the arrow.',
    },
    shape: {
      control: 'select',
      options: ['round', 'square'],
      description: 'Shape of the arrow.',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for wrapper.',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Arrow>;

export const DefaultRight: Story = {
  args: {
    direction: 'right',
    background: 'natural',
    size: 'medium',
    shape: 'round',
    ariaLabel: 'Arrow right',
  },
};

export const DefaultLeft: Story = {
  args: {
    direction: 'left',
    background: 'natural',
    size: 'medium',
    shape: 'round',
    ariaLabel: 'Arrow left',
  },
};

export const PrimaryRight: Story = {
  args: {
    direction: 'right',
    background: 'primary',
    size: 'medium',
    shape: 'round',
    ariaLabel: 'Arrow right primary',
  },
};

export const PrimaryLeft: Story = {
  args: {
    direction: 'left',
    background: 'primary',
    size: 'medium',
    shape: 'round',
    ariaLabel: 'Arrow left primary',
  },
};

export const Disabled: Story = {
  args: {
    direction: 'left',
    background: 'disabled',
    size: 'medium',
    shape: 'square',
    ariaLabel: 'Disabled arrow',
  },
};

export const Square: Story = {
  args: {
    direction: 'left',
    background: 'primary',
    size: 'medium',
    shape: 'square',
    ariaLabel: 'Squared arrow',
  },
};

export const Transparent: Story = {
  args: {
    direction: 'right',
    background: 'transparent',
    size: 'medium',
    shape: 'square',
    ariaLabel: 'Transparent arrow',
  },
};

export const TransparentDisabled: Story = {
  args: {
    direction: 'right',
    background: 'transparentDisabled',
    size: 'medium',
    shape: 'square',
    ariaLabel: 'Transparent disabled arrow',
  },
};

export const SmallWide: Story = {
  args: {
    direction: 'right',
    background: 'natural',
    size: 'smallWide',
    shape: 'round',
    ariaLabel: 'Small wide arrow',
  },
};
