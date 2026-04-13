import type { Meta, StoryObj } from '@storybook/nextjs';
import { ExpandableTabGroup } from '@/components/molecules/ExpandableTabGroup/ExpandableTabGroup';

const meta = {
  title: 'Molecules/ExpandableTabGroup',
  component: ExpandableTabGroup,
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ExpandableTabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    id: '1',
    title: 'IP respect',
    description: 'Respect for intellectual property rights and compliance with regulations.',
  },
  {
    id: '2',
    title: 'IP generation',
    description:
      'Proceeding from the importance of generating IP and based on what the Kingdom possesses of creative minds and young talents that innovate in various fields and other competitive advantages. High economic and social value.',
  },
  {
    id: '3',
    title: 'IP management',
    description: 'Strategic management and monetization of intellectual property.',
  },
];

const arabicItems = [
  {
    id: '1',
    title: 'احترام الملكية الفكرية',
    description: 'احترام حقوق الملكية الفكرية والامتثال للوائح.',
  },
  {
    id: '2',
    title: 'توليد الملكية الفكرية',
    description:
      'انطلاقاً من أهمية توليد الملكية الفكرية وبناءً على ما تمتلكه المملكة من عقول مبدعة ومواهب شابة تبتكر في مختلف المجالات وغيرها من المزايا التنافسية. قيمة اقتصادية واجتماعية عالية.',
  },
  {
    id: '3',
    title: 'إدارة الملكية الفكرية',
    description: 'الإدارة الاستراتيجية وتحقيق القيمة من الملكية الفكرية.',
  },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const WithActiveTab: Story = {
  args: {
    items,
    activeId: '2',
  },
};

export const WithImages: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      image: {
        src: 'https://via.placeholder.com/800x400',
        alt: 'IP illustration',
      },
    })),
    activeId: '2',
  },
};

export const RTL: Story = {
  args: {
    items: arabicItems,
  },
  parameters: {
    direction: 'rtl',
  },
};
