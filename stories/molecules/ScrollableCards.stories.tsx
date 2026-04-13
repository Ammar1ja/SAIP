import type { Meta, StoryObj } from '@storybook/react/*';
import ScrollableCards from '@/components/molecules/ScrollableCards';

const meta: Meta<typeof ScrollableCards> = {
  component: ScrollableCards,
  title: 'Molecules/ScrollableCards',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    heading: 'Heading text',
    text: 'Text',
    cardWidth: 318,
  },
};

export default meta;

type Story = StoryObj<typeof ScrollableCards>;

export const HighlightVariant: Story = {
  args: {
    variant: 'highlight',
    items: [
      {
        id: '1',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
      {
        id: '2',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
      {
        id: '3',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
    ],
  },
};

export const HighlightVariantRTL: Story = {
  args: {
    variant: 'highlight',
    items: [
      {
        id: '1',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
      {
        id: '2',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
      {
        id: '3',
        title: 'Sustainability',
        description: 'Environmental impact and green initiatives',
        buttonLabel: 'Learn More',
        buttonHref: '#',
      },
    ],
  },
  parameters: {
    direction: 'rtl',
  },
};

export const PillarVariant: Story = {
  args: {
    variant: 'pillar',
    items: [
      {
        id: '1',
        number: '01',
        title: 'Innovation',
      },
      {
        id: '2',
        number: '02',
        title: 'Innovation',
      },
      {
        id: '3',
        number: '03',
        title: 'Innovation',
      },
    ],
  },
};

export const PillarVariantRTL: Story = {
  args: {
    variant: 'pillar',
    items: [
      {
        id: '1',
        number: '01',
        title: 'Innovation',
      },
      {
        id: '2',
        number: '02',
        title: 'Innovation',
      },
      {
        id: '3',
        number: '03',
        title: 'Innovation',
      },
    ],
  },
  parameters: {
    direction: 'rtl',
  },
};

export const WithChildrenSlot: Story = {
  args: {
    variant: 'highlight',
    items: [],
    children: (
      <>
        <div className="w-[302px] h-[350px] bg-neutral-100 flex items-center justify-center shrink-0 snap-start">
          Custom JSX Card 1
        </div>
        <div className="w-[302px] h-[350px] bg-neutral-200 flex items-center justify-center shrink-0 snap-start">
          Custom JSX Card 2
        </div>
        <div className="w-[302px] h-[350px] bg-neutral-200 flex items-center justify-center shrink-0 snap-start">
          Custom JSX Card 3
        </div>
      </>
    ),
  },
};

export const ValueVariant: Story = {
  args: {
    variant: 'value',
    items: [
      {
        id: '1',
        title: 'Metric A',
        description: 'Description of metric A',
      },
      {
        id: '2',
        title: 'Metric B',
        description: 'Description of metric B',
      },
      {
        id: '3',
        title: 'Metric C',
        description: 'Description of metric C',
      },
    ],
  },
};
