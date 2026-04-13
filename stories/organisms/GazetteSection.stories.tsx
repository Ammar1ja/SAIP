import GazetteSection from '@/components/organisms/GazetteSection/GazetteSection';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GazetteSection> = {
  title: 'Organisms/GazetteSection',
  component: GazetteSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'The main heading of the section.',
    },
    text: {
      control: 'text',
      description: 'The descriptive text of the section.',
    },
    buttonText: {
      control: 'text',
      description: 'The text displayed on the call-to-action button.',
    },
    buttonHref: {
      control: 'text',
      description: 'The URL for the button.',
    },
    id: {
      control: 'text',
      description: 'The ID for the section, used for anchor links.',
    },
    imageSrc: {
      control: 'text',
      description: 'The source URL for the image.',
    },
    imageAlt: {
      control: 'text',
      description: 'The alt text for the image.',
    },
    isReversed: {
      control: 'boolean',
      description: 'Changes the order of the columns (text-image or image-text).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof GazetteSection>;

export const IPGazette: Story = {
  args: {
    id: 'ip-gazette',
    heading: 'IP Gazette',
    text: 'The IP Gazette is your trusted source for all trademark-related updates. Here, you will find details of trademark applications submitted on or after 19/12/2023, along with any subsequent changes to these records. Whether it’s renewals, ownership transfers, or modifications, the Gazette ensures you stay informed with the latest and most accurate trademark information.',
    buttonText: 'Search IP Gazette',
    buttonHref: '#',
    imageSrc: 'images/photo-container.png',
    imageAlt: 'IP Gazette image',
    isReversed: false,
  },
};

export const IPNewspaper: Story = {
  args: {
    id: 'ip-newspaper',
    heading: 'IP Newspaper',
    text: 'The IP Newspaper provides comprehensive details of trademark applications submitted prior to 19/12/2023, along with any subsequent updates to these records. From renewals and ownership transfers to modifications, the IP Newspaper keeps you informed with the most accurate and up-to-date trademark information.',
    buttonText: 'Search IP Newspaper',
    buttonHref: '#',
    imageSrc: 'images/photo-container.png',
    imageAlt: 'IP Newspaper image',
    isReversed: true,
  },
};

export const WithDifferentContent: Story = {
  args: {
    id: 'different-content',
    heading: 'Another Custom Section',
    text: 'This is a custom example to demonstrate the flexibility of the GazetteSection component. You can use it for various types of content sections on your site.',
    buttonText: 'Learn More',
    buttonHref: '#',
    imageSrc: 'images/photo-container.png',
    imageAlt: 'Custom section image',
    isReversed: false,
  },
};
