import { render } from '@testing-library/react';
import { Arrow } from './Arrow';
import React from 'react';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: React.ComponentProps<typeof Arrow>) => {
  const onClick = vi.fn();
  const { container } = render(<Arrow onClick={onClick} {...props} />);

  return {
    arrow: container.querySelector('svg')?.parentElement as HTMLElement,
    user: userEvent.setup(),
    onClick,
  };
};

describe('Arrow', () => {
  describe('rendering', () => {
    it('renders with classes based on default props', () => {
      const { arrow } = renderComponent();

      expect(arrow).toHaveClass(
        'bg-button-background-natural-default',
        'w-[40px]',
        'h-[40px]',
        'rotate-0',
        'rtl:rotate-180',
        'rounded-full',
      );
    });

    it('renders with classes based on provided props', () => {
      const { arrow } = renderComponent({
        background: 'primary',
        direction: 'left',
        shape: 'square',
        size: 'small',
      });

      expect(arrow).toHaveClass(
        'bg-button-background-primary-default',
        'w-[32px]',
        'h-[32px]',
        'rotate-180',
        'rtl:rotate-0',
        'rounded-md',
      );
    });
  });

  describe('attributes and accessibility', () => {
    it('applies provided custom class', () => {
      const customClass = 'custom-class';
      const { arrow } = renderComponent({ className: customClass });

      expect(arrow).toHaveClass(customClass);
    });

    it('handles disabled state', () => {
      const { arrow } = renderComponent({ background: 'disabled' });

      expect(arrow).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies provided aria-label', () => {
      const customLabel = 'Custom Label';
      const { arrow } = renderComponent({ ariaLabel: customLabel });

      expect(arrow).toHaveAttribute('aria-label', customLabel);
    });
  });

  describe('event handling', () => {
    it('calls provided onClick callback when clicked', async () => {
      const { arrow, user, onClick } = renderComponent();

      await user.click(arrow);

      expect(onClick).toHaveBeenCalled();
    });

    it('doest not call onClick callback when disabled', async () => {
      const { arrow, user, onClick } = renderComponent({ background: 'disabled' });

      await user.click(arrow);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
