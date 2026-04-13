import { render, screen } from '@testing-library/react';
import Pagination, { defaultAriaLabels } from './Pagination';
import React, { useState } from 'react';
import userEvent from '@testing-library/user-event';

type TestPaginationProps = Partial<React.ComponentProps<typeof Pagination>>;

const Wrapper = (props: TestPaginationProps = {}) => {
  const [currentPage, setCurrentPage] = useState(props.currentPage || 2);

  const defaultSetup = {
    currentPage,
    totalPages: props.totalPages || 3,
    onPageChange: setCurrentPage,
  };

  return <Pagination {...props} {...defaultSetup} />;
};

const renderComponent = (props: TestPaginationProps = {}) => {
  render(<Wrapper {...props} />);

  return {
    pagination: screen.queryByRole('navigation'),
    user: userEvent.setup(),
    buttons: screen.queryAllByRole('button'),
    isActive: (button: HTMLElement) => button.getAttribute('aria-current') === 'page',
    getButtons: () => screen.queryAllByRole('button'),
    getElipsis: (parent: HTMLElement | null) =>
      parent ? [...parent.querySelectorAll('span[aria-hidden="true"]')] : [],
    defaultAriaLabels,
  };
};

describe('Pagination', () => {
  describe('visability', () => {
    it('does not render when total pages is 1', () => {
      const { pagination } = renderComponent({ currentPage: 1, totalPages: 1 });

      expect(pagination).not.toBeInTheDocument();
    });

    it('renders ellipsis at edges of current page button siblings', async () => {
      const { pagination, getElipsis, defaultAriaLabels } = renderComponent({
        currentPage: 5,
        totalPages: 10,
        siblingCount: 2,
      });

      const elipsis = getElipsis(pagination);

      expect(elipsis).toHaveLength(2);
      expect(elipsis.at(0)).toHaveAttribute('aria-label', defaultAriaLabels.ellipsis);
      expect(elipsis.at(1)).toHaveAttribute('aria-label', defaultAriaLabels.ellipsis);
    });

    it('renders edge buttons with corresponding aria-labels when prop provided', () => {
      const { buttons, defaultAriaLabels } = renderComponent({
        currentPage: 5,
        totalPages: 10,
        showFirstLast: true,
      });

      expect(buttons.at(0)).toHaveAttribute('aria-label', defaultAriaLabels.firstPage);
      expect(buttons.at(-1)).toHaveAttribute('aria-label', defaultAriaLabels.lastPage);
    });
  });

  describe('attributes', () => {
    it('applies simple aria-label to the pagination navigation when provided', () => {
      const ariaLabel = 'Custom simple label';
      const { pagination } = renderComponent({ ariaLabel });

      expect(pagination).toHaveAttribute('aria-label', ariaLabel);
    });

    it('applies default aria-labels when none are provided', () => {
      const { pagination, buttons, defaultAriaLabels } = renderComponent();

      expect(pagination).toHaveAttribute('aria-label', defaultAriaLabels.pagination);
      expect(buttons.at(0)).toHaveAttribute('aria-label', defaultAriaLabels.previousPage);
      expect(buttons.at(1)).toHaveAttribute('aria-label', `${defaultAriaLabels.page} ${1}`);
      expect(buttons.at(2)).toHaveAttribute('aria-label', `${defaultAriaLabels.currentPage} ${2}`);
      expect(buttons.at(3)).toHaveAttribute('aria-label', `${defaultAriaLabels.page} ${3}`);
      expect(buttons.at(4)).toHaveAttribute('aria-label', defaultAriaLabels.nextPage);
    });

    it('applies provided aria-labels', () => {
      const customAriaLabels: Partial<typeof defaultAriaLabels> = {
        pagination: 'Custom navigation',
        previousPage: 'Custom previous page',
        page: 'Custom page',
        currentPage: 'Custom current page',
        nextPage: 'Custom next page',
      };
      const { pagination, buttons } = renderComponent({ ariaLabels: customAriaLabels });

      expect(pagination).toHaveAttribute('aria-label', customAriaLabels.pagination);
      expect(buttons.at(0)).toHaveAttribute('aria-label', customAriaLabels.previousPage);
      expect(buttons.at(1)).toHaveAttribute('aria-label', `${customAriaLabels.page} ${1}`);
      expect(buttons.at(2)).toHaveAttribute('aria-label', `${customAriaLabels.currentPage} ${2}`);
      expect(buttons.at(3)).toHaveAttribute('aria-label', `${customAriaLabels.page} ${3}`);
      expect(buttons.at(4)).toHaveAttribute('aria-label', customAriaLabels.nextPage);
    });

    it('applies custom class name to pagination when provided', () => {
      const customClass = 'custom-class';
      const { pagination } = renderComponent({ className: customClass });

      expect(pagination).toHaveClass(customClass);
    });
  });

  describe('state', () => {
    it('handles disabled state for all buttons', () => {
      const { buttons } = renderComponent({ disabled: true, currentPage: 5, totalPages: 10 });

      buttons.forEach((button) => expect(button).toBeDisabled());
    });

    it('handles disabled state for go to previous page button when current page is 1', () => {
      const { buttons } = renderComponent({ currentPage: 1, totalPages: 3 });

      expect(buttons.at(0)).toBeDisabled();
    });

    it('handles disabled state for go to next page button when current page is the last one', () => {
      const { buttons } = renderComponent({ currentPage: 3, totalPages: 3 });

      expect(buttons.at(-1)).toBeDisabled();
    });

    it('handles selected state for current page button', () => {
      const { buttons, isActive } = renderComponent();

      const button = buttons[2];

      expect(isActive(button)).toBe(true);
      expect(button).toHaveClass('text-gray-900', 'font-semibold');
    });
  });

  describe('user interaction', async () => {
    it('navigates correctly when go to previous page button is clicked', async () => {
      const { buttons, user, isActive } = renderComponent({ currentPage: 2, totalPages: 2 });
      const [goToPrevBtn, firstPageBtn, secondPageBtn] = buttons;

      expect(isActive(secondPageBtn)).toBe(true);
      await user.click(goToPrevBtn);

      expect(isActive(secondPageBtn)).toBe(false);
      expect(isActive(firstPageBtn)).toBe(true);
    });

    it('navigates correctly when go to next page button is clicked', async () => {
      const { buttons, user, isActive } = renderComponent({ currentPage: 1, totalPages: 2 });
      const [firstPageBtn, secondPageBtn, goToNextBtn] = buttons.slice(-3);

      expect(isActive(firstPageBtn)).toBe(true);
      await user.click(goToNextBtn);

      expect(isActive(firstPageBtn)).toBe(false);
      expect(isActive(secondPageBtn)).toBe(true);
    });

    it('navigates to corresponding page when go to page button is clicked', async () => {
      const { buttons, user, isActive } = renderComponent({ currentPage: 1, totalPages: 2 });

      const [firstPageBtn, secondPageBtn] = buttons.slice(1, -1);

      expect(isActive(firstPageBtn)).toBe(true);
      expect(isActive(secondPageBtn)).toBe(false);

      await user.click(secondPageBtn);
      expect(isActive(firstPageBtn)).toBe(false);
      expect(isActive(secondPageBtn)).toBe(true);

      await user.click(firstPageBtn);
      expect(isActive(firstPageBtn)).toBe(true);
      expect(isActive(secondPageBtn)).toBe(false);
    });

    it('navigates to first and last pages when edge buttons are clicked', async () => {
      const { getButtons, user, isActive } = renderComponent({
        showFirstLast: true,
        currentPage: 5,
        totalPages: 10,
      });

      let buttons = getButtons();
      let [goToFirstBtn, , firstPageBtn] = buttons;
      let [lastPageBtn, , goToLastBtn] = buttons.slice(-3);

      expect(isActive(firstPageBtn)).toBe(false);
      expect(isActive(lastPageBtn)).toBe(false);

      // User clicks go to first page edge button
      await user.click(goToFirstBtn);

      // Set the first page button as active and remove the go to first page edge button
      expect(isActive(firstPageBtn)).toBe(true);
      expect(goToFirstBtn).not.toBeInTheDocument();

      // Requery to avoid stale DOM state
      buttons = getButtons();
      [goToFirstBtn, , firstPageBtn] = buttons;
      [lastPageBtn, , goToLastBtn] = buttons.slice(-3);

      // User clicks go to last page edge button
      await user.click(goToLastBtn);

      // Set the last page button as active and remove the go to last page edge button
      expect(isActive(lastPageBtn)).toBe(true);
      expect(goToLastBtn).not.toBeInTheDocument();

      expect(isActive(firstPageBtn)).toBe(false);
      expect(goToFirstBtn).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const { getButtons, user, isActive } = renderComponent();

      const buttons = getButtons();
      const [goToPrevBtn, firstPageBtn, secondPageBtn, thirdPageBtn, goToNextBtn] = buttons;

      // Move focus inside pagination (page 2 is active by default test setup)
      await user.keyboard('[Tab]');
      expect(goToPrevBtn).toHaveFocus();

      // Go to previous page
      await user.keyboard('[Enter]');
      expect(isActive(firstPageBtn)).toBe(true);

      // Go to second page
      await user.keyboard('[Tab]');
      await user.keyboard('[Tab]');
      expect(secondPageBtn).toHaveFocus();
      await user.keyboard('[Space]');
      expect(isActive(secondPageBtn)).toBe(true);

      // Go to next page
      await user.keyboard('[Tab]');
      await user.keyboard('[Tab]');
      expect(goToNextBtn).toHaveFocus();
      await user.keyboard('[Space]');
      expect(isActive(thirdPageBtn)).toBe(true);

      // Go to second page
      await user.keyboard('{Shift>}[Tab]{/Shift}');
      await user.keyboard('{Shift>}[Tab]{/Shift}');
      expect(secondPageBtn).toHaveFocus();
      await user.keyboard('[Enter]');
      expect(isActive(secondPageBtn)).toBe(true);
    });
  });
});
