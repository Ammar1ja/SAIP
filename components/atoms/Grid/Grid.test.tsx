import { render, screen } from '@testing-library/react';
import Grid from './Grid';
import React from 'react';

type TestGridProps = Partial<React.ComponentProps<typeof Grid>>;

const renderComponent = (props?: TestGridProps) => {
  render(
    <Grid {...props}>
      <div data-testid="box"></div>
      <div data-testid="box"></div>
      <div data-testid="box"></div>
    </Grid>,
  );

  const gridElements = screen.getAllByTestId('box');
  const gridContainer = gridElements[0].parentElement;

  return {
    gridContainer,
    gridElements,
  };
};

describe('Grid', () => {
  it('renders children correctly', () => {
    const { gridElements } = renderComponent();

    expect(gridElements).toHaveLength(3);
  });

  it('applies default class names when optional props are not provided', () => {
    const { gridContainer } = renderComponent();

    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-6');
  });

  it('applies correct class names based on provided props', () => {
    const { gridContainer } = renderComponent({ cols: { base: 2, md: 4, lg: 6 }, gap: 'gap-2' });

    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-2',
      'md:grid-cols-4',
      'lg:grid-cols-6',
      'gap-2',
    );
  });

  it('applies custom class name when provided', () => {
    const customClass = 'custom-class';
    const { gridContainer } = renderComponent({ className: customClass });

    expect(gridContainer).toHaveClass(customClass);
  });
});
