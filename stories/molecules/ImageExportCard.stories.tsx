import type { Meta, StoryObj } from '@storybook/nextjs';
import ImageExportCard from '@/components/molecules/ImageExportCard';

const meta: Meta<typeof ImageExportCard> = {
  component: ImageExportCard,
  title: 'Molecules/ImageExportCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ImageExportCard>;

export const Default: Story = {
  args: {
    title: 'This is default title',
    description: 'This is a default description',
    image: {
      src: '/images/national-ip-strategy/photo-container.jpg',
      alt: 'This is default image',
    },
  },
};

export const WithDownloads: Story = {
  args: {
    ...Default.args,
    downloads: {
      svg: '/file.svg',
      png: '/file.png',
      jpg: '/file.jpg',
    },
  },
};
