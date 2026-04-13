import type { Meta, StoryObj } from '@storybook/nextjs';
import { PersonCard } from '@/components/molecules/PersonCard';

const meta: Meta<typeof PersonCard> = {
  title: 'Molecules/PersonCard',
  component: PersonCard,
  tags: ['autodocs'],
  args: {
    image: '/images/board/alswailem.jpg',
    name: 'Dr. Abdulaziz bin Mohammed AlSwailem',
    title: 'CEO of the Saudi Authority for Intellectual Property',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PersonCard>;

export const Default: Story = {};

export const WithCustomStyles: Story = {
  args: {
    className: 'max-w-sm mx-auto',
  },
};

export const BoardMember: Story = {
  args: {
    image: '/images/board/alyahya.jpg',
    name: 'Deemah AlYahya',
    title: 'Board Member',
  },
};
