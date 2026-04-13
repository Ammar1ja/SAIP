import type { Meta, StoryObj } from '@storybook/nextjs';
import DateComponent from '@/components/atoms/Date/Date';

const meta: Meta<typeof DateComponent> = {
  title: 'Atoms/DateComponent',
  component: DateComponent,
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
        ],
      },
    },
    docs: {
      description: {
        component: 'Displays a date in various formats: short, long, or relative.',
      },
    },
  },
  argTypes: {
    date: {
      control: 'text',
      description: 'Date value in ISO string or Date object',
    },
    format: {
      control: 'select',
      options: ['short', 'long', 'relative'],
      description: 'Format style for date',
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'white'],
      description: 'Color variant.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size.',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateComponent>;

export const ShortFormat: Story = {
  args: {
    date: new Date().toISOString(),
    format: 'short',
    variant: 'default',
    size: 'md',
  },
};

export const LongFormat: Story = {
  args: {
    date: new Date().toISOString(),
    format: 'long',
    variant: 'default',
    size: 'md',
  },
};

export const RelativeFormat: Story = {
  args: {
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    format: 'relative',
    variant: 'default',
    size: 'md',
  },
};

export const MutedVariant: Story = {
  args: {
    date: new Date().toISOString(),
    format: 'short',
    variant: 'muted',
    size: 'md',
  },
};

export const WhiteVariantLarge: Story = {
  args: {
    date: new Date().toISOString(),
    format: 'short',
    variant: 'white',
    size: 'lg',
    className: 'bg-neutral-900 p-4 rounded',
  },
};
