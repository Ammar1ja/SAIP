import type { Meta, StoryObj } from '@storybook/nextjs';
import { Filters } from '@/components/molecules/Filters/Filters';

const meta: Meta<typeof Filters> = {
  title: 'Molecules/Filters',
  component: Filters,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '1200px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Filters>;

const defaultFields = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search',
  },
  {
    id: 'activity',
    label: 'Tender activity',
    type: 'select' as const,
    placeholder: 'Select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  {
    id: 'stage',
    label: 'Tender stage',
    type: 'select' as const,
    placeholder: 'Select',
    options: [
      { value: 'stage1', label: 'Stage 1' },
      { value: 'stage2', label: 'Stage 2' },
      { value: 'stage3', label: 'Stage 3' },
    ],
  },
  {
    id: 'type',
    label: 'Tender type',
    type: 'select' as const,
    placeholder: 'Select',
    options: [
      { value: 'type1', label: 'Type 1' },
      { value: 'type2', label: 'Type 2' },
      { value: 'type3', label: 'Type 3' },
    ],
  },
];

export const Default: Story = {
  args: {
    fields: defaultFields,
    values: {},
  },
};

export const WithValues: Story = {
  args: {
    fields: defaultFields,
    values: {
      search: 'Example search',
      activity: 'option1',
      stage: 'stage2',
      type: 'type3',
    },
  },
};

export const WithoutHideFilters: Story = {
  args: {
    fields: defaultFields,
    values: {},
    showHideFilters: false,
  },
};

export const WithMoreFields: Story = {
  args: {
    fields: [
      ...defaultFields,
      {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        placeholder: 'Select status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' },
        ],
      },
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        placeholder: 'Select category',
        options: [
          { value: 'cat1', label: 'Category 1' },
          { value: 'cat2', label: 'Category 2' },
          { value: 'cat3', label: 'Category 3' },
        ],
      },
    ],
    values: {},
  },
};

export const MultiselectField: Story = {
  args: {
    fields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        options: [
          { value: 'cat1', label: 'Category 1' },
          { value: 'cat2', label: 'Category 2' },
          { value: 'cat3', label: 'Category 3' },
        ],
        multiselect: true,
      },
    ],
    values: {},
  },
};

export const MultiselectWithValues: Story = {
  args: {
    fields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        options: [
          { value: 'cat1', label: 'Category 1' },
          { value: 'cat2', label: 'Category 2' },
          { value: 'cat3', label: 'Category 3' },
        ],
        multiselect: true,
      },
    ],
    values: { category: ['cat1', 'cat3'] },
  },
};

export const MixedFields: Story = {
  args: {
    fields: [
      {
        id: 'search',
        label: 'Search',
        type: 'search' as const,
        placeholder: 'Search',
      },
      {
        id: 'type',
        label: 'Type',
        type: 'select' as const,
        options: [
          { value: 't1', label: 'Type 1' },
          { value: 't2', label: 'Type 2' },
        ],
      },
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        options: [
          { value: 'cat1', label: 'Category 1' },
          { value: 'cat2', label: 'Category 2' },
        ],
        multiselect: true,
      },
    ],
    values: { category: ['cat2'] },
  },
};
