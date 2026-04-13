import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import ServicesEnforcementSection from '@/components/sections/ServicesEnforcementSection';

const meta: Meta<typeof ServicesEnforcementSection> = {
  title: 'Sections/ServicesEnforcementSection',
  component: ServicesEnforcementSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ServicesEnforcementSection>;

export const Default: Story = {
  render: () => <ServicesEnforcementSection />,
};

export const DefaultRTL: Story = {
  render: () => <ServicesEnforcementSection />,
  parameters: {
    direction: 'rtl',
  },
};
