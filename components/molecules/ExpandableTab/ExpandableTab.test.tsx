import { render, screen } from '@testing-library/react';
import { ExpandableTabProps } from './ExpandableTab.types';
import { ExpandableTab } from './ExpandableTab';
import userEvent from '@testing-library/user-event';

const renderComponent = (props?: Partial<ExpandableTabProps>) => {
  const passedProps: ExpandableTabProps = {
    title: 'Required title',
    description: 'Required description',
    isExpanded: true,
    onToggle: vi.fn(),
  };

  const { container } = render(<ExpandableTab {...passedProps} {...props} />);

  const wrapper = container.firstElementChild as HTMLElement;

  const buttons = screen.getAllByRole('button');

  return {
    passedProps,
    wrapper,
    header: wrapper.firstElementChild as HTMLElement,
    content: wrapper.lastElementChild as HTMLElement,
    icon: wrapper.querySelector('svg'),
    heading: screen.getByRole('heading'),
    button: buttons.find((item) => item.tagName === 'BUTTON') as HTMLElement,
    img: screen.queryByRole('img'),
    user: userEvent.setup(),
  };
};

describe('ExpandableTab', () => {
  describe('rendering', () => {
    it('renders "title" prop as a heading element', () => {
      const title = 'Test title';
      const { heading } = renderComponent({ title });

      expect(heading).toHaveTextContent(title);
    });

    it('renders "description" prop', () => {
      const description = 'Test descrption';
      renderComponent({ description });

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('renders "image" prop when provided', () => {
      const image = { src: '/test/image', alt: 'Test image' };
      const { img } = renderComponent({ image });

      expect(img).toHaveAttribute('alt', image.alt);
    });

    describe('expanded', () => {
      it('renders "Hide" text inside button when tab is expanded', () => {
        const { button } = renderComponent();

        expect(button).toHaveTextContent('Hide');
      });

      it('applies "grid-rows-[1fr]" class to content element when expanded', () => {
        const { content } = renderComponent();

        expect(content).toHaveClass('grid-rows-[1fr]');
      });
    });

    describe('collapsed', () => {
      it('renders "Show more" text inside button when tab is collapsed', () => {
        const { button } = renderComponent({ isExpanded: false });

        expect(button).toHaveTextContent('Show more');
      });

      it('applies "grid-rows-[0fr]" class to content element when collapsed', () => {
        const { content } = renderComponent({ isExpanded: false });

        expect(content).toHaveClass('grid-rows-[0fr]');
      });
    });
  });

  describe('attributes', () => {
    it('applies cutom class name to wrapper element when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({ className: customClass });

      expect(wrapper).toHaveClass(customClass);
    });
  });

  describe('user interaction', () => {
    it('calls onToggle callback when header is clicked', async () => {
      const {
        header,
        user,
        passedProps: { onToggle },
      } = renderComponent();

      await user.click(header);

      expect(onToggle).toHaveBeenCalled();
    });
  });
});
