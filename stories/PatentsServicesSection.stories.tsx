import type { Meta, StoryObj } from '@storybook/nextjs';
import PatentsServicesSection from '@/components/organisms/PatentsServicesSection';

const meta: Meta<typeof PatentsServicesSection> = {
  title: 'Organisms/PatentsServicesSection',
  component: PatentsServicesSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatentsServicesSection>;

export const Default: Story = {
  args: {},
};
