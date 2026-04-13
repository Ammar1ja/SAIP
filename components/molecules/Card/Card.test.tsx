import { render, screen } from '@testing-library/react';
import { CardProps } from './Card.types';
import { Card } from './Card';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: Partial<CardProps>) => {
  const { container } = render(<Card {...props}>{props?.children}</Card>);

  return {
    card: container.firstElementChild as HTMLElement,
    user: userEvent.setup(),
  };
};

describe('Card', () => {
  describe('rendering', () => {
    it('renders provided children correctly', () => {
      const children = (
        <>
          <div data-testid="child">Test child 1</div>
          <div data-testid="child">Test child 2</div>
        </>
      );
      renderComponent({ children });

      expect(screen.getAllByTestId('child')).toHaveLength(2);
    });
  });

  describe('attributes', () => {
    it('applies custom class name to wrapper element when provided', () => {
      const customClass = 'custom-class';
      const { card } = renderComponent({ className: customClass });

      expect(card).toHaveClass(customClass);
    });

    it('forwards additional provided attribute', () => {
      const id = 'test-id';
      const { card } = renderComponent({ id });

      expect(card).toHaveAttribute('id', id);
    });

    describe('aria-label', () => {
      it('renders card with accessible name when aria-label is provided', () => {
        const ariaLabel = 'Test aria label';
        const { card } = renderComponent({ ariaLabel });

        expect(card).toHaveAccessibleName(new RegExp(ariaLabel, 'i'));
      });

      it('renders card with accessible name when aria-labelledby is provided', () => {
        const ariaLabelId = 'test-aria-labelledby-id';
        const ariaLabel = 'Test aria labelledby';
        const { card } = renderComponent({
          ariaLabelledby: ariaLabelId,
          children: <span id={ariaLabelId}>{ariaLabel}</span>,
        });

        expect(card).toHaveAccessibleName(new RegExp(ariaLabel, 'i'));
      });
    });

    describe('role', () => {
      it('applies "button" role when card is interactive', () => {
        const { card } = renderComponent({ interactive: true });

        expect(card).toHaveRole('button');
      });

      it('applies "region" role when card is not interactive', () => {
        const { card } = renderComponent();

        expect(card).toHaveRole('region');
      });

      it('applies custom role when provided and card is not interactive', () => {
        const role = 'custom-role';
        const { card } = renderComponent({ role });

        expect(card).toHaveRole(role);
      });
    });

    describe('tabindex', () => {
      it('applies tabindex when card is interactive', () => {
        const { card } = renderComponent({ interactive: true });

        expect(card).toHaveAttribute('tabindex', '0');
      });

      it('does not apply tabindex when card is not interactive', () => {
        const { card } = renderComponent();

        expect(card).not.toHaveAttribute('tabindex');
      });
    });
  });

  describe('user interaction', () => {
    it('calls provided callback on interactive card click', async () => {
      const onClick = vi.fn();
      const { card, user } = renderComponent({ onClick });

      await user.click(card);

      expect(onClick).toHaveBeenCalled();
    });

    it('calls provided callback on interactive card key down', async () => {
      const onKeyDown = vi.fn();
      const { card, user } = renderComponent({ onKeyDown, interactive: true });

      await user.keyboard('[Tab]');
      expect(card).toHaveFocus();

      await user.keyboard('{a}');
      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'a' }));
    });

    it('calls provided onClick when "Enter" or "Space" is pressed on interactive card', async () => {
      const onClick = vi.fn();
      const { card, user } = renderComponent({ onClick });

      await user.keyboard('[Tab]');
      expect(card).toHaveFocus();

      await user.keyboard('[Enter]');
      expect(onClick).toHaveBeenCalled();

      await user.keyboard('[Space]');
      expect(onClick).toHaveBeenCalled();
    });
  });
});
