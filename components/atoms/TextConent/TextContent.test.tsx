import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextContent } from './TextContent';

type TestTextContextProps = React.ComponentProps<typeof TextContent>;

describe('TextContent', () => {
  it('renders with default props', () => {
    render(<TextContent>Default Text</TextContent>);
    expect(screen.getByText('Default Text')).toBeInTheDocument();
  });

  it('renders as "div" tag by default', () => {
    const { container } = render(<TextContent>Content</TextContent>);

    const element = container.firstChild as HTMLElement;

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  const tags: TestTextContextProps['as'][] = ['strong', 'p', 'span', 'div', 'em'];

  it.each(tags)('renders as "%s" tag when provided', (tag) => {
    render(<TextContent as={tag}>Content</TextContent>);

    const element = screen.getByText('Content');

    expect(element.tagName.toLowerCase()).toBe(tag);
  });

  const aligns: TestTextContextProps['align'][] = ['center', 'left', 'right'];

  it.each(aligns)('renders with %s aligned when provided', (tag) => {
    render(<TextContent align={tag}>Content</TextContent>);

    const text = screen.getByText('Content');

    expect(text).toHaveClass(`text-${tag}`);
  });

  it('applies size classes', () => {
    const { rerender } = render(<TextContent size="sm">Small Text</TextContent>);
    expect(screen.getByText('Small Text')).toHaveClass('text-sm');

    rerender(<TextContent size="lg">Large Text</TextContent>);
    expect(screen.getByText('Large Text')).toHaveClass('text-xl');
  });

  it('applies color classes', () => {
    const { rerender } = render(<TextContent color="primary">Primary Text</TextContent>);
    expect(screen.getByText('Primary Text')).toHaveClass('text-primary-600');

    rerender(<TextContent color="muted">Muted Text</TextContent>);
    expect(screen.getByText('Muted Text')).toHaveClass('text-text-muted');
  });

  it('applies weight classes', () => {
    const { rerender } = render(<TextContent weight="bold">Bold Text</TextContent>);
    expect(screen.getByText('Bold Text')).toHaveClass('font-bold');

    rerender(<TextContent weight="medium">Medium Text</TextContent>);
    expect(screen.getByText('Medium Text')).toHaveClass('font-medium');
  });

  it('applies custom className', () => {
    render(<TextContent className="custom-class">Custom Text</TextContent>);
    expect(screen.getByText('Custom Text')).toHaveClass('custom-class');
  });

  it('handles accessibility attributes', () => {
    render(
      <TextContent
        ariaLabel="Custom Label"
        ariaDescribedby="description"
        role="article"
        id="test-content"
      >
        Accessible Text
      </TextContent>,
    );
    const text = screen.getByText('Accessible Text');
    expect(text).toHaveAttribute('aria-label', 'Custom Label');
    expect(text).toHaveAttribute('aria-describedby', 'description');
    expect(text).toHaveAttribute('role', 'article');
    expect(text).toHaveAttribute('id', 'test-content');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TextContent ref={ref}>Ref Text</TextContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
