import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { type BreadcrumbsProps } from './Breadcrumbs.types';
import { mockBreadcrumbsWithHref, mockBreadcrumbsWithoutHref } from './Breadcrumbs.data';

const renderComponent = (props?: Partial<BreadcrumbsProps>) => {
  render(<Breadcrumbs items={mockBreadcrumbsWithHref} {...props} />);

  return {
    navigation: screen.getByRole('navigation'),
    links: screen.queryAllByRole('link'),
  };
};

describe('Breadcrumbs', () => {
  describe('rendering', () => {
    it('renders items with href property as <a> elements', () => {
      const { links } = renderComponent();

      expect(links).toHaveLength(2);
      links.forEach((link) => expect(link).toBeInstanceOf(HTMLAnchorElement));

      const lastItem = screen.getByText(
        mockBreadcrumbsWithHref[mockBreadcrumbsWithHref.length - 1].label,
      );
      expect(lastItem).toBeInstanceOf(HTMLSpanElement);
    });

    it('renders items without href property as <span> elements', () => {
      renderComponent({ items: mockBreadcrumbsWithoutHref });

      mockBreadcrumbsWithoutHref.forEach(({ label }) => {
        const breadcrumb = screen.getByText(label);
        expect(breadcrumb).toBeInstanceOf(HTMLSpanElement);
      });
    });
  });

  describe('attributes', () => {
    it('applies custom class to navigation element when provided', () => {
      const customClass = 'custom-class';
      const { navigation } = renderComponent({ className: customClass });

      expect(navigation).toHaveClass(customClass);
    });

    it('applies provided href to link elements correctly', () => {
      const { links } = renderComponent();

      links.forEach((link, index) =>
        expect(link).toHaveAttribute('href', mockBreadcrumbsWithHref[index].href),
      );
    });
  });
});
