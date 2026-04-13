import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './index';
import { ButtonProps } from './Button.types';

describe('Button', () => {
  const defaultProps: Pick<ButtonProps, 'ariaLabel'> = {
    ariaLabel: 'Test Button',
  };

  it('renders button with default props', () => {
    render(<Button {...defaultProps}>Click me</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('renders as a link when href is provided', () => {
    render(
      <Button href="/test" ariaLabel="Link to test">
        Link Button
      </Button>,
    );
    const link = screen.getByRole('link', { name: /link to test/i });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies correct behavior based on intent', () => {
    const { rerender } = render(
      <Button intent="primary" ariaLabel="Primary button">
        Primary
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('data-intent', 'primary');

    rerender(
      <Button intent="secondary" ariaLabel="Secondary button">
        Secondary
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-intent', 'secondary');
  });

  it('handles disabled state correctly', () => {
    render(
      <Button disabled ariaLabel="Disabled button">
        Disabled Button
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} ariaLabel="Clickable button">
        Click me
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick} ariaLabel="Disabled clickable button">
        Disabled Button
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(
      <Button fullWidth ariaLabel="Full width button">
        Full Width
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Button size="sm" ariaLabel="Small button">
        Small
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');

    rerender(
      <Button size="lg" ariaLabel="Large button">
        Large
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });

  it('applies custom className', () => {
    render(
      <Button className="custom-class" ariaLabel="Custom styled button">
        Custom
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('handles aria attributes correctly', () => {
    render(
      <Button
        ariaLabel="Custom Label"
        ariaExpanded={true}
        ariaControls="menu"
        ariaPressed={true}
        ariaDescribedby="description"
      >
        Accessible Button
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'menu');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-describedby', 'description');
  });
});
