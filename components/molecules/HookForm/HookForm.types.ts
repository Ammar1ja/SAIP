import { z } from 'zod';
import { SubmitHandler, DefaultValues } from 'react-hook-form';

export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';

export interface HookFormField {
  id: string;
  type: FieldType;
  label: string;
  required?: true;
  placeholder?: string;
  className?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
  schema?: z.ZodTypeAny;
}

export interface HookFormProps {
  fields: HookFormField[];
  defaultValues?: DefaultValues<any>;
  onSubmit: SubmitHandler<any>;
  submitLabel?: string;
  submitIntent?: 'primary' | 'secondary';
  uploadFiles?: boolean;
  className?: string;
  columns?: number;
  wrapped?: boolean;
}
