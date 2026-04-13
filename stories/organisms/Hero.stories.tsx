import type { Meta, StoryObj } from '@storybook/nextjs';
import { HeroStatic as Hero } from '@/components/organisms/Hero/HeroStatic';

const meta: Meta<typeof Hero> = {
  title: 'Molecules/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'en',
      },
    },
  },
  argTypes: {
    overlay: {
      control: 'boolean',
    },
    backgroundImage: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
  args: {
    overlay: true,
    backgroundImage: '/images/about/hero.JPG',
    title: 'Protecting Ideas, Empowering Innovation',
    description: 'Explore our services to protect your intellectual property with confidence.',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {};

export const RTL: Story = {
  args: {
    overlay: true,
    backgroundImage: '/images/about/hero.JPG',
    title: 'حماية الأفكار، وتمكين الابتكار',
    description: 'اكتشف خدماتنا لحماية ملكيتك الفكرية بثقة.',
  },
  parameters: {
    direction: 'rtl',
    nextjs: {
      router: {
        path: '/',
        asPath: '/',
        locale: 'ar',
      },
    },
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
