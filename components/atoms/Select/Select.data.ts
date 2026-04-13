import React from 'react';
import { Select } from './Select';
import { SelectOption } from './Select.types';

export type MockSelectType = Partial<React.ComponentProps<typeof Select>>;

export const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' },
];

export const mockSelectWithDisabledOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option-1', disabled: true },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' },
];
