import { render, screen } from '@testing-library/react';
import type { InlineAlertProps } from './InlineAlert.types';
import { mockInlineAlertContent } from './InlineAlert.data';
import InlineAlert from './InlineAlert';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: Partial<InlineAlertProps>) => {
  const { container } = render(<InlineAlert alertContent={mockInlineAlertContent} {...props} />);

  const { title, description } = mockInlineAlertContent;

  return {
    container: container.firstElementChild as HTMLElement,
    title: screen.queryByText(title),
    description: screen.queryByText(description),
    getButton: (name: string) => screen.getByRole('button', { name }),
    user: userEvent.setup(),
    helpers: {
      additionalActionTestId: 'test-additional-action',
    },
    defaultValues: {
      closeButtonLabel: 'Close alert',
      role: 'status',
      ariaLabelledby: 'alert-title',
      ariaDescribedby: 'alert-description',
    },
  };
};

describe('InlineAlert', () => {
  describe('rendering', () => {
    it('renders alert container with default role when not provided', () => {
      const {
        container,
        defaultValues: { role },
      } = renderComponent();

      expect(container).toHaveRole(role);
    });

    it('renders title paragraph when provided', () => {
      const { title } = renderComponent();

      expect(title).toBeInstanceOf(HTMLParagraphElement);
    });

    it('renders description when provided', () => {
      const { description } = renderComponent();

      expect(description).toBeInTheDocument();
    });

    it('renders primary and secondary action buttons when provided', () => {
      const { getButton } = renderComponent();

      const {
        actions: { primary, secondary },
      } = mockInlineAlertContent;

      expect(getButton(primary.ariaLabel)).toBeInTheDocument();
      expect(getButton(secondary.ariaLabel)).toBeInTheDocument();
    });

    it('renders close alert button', () => {
      const {
        getButton,
        defaultValues: { closeButtonLabel },
      } = renderComponent();

      expect(getButton(closeButtonLabel)).toBeInTheDocument();
    });

    it('renders additional action element when provided', () => {
      const {
        helpers: { additionalActionTestId },
      } = renderComponent();

      expect(screen.getByTestId(additionalActionTestId)).toBeInTheDocument();
    });

    it('does not render any action when not provided', () => {
      renderComponent({ alertContent: { title: 'Test' } });

      // Only close alert button rendered
      expect(screen.queryAllByRole('button')).toHaveLength(1);
    });

    it('renders children when provided', () => {
      renderComponent({ children: <div data-testid="test-children"></div> });

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('does not render alert when neither alert content nor children are provided', () => {
      const { container } = renderComponent({ alertContent: undefined, children: undefined });

      expect(container).toBeNull();
    });

    it('doesnt not render alert when open state is false', () => {
      const { container } = renderComponent({ isOpen: false });

      expect(container).toBeNull();
    });
  });

  describe('attributes', () => {
    it('connects alert container with title via default aria-labelledby when not provided', () => {
      const {
        container,
        title,
        defaultValues: { ariaLabelledby },
      } = renderComponent();

      expect(container).toHaveAttribute('aria-labelledby', ariaLabelledby);
      expect(title).toHaveAttribute('id', ariaLabelledby);
    });

    it('connects alert container with title via default aria-describedby when not provided', () => {
      const {
        container,
        description,
        defaultValues: { ariaDescribedby },
      } = renderComponent();

      expect(container).toHaveAttribute('aria-describedby', ariaDescribedby);
      expect(description).toHaveAttribute('id', ariaDescribedby);
    });

    it('connects alert container with title via provided aria-labelledby', () => {
      const ariaLabelledby = 'test-aria-labelledby';
      const { container, title } = renderComponent({ ariaLabelledby });

      expect(container).toHaveAttribute('aria-labelledby', ariaLabelledby);
      expect(title).toHaveAttribute('id', ariaLabelledby);
    });

    it('connects alert container with description via provided aria-describedby', () => {
      const ariaDescribedby = 'test-aria-describedby';
      const { container, description } = renderComponent({ ariaDescribedby });

      expect(container).toHaveAttribute('aria-describedby', ariaDescribedby);
      expect(description).toHaveAttribute('id', ariaDescribedby);
    });

    it('applies provided role to alert container', () => {
      const role = 'test-role';
      const { container } = renderComponent({ role });

      expect(container).toHaveRole(role);
    });

    it('applies custom class to alert container when provided', () => {
      const customClass = 'custom-class';
      const { container } = renderComponent({ className: customClass });

      expect(container).toHaveClass(customClass);
    });
  });

  describe('state', () => {
    it('handles open state when component is controlled', () => {
      const {
        defaultValues: { role },
      } = renderComponent({ isOpen: false });

      expect(screen.queryByRole(role)).not.toBeInTheDocument();
    });

    it('handles open state when component is uncontrolled', () => {
      const {
        defaultValues: { role },
      } = renderComponent({ defaultOpen: false });

      expect(screen.queryByRole(role)).not.toBeInTheDocument();
    });
  });

  describe('user interaction', () => {
    it('closes alert when close alert button clicked', async () => {
      const {
        getButton,
        user,
        defaultValues: { closeButtonLabel, role },
      } = renderComponent();

      await user.click(getButton(closeButtonLabel));

      expect(screen.queryByRole(role)).not.toBeInTheDocument();
    });

    it('calls provided onClose callbak when close alert button clicked', async () => {
      const onClose = vi.fn();
      const {
        user,
        getButton,
        defaultValues: { closeButtonLabel },
      } = renderComponent({ onClose });

      await user.click(getButton(closeButtonLabel));

      expect(onClose).toHaveBeenCalled();
    });
  });
});
