import type { Meta, StoryObj } from '@storybook/nextjs';
import { Card } from '@/components/molecules/Card/Card';
import CardContent from '@/components/atoms/CardContent';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Atoms/Card',
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
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'This is a default card',
    shadow: false,
  },
};

export const WithShadow: Story = {
  args: {
    children: 'This card has shadow',
    shadow: true,
  },
};

export const NoBorder: Story = {
  args: {
    children: 'This card has no border',
    border: false,
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <CardContent title="Card Title" description="This is a card with content component inside" />
    ),
    shadow: true,
  },
};

export const Blurred: Story = {
  args: {
    children: 'This is a blurred card',
    variant: 'blurred',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Mission: Story = {
  args: {
    children: 'Mission card variant',
    variant: 'mission',
  },
};

export const News: Story = {
  args: {
    children: 'News card variant',
    variant: 'news',
  },
};

export const CustomPadding: Story = {
  args: {
    children: 'Card with custom padding',
    className: 'p-12',
  },
};

export const Pillar: Story = {
  args: {
    children: 'Pillar card variant',
    variant: 'pillar',
    shadow: true,
  },
};
