import { render, screen } from '@testing-library/react';
import { BlurredCardProps } from './BlurredCard.types';
import { BlurredCard } from './BlurredCard';

const renderComponent = (props?: Partial<BlurredCardProps>) => {
  const title = 'Test title';
  const description = 'Test description';
  const { container } = render(<BlurredCard title={title} description={description} {...props} />);

  return {
    card: container.firstElementChild as HTMLElement,
    passedProps: {
      title,
      description,
    },
  };
};

describe('BlurredCard', () => {
  describe('rendering', () => {
    it('renders provided title and description', () => {
      const {
        passedProps: { title, description },
      } = renderComponent();

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  describe('attributes', () => {
    it('applies custom class name to card element when provided', () => {
      const customClass = 'custom-class';
      const { card } = renderComponent({ className: customClass });

      expect(card).toHaveClass(customClass);
    });
  });
});
