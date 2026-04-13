import { render, screen } from '@testing-library/react';
import { ImageExportCardProps } from '@/components/molecules/ImageExportCard/ImageExportCard.types';
import { ImageExportCard } from '@/components/molecules/ImageExportCard/ImageExportCard';

const renderComponent = (props?: Partial<ImageExportCardProps>) => {
  const passedProps: ImageExportCardProps = {
    title: 'Required title',
    description: (
      <>
        <p> Required description </p>
      </>
    ),
    image: {
      src: '/test/image',
      alt: 'Required image alt',
    },
  };

  const { container } = render(<ImageExportCard {...passedProps} {...props} />);

  const wrapper = container.firstElementChild as HTMLElement;

  return {
    passedProps,
    wrapper,
  };
};

describe('ImageExportCard', () => {
  describe('rendering', () => {
    it('renders "title" prop when provided', () => {
      const title = 'Test title';
      renderComponent({ title });

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('renders "description" prop', () => {
      const description = 'Test descrption';
      renderComponent({ description });

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('renders "image" prop', () => {
      const image = { src: '/test/image', alt: 'Test image' };
      renderComponent({ image });
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('alt', image.alt);
    });

    it('renders download buttons for all provided formats', () => {
      const downloads = {
        svg: '/file.svg',
        png: '/file.png',
        jpg: '/file.jpg',
      };

      renderComponent({ downloads });

      Object.entries(downloads).forEach(([format, href]) => {
        const link = screen.getAllByRole('link').find((l) => l.getAttribute('href') === href);
        expect(link).toBeInTheDocument();
      });
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
