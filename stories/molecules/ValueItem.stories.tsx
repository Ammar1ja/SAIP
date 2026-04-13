import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ValueItem from '@/components/molecules/ValueItem';

const meta: Meta<typeof ValueItem> = {
  title: 'Molecules/ValueItem',
  component: ValueItem,
  tags: ['autodocs'],
  args: {
    alt: 'Example icon',
    title: 'Fast Integration',
    description: 'Integrate our solution into your product in just minutes :)',
    background: 'white',
    borderColor: 'white',
  },
  argTypes: {
    icon: {
      description: 'Path to image or React component',
      control: false,
    },
    background: {
      control: 'radio',
      options: ['none', 'white', 'light', 'dark', 'green', 'transparent'],
    },
    borderColor: {
      control: 'radio',
      options: ['white'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ValueItem>;

export const Default: Story = {
  name: 'Default',
  args: {
    icon: '/icons/roles/aim.svg',
    background: 'green',
  },
};

export const DefaultRTL: Story = {
  name: 'Default RTL',
  args: {
    icon: '/icons/roles/aim.svg',
    background: 'green',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const WithDarkComponentIcon: Story = {
  name: 'With Dark Component',
  args: {
    icon: '/icons/roles/aim.svg',
    background: 'dark',
  },
};

export const WithImageIcon: Story = {
  name: 'With Image Icon',
  args: {
    icon: '/icons/roles/aim.svg',
  },
};
