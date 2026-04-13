import type { Meta, StoryObj } from '@storybook/react/*';
import MobileNavHeader from '@/components/molecules/MobileNavHeader';

const meta: Meta<typeof MobileNavHeader> = {
  title: 'Molecules/MobileNavHeader',
  component: MobileNavHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MobileNavHeader>;

export const Default: Story = {
  args: {
    title: 'Main Menu',
  },
};

export const DefaultRTL: Story = {
  args: {
    title: 'Main Menu',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const WithBackButton: Story = {
  args: {
    title: 'Subpage',
    onBackClick: () => alert('Back clicked!'),
  },
};

export const CustomClassName: Story = {
  args: {
    title: 'Custom Styled Header',
    className: 'bg-blue-100',
  },
};
