import GlossaryTabs from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof GlossaryTabs> = {
  title: 'Molecules/GlossaryTabs',
  component: GlossaryTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof GlossaryTabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('Glossary');
    return (
      <div className="w-full ">
        <GlossaryTabs tabs={['Glossary', 'Acronyms']} activeTab={active} onTabChange={setActive} />

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-medium mb-4">
            {active === 'Glossary' ? 'Glossary Content' : 'Acronyms Content'}
          </h3>
          <p className="text-gray-600">
            This is sample content for the {active.toLowerCase()} tab.
          </p>
        </div>
      </div>
    );
  },
};

export const DefaultRTL: Story = {
  render: () => {
    const [active, setActive] = useState('Glossary');
    return (
      <div className="w-full ">
        <GlossaryTabs tabs={['Glossary', 'Acronyms']} activeTab={active} onTabChange={setActive} />

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-medium mb-4">
            {active === 'Glossary' ? 'Glossary Content' : 'Acronyms Content'}
          </h3>
          <p className="text-gray-600">
            This is sample content for the {active.toLowerCase()} tab.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    direction: 'rtl',
  },
};
