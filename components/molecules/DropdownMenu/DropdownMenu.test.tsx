import { render, screen } from '@testing-library/react';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuProps } from './DropdownMenu.types';
import { mockDropdownItems, mockMultiColumnDropdownItems } from './DropdowMenu.data';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: Partial<DropdownMenuProps>) => {
  const passedProps: DropdownMenuProps = {
    label: 'Test label',
    items: mockDropdownItems,
    onItemSelect: vi.fn(),
    onOpenChange: vi.fn(),
  };

  const defaultProps = {
    role: 'menu',
    tabIndex: 0,
    rootPath: '',
  };

  const { container } = render(<DropdownMenu {...passedProps} {...props} />);

  return {
    passedProps,
    defaultProps,
    wrapper: container.firstElementChild as HTMLElement,
    trigger: screen.getByRole('button'),
    getHeading: (name: string) => screen.queryByRole('heading', { name }),
    getMenu: (role = defaultProps.role) => screen.queryByRole(role),
    getMenuItems: () => screen.queryAllByRole('menuitem'),
    user: userEvent.setup(),
  };
};

describe('DropdownMenu', () => {
  describe('single column', () => {
    describe('rendering', () => {
      it('renders trigger button with expected default attributes', () => {
        const { trigger, defaultProps } = renderComponent();

        expect(trigger).toHaveAttribute('id', 'dropdown-test-label-button');
        expect(trigger).toHaveAttribute('aria-controls', 'dropdown-test-label');
        expect(trigger).toHaveAttribute('aria-haspopup', 'true');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('tabIndex', `${defaultProps.tabIndex}`);
      });

      it('renders trigger button with provided text content', () => {
        const { trigger, passedProps } = renderComponent();

        expect(trigger).toHaveTextContent(passedProps.label);
      });

      it('renders menu with generated id and heading based on item group name', async () => {
        const { trigger, user, getMenu, getHeading, passedProps } = renderComponent();

        await user.click(trigger);
        const menu = getMenu();

        expect(menu).toHaveAttribute('id', 'dropdown-test-label');
        expect(getHeading(passedProps.items[0].group!)).toBeInTheDocument();
      });

      it('renders provided items with optional description', async () => {
        const { trigger, user, getMenuItems } = renderComponent();

        await user.click(trigger);
        const items = getMenuItems();

        items.forEach((item, index) => {
          const { label, description } = mockDropdownItems[index];
          expect(item).toHaveTextContent(label);

          if (description) {
            expect(item).toHaveTextContent(description);
          }
        });
      });

      it('renders item icon when provided', async () => {
        const { trigger, user, getMenu } = renderComponent();

        await user.click(trigger);
        const menu = getMenu();

        // Icons in mocked data
        expect(menu?.querySelectorAll('svg')).toHaveLength(1);
      });
    });

    describe('state', () => {
      it('handles disabled state for menu items', async () => {
        const { user, trigger, getMenuItems } = renderComponent({
          items: [{ href: '/item', label: 'Item', disabled: true }],
        });

        await user.click(trigger);
        const item = getMenuItems()[0];

        expect(item).toHaveAttribute('aria-disabled', 'true');
        expect(item).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('attributes', () => {
      it('applies custom class name to wrapper element when provided', () => {
        const customClass = 'custom-class';
        const { wrapper } = renderComponent({ className: customClass });

        expect(wrapper).toHaveClass(customClass);
      });

      it('renders trigger button with attribtues based on provided props', () => {
        const id = 'test-id';
        const ariaLabel = 'Test aria label';
        const tabIndex = -1;

        const { trigger } = renderComponent({ id, ariaLabel, tabIndex });

        expect(trigger).toHaveAccessibleName(new RegExp(ariaLabel, 'i'));
        expect(trigger).toHaveAttribute('id', `${id}-button`);
        expect(trigger).toHaveAttribute('tabindex', `${tabIndex}`);
        expect(trigger).toHaveAttribute('aria-controls', id);
      });

      it('renders menu with attribtues based on provided props', async () => {
        const id = 'test-id';
        const ariaDescribedby = 'test-describedby';
        const role = 'test-role';

        const { trigger, user, getMenu } = renderComponent({ id, role, ariaDescribedby });

        await user.click(trigger);
        const menu = getMenu(role);

        expect(menu).toHaveAttribute('id', id);
        expect(menu).toHaveAttribute('aria-describedby', ariaDescribedby);
      });
    });

    describe('user interaction', () => {
      describe('mouse', () => {
        it('toggles menu on trigger click and calls provided "onOpenChange" callback', async () => {
          const {
            trigger,
            user,
            getMenu,
            passedProps: { onOpenChange },
          } = renderComponent();

          // Call callback on mount with "false"
          expect(onOpenChange).toHaveBeenNthCalledWith(1, false);

          // Open menu call callback on open with "true"
          await user.click(trigger);
          expect(onOpenChange).toHaveBeenNthCalledWith(2, true);

          expect(trigger).toHaveAttribute('aria-expanded', 'true');
          expect(getMenu()).toBeInTheDocument();

          // Close menu and call callback with "false"
          await user.click(trigger);
          expect(onOpenChange).toHaveBeenNthCalledWith(3, false);

          expect(trigger).toHaveAttribute('aria-expanded', 'false');
          expect(getMenu()).not.toBeInTheDocument();
        });

        it('closes menu on outside click', async () => {
          const { trigger, user, getMenu } = renderComponent();

          // Open menu
          await user.click(trigger);

          expect(trigger).toHaveAttribute('aria-expanded', 'true');
          expect(getMenu()).toBeInTheDocument();

          // Close menu by outside click
          await user.click(document.body);

          expect(trigger).toHaveAttribute('aria-expanded', 'false');
          expect(getMenu()).not.toBeInTheDocument();
        });

        it('closes menu on item click', async () => {
          const { trigger, user, getMenu, getMenuItems } = renderComponent();

          await user.click(trigger);
          expect(getMenu()).toBeInTheDocument();

          const item = getMenuItems()[0];
          await user.click(item);

          expect(getMenu()).not.toBeInTheDocument();
        });
      });

      describe('keyboard', () => {
        it('toggles menu via keyboard', async () => {
          const { trigger, user, getMenu } = renderComponent();

          await user.keyboard('[Tab]');
          expect(trigger).toHaveFocus();

          await user.keyboard('[Enter]');
          expect(getMenu()).toBeInTheDocument();

          await user.keyboard('[Escape]');
          expect(getMenu()).not.toBeInTheDocument();

          await user.keyboard('[Space]');
          expect(getMenu()).toBeInTheDocument();
        });

        it('navigates through arrow keys', async () => {
          const { trigger, user, getMenuItems } = renderComponent();

          await user.click(trigger);
          const items = getMenuItems();

          await user.keyboard('[ArrowDown]');
          expect(items[0]).toHaveFocus();

          await user.keyboard('[ArrowUp]');
          expect(items[2]).toHaveFocus();

          await user.keyboard('[ArrowDown]');
          expect(items[0]).toHaveFocus();
        });

        it('fires menu items click event on Enter and Space', async () => {
          const { trigger, user, getMenuItems } = renderComponent();

          // Click Space on focused menu item
          await user.click(trigger);
          await user.keyboard('[ArrowDown]');
          let items = getMenuItems();

          const spySpaceClick = vi.spyOn(items[0], 'click');
          await user.keyboard('[Space]');
          expect(spySpaceClick).toHaveBeenCalled();

          // Click Enter on focused menu item
          await user.click(trigger);
          await user.keyboard('[ArrowDown]');
          items = getMenuItems();

          const spyEnterClick = vi.spyOn(items[0], 'click');
          await user.keyboard('[Enter]');
          expect(spyEnterClick).toHaveBeenCalled();
        });
      });
    });
  });

  describe('multi column', () => {
    describe('rendering', () => {
      it.each(['Resources', 'Services'])(
        'renders multiple column when provided label is equal to %s',
        async (label: string) => {
          const { trigger, user } = renderComponent({
            items: mockMultiColumnDropdownItems,
            label,
          });

          await user.click(trigger);

          const headings = screen.getAllByRole('heading');
          // Unique multicolumn groups
          expect(headings).toHaveLength(5);
        },
      );

      it('renders item icon when provided', async () => {
        const { trigger, user, getMenu } = renderComponent();

        await user.click(trigger);
        const menu = getMenu();

        // Icons in mocked data
        expect(menu?.querySelectorAll('svg')).toHaveLength(1);
      });
    });

    describe('user interaction', () => {
      describe('keyboard', () => {
        it('navigates through arrow keys', async () => {
          const { trigger, user, getMenuItems } = renderComponent({
            items: mockMultiColumnDropdownItems,
          });

          await user.click(trigger);
          const items = getMenuItems();

          await user.keyboard('[ArrowDown]');
          expect(items[0]).toHaveFocus();

          await user.keyboard('[ArrowUp]');
          expect(items[items.length - 1]).toHaveFocus();

          await user.keyboard('[ArrowDown]');
          expect(items[0]).toHaveFocus();
        });
      });
    });
  });
});
