import { render, screen } from '@testing-library/react';
import { ContentBlockProps } from './ContentBlock.types';
import { ContentBlock } from './ContentBlock';

const renderComponent = (props?: Partial<ContentBlockProps>) => {
  const defaultProps: Partial<ContentBlockProps> = {
    textAlign: 'left',
    lineHeight: 'normal',
    headingSize: 'h2',
  };

  const passedProps: ContentBlockProps = {
    heading: 'Test heading',
  };

  const { container } = render(<ContentBlock {...defaultProps} {...passedProps} {...props} />);

  return {
    defaultProps,
    passedProps,
    wrapper: container.firstElementChild as HTMLElement,
    heading: screen.getByRole('heading'),
  };
};

describe('ContentBlock', () => {
  describe('rendering', () => {
    it('renders component with default props', () => {
      const {
        heading,
        wrapper,
        defaultProps: { headingSize },
      } = renderComponent();

      expect(heading.tagName.toLocaleLowerCase()).toBe(headingSize);
      expect(heading).toHaveClass('leading-normal', 'text-left', 'rtl:text-right');
      expect(wrapper).toHaveClass('leading-normal', 'text-left', 'rtl:text-right');
    });

    it('renders heading with provided size', () => {
      const { heading } = renderComponent({ headingSize: 'h3' });

      expect(heading.tagName.toLowerCase()).toBe('h3');
    });

    it('renders heading with provided text content', () => {
      const { heading, passedProps } = renderComponent();

      expect(heading).toHaveTextContent(passedProps.heading);
    });

    it('renders "text" prop when provided', () => {
      const text = 'Test text';
      renderComponent({ text });

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('renders heading with line height set to "none" when provided', () => {
      const { wrapper } = renderComponent({ lineHeight: 'none' });

      expect(wrapper).toHaveClass('leading-none');
    });

    it('centers heading when textAlign is "center"', () => {
      const { heading } = renderComponent({ textAlign: 'center' });

      expect(heading).toHaveClass('text-center');
    });

    it('aligns to the right heading when textAlign is "right"', () => {
      const { heading } = renderComponent({ textAlign: 'right' });

      expect(heading).toHaveClass('text-right', 'rtl:text-left');
    });
  });

  describe('attributes', () => {
    it('applies custom class name to wrapper element when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({ className: customClass });

      expect(wrapper).toHaveClass(customClass);
    });
  });
});
