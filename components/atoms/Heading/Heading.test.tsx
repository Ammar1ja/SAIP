import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders with default props', () => {
    render(<Heading>Default Heading</Heading>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Default Heading');
  });

  it('renders with different heading levels', () => {
    const { rerender } = render(<Heading as="h2">H2 Heading</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    rerender(<Heading as="h3">H3 Heading</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders non-semantic heading with aria-level', () => {
    render(
      <Heading as="div" ariaLevel={2}>
        Non-semantic Heading
      </Heading>,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName.toLowerCase()).toBe('div');
  });

  it('applies correct color classes', () => {
    const { rerender } = render(<Heading color="primary">Primary Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('text-primary-600');

    rerender(<Heading color="muted">Muted Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('text-text-muted');
  });

  it('applies correct weight classes', () => {
    const { rerender } = render(<Heading weight="bold">Bold Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('font-bold');

    rerender(<Heading weight="medium">Medium Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('font-medium');
  });

  it('applies correct alignment classes', () => {
    const { rerender } = render(<Heading align="center">Centered Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('text-center');

    rerender(<Heading align="right">Right-aligned Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('text-end');
  });

  it('applies custom className', () => {
    render(<Heading className="custom-class">Custom Heading</Heading>);
    expect(screen.getByRole('heading')).toHaveClass('custom-class');
  });

  it('handles aria attributes correctly', () => {
    render(
      <Heading ariaLabel="Custom Label" ariaDescribedby="description" id="test-heading">
        Accessible Heading
      </Heading>,
    );
    const heading = screen.getByRole('heading');
    expect(heading).toHaveAttribute('aria-label', 'Custom Label');
    expect(heading).toHaveAttribute('aria-describedby', 'description');
    expect(heading).toHaveAttribute('id', 'test-heading');
  });
});
