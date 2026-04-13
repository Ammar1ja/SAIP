import type { Meta, StoryObj } from '@storybook/react';
import { CommentCard } from '@/components/molecules/CommentCard';

const meta: Meta<typeof CommentCard> = {
  title: 'Molecules/CommentCard',
  component: CommentCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    comment: {
      description: 'Comment object containing author, date, and content',
      control: { type: 'object' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentCard>;

const sampleComment = {
  id: '1',
  author: 'Omar Al-Faisal',
  publicationDate: '11.11.2024',
  content:
    "It's really interesting how the legal system continues to grapple with challenges surrounding trademark protection in the digital age. I hope these legal actions set new standards that help safeguard intellectual property while not stifling innovation.",
};

const longComment = {
  id: '2',
  author: 'Dr. Sarah Al-Rashid',
  publicationDate: '12.11.2024',
  content:
    "Trademark disputes are becoming more frequent, especially with the rise of global brands and digital platforms. It will be interesting to see how these cases unfold and whether they'll impact international trademark laws. The evolution from Saudi to Gulf systems shows the importance of regional cooperation in intellectual property. This unified approach will benefit all member countries and create a more consistent legal framework across the region.",
};

const shortComment = {
  id: '3',
  author: 'Ahmed Al-Zahrani',
  publicationDate: '13.11.2024',
  content: 'Great article! Very informative.',
};

export const Default: Story = {
  args: {
    comment: sampleComment,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default comment card with standard content length.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    comment: longComment,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment card with longer content to demonstrate text wrapping and card height adaptation.',
      },
    },
  },
};

export const ShortContent: Story = {
  args: {
    comment: shortComment,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comment card with shorter content to show minimal height usage.',
      },
    },
  },
};

export const ArabicAuthor: Story = {
  args: {
    comment: {
      id: '4',
      author: 'فاطمة الزهراء',
      publicationDate: '14.11.2024',
      content:
        "As a small business owner, I'm particularly interested in how these regulations will affect local entrepreneurs. The balance between protection and accessibility is crucial for fostering innovation.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Comment card with Arabic author name to test RTL support.',
      },
    },
  },
};

export const RecentDate: Story = {
  args: {
    comment: {
      id: '5',
      author: 'Mohammed Al-Shehri',
      publicationDate: '15.12.2024',
      content: 'This is a very recent comment showing current engagement with the content.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Comment card with a recent publication date.',
      },
    },
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="flex gap-4 max-w-4xl">
      <CommentCard comment={sampleComment} />
      <CommentCard comment={longComment} />
      <CommentCard comment={shortComment} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple comment cards displayed together to show how they look in a carousel or grid layout.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    comment: {
      id: 'playground',
      author: 'John Doe',
      publicationDate: '01.01.2024',
      content:
        'This is a customizable comment for testing purposes. You can modify the author, date, and content in the controls panel.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground where you can customize all comment properties using the controls panel.',
      },
    },
  },
};
