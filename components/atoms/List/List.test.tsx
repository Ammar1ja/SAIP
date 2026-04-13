import { render, screen } from '@testing-library/react';
import { ListProps } from './List.types';
import List from './List';
import { mockListItems } from './List.data';

const renderComponent = (props?: Partial<ListProps>) => {
  render(<List items={mockListItems} {...props} />);

  return {
    list: screen.getByRole('list'),
    items: screen.getAllByRole('listitem'),
  };
};

describe('List', () => {
  describe('rendering', () => {
    it('renders unordered list by default', () => {
      const { list } = renderComponent();

      expect(list).toBeInstanceOf(HTMLUListElement);
    });

    it('renders ordered list when provided', () => {
      const { list } = renderComponent({ ordered: true });

      expect(list).toBeInstanceOf(HTMLOListElement);
    });

    it('renders provided list items', () => {
      const { items } = renderComponent();

      expect(items).toHaveLength(3);
    });
  });

  describe('attributes', () => {
    it('applies custom class name to list element when provided', () => {
      const customClass = 'custom-class';
      const { list } = renderComponent({ className: customClass });

      expect(list).toHaveClass(customClass);
    });

    it('applies custom class name to list item elements when provided', () => {
      const customClass = 'custom-class';
      const { items } = renderComponent({ listItemClassName: customClass });

      items.forEach((item) => expect(item).toHaveClass(customClass));
    });
  });
});
