import type { Meta, StoryObj } from '@storybook/nextjs';
import { FeaturedNewsClient } from '@/components/organisms/FeaturedNews/FeaturedNewsClients';
import { type ArticleCmsProps } from '@/lib/dummyCms/allArticles';

const mockArticles: ArticleCmsProps[] = [
  {
    title: 'SAIP launches new IP platform',
    excerpt: 'The new platform aims to streamline the registration process for all users.',
    publishData: '2025-03-10',
    categories: [
      { id: '1', name: 'Innovation' },
      { id: '2', name: 'Technology' },
    ],
    id: '1',
    image: '/images/photo-container.png',
  },
  {
    title: 'Saudi IP week: Key highlights',
    excerpt: 'A summary of the most important announcements and panels from IP Week.',
    publishData: '2025-02-28',
    categories: [
      { id: '3', name: 'Events' },
      { id: '4', name: 'Highlights' },
    ],
    id: '2',
    image: '/images/photo-container.png',
  },
  {
    title: 'International cooperation in IP',
    excerpt: 'SAIP signs new agreements to boost global IP collaboration.',
    publishData: '2025-01-15',
    categories: [
      { id: '5', name: 'Policy' },
      { id: '6', name: 'International' },
    ],
    id: '3',
    image: '/images/photo-container.png',
  },
];

const meta: Meta<typeof FeaturedNewsClient> = {
  title: 'Organisms/FeaturedNewsClient',
  component: FeaturedNewsClient,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  args: {
    title: 'Featured News',
    text: 'Discover the latest updates and articles from SAIP.',
    articles: mockArticles,
    currentIndex: 0,
  },
};

export default meta;
type Story = StoryObj<typeof FeaturedNewsClient>;

export const Default: Story = {};

export const RTL: Story = {
  args: {
    title: 'أخبار مميزة',
    text: 'اكتشف آخر التحديثات والمقالات من الهيئة.',
  },
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
