import type { Meta, StoryObj } from '@storybook/react/*';
import DropdownMenu from '@/components/molecules/DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  title: 'Molecules/DropdownMenu',
  tags: ['autodocs'],
  args: {
    label: 'menu',
    items: [
      { href: '/docs', label: 'Documentation' },
      { href: '/about', label: 'About' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    label: 'Menu',
    items: [
      { href: '/docs', label: 'Documentation' },
      { href: '/about', label: 'About' },
    ],
  },
};

export const DefaultRTL: Story = {
  args: {
    label: 'Menu',
    items: [
      { href: '/docs', label: 'Documentation' },
      { href: '/about', label: 'About' },
    ],
  },
  parameters: {
    direction: 'rtl',
  },
};

export const MultiColumn: Story = {
  args: {
    label: 'Resources',
    items: [
      { href: '/docs', label: 'API Reference', group: 'Documentation' },
      { href: '/docs', label: 'Getting Started', group: 'Documentation' },
      { href: '/about', label: 'Tutorials', group: 'About' },
      { href: '/blog', label: 'Blog', group: 'Blog' },
      { href: '/faq', label: 'FAQ', group: 'FAQ' },
    ],
  },
};

export const WithDescriptions: Story = {
  args: {
    label: 'Help',
    items: [
      {
        href: '/docs',
        label: 'Documentation',
        description: 'Read the full documentation',
      },
      {
        href: '/about',
        label: 'About',
        description: 'Read about us',
      },
    ],
  },
};

export const DisabledItems: Story = {
  args: {
    label: 'Documentation',
    items: [
      { href: '/docs', label: 'Documentation', disabled: true },
      { href: '/about', label: 'About' },
    ],
  },
};

export const CustomAriaProps: Story = {
  args: {
    label: 'Accessible Menu',
    ariaLabel: 'Main navigation menu',
    ariaDescribedby: 'dropdown-description',
    id: 'dropdown-custom',
  },
};
