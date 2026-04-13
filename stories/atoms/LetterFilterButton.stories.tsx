import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { LetterFilterButton } from '@/components/atoms/LetterFilterButton/LetterFilterButton';

const meta: Meta<typeof LetterFilterButton> = {
  title: 'Atoms/LetterFilterButton',
  component: LetterFilterButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LetterFilterButton>;

export const Default = () => {
  const [selected, setSelected] = useState(false);

  return (
    <LetterFilterButton
      label="A"
      selected={selected}
      onClick={() => setSelected((prev) => !prev)}
    />
  );
};
