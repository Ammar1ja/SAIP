import type { Meta, StoryObj } from '@storybook/nextjs';
import DropdownMenu from '@/components/molecules/DropdownMenu';
import { ChevronIcon } from '@/components/icons';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Atoms/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    a11y: {
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
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label of the dropdown button',
    },
    items: {
      control: 'object',
      description: 'The items in the dropdown menu',
    },
    ariaLabel: {
      control: 'text',
      description: 'The ARIA label for the dropdown',
    },
    ariaDescribedby: {
      control: 'text',
      description: 'The ARIA describedby for the dropdown',
    },
    role: {
      control: 'text',
      description: 'The ARIA role for the dropdown',
    },
    tabIndex: {
      control: 'number',
      description: 'The tab index for keyboard navigation',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'The handler for when the dropdown opens or closes',
    },
    onItemSelect: {
      action: 'itemSelect',
      description: 'The handler for when an item is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const defaultItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Default: Story = {
  args: {
    label: 'Menu',
    items: defaultItems,
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Menu',
    items: defaultItems.map((item) => ({
      ...item,
      icon: {
        icon: ChevronIcon,
        size: 'small',
        color: 'primary',
        alt: `${item.label} icon`,
      },
    })),
  },
};

export const WithDescriptions: Story = {
  args: {
    label: 'Menu',
    items: defaultItems.map((item) => ({
      ...item,
      description: `Description for ${item.label}`,
    })),
  },
};

export const MultiColumn: Story = {
  args: {
    label: 'Resources',
    items: [
      { href: '/docs', label: 'Documentation', group: 'Guides' },
      { href: '/tutorials', label: 'Tutorials', group: 'Guides' },
      { href: '/api', label: 'API Reference', group: 'Reference' },
      { href: '/components', label: 'Components', group: 'Reference' },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    label: 'Menu',
    items: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About', disabled: true },
      { href: '/contact', label: 'Contact' },
    ],
  },
};

export const Interactive: Story = {
  args: {
    ...Default.args,
    tabIndex: 0,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const button = canvasElement.querySelector('button');
    if (button instanceof HTMLButtonElement) {
      button.click();
    }
  },
};

export const Accessible: Story = {
  args: {
    ...Default.args,
    ariaLabel: 'Navigation menu',
    ariaDescribedby: 'menu-description',
    role: 'navigation',
    tabIndex: 0,
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'list',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const CustomIcons: Story = {
  args: {
    label: 'Open',
    items: [
      {
        label: 'Edit',
        href: '#edit',
        icon: { src: '/icons/edit.svg', alt: 'Edit', size: 'small' },
      },
      {
        label: 'Duplicate',
        href: '#duplicate',
        icon: { src: '/icons/copy.svg', alt: 'Duplicate', size: 'small' },
      },
      {
        label: 'Archive',
        href: '#archive',
        icon: { src: '/icons/archive.svg', alt: 'Archive', size: 'small' },
      },
      {
        label: 'Move',
        href: '#move',
        icon: { src: '/icons/move.svg', alt: 'Move', size: 'small' },
      },
      {
        label: 'Delete',
        href: '#delete',
        icon: { src: '/icons/trash.svg', alt: 'Delete', size: 'small' },
      },
    ],
  },
};
