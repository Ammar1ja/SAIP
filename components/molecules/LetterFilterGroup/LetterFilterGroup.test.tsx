import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LetterFilterGroup } from './LetterFilterGroup';

describe('LetterFilterGroup', () => {
  const letters = ['A', 'B', 'C'];
  const onSelect = vi.fn();
  const onClear = vi.fn();
  const onArabicToggle = vi.fn();
  const onSearchChange = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
    onClear.mockClear();
    onArabicToggle.mockClear();
    onSearchChange.mockClear();
  });

  it('renders search input, toggle switch, letter buttons, and clear button', () => {
    render(
      <LetterFilterGroup
        letters={letters}
        selectedLetter="ALL"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Arabic alphabet/i)).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    letters.forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Clear filters/i })).toBeInTheDocument();
  });
  it('calls onSelect when ALL button is clicked', () => {
    render(
      <LetterFilterGroup
        letters={['A', 'B']}
        selectedLetter="A"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.click(screen.getByText('ALL'));
    expect(onSelect).toHaveBeenCalledWith('ALL');
  });

  it('calls onSelect when letter buttons are clicked', () => {
    render(
      <LetterFilterGroup
        letters={letters}
        selectedLetter="ALL"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.click(screen.getByText('B'));
    expect(onSelect).toHaveBeenCalledWith('B');
  });

  it('calls onArabicToggle when toggle switch is changed', () => {
    render(
      <LetterFilterGroup
        letters={letters}
        selectedLetter="ALL"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Arabic alphabet/i));
    expect(onArabicToggle).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', () => {
    render(
      <LetterFilterGroup
        letters={letters}
        selectedLetter="ALL"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Clear filters/i }));
    expect(onClear).toHaveBeenCalled();
  });

  it('calls onSearchChange when typing in search input', () => {
    render(
      <LetterFilterGroup
        letters={letters}
        selectedLetter="ALL"
        onSelect={onSelect}
        onClear={onClear}
        isArabic={false}
        onArabicToggle={onArabicToggle}
        searchQuery=""
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Search/i), { target: { value: 'test' } });
    expect(onSearchChange).toHaveBeenCalled();
  });
});
