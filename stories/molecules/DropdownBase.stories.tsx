import type { Meta, StoryObj } from '@storybook/nextjs';
import DropdownBase from '@/components/molecules/DropdownBase';

const meta: Meta<typeof DropdownBase> = {
  component: DropdownBase,
  title: 'Molecules/DropdownBase',
  tags: ['autodocs'],
  argTypes: {
    buttonContent: {
      control: 'text',
      description: 'Content of the dropdown trigger button',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the dropdown',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A base dropdown component ',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DropdownBase>;

export const Default: Story = {
  args: {
    buttonContent: 'Open Dropdown',
    label: 'Toggle dropdown menu',
    children: (
      <div className="p-4">
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 1</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 2</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 3</div>
      </div>
    ),
  },
};

export const DefaultRTL: Story = {
  args: {
    buttonContent: 'Open Dropdown',
    label: 'Toggle dropdown menu',
    children: (
      <div className="p-4">
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 1</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 2</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option 3</div>
      </div>
    ),
  },
  parameters: {
    direction: 'rtl',
  },
};

export const WithCustomButton: Story = {
  args: {
    buttonContent: (
      <div className="flex items-center gap-2">
        <span>Menu</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    ),
    label: 'Open menu with icon',
    children: (
      <div className="min-w-48">
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b">Option1</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b">Option2</div>
        <div className="py-2 px-4 hover:bg-gray-100 cursor-pointer">Option3</div>
      </div>
    ),
  },
};

export const MinimalExample: Story = {
  args: {
    buttonContent: '⋮',
    label: 'More options',
    children: (
      <div className="py-1">
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Option1</button>
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Option2</button>
      </div>
    ),
  },
};
