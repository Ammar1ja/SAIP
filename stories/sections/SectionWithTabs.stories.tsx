import SectionWithTabs from '@/components/sections/SectionWithTabs';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SectionTab } from '@/components/sections/SectionWithTabs/SectionWithTabs.types';

const TABS: SectionTab[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

interface DataItem {
  id: string;
  content: string;
}

const DATA: DataItem[] = [
  { id: 'tab1', content: 'Content for Tab 1' },
  { id: 'tab2', content: 'Content for Tab 2' },
  { id: 'tab3', content: 'Content for Tab 3' },
];

const meta: Meta<typeof SectionWithTabs> = {
  title: 'Sections/SectionWithTabs',
  component: SectionWithTabs,
};
export default meta;

type Story = StoryObj<typeof SectionWithTabs>;

export const Default: Story = {
  args: {
    title: 'Example Section With Tabs',
    tabs: TABS,
    data: DATA,
    renderPanel: (item: unknown) => <div>{(item as DataItem).content}</div>,
  },
};
