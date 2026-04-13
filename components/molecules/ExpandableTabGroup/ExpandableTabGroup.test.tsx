import { render, screen } from '@testing-library/react';
import { ExpandableTabGroup } from './ExpandableTabGroup';
import { ExpandableTabGroupProps } from './ExpandableTabGroup.types';
import { mockExpandableTabGroupItems } from './ExpandableTabGroup.data';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: Partial<ExpandableTabGroupProps>) => {
  const { container } = render(
    <ExpandableTabGroup items={mockExpandableTabGroupItems} {...props} />,
  );

  const headings = screen.getAllByRole('heading');

  const buttons = screen
    .getAllByRole('button')
    .filter((item) => item.tagName === 'BUTTON') as HTMLButtonElement[];

  return {
    wrapper: container.firstElementChild as HTMLElement,
    buttons,
    images: screen.getAllByRole('img'),
    headings,
    getHeader: (index: number) => headings[index].parentElement as HTMLElement,
    user: userEvent.setup(),
  };
};

describe('ExpandableTabGroup', () => {
  describe('rendering', () => {
    it('render all tabs based on provided items', () => {
      const { buttons, headings, images } = renderComponent();

      expect(buttons).toHaveLength(3);
      expect(headings).toHaveLength(3);
      expect(images).toHaveLength(3);
    });

    it('renders each tab as collapsed by default', () => {
      renderComponent();

      expect(screen.getAllByText('Show more')).toHaveLength(3);
    });

    it('expands tab on initial render when controlled', () => {
      const { buttons } = renderComponent({ activeId: mockExpandableTabGroupItems[0].id });

      expect(buttons[0]).toHaveTextContent('Hide');
    });
  });

  describe('attributes', () => {
    it('applies custom class name to wrapper element when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({ className: customClass });

      expect(wrapper).toHaveClass(customClass);
    });
  });

  describe('user interaction', () => {
    it('toggles active tab by expanding selected and collapsing previous', async () => {
      const { user, buttons, getHeader } = renderComponent();

      // Expand first tab
      await user.click(getHeader(0));

      expect(buttons[0]).toHaveTextContent('Hide');
      expect(buttons[1]).toHaveTextContent('Show more');

      // Expand second tab and collapse first tab
      await user.click(getHeader(1));

      expect(buttons[0]).toHaveTextContent('Show more');
      expect(buttons[1]).toHaveTextContent('Hide');

      // Collapse second tab
      await user.click(getHeader(1));

      expect(buttons[0]).toHaveTextContent('Show more');
      expect(buttons[1]).toHaveTextContent('Show more');
    });

    it('calls provided onTabChange with id of toggled tab', async () => {
      const onTabChange = vi.fn();
      const { user, getHeader } = renderComponent({
        onTabChange,
        activeId: mockExpandableTabGroupItems[1].id,
      });

      // First tab clickable header
      const heading = getHeader(0);

      await user.click(heading);

      expect(onTabChange).toHaveBeenCalledWith(mockExpandableTabGroupItems[0].id);
    });

    it('does not collapse tab when is controlled and already expanded', async () => {
      const { user, buttons, getHeader } = renderComponent({
        activeId: mockExpandableTabGroupItems[0].id,
      });

      // First tab clickable header
      const heading = getHeader(0);
      await user.click(heading);

      expect(buttons[0]).toHaveTextContent('Hide');
      await user.click(heading);

      expect(buttons[0]).toHaveTextContent('Hide');
    });
  });
});
