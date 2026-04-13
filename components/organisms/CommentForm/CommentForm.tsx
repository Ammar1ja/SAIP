'use client';

import { useState } from 'react';
import { Form } from '@/components/molecules/Form';
import { FormField } from '@/components/molecules/Form/Form.types';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  className?: string;
}

export interface CommentFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  comment: string;
}

const commentFormFields: FormField[] = [
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
    id: 'comment',
    type: 'textarea',
    label: '* Comment',
    placeholder: 'Type your message',
    required: true,
  },
];

export function CommentForm({ onSubmit, className }: CommentFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string | boolean | string[]>>({
    fullName: '',
    email: '',
    phoneNumber: '',
    comment: '',
  });

  const handleFormChange = (fieldId: string, value: string | boolean | string[]) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = (values: Record<string, string | boolean | string[]>) => {
    const commentData: CommentFormData = {
      fullName: values.fullName as string,
      email: values.email as string,
      phoneNumber: values.phoneNumber as string,
      comment: values.comment as string,
    };
    onSubmit(commentData);
  };

  return (
    <div className={className}>
      <Form
        fields={commentFormFields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        submitLabel="Send request"
        submitIntent="primary"
        columns={2}
      />
    </div>
  );
}
