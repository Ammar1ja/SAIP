import type { Meta, StoryObj } from '@storybook/nextjs';
import { MainIpServicesClient } from '@/components/organisms/MainIpServices/MainIpServices.client';

const meta: Meta<typeof MainIpServicesClient> = {
  title: 'Organisms/MainIpServices',
  component: MainIpServicesClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainIpServicesClient>;

export const Default: Story = {
  args: {
    heading: 'Main IP Services',
    text: 'Discover the core intellectual property services offered by SAIP.',
  },
};

export const RTL: Story = {
  ...Default,
  parameters: {
    direction: 'rtl',
  },
};

export const Tablet: Story = {
  ...Default,
  globals: {
    viewport: {
      value: 'tablet',
    },
  },
};

export const Mobile: Story = {
  ...Default,
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};
