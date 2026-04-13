import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import DetailPageLayout from '@/components/layouts/DetailPageLayout';
import DetailSidebar from '@/components/organisms/DetailSidebar';
import { AddNoteIcon, CirclePlusIcon } from '@/components/icons/services';
import { ExpandableTabGroupItem } from '@/components/molecules/ExpandableTabGroup/ExpandableTabGroup.types';

const MOCK_SIDEBAR_ITEMS = [
  {
    icon: <AddNoteIcon className="w-6 h-6" />,
    label: 'Start date',
    value: '01.01.2025 | 08.03.2025',
  },
  {
    icon: <CirclePlusIcon className="w-6 h-6" />,
    label: 'Duration',
    value: '120 minutes',
  },
];

const MOCK_TABS: ExpandableTabGroupItem[] = [
  {
    id: 'details',
    title: 'Details',
    description: 'Some details about the service.',
  },
  {
    id: 'requirements',
    title: 'Requirements',
    description: 'Some requirements.',
  },
];

const meta: Meta<typeof DetailPageLayout> = {
  title: 'Layouts/DetailPageLayout',
  component: DetailPageLayout,
};
export default meta;

type Story = StoryObj<typeof DetailPageLayout>;

export const DefaultTabs: Story = {
  args: {
    sidebar: <DetailSidebar items={MOCK_SIDEBAR_ITEMS} />,
    defaultTabs: MOCK_TABS,
    sectionProps: { background: 'white', padding: 'default' },
  },
};

export const WithCustomChildren: Story = {
  args: {
    sidebar: <DetailSidebar items={MOCK_SIDEBAR_ITEMS} />,
    children: <div className="p-8 bg-neutral-100 rounded-xl">Custom content here</div>,
    sectionProps: { background: 'white', padding: 'default' },
  },
};
