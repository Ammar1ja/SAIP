import type { Meta, StoryObj } from '@storybook/nextjs';
import MissionVisionCard from '@/components/molecules/MissionVisionCard';

const meta: Meta<typeof MissionVisionCard> = {
  title: 'Molecules/MissionVisionCard',
  component: MissionVisionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MissionVisionCard>;

export const Default: Story = {};

export const RTL: Story = {
  parameters: {
    direction: 'rtl',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: 'tablet' },
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1' },
  },
};
