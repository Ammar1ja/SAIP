import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs/*';
import TrainingProgramsSection from '@/components/sections/TrainingProgramsSection';
import { MOCK_TRAINING_PROGRAMS } from '@/components/sections/TrainingProgramsSection/TrainingProgramsSection.data';

const meta: Meta<typeof TrainingProgramsSection> = {
  title: 'sections/TrainingProgramsSection',
  component: TrainingProgramsSection,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TrainingProgramsSection>;

export const Default: Story = {
  args: {
    programs: MOCK_TRAINING_PROGRAMS,
  },
};

export const DefaultRTL: Story = {
  args: {
    programs: MOCK_TRAINING_PROGRAMS,
  },
  parameters: {
    direction: 'rtl',
  },
};
