import type { Meta, StoryObj } from '@storybook/nextjs';
import TabVertical from '@/components/molecules/TabVertical';
import { useState } from 'react';

const meta = {
  title: 'Molecules/TabVertical',
  component: TabVertical,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showIcons: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TabVertical>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { id: 'tab1', label: 'First Tab' },
  { id: 'tab2', label: 'Second Tab' },
  { id: 'tab3', label: 'Third Tab' },
  { id: 'tab4', label: 'Forth Tab' },
  { id: 'tab5', label: 'Fifth Tab' },
];

// Interactive stories with working tab switching
export const InteractiveWithIcons = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return (
    <TabVertical
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showIcons={true}
      size="md"
    />
  );
};

export const InteractiveWithoutIcons = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return (
    <TabVertical
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showIcons={false}
      size="md"
    />
  );
};

// Size variants
export const Small: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'lg',
  },
};

// With icons and sizes
export const SmallWithIcons: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: true,
    size: 'sm',
  },
};

export const MediumWithIcons: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: true,
    size: 'md',
  },
};

export const LargeWithIcons: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: true,
    size: 'lg',
  },
};

export const RTL: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'md',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const Mobile: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'sm',
  },
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    tabs,
    activeTab: 'tab1',
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    },
    showIcons: false,
    size: 'md',
  },
  globals: {
    viewport: {
      value: 'tablet',
    },
  },
};
