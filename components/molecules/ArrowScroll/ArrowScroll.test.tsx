import { render, screen } from '@testing-library/react';
import { ArrowScroll } from './ArrowScroll';
import { type ArrowScrollProps } from './ArrowScroll.types';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: ArrowScrollProps) => {
  render(<ArrowScroll {...props} />);

  const buttons = screen.getAllByRole('button');

  return {
    groupElement: screen.getByRole('group'),
    buttonLeft: buttons[0],
    buttonRight: buttons[1],
    labels: {
      groupElementLabel: /scroll controls/i,
      buttonLeftLabel: /scroll left/i,
      buttonRightLabel: /scroll right/i,
    },
    user: userEvent.setup(),
  };
};

describe('ArrowScroll', () => {
  describe('rendering', () => {
    it('renders arrows based on primary intent by default', () => {
      const { buttonLeft, buttonRight } = renderComponent();

      expect(buttonLeft.firstElementChild).toHaveClass('bg-button-background-primary-default');
      expect(buttonRight.firstElementChild).toHaveClass('bg-button-background-primary-default');
    });

    it('renders arrows based on neutral intent when some other than primary provided', () => {
      const { buttonLeft, buttonRight } = renderComponent({ intent: 'secondary' });

      expect(buttonLeft.firstElementChild).toHaveClass('bg-button-background-natural-default');
      expect(buttonRight.firstElementChild).toHaveClass('bg-button-background-natural-default');
    });
  });

  describe('state', () => {
    it('handles disabled state for left arrow button when provided', () => {
      const { buttonLeft } = renderComponent({ disabledLeft: true });

      expect(buttonLeft).toBeDisabled();
      expect(buttonLeft.firstElementChild).toHaveClass('bg-button-background-disabled');
    });

    it('handles disabled state for right arrow button when provided', () => {
      const { buttonRight } = renderComponent({ disabledRight: true });

      expect(buttonRight).toBeDisabled();
      expect(buttonRight.firstElementChild).toHaveClass('bg-button-background-disabled');
    });
  });

  describe('attributes', () => {
    it('applies custom class name to group element when provided', () => {
      const customClass = 'custom-class';
      const { groupElement } = renderComponent({ className: customClass });

      expect(groupElement).toHaveClass(customClass);
    });

    it('renders group element with an accessible name', () => {
      const {
        groupElement,
        labels: { groupElementLabel },
      } = renderComponent();

      expect(groupElement).toHaveAccessibleName(groupElementLabel);
    });

    it('renders buttons with an accessible names', () => {
      const {
        buttonLeft,
        buttonRight,
        labels: { buttonLeftLabel, buttonRightLabel },
      } = renderComponent();

      expect(buttonLeft).toHaveAccessibleName(buttonLeftLabel);
      expect(buttonRight).toHaveAccessibleName(buttonRightLabel);
    });
  });

  describe('user interaction', () => {
    it('calls provided callback on left arrow button click', async () => {
      const onScrollLeft = vi.fn();
      const { buttonLeft, user } = renderComponent({ onScrollLeft });

      await user.click(buttonLeft);

      expect(onScrollLeft).toHaveBeenCalled();
    });

    it('calls provided callback on right arrow button click', async () => {
      const onScrollRight = vi.fn();
      const { buttonRight, user } = renderComponent({ onScrollRight });

      await user.click(buttonRight);

      expect(onScrollRight).toHaveBeenCalled();
    });
  });
});
