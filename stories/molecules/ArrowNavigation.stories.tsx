import type { Meta, StoryObj } from '@storybook/nextjs';
import ArrowNavigation from '@/components/molecules/ArrowNavigation';

const meta: Meta<typeof ArrowNavigation> = {
  title: 'Molecules/ArrowNavigation',
  component: ArrowNavigation,
  parameters: {
    layout: 'centered',
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'en',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ArrowNavigation>;

export const Default: Story = {
  args: {
    currentIndex: 1,
    totalItems: 5,
    searchParams: 'page',
    intent: 'primary',
  },
};

export const FirstItemDisabled: Story = {
  args: {
    currentIndex: 0,
    totalItems: 5,
    searchParams: 'page',
    intent: 'primary',
  },
};

export const LastItemDisabled: Story = {
  args: {
    currentIndex: 4,
    totalItems: 5,
    searchParams: 'page',
    intent: 'primary',
  },
};

export const SingleItem: Story = {
  args: {
    currentIndex: 0,
    totalItems: 1,
    searchParams: 'page',
    intent: 'primary',
  },
};

export const SecondaryIntent: Story = {
  args: {
    currentIndex: 2,
    totalItems: 5,
    searchParams: 'page',
    intent: 'secondary',
  },
};
