import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import ServicesProtectionSection from '@/components/sections/ServicesProtectionSection';

const meta: Meta<typeof ServicesProtectionSection> = {
  title: 'sections/ServicesProtectionSection',
  component: ServicesProtectionSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ServicesProtectionSection>;

export const Default: Story = {
  render: () => <ServicesProtectionSection />,
};

export const DefaultRTL: Story = {
  render: () => <ServicesProtectionSection />,
  parameters: {
    direction: 'rtl',
  },
};
