import type { Meta, StoryObj } from '@storybook/nextjs';
import Image from '@/components/atoms/Image';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
      config: {
        rules: [
          {
            id: 'image-alt',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'The source URL of the image',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility - describes the image content',
    },
    priority: {
      control: 'boolean',
      description: 'Whether to prioritize loading this image (for above-the-fold content)',
    },
    aspectRatio: {
      control: 'select',
      options: ['square', 'landscape', 'portrait'],
      description: 'Predefined aspect ratio for the image container',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'How the image should be resized to fit its container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling the image container',
    },
    sizes: {
      control: 'text',
      description: 'Responsive image sizes attribute for different viewport widths',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: '/images/photo-container.png',
    alt: 'Default image example showing a photo container',
    className: 'relative w-[300px] h-[200px] bg-gray-200',
  },
};

export const PriorityImage: Story = {
  args: {
    src: '/images/photo-container.png',
    alt: 'Priority loaded image for above-the-fold content',
    priority: true,
    aspectRatio: 'landscape',
    className: 'relative w-[400px] h-[300px] bg-gray-200',
  },
};

export const ContainFit: Story = {
  args: {
    src: '/images/photo-container.png',
    alt: 'Image with contain object fit to show full image within bounds',
    objectFit: 'contain',
    aspectRatio: 'square',
    className: 'relative w-[300px] h-[300px] bg-gray-200',
  },
};

export const SquareImage: Story = {
  args: {
    src: '/images/photo-container.png',
    alt: 'Square aspect ratio image example',
    aspectRatio: 'square',
    className: 'relative w-[400px] h-[400px] bg-gray-200',
  },
};

export const ResponsiveImage: Story = {
  args: {
    src: '/images/photo-container.png',
    alt: 'Responsive image with custom sizes',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    className: 'relative w-[500px] h-[300px] bg-gray-200',
  },
};

export const ErrorFallback: Story = {
  args: {
    src: '/images/non-existent-image.jpg',
    alt: 'Image that fails to load for testing error states',
    className: 'relative w-[300px] h-[200px] bg-gray-200',
  },
};
