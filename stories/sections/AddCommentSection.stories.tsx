import type { Meta, StoryObj } from '@storybook/react';
import { AddCommentSection } from '@/components/sections/AddCommentSection';
import { CommentFormData } from '@/components/organisms/CommentForm';

const meta: Meta<typeof AddCommentSection> = {
  title: 'Sections/AddCommentSection',
  component: AddCommentSection,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onSubmit: {
      description: 'Callback function called when comment form is submitted',
      action: 'comment-submitted',
    },
    className: {
      description: 'Additional CSS classes for styling',
      control: { type: 'text' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddCommentSection>;

export const Default: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default add comment section with title and form in two-column layout.',
      },
    },
  },
};

export const WithCustomHandler: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      alert(
        `New comment received!\n\nFrom: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phoneNumber}\nComment: ${data.comment}`,
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Add comment section with custom submission handler that shows an alert with the submitted data.',
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
    className: 'bg-gray-50',
  },
  parameters: {
    docs: {
      description: {
        story: 'Add comment section with custom background styling applied.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the responsive behavior of the add comment section. Resize the viewport to see how it adapts from two-column to single-column layout.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground where you can test the add comment section functionality and see how the onSubmit callback works.',
      },
    },
  },
};
