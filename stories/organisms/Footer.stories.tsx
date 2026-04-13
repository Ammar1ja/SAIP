import type { Meta, StoryObj } from '@storybook/nextjs';
import Footer from '@/components/organisms/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'link-name',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const RTL: Story = {
  parameters: {
    direction: 'rtl',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        locale: 'ar',
      },
    },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: {
      value: 'tablet',
    },
  },
};

export const Mobile: Story = {
  globals: {
    viewport: {
      value: 'mobile1',
    },
  },
};
