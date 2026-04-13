import { render, screen } from '@testing-library/react';
import { ArrowNavigation } from './ArrowNavigation';
import { type ArrowNavigationProps } from './ArrowNavigation.types';

const renderComponent = (props?: Partial<ArrowNavigationProps>) => {
  render(<ArrowNavigation currentIndex={1} totalItems={3} searchParams="item" {...props} />);

  const navigation = screen.getByRole('navigation');

  return {
    navigation,
    arrows: [...navigation.children],
    labels: {
      navigationLabel: /pagination navigation/i,
      prevArrowLabel: /previous item/i,
      nextArrowLabel: /next item/i,
    },
  };
};

describe('ArrowNavigation', () => {
  describe('rendering', () => {
    it('renders arrows based on primary intent by default', () => {
      const { arrows } = renderComponent();
      const [prevArrow, nextArrow] = arrows;

      expect(prevArrow.firstElementChild).toHaveClass('bg-button-background-primary-default');
      expect(nextArrow.firstElementChild).toHaveClass('bg-button-background-primary-default');
    });

    it('renders arrows based on neutral intent when some other than primary provided', () => {
      const { arrows } = renderComponent({ intent: 'secondary' });
      const [prevArrow, nextArrow] = arrows;

      expect(prevArrow.firstElementChild).toHaveClass('bg-button-background-natural-default');
      expect(nextArrow.firstElementChild).toHaveClass('bg-button-background-natural-default');
    });
  });

  describe('state', () => {
    it('handles disabled state for arrows when list has one item', () => {
      const { arrows } = renderComponent({ totalItems: 1 });
      const [prevArrow, nextArrow] = arrows;

      expect(prevArrow).toBeInstanceOf(HTMLSpanElement);
      expect(nextArrow).toBeInstanceOf(HTMLSpanElement);
      expect(prevArrow).toHaveAttribute('aria-disabled', 'true');
      expect(nextArrow).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles disabled state for previous arrow at start of list', () => {
      const { arrows } = renderComponent({ currentIndex: 0 });
      const [prevArrow] = arrows;

      expect(prevArrow).toBeInstanceOf(HTMLSpanElement);
      expect(prevArrow).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles disabled state for next arrow at end of list', () => {
      const { arrows } = renderComponent({ currentIndex: 2 });
      const [_, nextArrow] = arrows;

      expect(nextArrow).toBeInstanceOf(HTMLSpanElement);
      expect(nextArrow).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('attribtues', () => {
    it('renders navigation with an accessible name', () => {
      const {
        navigation,
        labels: { navigationLabel },
      } = renderComponent();

      expect(navigation).toHaveAccessibleName(navigationLabel);
    });

    it('renders arrows with an accessible names', () => {
      const {
        arrows,
        labels: { prevArrowLabel, nextArrowLabel },
      } = renderComponent();
      const [prevArrow, nextArrow] = arrows;

      expect(prevArrow).toHaveAccessibleName(prevArrowLabel);
      expect(nextArrow).toHaveAccessibleName(nextArrowLabel);
    });

    it('applies relevant search params correctly to link hrefs', () => {
      const { arrows } = renderComponent();
      const [prevArrow, nextArrow] = arrows;

      expect(prevArrow).toBeInstanceOf(HTMLAnchorElement);
      expect(nextArrow).toBeInstanceOf(HTMLAnchorElement);
      expect(prevArrow).toHaveAttribute('href', '?item=0');
      expect(nextArrow).toHaveAttribute('href', '?item=2');
    });
  });
});
