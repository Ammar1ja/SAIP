import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardGrid } from '@/components/organisms/CardGrid/CardGrid';
import { CardGridItem } from '@/components/organisms/CardGrid/CardGrid';
import { ChevronIcon, StrategyBrainIcon, ChartBarIcon } from '@/components/icons';

const meta = {
  title: 'Organisms/CardGrid',
  component: CardGrid,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: CardGridItem[] = [
  {
    title: 'First Item',
    description: 'Description for the first item',
    icon: {
      component: ChevronIcon,
      alt: 'Chevron Icon',
      size: 'medium',
      background: 'none',
    },
  },
  {
    title: 'Second Item',
    description: 'Description for the second item',
    icon: {
      component: StrategyBrainIcon,
      alt: 'Brain Icon',
      size: 'medium',
      background: 'green',
    },
  },
  {
    title: 'Third Item',
    description: 'Description for the third item',
    icon: {
      component: ChartBarIcon,
      alt: 'Chart Icon',
      size: 'medium',
      background: 'light',
    },
  },
];

const defaultArgs = {
  items: sampleItems,
  heading: 'Sample Grid',
  text: 'This is a sample grid with some items.',
  showViewAll: true,
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithoutViewAll: Story = {
  args: {
    ...defaultArgs,
    showViewAll: false,
  },
};

export const RTL: Story = {
  args: defaultArgs,
  parameters: {
    direction: 'rtl',
  },
};

export const Tablet: Story = {
  args: defaultArgs,
  globals: {
    viewport: {
      value: 'tablet',
    },
  },
};

export const Mobile: Story = {
  args: defaultArgs,
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};
