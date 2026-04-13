import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import IpAcademyOverviewSection from '@/components/sections/IpAcademyOverviewSection';

const meta: Meta = {
  title: 'Sections/IpAcademyOverviewSection',
  component: IpAcademyOverviewSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-screen-xl mx-auto bg-white p-6">
      <IpAcademyOverviewSection />
    </div>
  ),
};
