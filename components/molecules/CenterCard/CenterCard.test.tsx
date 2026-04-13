import { render, screen } from '@testing-library/react';
import { CenterCardProps } from './CenterCard.types';
import CenterCard from './CenterCard';

const renderComponent = (props?: Partial<CenterCardProps>) => {
  const passedProps: CenterCardProps = {
    logo: '/test/logo',
    name: 'Test name',
    location: 'Test location',
    email: 'test@example.com',
    website: 'https://example.com',
  };

  const { container } = render(<CenterCard {...passedProps} {...props} />);

  return {
    passedProps,
    card: container.firstElementChild as HTMLElement,
    email: screen.getByRole('link', { name: passedProps.email }),
    heading: screen.getByRole('heading'),
    logo: screen.getByRole('img'),
    location: screen.getByText(passedProps.location),
    website: screen.getByRole('link', { name: passedProps.website }),
  };
};

describe('CenterCard', () => {
  describe('rendering', () => {
    it('renders "logo" prop as an image with an accessible name', () => {
      const {
        logo,
        passedProps: { name },
      } = renderComponent();
      const alt = new RegExp(`${name} logo`, 'i');

      expect(logo).toHaveAccessibleName(alt);
    });

    it('renders "name" prop as a heading', () => {
      const {
        heading,
        passedProps: { name },
      } = renderComponent();

      expect(heading).toHaveTextContent(name);
    });

    it('renders "location" prop', () => {
      const { location } = renderComponent();

      expect(location).toBeInTheDocument();
    });

    it('renders "email" prop as a mailto: link', () => {
      const { email, passedProps } = renderComponent();
      const href = `mailto:${passedProps.email}`;

      expect(email).toHaveAttribute('href', href);
    });

    it('renders "website" prop as a link opening in a new tab', () => {
      const { website, passedProps } = renderComponent();

      expect(website).toHaveAttribute('href', passedProps.website);
      expect(website).toHaveAttribute('target', '_blank');
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
