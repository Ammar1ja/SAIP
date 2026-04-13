import { Meta, StoryObj } from '@storybook/nextjs';
import ProQualificationSection from '@/components/sections/ProQualificationSection';
import { PRO_QUALIFICATION_ITEMS } from '@/components/sections/ProQualificationSection/ProQualificationSection.data';

const meta: Meta<typeof ProQualificationSection> = {
  title: 'Sections/ProQualificationSection',
  component: ProQualificationSection,
};
export default meta;

type Story = StoryObj<typeof ProQualificationSection>;

export const Default: Story = {
  args: {
    items: PRO_QUALIFICATION_ITEMS,
  },
};
