import { render, screen } from '@testing-library/react';
import { DropdownBaseProps } from './DropdownBase.types';
import { DropdownBase } from './DropdownBase';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';

const renderComponent = (
  props?: Partial<DropdownBaseProps>,
  options: { locale: 'en' | 'ar' } = { locale: 'en' },
) => {
  document.documentElement.lang = options.locale;

  const passedProps: DropdownBaseProps = {
    buttonContent: 'Toggle test dropdown',
    children: <div data-testid="child">Test dropdown child</div>,
  };

  const { container } = render(
    <NextIntlClientProvider locale={options.locale}>
      <DropdownBase {...passedProps} {...props} />
    </NextIntlClientProvider>,
  );

  return {
    wrapper: container.firstElementChild as HTMLElement,
    trigger: screen.getByRole('button'),
    user: userEvent.setup(),
    getChildren: () => screen.queryByTestId('child'),
    getMenu: () => screen.queryByRole('menu'),
  };
};

describe('DropdownBase', () => {
  describe('rendering', () => {
    it('renders trigger button with provided content', () => {
      const buttonContent = 'Test button content';
      const { trigger } = renderComponent({ buttonContent });

      expect(trigger).toHaveTextContent(buttonContent);
    });

    it('renders trigger button with proper aria attributes', () => {
      const { trigger } = renderComponent();

      expect(trigger).toHaveAttribute('aria-haspopup', 'true');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not render dropdown menu by default', () => {
      const { getMenu } = renderComponent();

      expect(getMenu()).not.toBeInTheDocument();
    });

    it('renders provided children when menu is opened', async () => {
      const { trigger, user, getChildren } = renderComponent();

      expect(getChildren()).not.toBeInTheDocument();

      await user.click(trigger);

      expect(getChildren()).toBeInTheDocument();
    });

    it('aligns menu to left edge of trigger button in LTR layout', async () => {
      const { trigger, user, getMenu } = renderComponent();

      await user.click(trigger);

      expect(getMenu()).toHaveClass('left-0');
    });

    it('aligns menu to right edge of trigger button in RTL layout', async () => {
      const { trigger, user, getMenu } = renderComponent(undefined, { locale: 'ar' });

      await user.click(trigger);

      expect(getMenu()).toHaveClass('right-0');
    });
  });

  describe('attributes', () => {
    it('applies custom class name to wrapper element when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({ className: customClass });

      expect(wrapper).toHaveClass(customClass);
    });

    it('renders trigger button with an accessible name when provided', () => {
      const label = 'Test label';
      const { trigger } = renderComponent({ label });

      expect(trigger).toHaveAccessibleName(new RegExp(label, 'i'));
    });
  });

  describe('user interaction', () => {
    it('toggles menu on trigger button click', async () => {
      const { trigger, user, getMenu } = renderComponent();

      // Open dropdown
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(getMenu()).toBeInTheDocument();

      // Close dropdown
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(getMenu()).not.toBeInTheDocument();
    });

    it('closes menu on outside click', async () => {
      const { trigger, user, getMenu } = renderComponent();

      // Open dropdown
      await user.click(trigger);

      expect(getMenu()).toBeInTheDocument();

      // Clsoe by outside click
      await user.click(document.body);

      expect(getMenu()).not.toBeInTheDocument();
    });
  });
});
