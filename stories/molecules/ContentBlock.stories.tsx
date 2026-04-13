import type { Meta, StoryObj } from '@storybook/react/*';
import ContentBlock from '@/components/molecules/ContentBlock';

const meta: Meta<typeof ContentBlock> = {
  component: ContentBlock,
  title: 'Molecules/ContentBlock',
  tags: ['autodocs'],
  argTypes: {
    heading: {
      control: 'text',
      description: 'Main heading text for the block',
    },
    text: {
      control: 'text',
      description: 'Supporting body text',
    },
    textAlign: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Text alignment of the block',
    },
    lineHeight: {
      control: { type: 'select' },
      options: ['normal', 'none'],
      description: 'Line height',
    },
    headingSize: {
      control: { type: 'select' },
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContentBlock>;

export const Dedault: Story = {
  args: {
    heading: 'Our Vision',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
};

export const DedaultRTL: Story = {
  args: {
    heading: 'Our Vision',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const CenteredText: Story = {
  args: {
    heading: 'Centered Heading',
    text: 'This block is centered',
    textAlign: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    heading: 'Right Aligned Block',
    text: 'All text here is aligned to the right.',
    textAlign: 'right',
  },
};

export const NoLineHeight: Story = {
  args: {
    heading: 'Compact Line Height',
    text: 'This version reduce vertical spacing.',
    lineHeight: 'none',
  },
};

export const CustomHeadingSize: Story = {
  args: {
    heading: 'Heading as H4',
    headingSize: 'h4',
    text: 'The heading above uses a smaller',
  },
};

export const WithExtraClass: Story = {
  args: {
    heading: 'With Border & Padding',
    text: 'This block has extra styles',
    className: 'border p-4 bg-gray-50',
  },
};
