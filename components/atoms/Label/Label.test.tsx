import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Label from './Label';

describe('Label', () => {
  it('renders with default props', () => {
    render(<Label>Default Label</Label>);
    const label = screen.getByText('Default Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName.toLowerCase()).toBe('span');
  });

  it('renders as a form label when htmlFor is provided', () => {
    render(<Label htmlFor="test-input">Form Label</Label>);
    const label = screen.getByText('Form Label');
    expect(label.tagName.toLowerCase()).toBe('label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Label variant="success">Success Label</Label>);
    const successLabel = screen.getByText('Success Label');
    expect(successLabel).toHaveAttribute('data-variant', 'success');

    rerender(<Label variant="warning">Warning Label</Label>);
    const warningLabel = screen.getByText('Warning Label');
    expect(warningLabel).toHaveAttribute('data-variant', 'warning');

    rerender(<Label variant="error">Error Label</Label>);
    const errorLabel = screen.getByText('Error Label');
    expect(errorLabel).toHaveAttribute('data-variant', 'error');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Label size="sm">Small Label</Label>);
    const smallLabel = screen.getByText('Small Label');
    expect(smallLabel).toHaveAttribute('data-size', 'sm');

    rerender(<Label size="lg">Large Label</Label>);
    const largeLabel = screen.getByText('Large Label');
    expect(largeLabel).toHaveAttribute('data-size', 'lg');
  });

  it('handles required state', () => {
    render(<Label required>Required Label</Label>);
    const label = screen.getByText('Required Label');
    // Check for required indicator presence
    expect(label).toBeInTheDocument();
    expect(screen.getByText('(Required)')).toHaveClass('sr-only');
  });

  it('handles required state for form labels', () => {
    render(
      <Label required htmlFor="test-input">
        Required Form Label
      </Label>,
    );
    const label = screen.getByText('Required Form Label');
    expect(label).toHaveAttribute('aria-required', 'true');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>);
    expect(screen.getByText('Custom Label')).toHaveClass('custom-class');
  });

  it('handles accessibility attributes', () => {
    render(
      <Label ariaLabel="Custom Label" ariaDescribedby="description" id="test-label" role="status">
        Accessible Label
      </Label>,
    );
    const label = screen.getByText('Accessible Label');
    expect(label).toHaveAttribute('aria-label', 'Custom Label');
    expect(label).toHaveAttribute('aria-describedby', 'description');
    expect(label).toHaveAttribute('id', 'test-label');
    expect(label).toHaveAttribute('role', 'status');
  });

  it('overrides role for form labels', () => {
    render(
      <Label htmlFor="test-input" role="status">
        Form Label
      </Label>,
    );
    const label = screen.getByText('Form Label');
    expect(label).not.toHaveAttribute('role');
  });
});
