import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ToggleSwitch', () => {
  it('renders with label', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<ToggleSwitch checked={false} onChange={handleChange} />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
  it('respects the "checked" prop', () => {
    const { rerender } = render(<ToggleSwitch checked={false} onChange={() => {}} />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);

    rerender(<ToggleSwitch checked={true} onChange={() => {}} />);
    expect(input.checked).toBe(true);
  });

  it('disables the switch when "disabled" is true', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} disabled />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
  });
});
