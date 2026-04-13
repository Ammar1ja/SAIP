import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import IpSupportCentersOverviewSection from '@/components/sections/IpSupportCentersOverviewSection';

const meta: Meta<typeof IpSupportCentersOverviewSection> = {
  title: 'sections/IpSupportCentersOverviewSection',
  component: IpSupportCentersOverviewSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IpSupportCentersOverviewSection>;

export const Deault: Story = {
  render: () => <IpSupportCentersOverviewSection data={{} as any} />,
};
