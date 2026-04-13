import type { Meta, StoryObj } from '@storybook/nextjs';
import Tabs from '@/components/molecules/Tabs';
import { useState } from 'react';
import { DirectionProvider } from '@/context/DirectionContext';

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const dir = context.parameters.direction || 'ltr';
      return (
        <DirectionProvider dir={dir}>
          <div dir={dir}>
            <Story />
          </div>
        </DirectionProvider>
      );
    },
  ],
};

const tabs = [
  {
    id: 'tab1',
    label: 'Discover services',
    badge: <span className="bg-red-500 text-white rounded-full px-2 text-xs">1</span>,
  },
  { id: 'tab2', label: 'IP protection & management' },
  { id: 'tab3', label: 'IP enablement' },
  { id: 'tab4', label: 'IP enforcement & dispute' },
];

const mobileTabs = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'journey',
    label: 'Journey',
  },
  {
    id: 'services',
    label: 'Services',
  },
  {
    id: 'media',
    label: 'Media',
  },
];

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    tabs: tabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <div>
        <Tabs {...args} activeTab={activeTab} onTabChange={setActiveTab} ariaLabel="Example tabs" />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};

export const DefaultRTL: Story = {
  args: {
    tabs: tabs,
  },
  parameters: {
    direction: 'rtl',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <div>
        <Tabs {...args} activeTab={activeTab} onTabChange={setActiveTab} ariaLabel="RTL tabs" />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};

export const DisabledTabs: Story = {
  args: {
    tabs: tabs.map((tab, index) => ({
      ...tab,
      disabled: index === 3,
    })),
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <div>
        <Tabs
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Disabled tabs"
        />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};

export const Mobile: Story = {
  args: {
    tabs: mobileTabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('overview');
    return (
      <div>
        <Tabs
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Example mobile tabs"
        />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    tabs: mobileTabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('overview');
    return (
      <div>
        <Tabs
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Example tablet tabs"
        />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
  globals: {
    viewport: {
      value: 'tablet',
    },
  },
};

export const Controlled: Story = {
  args: {
    tabs: tabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <div>
        <Tabs
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Example controlled tabs"
        />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    tabs: tabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab2');
    return (
      <div>
        <Tabs
          {...args}
          defaultActiveTab="tab2"
          onTabChange={setActiveTab}
          ariaLabel="Example uncontrolled tabs"
        />
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};

export const Vertical: Story = {
  args: {
    tabs: tabs,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
      <div className="flex h-48">
        <div>
          <Tabs
            {...args}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            orientation="vertical"
            ariaLabel="Vertical tabs"
            className="w-48"
          />
        </div>
        <div className="p-4">Panel for {activeTab}</div>
      </div>
    );
  },
};
