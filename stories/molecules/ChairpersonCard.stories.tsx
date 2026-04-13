import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import ChairpersonCard from '@/components/molecules/ChairpersonCard';
import { NextIntlClientProvider } from 'next-intl';

const withLocale = (locale: string) => (Story: React.ComponentType) => (
  <NextIntlClientProvider locale={locale} messages={{}}>
    <Story />
  </NextIntlClientProvider>
);

const meta: Meta<typeof ChairpersonCard> = {
  component: ChairpersonCard,
  title: 'Molecules/ChairpersonCard',
  tags: ['autodocs'],
  decorators: [withLocale('en')],
  argTypes: {
    image: {
      control: 'text',
      description: 'Chairperson profile image URL',
    },
    name: {
      control: 'text',
      description: 'Chairperson full name',
    },
    title: {
      control: 'text',
      description: 'Chairperson title or role',
    },
    description: {
      control: 'text',
      description: 'Short biography or description',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `ChairpersonCard` component displays a profile card with image, name, title, and optional description. It supports RTL layouts based on the locale.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChairpersonCard>;
export const Default: Story = {
  args: {
    image: '/images/photo-container.png',
    name: 'H.E Shihana Saleh Alazzaz',
    title: 'Chairperson of the Board',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
  },
};

export const DefaultRTL: Story = {
  decorators: [withLocale('ar')],
  args: {
    image: '/images/photo-container.png',
    name: 'H.E Shihana Saleh Alazzaz',
    title: 'Chairperson of the Board',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
  },
  parameters: {
    direction: 'rtl',
  },
};

export const Minimal: Story = {
  args: {
    image: '/images/photo-container.png',
    name: 'H.E Shihana Saleh Alazzaz',
  },
};
export const WithCustomClassName: Story = {
  args: {
    image: '/images/photo-container.png',
    name: 'H.E Shihana Saleh Alazzaz',
    title: 'Chairperson',
    description: 'Custom class styling for layout testing.',
    className: 'border-4 border-red-500',
  },
};

export const MissingImage: Story = {
  args: {
    name: 'H.E Shihana Saleh Alazzaz',
    title: 'Chairperson',
    description: 'No image provided',
  },
};

export const LongText: Story = {
  args: {
    image: '/images/photo-container.png',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
  },
};
