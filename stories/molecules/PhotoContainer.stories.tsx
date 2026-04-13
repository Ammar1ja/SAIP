import type { Meta, StoryObj } from '@storybook/nextjs';
import { PhotoContainer } from '@/components/molecules/PhotoContainer/PhotoContainer';

const meta = {
  title: 'Molecules/PhotoContainer',
  component: PhotoContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PhotoContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description:
      'Proceeding from the importance of generating IP and based on what the Kingdom possesses of creative minds and young talents that innovate in various fields and other competitive advantages. High economic and social value.',
    image: {
      src: '/images/national-ip-strategy/photo-container.jpg',
      alt: 'Patent Applicant Analysis chart',
    },
  },
};

export const RTL: Story = {
  args: {
    description:
      'انطلاقاً من أهمية توليد الملكية الفكرية وبناءً على ما تمتلكه المملكة من عقول مبدعة ومواهب شابة تبتكر في مختلف المجالات وغيرها من المزايا التنافسية. قيمة اقتصادية واجتماعية عالية.',
    image: {
      src: '/images/national-ip-strategy/photo-container.jpg',
      alt: 'Patent Applicant Analysis chart',
    },
  },
  parameters: {
    direction: 'rtl',
  },
};
