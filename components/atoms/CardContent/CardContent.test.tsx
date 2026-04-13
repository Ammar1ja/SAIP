import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardContent } from './CardContent';

describe('CardContent', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders with default props', () => {
    render(<CardContent {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(<CardContent {...defaultProps} icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { container, rerender } = render(<CardContent {...defaultProps} variant="compact" />);
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveAttribute('data-variant', 'compact');

    rerender(<CardContent {...defaultProps} variant="bordered" />);
    expect(cardElement).toHaveAttribute('data-variant', 'bordered');

    rerender(<CardContent {...defaultProps} variant="elevated" />);
    expect(cardElement).toHaveAttribute('data-variant', 'elevated');
  });

  it('renders with different sizes', () => {
    const { container, rerender } = render(<CardContent {...defaultProps} size="sm" />);
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveAttribute('data-size', 'sm');

    rerender(<CardContent {...defaultProps} size="lg" />);
    expect(cardElement).toHaveAttribute('data-size', 'lg');
  });

  it('renders project variant with grid content', () => {
    const gridContent = [
      { id: '1', content: 'Grid Item 1', ariaLabel: 'First item' },
      { id: '2', content: 'Grid Item 2', ariaLabel: 'Second item' },
    ];

    render(<CardContent {...defaultProps} variant="project" gridContent={gridContent} />);

    expect(screen.getByText('Grid Item 1')).toBeInTheDocument();
    expect(screen.getByText('Grid Item 2')).toBeInTheDocument();
  });

  it('handles click events when interactive', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <CardContent {...defaultProps} interactive onClick={handleClick} />,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveAttribute('data-interactive', 'true');

    fireEvent.click(cardElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when not interactive', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <CardContent {...defaultProps} interactive={false} onClick={handleClick} />,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveAttribute('data-interactive', 'false');

    fireEvent.click(cardElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom classNames', () => {
    const { container } = render(
      <CardContent
        {...defaultProps}
        className="custom-card"
        titleClassName="custom-title"
        descriptionClassName="custom-description"
        iconClassName="custom-icon"
      />,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('custom-card');
    expect(screen.getByText('Test Title')).toHaveClass('custom-title');
    expect(screen.getByText('Test Description')).toHaveClass('custom-description');
  });

  it('handles accessibility attributes', () => {
    const { container } = render(
      <CardContent
        {...defaultProps}
        aria-label="Custom Label"
        aria-describedby="description"
        role="article"
        id="test-card"
      />,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveAttribute('aria-label', 'Custom Label');
    expect(cardElement).toHaveAttribute('aria-describedby', 'description');
    expect(cardElement).toHaveAttribute('role', 'article');
    expect(cardElement).toHaveAttribute('id', 'test-card');
  });

  it('renders with header content in project variant', () => {
    const headerContent = <div data-testid="header-content">Header Content</div>;
    render(<CardContent {...defaultProps} variant="project" headerContent={headerContent} />);

    expect(screen.getByTestId('header-content')).toBeInTheDocument();
  });
});
