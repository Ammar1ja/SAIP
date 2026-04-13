export interface LetterFilterGroupProps {
  letters: string[];
  selectedLetter: string | null;
  onSelect: (letter: string) => void;

  onClear: () => void;
  isArabic: boolean;
  onArabicToggle: (value: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}
