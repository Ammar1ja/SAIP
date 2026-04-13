import type { Meta, StoryObj } from '@storybook/nextjs';
import { AboutSaip } from '@/components/organisms/AboutSaip';

const meta: Meta<typeof AboutSaip> = {
  title: 'Organisms/AboutSaip',
  component: AboutSaip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  argTypes: {
    heading: { control: 'text' },
    text: { control: 'text' },
    image: { control: 'text' },
  },
  args: {
    heading: 'About SAIP',
    text: 'The Saudi Authority for Intellectual Property (SAIP) is the entity responsible for regulating, supporting, and protecting intellectual property in the Kingdom of Saudi Arabia.',
    image: '/images/about/hero.JPG',
  },
};

export default meta;
type Story = StoryObj<typeof AboutSaip>;

export const Default: Story = {};

export const RTL: Story = {
  parameters: {
    direction: 'rtl',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  args: {
    heading: 'عن الهيئة السعودية للملكية الفكرية',
    text: 'الهيئة السعودية للملكية الفكرية هي الجهة المسؤولة عن تنظيم ودعم وحماية حقوق الملكية الفكرية في المملكة العربية السعودية.',
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: 'tablet' },
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1' },
  },
};
