import { GlossaryTable } from '@/components/organisms/GlossaryTable/GlossaryTable';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GlossaryTable> = {
  title: 'Organisms/GlossaryTable',
  component: GlossaryTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlossaryTable>;

const mockData = [
  {
    english: 'Applicant',
    arabic: 'مقدم الطلب',
    description: 'الشخص الذي يقدم طلبًا للتسجيل في مكتب الملكية الفكرية',
  },
  {
    english: 'Patent',
    arabic: 'براءة اختراع',
    description: 'حق قانوني يُمنح للمخترع لمنع الآخرين من استخدام اختراعه.',
  },
  {
    english: 'Patent',
    arabic: 'براءة اختراع',
    description: 'حق قانوني يُمنح للمخترع لمنع الآخرين من استخدام اختراعه.',
  },
  {
    english: 'Patent',
    arabic: 'براءة اختراع',
    description: 'حق قانوني يُمنح للمخترع لمنع الآخرين من استخدام اختراعه.',
  },
];

export const Default: Story = {
  args: {
    data: mockData,
  },
};

export const DefaultRTL: Story = {
  args: {
    data: mockData,
  },
  parameters: {
    direction: 'rtl',
  },
};
