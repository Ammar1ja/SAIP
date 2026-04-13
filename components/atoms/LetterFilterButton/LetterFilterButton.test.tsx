import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LetterFilterButton } from './LetterFilterButton';

describe('LetterFilterButton', () => {
  const label = 'A';
  const mockClick = vi.fn();

  beforeEach(() => {
    mockClick.mockClear();
  });

  it('renders with label', () => {
    render(<LetterFilterButton label={label} onClick={mockClick} />);
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<LetterFilterButton label={label} onClick={mockClick} />);
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('has aria-pressed true when selected', () => {
    render(<LetterFilterButton label={label} selected onClick={mockClick} />);
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has aria-pressed false when not selected', () => {
    render(<LetterFilterButton label={label} selected={false} onClick={mockClick} />);
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies custom className', () => {
    render(<LetterFilterButton label={label} onClick={mockClick} className="custom-class" />);
    expect(screen.getByRole('button', { name: label })).toHaveClass('custom-class');
  });
});
