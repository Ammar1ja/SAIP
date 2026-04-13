import type { Meta, StoryObj } from '@storybook/react';
import { GradientBlock } from '@/components/atoms/GradientBlock';

const meta: Meta<typeof GradientBlock> = {
  title: 'Molecules/GradientBlock',
  tags: ['autodocs'],
  component: GradientBlock,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['max-w-[80%]', 'max-w-[600px]', 'max-w-[800px]', 'max-w-full'],
      description: 'Maximum width of the white content container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'max-w-[80%]' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the container',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sample Content</h3>
        <p className="text-gray-600 mb-4">
          This is a sample content inside the GradientBlock component.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            The gradient decoration appears on the right side of this container.
          </p>
        </div>
      </div>
    ),
  },
};

export const WithChartContent: Story = {
  args: {
    children: (
      <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chart Placeholder</h3>
          <p className="text-gray-600">Chart content would go here</p>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-xs text-gray-700">Interactive chart elements</p>
          </div>
        </div>
      </div>
    ),
  },
};
