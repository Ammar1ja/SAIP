import { HookFormProps } from '@/components/molecules/HookForm/HookForm.types';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import {
  formContainer,
  formActions,
  formGrid,
  formPhoneInputWrapper,
} from '@/components/molecules/HookForm/HookForm.styles';
import { Button } from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import { X } from 'lucide-react';

export const HookForm = ({
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Submit',
  submitIntent = 'primary',
  className,
  uploadFiles = false,
  columns = 1,
  wrapped = true,
}: HookFormProps) => {
  const t = useTranslations('common.form');
  const defValues = defaultValues ?? Object.fromEntries(fields.map((f) => [f.id, '']));
  const schema = z.object(Object.fromEntries(fields.map((f) => [f.id, f.schema])));

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Record<string, any>>({
    mode: 'onChange',
    defaultValues: defValues,
    resolver: zodResolver(schema),
  });

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gridColumns = columns || fields.length;
  const onInvalid = (errors: any) => {
    console.log('Form submission failed with errors:', errors);
  };

  // File handling
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError('');

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError(
          t('fileTypeError', { defaultValue: 'Only .jpg, .png, and .pdf files are allowed' }),
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(t('fileSizeError', { defaultValue: 'File size must be less than 2MB' }));
        continue;
      }
      validFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    // Pass both form data and files to parent
    onSubmit({ ...data, files: selectedFiles });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
      className={twMerge(formContainer({ wrapped }), className)}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-600">{t('requiredFields')}</p>
      </div>

      <div className={formGrid({ columns: gridColumns as 1 | 2 | 3 | 4 })}>
        {fields.map((field) => {
          const fieldError = errors[field.id];

          return (
            <div key={field.id} className="flex flex-col">
              {field.type !== 'checkbox' && (
                <label htmlFor={field.id} className="text-text-default font-normal text-sm mb-1">
                  {field.required && <span className="shrink-0 text-red-500 me-[4px]">*</span>}
                  {field.label}
                </label>
              )}

              {field.type === 'select' ? (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      key={field.id}
                      id={field.id}
                      value={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      options={field.options || []}
                      className={field.className}
                      required={field.required}
                      aria-invalid={!!fieldError}
                      aria-errormessage={fieldError?.message?.toString()}
                    />
                  )}
                />
              ) : field.type === 'textarea' ? (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Textarea
                      key={field.id}
                      id={field.id}
                      value={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      className={field.className}
                      helperText={fieldError ? '' : field.helperText}
                      required={field.required}
                      aria-invalid={!!fieldError}
                      aria-errormessage={fieldError?.message?.toString()}
                    />
                  )}
                />
              ) : field.type === 'checkbox' ? (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      checked={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      className={field.className}
                      required={field.required}
                      aria-invalid={!!fieldError}
                      aria-errormessage={fieldError?.message?.toString()}
                    />
                  )}
                />
              ) : field.type === 'tel' ? (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    const [prefix, number] = value ? value.split(' ') : ['', ''];

                    const defaultPrefix = field.options?.[0]?.value ?? '';
                    const currentPrefix = prefix || defaultPrefix;

                    const handlePrefixChange = (newPrefix: string | string[]) => {
                      onChange(`${newPrefix} ${number}`);
                    };

                    const handleNumberChange = (newNumber: string) => {
                      onChange(`${currentPrefix} ${newNumber}`);
                    };

                    return (
                      <div className={twMerge(formPhoneInputWrapper(), field.className)}>
                        <Select
                          key={`${field.id}-prefix`}
                          id={`${field.id}-prefix`}
                          value={currentPrefix}
                          onChange={handlePrefixChange}
                          options={field.options || []}
                          className="bg-neutral-100"
                          required={field.required}
                          aria-invalid={!!fieldError}
                          aria-errormessage={fieldError?.message?.toString()}
                        />
                        <input
                          key={`${field.id}-number`}
                          id={`${field.id}-number`}
                          value={number}
                          onChange={(e) => handleNumberChange(e.target.value)}
                          placeholder={field.placeholder}
                          type={field.type}
                          className="flex-1 px-4 py-2 outline-none border-none placeholder-gray-400"
                          required={field.required}
                          aria-invalid={!!fieldError}
                          aria-errormessage={fieldError?.message?.toString()}
                        />
                      </div>
                    );
                  }}
                />
              ) : (
                <Controller
                  name={field.id}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      key={field.id}
                      id={field.id}
                      value={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      type={field.type}
                      required={field.required}
                      aria-invalid={!!fieldError}
                      aria-errormessage={fieldError?.message?.toString()}
                    />
                  )}
                />
              )}

              {fieldError && (
                <div className="flex flex-row items-center gap-1 text-red-500 text-sm mt-1">
                  <div className="flex-shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.99967 5.33325V7.99992M7.99967 10.6666H8.00634M14.6663 7.99992C14.6663 11.6818 11.6816 14.6666 7.99967 14.6666C4.31778 14.6666 1.33301 11.6818 1.33301 7.99992C1.33301 4.31802 4.31778 1.33325 7.99967 1.33325C11.6816 1.33325 14.6663 4.31802 14.6663 7.99992Z"
                        stroke="#B54708"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>{fieldError.message?.toString()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {uploadFiles && (
        <>
          <div className="flex flex-col gap-2">
            <p className="text-text-default font-normal text-sm">{t('uploadFiles')}</p>
            <p className="text-text-secondary-paragraph font-normal text-xs">
              {t('fileSizeLimit')}
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Browse button */}
          <Button
            type="button"
            intent="secondary"
            outline
            className="w-full sm:w-auto"
            ariaLabel={t('browseFiles')}
            onClick={() => fileInputRef.current?.click()}
          >
            {t('browseFiles')}
          </Button>

          {/* File error */}
          {fileError && <p className="text-red-600 text-sm">{fileError}</p>}

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm text-text-default">
                {t('selectedFiles', { defaultValue: 'Selected files' })}: {selectedFiles.length}
              </p>
              <div className="flex flex-col gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm text-text-default truncate">{file.name}</span>
                      <span className="text-xs text-text-secondary-paragraph whitespace-nowrap">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label={t('removeFile', { defaultValue: 'Remove file' })}
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className={formActions({ wrapped })}>
        <Button
          type="submit"
          intent={submitIntent}
          className="w-full sm:w-auto"
          ariaLabel={`Submit ${submitLabel}`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
