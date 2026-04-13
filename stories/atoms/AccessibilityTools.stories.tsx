import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import AccessibilityTools from '@/components/atoms/AccessibilityTools';

const meta: Meta<typeof AccessibilityTools> = {
  title: 'Atoms/AccessibilityTools',
  component: AccessibilityTools,
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
    className: {
      control: 'text',
      description: 'Custom CSS class for the wrapper element.',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-success-900 rounded-lg border border-neutral-200">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AccessibilityTools>;

export const Default: Story = {
  args: {
    className: '',
  },
};
