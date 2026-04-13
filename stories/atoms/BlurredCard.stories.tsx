import type { Meta, StoryObj } from '@storybook/nextjs';
import BlurredCard from '@/components/molecules/BlurredCard';

const meta: Meta<typeof BlurredCard> = {
  title: 'Molecules/BlurredCard',
  component: BlurredCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlurredCard>;

export const Default: Story = {
  args: {
    title: 'Welcome to the blurred world',
    description: 'This is a beautiful card with a frosted glass effect and soft UI look.',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Information panel',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, explicabo? Quisquam, quasi. Modi culpa quos doloremque eius necessitatibus!',
  },
};

export const NoDescription: Story = {
  args: {
    title: 'Just a title',
  },
};

export const CustomClass: Story = {
  args: {
    title: 'With custom class',
    description: 'This card has padding and border customized.',
    className: 'p-8 border border-green-500',
  },
};
