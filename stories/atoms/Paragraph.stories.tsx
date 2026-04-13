import type { Meta, StoryObj } from '@storybook/nextjs';
import Paragraph from '@/components/atoms/Paragraph/Paragraph';

const meta: Meta<typeof Paragraph> = {
  title: 'Atoms/Paragraph',
  component: Paragraph,
  tags: ['autodocs'],
  args: {
    children: 'This is a sample paragraph, It shows how standard text appears in your UI',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
    children: {
      control: 'text',
      description: 'Paragraph content',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
  args: {
    children: 'This is a default paragraph with no additional styling',
  },
};

export const WithCustomStyle: Story = {
  args: {
    children: 'This paragraph uses a custom class for styling',
    className: 'text-blue-600 font-semibold',
  },
};

export const LongText: Story = {
  args: {
    children:
      'This is a long paragraph used to test how the component handles large amounts of text. It’s useful for checking padding, line height, and word wrapping behavior on different screen sizes',
  },
};
