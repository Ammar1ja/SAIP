import type { Meta, StoryObj } from '@storybook/nextjs';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
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
            id: 'link-name',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for navigation container',
    },
    items: {
      description: 'Array of breadcrumbs element',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Services Overview', href: '/services/overview' },
    ],
  },
};

export const WithActiveItem: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Services Overview' },
    ],
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'bg-gray-50 p-4 rounded',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Services Overview' },
    ],
  },
};
