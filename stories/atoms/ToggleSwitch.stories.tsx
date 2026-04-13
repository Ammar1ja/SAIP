import type { Meta, StoryObj } from '@storybook/nextjs';
import { ToggleSwitch } from '@/components/atoms/ToggleSwitch/ToggleSwitch';
import React, { useState } from 'react';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Atoms/ToggleSwitch',
  component: ToggleSwitch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Default = () => {
  const [checked, setChecked] = useState(false);

  return <ToggleSwitch label="Arabic alphabet" checked={checked} onChange={setChecked} />;
};
