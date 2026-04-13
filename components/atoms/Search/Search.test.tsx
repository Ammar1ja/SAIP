import { render, screen } from '@testing-library/react';
import { Search } from './Search';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Search', () => {
  const renderComponent = (props?: React.ComponentProps<typeof Search>) => {
    render(<Search {...props} />);

    return {
      input: screen.getByRole('searchbox'),
      getLabel: (label: string) => screen.queryByText(label),
      user: userEvent.setup(),
      defaultProps: {
        placeholder: 'Search',
        ariaLabel: 'Search',
        id: 'search-input',
      },
    };
  };

  describe('rendering', () => {
    it('renders with default props', () => {
      const {
        input,
        defaultProps: { placeholder, ariaLabel, id },
      } = renderComponent();

      expect(input).toHaveAttribute('placeholder', placeholder);
      expect(input).toHaveAttribute('aria-label', ariaLabel);
      expect(input).toHaveAttribute('id', id);
    });

    it('renders label when provided', () => {
      const labelText = 'Test label';
      const { getLabel } = renderComponent({ label: labelText });

      const label = getLabel(labelText);
      expect(label).toBeInTheDocument();
    });

    it('does not render label when none provided', () => {
      const labelText = 'Test label';
      const { getLabel } = renderComponent();

      const label = getLabel(labelText);
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('attributes and accessibility', () => {
    it('applies provided aria-label attribute', () => {
      const customAriaLabel = 'Custom aria label';
      const { input } = renderComponent({ ariaLabel: customAriaLabel });

      expect(input).toHaveAttribute('aria-label', customAriaLabel);
    });

    it('applies provided placeholder attribute', () => {
      const customPlaceholder = 'Custom placeholder';
      const { input } = renderComponent({ placeholder: customPlaceholder });

      expect(input).toHaveAttribute('placeholder', customPlaceholder);
    });

    it('applies provided id attribute', () => {
      const customId = 'custom-id';
      const { input } = renderComponent({ id: customId });

      expect(input).toHaveAttribute('id', customId);
    });

    it('applies provided class to search container', () => {
      const customClass = 'custom-class';
      const { input } = renderComponent({ className: customClass });

      const searchContainer = input?.parentElement?.parentElement;

      expect(searchContainer).toHaveClass(customClass);
    });

    it('handles disabled state', () => {
      const { input } = renderComponent({ disabled: true });

      expect(input).toBeDisabled();
    });
  });

  describe('event handling', () => {
    it('calls onSearch when Enter is pressed', async () => {
      const onSearch = vi.fn();
      const testQuery = 'Test query';
      const { input, user } = renderComponent({ value: testQuery, onSearch });

      await user.type(input, '{Enter}');

      expect(onSearch).toHaveBeenCalledWith(testQuery);
    });

    it('does not call onSearch when Enter is pressed and value is empty', async () => {
      const onSearch = vi.fn();
      const value = '';
      const { input, user } = renderComponent({ value, onSearch });

      await user.type(input, '{Enter}');

      expect(onSearch).not.toHaveBeenCalled();
    });

    it('calls onChange with input value when user types', async () => {
      const onChange = vi.fn();
      const testQuery = 'Test Query';
      const { input, user } = renderComponent({ onChange });

      await user.type(input, testQuery);

      expect(onChange).toHaveBeenCalledTimes(testQuery.length);
      expect(onChange).toHaveBeenCalledWith(testQuery);
    });
  });
});
