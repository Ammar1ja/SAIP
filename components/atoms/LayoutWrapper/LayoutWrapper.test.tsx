import { render, screen } from '@testing-library/react';
import { LayoutWrapper } from './LayoutWrapper';
import React from 'react';

type TestLayoutWrapperProps = Partial<React.ComponentPropsWithRef<typeof LayoutWrapper>>;

const renderComponent = (props?: TestLayoutWrapperProps) => {
  render(
    <LayoutWrapper {...props}>
      <div data-testid="children">Test child element</div>
    </LayoutWrapper>,
  );

  const children = screen.getByTestId('children');

  return {
    children,
    parent: children.parentElement,
  };
};

describe('LayoutWrapper', () => {
  it('renders children correctly', () => {
    const { children } = renderComponent();

    expect(children).toBeInTheDocument();
  });

  it('renders "default" variant by default', () => {
    const { parent } = renderComponent();

    expect(parent).toHaveClass('max-w-screen-xl');
  });

  it('renders "narrow" variant when provided', () => {
    const { parent } = renderComponent({ variant: 'narrow' });

    expect(parent).toHaveClass('max-w-screen-lg');
  });

  it('renders "wide" variant when provided', () => {
    const { parent } = renderComponent({ variant: 'wide' });

    expect(parent).toHaveClass('max-w-screen-2xl');
  });

  it('renders as "div" tag by default', () => {
    const { parent } = renderComponent({ as: 'div' });

    expect(parent?.tagName.toLowerCase()).toBe('div');
  });

  const tags: TestLayoutWrapperProps['as'][] = ['div', 'article', 'aside', 'main', 'section'];
  it.each(tags)('renders as "%s" tag when provided', (tag) => {
    const { parent } = renderComponent({ as: tag });

    expect(parent?.tagName.toLowerCase()).toBe(tag);
  });

  it('applies custom class name to wrapper element when provided', () => {
    const customClass = 'custom-class';
    const { parent } = renderComponent({ className: customClass });

    expect(parent).toHaveClass(customClass);
  });

  it('applies provided role to wrapper element', () => {
    const role = 'custom-role';
    const { parent } = renderComponent({ role });

    expect(parent).toHaveRole(role);
  });
});
