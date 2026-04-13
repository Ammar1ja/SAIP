import type { Meta, StoryObj } from '@storybook/nextjs';
import ScrollableCards from '@/components/molecules/ScrollableCards';
import { Star } from 'lucide-react';
import { ReactNode } from 'react';

const mockIcon: ReactNode = <Star size={24} />;

const meta: Meta<typeof ScrollableCards> = {
  title: 'Organisms/ScrollableCards',
  component: ScrollableCards,
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
    variant: {
      control: 'select',
      options: ['highlight', 'pillar'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollableCards>;

const mockItemsHighlights = [
  {
    id: 'card-1',
    icon: mockIcon,
    title: 'Patent Protection',
    description: 'Safeguard your inventions with our comprehensive patent system.',
    buttonLabel: 'Learn more',
    buttonHref: '/',
  },
  {
    id: 'card-2',
    icon: mockIcon,
    title: 'Trademark Services',
    description: 'Secure your brand identity and logos with ease.',
    buttonLabel: 'Register now',
    buttonHref: '/',
  },
  {
    id: 'card-3',
    icon: mockIcon,
    title: 'Copyright Registration',
    description: 'Protect your creative works with official registration.',
    buttonLabel: 'Get started',
    buttonHref: '/',
  },
];

const mockItemsPillars = [
  {
    id: '1',
    number: '01',
    title: 'Innovation',
  },
  {
    id: '2',
    number: '02',
    title: 'Protection',
  },
  {
    id: '3',
    number: '03',
    title: 'Empowerment',
  },
];

export const Highlight: Story = {
  args: {
    heading: 'Our Services',
    text: 'Discover how we support your intellectual property journey.',
    variant: 'highlight',
    items: mockItemsHighlights,
  },
};

export const Pillar: Story = {
  args: {
    heading: 'Strategic Pillars',
    text: 'Explore our foundational elements of innovation.',
    variant: 'pillar',
    items: mockItemsPillars,
  },
};

export const RTL: Story = {
  args: {
    heading: 'ركائز الابتكار',
    text: 'اكتشف ركائزنا الاستراتيجية الداعمة للابتكار.',
    variant: 'pillar',
    items: mockItemsPillars,
  },
  parameters: {
    direction: 'rtl',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export const Tablet: Story = {
  ...Highlight,
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};

export const Mobile: Story = {
  ...Highlight,
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};
