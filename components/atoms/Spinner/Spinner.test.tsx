import { render } from '@testing-library/react';
import Spinner from './Spinner';
import React from 'react';

type TestSpinnerProps = Partial<React.ComponentProps<typeof Spinner>>;

describe('Spinner', () => {
  const renderComponent = (props?: TestSpinnerProps) => {
    const { container } = render(<Spinner {...props} />);

    const svg = container.querySelector('svg');
    const spinner = svg?.parentElement;

    return {
      svg,
      spinner,
      defualtProps: {
        size: 32,
        colorClass: 'text-primary-600',
        className: '',
        ariaLabel: 'Loading...',
        role: 'status',
        ariaLive: 'polite',
        ariaHidden: false,
      },
    };
  };

  it('renders with default aria attributes', () => {
    const {
      spinner,
      defualtProps: { ariaLabel, ariaHidden, ariaLive, role },
    } = renderComponent();

    expect(spinner).toHaveAttribute('aria-label', ariaLabel);
    expect(spinner).toHaveAttribute('aria-live', ariaLive);
    expect(spinner).toHaveAttribute('aria-hidden', `${ariaHidden}`);
    expect(spinner).toHaveRole(role);
  });

  it('renders  with default size when none provided', () => {
    const {
      spinner,
      defualtProps: { size },
    } = renderComponent();

    expect(spinner).toHaveStyle({ height: `${size}px`, width: `${size}px` });
  });

  it('renders SVG with default color class when none provided', () => {
    const {
      svg,
      defualtProps: { colorClass },
    } = renderComponent();

    expect(svg).toHaveClass(colorClass);
  });

  it('applies provided aria attributes', () => {
    const ariaLabel = 'Custom label';
    const ariaLive = 'off';
    const role = 'custom-role';
    const { spinner } = renderComponent({ role, ariaLabel, ariaLive });

    expect(spinner).toHaveAttribute('aria-label', ariaLabel);
    expect(spinner).toHaveAttribute('aria-live', ariaLive);
    expect(spinner).toHaveRole(role);
  });

  it('omits other aria attributes when aria-hidden is true', () => {
    const { spinner } = renderComponent({ ariaHidden: true });

    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).not.toHaveAttribute('aria-live');
    expect(spinner).not.toHaveAttribute('aria-label');
  });

  it('applies provided custom class', () => {
    const customClass = 'custom-class';
    const { spinner } = renderComponent({ className: customClass });

    expect(spinner).toHaveClass(customClass);
  });

  it('applies provided custom color class to the SVG element', () => {
    const customColorClass = 'custom-color';
    const { svg } = renderComponent({ colorClass: customColorClass });

    expect(svg).toHaveClass(customColorClass);
  });

  it('applies provided size', () => {
    const customSize = 64;
    const { spinner } = renderComponent({ size: customSize });

    expect(spinner).toHaveStyle({ height: `${customSize}px`, width: `${customSize}px` });
  });
});
