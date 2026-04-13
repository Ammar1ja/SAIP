import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { NavigationItem } from '@/components/molecules/Navigation/Navigation.type';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Navigation> = {
  title: 'Molecules/Navigation',
  component: Navigation,
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
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

const items: NavigationItem[] = [
  { label: 'SAIP mission & vision', href: '#mission' },
  { label: 'Our values', href: '#values' },
  { label: 'CEO speech', href: '#ceo' },
  { label: 'Our roles', href: '#roles' },
  { label: 'Our pillars', href: '#pillars' },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const DefaultRTL: Story = {
  args: {
    items,
  },
  parameters: {
    direction: 'rtl',
  },
};
