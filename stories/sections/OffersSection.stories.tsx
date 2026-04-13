import OffersSection from '@/components/sections/OffersSection';
import { TABS, OFFERS } from '@/components/sections/OffersSection/IpAcademyOffersSection.data';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof OffersSection> = {
  title: 'Sections/OffersSection',
  component: OffersSection,
};
export default meta;

type Story = StoryObj<typeof OffersSection>;

export const Default: Story = {
  args: {
    tabs: TABS,
    data: OFFERS,
  },
};
