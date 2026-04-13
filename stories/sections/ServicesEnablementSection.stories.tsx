import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import ServicesEnablementSection from '@/components/sections/ServicesEnablementSection';

const meta: Meta<typeof ServicesEnablementSection> = {
  title: 'sections/ServicesEnablementSection',
  component: ServicesEnablementSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ServicesEnablementSection>;

export const Default: Story = {
  render: () => <ServicesEnablementSection />,
};
