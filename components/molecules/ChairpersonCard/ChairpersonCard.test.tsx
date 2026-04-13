import { render, screen } from '@testing-library/react';
import { ChairpersonCardProps } from './ChairpersonCard.types';
import { ChairpersonCard } from './ChairpersonCard';
import { NextIntlClientProvider } from 'next-intl';

const renderComponent = (props?: Partial<ChairpersonCardProps>, locale: 'ar' | 'en' = 'en') => {
  document.documentElement.lang = locale;

  const passedProps: ChairpersonCardProps = {
    name: 'Test name',
    image: '/test/image',
  };

  render(
    <NextIntlClientProvider locale={locale}>
      <ChairpersonCard {...passedProps} {...props} />
    </NextIntlClientProvider>,
  );

  return {
    passedProps,
    card: screen.getByTestId('chairperson-card'),
    image: screen.getByRole('img'),
    heading: screen.getByRole('heading'),
  };
};

describe('ChairpersonCard', () => {
  describe('rendering', () => {
    it('renders "image" prop with an accessible name', () => {
      const {
        image,
        passedProps: { name },
      } = renderComponent();

      expect(image).toHaveAccessibleName(name);
    });

    it('renders "name" prop as a heading', () => {
      const {
        heading,
        passedProps: { name },
      } = renderComponent();

      expect(heading).toHaveTextContent(name);
    });

    it('renders "title" prop when provided', () => {
      const title = 'Test title';
      renderComponent({ title });

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('renders "description" prop when provided', () => {
      const description = 'Test description';
      renderComponent({ description });

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

  describe('RTL', () => {
    it('aligned text to the right for "ar" locale', () => {
      const { heading } = renderComponent({}, 'ar');

      expect(heading.parentElement).toHaveClass('text-right');
    });
  });
});
