import { LetterFilterGroup } from '@/components/molecules/LetterFilterGroup/LetterFilterGroup';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof LetterFilterGroup> = {
  title: 'Molecules/LetterFilterGroup',
  component: LetterFilterGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LetterFilterGroup>;

export const Default: Story = {
  render: () => {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [isArabic, setIsArabic] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <LetterFilterGroup
        letters={letters}
        selectedLetter={selectedLetter}
        onSelect={setSelectedLetter}
        onClear={() => setSelectedLetter(null)}
        isArabic={isArabic}
        onArabicToggle={setIsArabic}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  },
};
