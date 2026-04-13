import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ExpandableTab } from '@/components/molecules/ExpandableTab/ExpandableTab';
import type { ExpandableTabProps } from '@/components/molecules/ExpandableTab/ExpandableTab.types';

const InteractiveTab = (args: ExpandableTabProps) => {
  const [isExpanded, setIsExpanded] = useState(args.isExpanded);
  return (
    <ExpandableTab {...args} isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
  );
};

const meta = {
  title: 'Molecules/ExpandableTab',
  component: ExpandableTab,
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onToggle: () => {
      console.log('Tab toggled');
    },
  },
} satisfies Meta<typeof ExpandableTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <InteractiveTab {...args} />,
  args: {
    title: 'IP respect',
    description: 'Respect for intellectual property rights and compliance with regulations.',
    isExpanded: false,
    onToggle: () => {
      console.log('Tab toggled');
    },
  },
};

export const Expanded: Story = {
  render: (args) => <InteractiveTab {...args} />,
  args: {
    title: 'IP generation',
    description:
      'Proceeding from the importance of generating IP and based on what the Kingdom possesses of creative minds and young talents that innovate in various fields and other competitive advantages. High economic and social value.',
    isExpanded: true,
    onToggle: () => {
      console.log('Tab toggled');
    },
  },
};

export const WithImage: Story = {
  render: (args) => <InteractiveTab {...args} />,
  args: {
    title: 'IP respect',
    description: 'Respect for intellectual property rights and compliance with regulations.',
    image: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'IP respect illustration',
    },
    isExpanded: true,
    onToggle: () => {
      console.log('Tab toggled');
    },
  },
};

export const RTL: Story = {
  render: (args) => <InteractiveTab {...args} />,
  args: {
    title: 'احترام الملكية الفكرية',
    description: 'احترام حقوق الملكية الفكرية والامتثال للوائح.',
    isExpanded: false,
    onToggle: () => {
      console.log('Tab toggled');
    },
  },
  parameters: {
    direction: 'rtl',
  },
};
