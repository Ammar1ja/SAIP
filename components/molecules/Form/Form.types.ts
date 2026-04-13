export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormProps {
  fields: FormField[];
  values: Record<string, string | boolean | string[]>;
  onChange: (fieldId: string, value: string | boolean | string[]) => void;
  onSubmit: (values: Record<string, string | boolean | string[]>) => void;
  submitLabel?: string;
  submitIntent?: 'primary' | 'secondary';
  className?: string;
  columns?: number;
}
