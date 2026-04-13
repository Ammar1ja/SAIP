import React from 'react';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';
import { DirectionProvider } from '@/context/DirectionContext';

const renderWithDirection = (ui: React.ReactElement, direction: 'ltr' | 'rtl' = 'ltr') => {
  return render(<DirectionProvider dir={direction}>{ui}</DirectionProvider>);
};

describe('Section', () => {
  it('renders with default props', () => {
    const { container } = renderWithDirection(<Section>Content</Section>);
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement.tagName.toLowerCase()).toBe('section');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  const tags: React.ComponentProps<typeof Section>['as'][] = [
    'article',
    'aside',
    'div',
    'main',
    'section',
  ];

  it.each(tags)('renders as "%s" tag when provided', (tag) => {
    const { container } = render(<Section as={tag}>Content</Section>);

    const element = container.firstChild as HTMLElement;

    expect(element.tagName.toLowerCase()).toBe(tag);
  });

  it('applies background data attributes', () => {
    const { container, rerender } = renderWithDirection(
      <Section background="primary-50">Content</Section>,
    );
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-background', 'primary-50');

    rerender(
      <DirectionProvider dir="ltr">
        <Section background="neutral">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-background', 'neutral');
  });

  it('applies column layout data attributes', () => {
    const { container, rerender } = renderWithDirection(<Section columns="two">Content</Section>);
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-columns', 'two');

    rerender(
      <DirectionProvider dir="ltr">
        <Section columns="asymNarrowWide">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-columns', 'asymNarrowWide');
  });

  it('applies alignment data attributes', () => {
    const { container, rerender } = renderWithDirection(<Section align="center">Content</Section>);
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-align', 'center');

    rerender(
      <DirectionProvider dir="ltr">
        <Section align="right">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-align', 'right');
  });

  it('applies items alignment data attributes', () => {
    const { container, rerender } = renderWithDirection(
      <Section itemsAlign="center">Content</Section>,
    );
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-items-align', 'center');

    rerender(
      <DirectionProvider dir="ltr">
        <Section itemsAlign="end">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-items-align', 'end');
  });

  it('handles fullWidth prop', () => {
    const { container } = renderWithDirection(<Section fullWidth>Content</Section>);
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-fullwidth', 'true');
  });

  it('merges outerClassName onto the outer wrapper', () => {
    const { container } = renderWithDirection(
      <Section outerClassName="min-w-0 overflow-x-clip">Content</Section>,
    );
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveClass('min-w-0', 'overflow-x-clip');
  });

  it('handles RTL-aware alignment', () => {
    const { container, rerender } = renderWithDirection(
      <Section rtlAwareAlign="left">Content</Section>,
      'rtl',
    );
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toBeInTheDocument();

    rerender(
      <DirectionProvider dir="rtl">
        <Section rtlAwareAlign="right">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toBeInTheDocument();

    rerender(
      <DirectionProvider dir="ltr">
        <Section rtlAwareAlign="right">Content</Section>
      </DirectionProvider>,
    );

    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toBeInTheDocument();

    rerender(
      <DirectionProvider dir="ltr">
        <Section rtlAwareAlign="left">Content</Section>
      </DirectionProvider>,
    );

    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toBeInTheDocument();
  });

  it('handles responsive alignment direction', () => {
    const { container, rerender } = renderWithDirection(
      <Section responsiveAlignDirection="left">Content</Section>,
      'rtl',
    );
    let sectionElement = container.firstChild as HTMLElement;
    let nestedContainer = sectionElement.firstChild;

    expect(sectionElement).toBeInTheDocument();
    expect(nestedContainer).toHaveClass('responsive-align-right');

    rerender(
      <DirectionProvider dir="rtl">
        <Section responsiveAlignDirection="right">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    nestedContainer = sectionElement.firstChild;

    expect(sectionElement).toBeInTheDocument();
    expect(nestedContainer).toHaveClass('responsive-align-left');

    rerender(
      <DirectionProvider dir="ltr">
        <Section responsiveAlignDirection="right">Content</Section>
      </DirectionProvider>,
    );

    sectionElement = container.firstChild as HTMLElement;
    nestedContainer = sectionElement.firstChild;

    expect(sectionElement).toBeInTheDocument();
    expect(nestedContainer).toHaveClass('responsive-align-right');

    rerender(
      <DirectionProvider dir="ltr">
        <Section responsiveAlignDirection="left">Content</Section>
      </DirectionProvider>,
    );

    sectionElement = container.firstChild as HTMLElement;
    nestedContainer = sectionElement.firstChild;

    expect(sectionElement).toBeInTheDocument();
    expect(nestedContainer).toHaveClass('responsive-align-left');
  });

  it('handles constrain prop', () => {
    const { container } = renderWithDirection(<Section constrain>Content</Section>);
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-constrain', 'true');
  });

  it('handles overlap prop', () => {
    const { container } = renderWithDirection(<Section overlap>Content</Section>);
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-overlap', 'true');
  });

  it('applies padding data attributes', () => {
    const { container, rerender } = renderWithDirection(<Section padding="small">Content</Section>);
    let sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-padding', 'small');

    rerender(
      <DirectionProvider dir="ltr">
        <Section padding="large">Content</Section>
      </DirectionProvider>,
    );
    sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('data-padding', 'large');
  });

  it('applies custom className to nested container', () => {
    const { container } = renderWithDirection(<Section className="custom-class">Content</Section>);
    const sectionElement = container.firstChild?.firstChild as HTMLElement;

    expect(sectionElement).toHaveClass('custom-class');
  });

  it('renders content inside LayoutWrapper', () => {
    renderWithDirection(<Section>Test Content</Section>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles accessibility attributes', () => {
    const { container } = renderWithDirection(
      <Section aria-label="Test Section" id="test-section">
        Content
      </Section>,
    );
    const sectionElement = container.firstChild as HTMLElement;
    expect(sectionElement).toHaveAttribute('aria-label', 'Test Section');
    expect(sectionElement).toHaveAttribute('id', 'test-section');
  });
});
