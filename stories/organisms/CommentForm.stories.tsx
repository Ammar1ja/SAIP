import type { Meta, StoryObj } from '@storybook/react';
import { CommentForm, CommentFormData } from '@/components/organisms/CommentForm';

const meta: Meta<typeof CommentForm> = {
  title: 'Organisms/CommentForm',
  component: CommentForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: {
      description: 'Callback function called when form is submitted',
      action: 'form-submitted',
    },
    className: {
      description: 'Additional CSS classes for styling',
      control: { type: 'text' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentForm>;

export const Default: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default comment form with all required fields and validation.',
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      console.log('Comment submitted:', data);
    },
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Comment form with custom styling applied via className prop.',
      },
    },
  },
};

export const FormInteraction: Story = {
  args: {
    onSubmit: (data: CommentFormData) => {
      alert(
        `Comment submitted!\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phoneNumber}\nComment: ${data.comment}`,
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive form that shows an alert with submitted data when the form is submitted. Try filling out the form and clicking "Send request".',
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
          'Interactive playground where you can test the form functionality and see the onSubmit callback in action.',
      },
    },
  },
};
