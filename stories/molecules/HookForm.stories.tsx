import type { Meta, StoryObj } from '@storybook/react';
import { HookForm } from '@/components/molecules/HookForm';
import { z } from 'zod';

const meta: Meta<typeof HookForm> = {
  title: 'Molecules/HookForm',
  component: HookForm,
  tags: ['autodocs'],
  argTypes: {
    fields: {
      table: {
        type: { summary: 'HookFormFields[]' },
      },
    },
    className: {
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    submitLabel: {
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    submitIntent: {
      control: { type: 'select' },
      table: {
        type: { summary: 'string' },
      },
      options: ['primary', 'secondary'],
    },
    columns: {
      control: { type: 'select' },
      table: {
        type: { summary: 'number' },
      },
      options: [1, 2, 3, 4],
    },
    uploadFiles: {
      control: { type: 'select' },
      table: {
        type: { summary: 'boolean' },
      },
      options: [true, false],
    },
    wrapped: {
      control: { type: 'select' },
      table: {
        type: { summary: 'boolean' },
      },
      options: [true, false],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const HookFormWrapper = (args: any) => {
  const handleSubmit = (formValues: Record<string, string | boolean>) => {
    console.log('Form submitted:', formValues);
    alert('Form submitted! Check console for values.');
  };

  return <HookForm {...args} onSubmit={handleSubmit} />;
};

export const Default: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        label: 'Full name',
        type: 'text',
        placeholder: 'Type your full name',
        helperText: 'Please enter your full name.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your full name.',
          })
          .min(2, { message: 'Your name must be at least 2 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your name contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Type your Email',
        helperText: 'Please enter your email address.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your email address',
          })
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message:
              'The email address format is invalid. Please use a valid email, e.g., mohammed.alrasheed@gmail.com.',
          }),
      },
    ],
    submitLabel: 'Submit',
    submitIntent: 'primary',
    columns: 2,
  },
};

export const ContactForm: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        label: 'Full name',
        type: 'text',
        placeholder: 'Type your full name',
        helperText: 'Please enter your full name.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your full name.',
          })
          .min(2, { message: 'Your name must be at least 2 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your name contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Type your Email',
        helperText: 'Please enter your email address.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your email address',
          })
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message:
              'The email address format is invalid. Please use a valid email, e.g., mohammed.alrasheed@gmail.com.',
          }),
      },
      {
        id: 'phoneNumber',
        label: 'Phone number',
        type: 'tel',
        placeholder: 'Type your phone number',
        helperText: 'Please provide your phone number.',
        options: [
          { label: '+966', value: '+966' },
          { label: '+48', value: '+48' },
          { label: '+47', value: '+47' },
        ],
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please provide your phone number.',
          })
          .regex(/^\+\d{1,3}\s?\d{7,15}$/, {
            message:
              'The phone number is not valid. Please ensure you include the correct country code.',
          }),
      },
      {
        id: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Type your message',
        helperText: 'Please write your message.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please write your message.',
          })
          .min(10, { message: 'Your message must be at least 10 characters long.' }),
      },
    ],
    submitLabel: 'Submit',
    submitIntent: 'primary',
    columns: 2,
  },
};

export const SingleColumn: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Type your username',
        helperText: 'Please enter your username.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your username.',
          })
          .min(8, { message: 'Your username must be at least 8 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your username contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'password',
        label: 'Password',
        type: 'text',
        placeholder: 'Type your password',
        helperText: 'Please enter your password.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your password.',
          })
          .min(8, { message: 'Your password must be at least 8 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your password contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'confirmPassword',
        label: 'confirmPassword',
        type: 'text',
        placeholder: 'Type your password again',
        helperText: 'Please enter your password again.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your password.',
          })
          .min(8, { message: 'Your password must be at least 8 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your password contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
    ],
    submitLabel: 'Create account',
    submitIntent: 'primary',
    columns: 1,
  },
};

export const WithSelect: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'category',
        type: 'select',
        label: 'Category',
        placeholder: 'Select a category',
        helperText: 'Please select a category from the list.',
        options: [
          { value: 'general', label: 'General' },
          { value: 'support', label: 'Support' },
          { value: 'billing', label: 'Billing' },
          { value: 'technical', label: 'Technical' },
        ],
        schema: z.string().refine((val) => (val ?? '').trim().length > 0, {
          message: 'Please select a category from the list.',
        }),
      },
      {
        id: 'priority',
        type: 'select',
        label: 'Priority',
        placeholder: 'Select priority',
        helperText: 'Please select a priority from the list.',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ],
        schema: z.string().refine((val) => (val ?? '').trim().length > 0, {
          message: 'Please select a priority from the list.',
        }),
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Describe your request',
        helperText: 'Provide detailed information',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please provide detailed information.',
          })
          .min(10, { message: 'Your message must be at least 10 characters long.' }),
      },
    ],
    submitLabel: 'Submit Request',
    submitIntent: 'secondary',
    columns: 3,
  },
};

export const OpenDataRequestForm: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        label: 'Full name',
        type: 'text',
        placeholder: 'Type your full name',
        helperText: 'Please enter your full name.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your full name.',
          })
          .min(2, { message: 'Your name must be at least 2 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your name contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Type your Email',
        helperText: 'Please enter your email address.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your email address',
          })
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message:
              'The email address format is invalid. Please use a valid email, e.g., mohammed.alrasheed@gmail.com.',
          }),
      },
      {
        id: 'phoneNumber',
        label: 'Phone number',
        type: 'tel',
        placeholder: 'Type your phone number',
        helperText: 'Please provide your phone number.',
        options: [
          { label: '+966', value: '+966' },
          { label: '+48', value: '+48' },
          { label: '+47', value: '+47' },
        ],
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please provide your phone number.',
          })
          .regex(/^\+\d{1,3}\s?\d{7,15}$/, {
            message:
              'The phone number is not valid. Please ensure you include the correct country code.',
          }),
      },
      {
        id: 'requestDetails',
        type: 'textarea',
        label: 'Request details',
        placeholder: 'Type your request details',
        helperText: 'Write exactly what you need',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please write exactly what you need.',
          })
          .min(10, { message: 'Your request details must be at least 10 characters long.' }),
      },
      {
        id: 'purpose',
        type: 'textarea',
        label: 'Purpose of the request',
        placeholder: 'Type your message',
        helperText: 'Write why you need this data',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please write why you need this data.',
          })
          .min(10, { message: 'Your purpose of the request must be at least 10 characters long.' }),
      },
      {
        id: 'acknowledgement',
        type: 'checkbox',
        label:
          'I acknowledge that I have read and agreed to the privacy and usage policy published on the site and the related terms and regulations.',
      },
    ],
    submitLabel: 'Send request',
    submitIntent: 'primary',
    columns: 2,
  },
};

export const WithUploadFiles: Story = {
  render: (args) => <HookFormWrapper {...args} />,
  args: {
    fields: [
      {
        id: 'fullName',
        label: 'Full name',
        type: 'text',
        placeholder: 'Type your full name',
        helperText: 'Please enter your full name.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your full name.',
          })
          .min(2, { message: 'Your name must be at least 2 characters long.' })
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
            message:
              'Your name contains invalid characters. Please use only letters, spaces or dashes.',
          }),
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Type your Email',
        helperText: 'Please enter your email address.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please enter your email address.',
          })
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message:
              'The email address format is invalid. Please use a valid email, e.g., mohammed.alrasheed@gmail.com.',
          }),
      },
      {
        id: 'phoneNumber',
        label: 'Phone number',
        type: 'tel',
        placeholder: 'Type your phone number',
        helperText: 'Please provide your phone number.',
        options: [
          { label: '+966', value: '+966' },
          { label: '+48', value: '+48' },
          { label: '+47', value: '+47' },
        ],
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please provide your phone number.',
          })
          .regex(/^\+\d{1,3}\s?\d{7,15}$/, {
            message:
              'The phone number is not valid. Please ensure you include the correct country code.',
          }),
      },
      {
        id: 'subject',
        label: 'Subject',
        type: 'select',
        placeholder: 'Select your subject',
        helperText: 'Please select a subject from the list.',
        options: [
          { label: 'Option', value: 'option1' },
          { label: 'Option', value: 'option2' },
          { label: 'Option', value: 'option3' },
          { label: 'Option', value: 'option4' },
        ],
        schema: z.string().refine((val) => (val ?? '').trim().length > 0, {
          message: 'Please select a subject from the list.',
        }),
      },
      {
        id: 'howCanWeHelp',
        label: 'How can we help?',
        type: 'textarea',
        placeholder: 'Type your message',
        helperText: 'Please describe how we can help.',
        schema: z
          .string()
          .refine((val) => (val ?? '').trim().length > 0, {
            message: 'Please describe how we can help.',
          })
          .min(10, { message: 'Your message must be at least 10 characters long.' }),
      },
    ],
    submitLabel: 'Submit',
    submitIntent: 'primary',
    uploadFiles: true,
    columns: 1,
  },
};
