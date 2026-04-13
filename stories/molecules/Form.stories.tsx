import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@/components/molecules/Form';
import { useState } from 'react';

const meta: Meta<typeof Form> = {
  title: 'Molecules/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3, 4],
    },
    submitIntent: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FormWrapper = (args: any) => {
  const [values, setValues] = useState<Record<string, string | boolean>>({});

  const handleChange = (fieldId: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (formValues: Record<string, string | boolean>) => {
    console.log('Form submitted:', formValues);
    alert('Form submitted! Check console for values.');
  };

  return <Form {...args} values={values} onChange={handleChange} onSubmit={handleSubmit} />;
};

export const Default: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        type: 'text',
        label: 'Full name',
        placeholder: 'Enter your full name',
        required: false,
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
      },
    ],
    submitLabel: 'Submit',
    submitIntent: 'primary',
    columns: 2,
  },
};

export const ContactForm: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        type: 'text',
        label: '* Full name',
        placeholder: 'Type your full name',
        required: true,
      },
      {
        id: 'email',
        type: 'email',
        label: '* Email',
        placeholder: 'Type your Email',
        required: true,
      },
      {
        id: 'phoneNumber',
        type: 'tel',
        label: '* Phone number',
        placeholder: 'Type your phone number',
        required: true,
      },
      {
        id: 'message',
        type: 'textarea',
        label: '* Message',
        placeholder: 'Type your message',
        required: true,
        helperText: 'Tell us what you need',
      },
    ],
    submitLabel: 'Send message',
    submitIntent: 'primary',
    columns: 2,
  },
};

export const SingleColumn: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'Enter username',
        required: true,
      },
      {
        id: 'password',
        type: 'text',
        label: 'Password',
        placeholder: 'Enter password',
        required: true,
      },
      {
        id: 'confirmPassword',
        type: 'text',
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
        required: true,
      },
      {
        id: 'terms',
        type: 'checkbox',
        label: 'I agree to the terms and conditions',
        required: true,
      },
    ],
    submitLabel: 'Create Account',
    submitIntent: 'primary',
    columns: 1,
  },
};

export const WithSelect: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'category',
        type: 'select',
        label: 'Category',
        placeholder: 'Select a category',
        required: true,
        options: [
          { value: 'general', label: 'General' },
          { value: 'support', label: 'Support' },
          { value: 'billing', label: 'Billing' },
          { value: 'technical', label: 'Technical' },
        ],
      },
      {
        id: 'priority',
        type: 'select',
        label: 'Priority',
        placeholder: 'Select priority',
        required: false,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ],
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Describe your request',
        required: true,
        helperText: 'Provide detailed information',
      },
    ],
    submitLabel: 'Submit Request',
    submitIntent: 'secondary',
    columns: 3,
  },
};

export const OpenDataRequestForm: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        type: 'text',
        label: '* Full name',
        placeholder: 'Type your full name',
        required: true,
      },
      {
        id: 'email',
        type: 'email',
        label: '* Email',
        placeholder: 'Type your Email',
        required: true,
      },
      {
        id: 'phoneNumber',
        type: 'tel',
        label: '* Phone number',
        placeholder: 'Type your phone number',
        required: true,
      },
      {
        id: 'requestDetails',
        type: 'textarea',
        label: '* Request details',
        placeholder: 'Type your request details',
        required: true,
        helperText: 'Write exactly what you need',
      },
      {
        id: 'purpose',
        type: 'textarea',
        label: '* Purpose of the request',
        placeholder: 'Type your message',
        required: true,
        helperText: 'Write why you need this data',
      },
      {
        id: 'acknowledgement',
        type: 'checkbox',
        label:
          'I acknowledge that I have read and agreed to the privacy and usage policy published on the site and the related terms and regulations.',
        required: true,
      },
    ],
    submitLabel: 'Send request',
    submitIntent: 'primary',
    columns: 2,
  },
};
