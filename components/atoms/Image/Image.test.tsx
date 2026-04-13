import { render, screen } from '@testing-library/react';
import { Image } from './Image';
import React from 'react';
import type { ImageObjectFit, ImageAspectRatio } from './Image.types';

type TestImageProps = Partial<React.ComponentProps<typeof Image>>;

const renderComponent = (props?: TestImageProps) => {
  render(<Image alt="Test Image" src="/test" {...props} />);

  const image = screen.getByRole('img') as HTMLImageElement;
  const wrapper = image.parentElement;

  return {
    image,
    wrapper,
    defaultProps: {
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      quality: 75,
    },
  };
};

describe('Image', () => {
  describe('visibility', () => {
    describe('aspect ratio', () => {
      const aspectRatioValues: { label: ImageAspectRatio; className: string }[] = [
        { label: 'square', className: 'aspect-square' },
        { label: 'video', className: 'aspect-video' },
        { label: 'portrait', className: 'aspect-[3/4]' },
        { label: 'landscape', className: 'aspect-[4/3]' },
      ];

      it("renders the wrapper with an 'auto' proportion by default", () => {
        const { wrapper } = renderComponent();

        aspectRatioValues.forEach((ratio) => {
          expect(wrapper).not.toHaveClass(ratio.className);
        });
      });

      it.each(aspectRatioValues)(
        'renders the wrapper with a $label proportion when provided',
        ({ label, className }) => {
          const { wrapper } = renderComponent({ aspectRatio: label });

          expect(wrapper).toHaveClass(className);
        },
      );
    });

    describe('resizing', () => {
      const objectFitValues: ImageObjectFit[] = ['contain', 'fill', 'none', 'scale-down'];

      it("renders with 'object-cover' by default", () => {
        const { image } = renderComponent();

        expect(image).toHaveClass('object-cover');
      });

      it.each(objectFitValues)("renders with 'object-%s' class when provided", (objectFit) => {
        const { image } = renderComponent({ objectFit });

        expect(image).toHaveClass(`object-${objectFit}`);
      });
    });

    describe('quality', () => {
      it('renders with default quality when none provided', () => {
        const {
          image,
          defaultProps: { quality },
        } = renderComponent();

        expect(image.srcset).toContain(`q=${quality}`);
      });

      it('renders with provided quality', () => {
        const customQuality = 100;
        const { image } = renderComponent({ quality: customQuality });

        expect(image.srcset).toContain(`q=${customQuality}`);
      });
    });
  });

  describe('attributes', () => {
    it('applies provided alternative text', () => {
      const alternativeText = 'Test alternative text';
      const { image } = renderComponent({ alt: alternativeText });

      expect(image).toHaveAttribute('alt', alternativeText);
    });

    it('applies custom class name to the wrapper when provided', () => {
      const customClass = 'customClass';
      const { wrapper } = renderComponent({ className: customClass });

      expect(wrapper).toHaveClass(customClass);
    });

    describe('sizes', () => {
      it('applies default sizes when none provided', () => {
        const {
          image,
          defaultProps: { sizes },
        } = renderComponent();

        expect(image).toHaveAttribute('sizes', sizes);
      });

      it('applies custom sizes when provided', () => {
        const customSizes = '(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw';
        const { image } = renderComponent({ sizes: customSizes });

        expect(image).toHaveAttribute('sizes', customSizes);
      });
    });

    describe('loading', () => {
      it('applies lazy loading by default', () => {
        const { image } = renderComponent();

        expect(image).toHaveAttribute('loading', 'lazy');
      });

      it('applies eager loading when priority prop is true', () => {
        const { image } = renderComponent({ priority: true });

        expect(image).toHaveAttribute('loading', 'eager');
      });
    });
  });
});
