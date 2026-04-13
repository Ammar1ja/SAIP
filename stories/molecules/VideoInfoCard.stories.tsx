import type { Meta, StoryObj } from '@storybook/nextjs';
import VideoInfoCard from '@/components/molecules/VideoInfoCard';

const meta: Meta<typeof VideoInfoCard> = {
  title: 'Molecules/VideoInfoCard',
  component: VideoInfoCard,
};
export default meta;

type Story = StoryObj<typeof VideoInfoCard>;

export const Default: Story = {
  args: {
    videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: '/images/patents/overview.jpg',
    title: 'Information library',
    description: 'Watch the video and learn the key steps involved in patents.',
    ctaLabel: 'See all videos',
    ctaHref: '/resources/videos',
  },
};
