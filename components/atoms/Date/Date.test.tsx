import { render, screen } from '@testing-library/react';
import DateComponent from './Date';
import React from 'react';

type TestDateProps = Omit<React.ComponentPropsWithRef<typeof DateComponent>, 'date'> & {
  date?: string | Date;
};

const renderComponent = (props?: TestDateProps) => {
  const date = new Date(2025, 0, 1);
  render(<DateComponent date={date} {...props} />);

  return {
    time: screen.getByRole('time'),
  };
};

describe('Date', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('parses and renders ISO date string correctly', () => {
      const { time } = renderComponent({ date: '2025-01-01T12:00:00' });

      expect(time).toHaveTextContent('Jan 1, 2025');
    });

    it('renders in "short" format by default', () => {
      const { time } = renderComponent();

      expect(time).toHaveTextContent('Jan 1, 2025');
    });

    it('renders in "long" format when specified', () => {
      const { time } = renderComponent({ format: 'long' });

      expect(time).toHaveTextContent('Wednesday, January 1, 2025');
    });

    it('renders in "relative" format when specified', () => {
      const mockDateNow = new Date(2025, 1, 1);
      vi.setSystemTime(mockDateNow);

      const { time } = renderComponent({ format: 'relative' });

      expect(time).toHaveTextContent('about 1 month ago');
    });
  });

  describe('classes', () => {
    it('applies default class names when optional props are omitted', () => {
      const { time } = renderComponent();

      expect(time).toHaveClass('text-text-default', 'text-sm');
    });

    it('applies correct class names based on provided props', () => {
      const { time } = renderComponent({ variant: 'muted', size: 'lg' });

      expect(time).toHaveClass('text-text-muted', 'text-lg');
    });

    it('applies custom class when provided', () => {
      const customClass = 'custom-class';
      const { time } = renderComponent({ className: customClass });

      expect(time).toHaveClass(customClass);
    });
  });
});
