import type { Meta, StoryObj } from '@storybook/nextjs';
import { PeopleGrid } from '@/components/organisms/PeopleGrid';

const samplePeople = [
  {
    image: '/images/about/ceo.jpeg',
    name: 'Dr. Abdulaziz bin Mohammed AlSwailem',
    title: 'CEO of the Saudi Authority for Intellectual Property',
  },
  {
    image: '/images/board/al-zamil.jpg',
    name: 'Eng. Osama Al-Zamil',
    title: 'Board Member',
  },
  {
    image: '/images/board/alohali.jpg',
    name: 'Eng. Haitham Abdulrahman AlOhali',
    title: 'Board Member',
  },
  {
    image: '/images/board/al-kadi.png',
    name: 'Bader Abdulrahman Al kadi',
    title: 'Board Member',
  },
  {
    image: '/images/board/alyahya.jpg',
    name: 'Deemah AlYahya',
    title: 'Board Member',
  },
  {
    image: '/images/board/alotaibi.png',
    name: 'Dr Mohammed Awaidh Alotaibi',
    title: 'Board Member',
  },
];

const meta: Meta<typeof PeopleGrid> = {
  title: 'Organisms/PeopleGrid',
  component: PeopleGrid,
  tags: ['autodocs'],
  args: {
    people: samplePeople,
    heading: 'Board Members',
    description: 'Meet our distinguished board members who guide the strategic direction of SAIP.',
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PeopleGrid>;

export const Default: Story = {};

export const WithoutHeading: Story = {
  args: {
    heading: undefined,
    description: undefined,
  },
};

export const TwoColumns: Story = {
  args: {
    className: 'max-w-2xl mx-auto',
    people: samplePeople.slice(0, 4), // Pokazujemy tylko 4 osoby dla lepszej prezentacji w 2 kolumnach
  },
};
