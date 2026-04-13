import AdvantagesSection from '@/components/sections/AdvantagesSection';
import ADVANTAGES from '@/components/sections/AdvantagesSection/IpAcademyAdvantagesSection.data';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof AdvantagesSection> = {
  title: 'Sections/AdvantagesSection',
  component: AdvantagesSection,
};
export default meta;

type Story = StoryObj<typeof AdvantagesSection>;

export const Default: Story = {
  args: {
    advantages: ADVANTAGES,
  },
};
