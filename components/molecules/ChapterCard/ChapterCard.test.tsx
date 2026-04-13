import { render, screen } from '@testing-library/react';
import { ChapterCardProps } from './ChapterCard.types';
import { ChapterCard } from './ChapterCard';

const renderComponent = (props?: Partial<ChapterCardProps>) => {
  const chapter = '1';
  const title = 'Title';
  const { container } = render(<ChapterCard chapter={chapter} title={title} {...props} />);

  return {
    card: container.firstElementChild as HTMLElement,
    passedProps: {
      chapter,
      title,
    },
  };
};

describe('ChapterCard', () => {
  describe('rendering', () => {
    it('renders provided chapter and title', () => {
      const {
        passedProps: { chapter, title },
      } = renderComponent();

      expect(screen.getByText(`Chapter ${chapter}`)).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  describe('attributes', () => {
    it('applies custom class name when provided', () => {
      const customClass = 'custom-class';
      const { card } = renderComponent({ className: customClass });

      expect(card).toHaveClass(customClass);
    });

    it('renders card with an accessible name based on provided props', () => {
      const {
        card,
        passedProps: { chapter, title },
      } = renderComponent();

      expect(card).toHaveAccessibleName(new RegExp(`Chapter ${chapter}: ${title}`, 'i'));
    });
  });
});
