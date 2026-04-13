import { render, screen } from '@testing-library/react';
import { Icon, StaticIcon } from './Icon';
import { HomeIcon } from 'lucide-react';
import userEvent from '@testing-library/user-event';
import { type BaseIconProps } from './Icon.types';
import { type ComponentPropsWithoutRef, type ComponentPropsWithRef } from 'react';

type IconComponent = {
  iconType: typeof Icon;
  props?: Partial<ComponentPropsWithRef<typeof Icon>>;
};

type StaticIconComponent = {
  iconType: typeof StaticIcon;
  props?: Partial<ComponentPropsWithoutRef<typeof StaticIcon>>;
};

export type TestIconProps = IconComponent | StaticIconComponent;

const sizes: BaseIconProps['size'][] = ['small', 'medium', 'large'];
const backgrounds: BaseIconProps['background'][] = [
  'none',
  'green',
  'light',
  'dark',
  'transparent',
  'white',
];

function renderComponent({ iconType: IconComponent, props }: TestIconProps) {
  const arialabelText = 'Test aria label text';
  render(<IconComponent alt={arialabelText} {...props} />);

  const wrapper = screen.getByLabelText(props?.alt || arialabelText);

  return {
    wrapper,
    svg: wrapper.querySelector('svg'),
    image: wrapper.querySelector('img'),
    user: userEvent.setup(),
  };
}

describe('Static Icon', () => {
  describe('visibility', () => {
    it("renders with 'medium' size and 'none' background by default", () => {
      const { wrapper } = renderComponent({ iconType: StaticIcon });

      expect(wrapper).toHaveAttribute('data-size', 'medium');
      expect(wrapper).toHaveAttribute('data-background', 'none');
    });

    describe('background', () => {
      it.each(backgrounds)("renders with '%s' background when provided", (background) => {
        const { wrapper } = renderComponent({
          iconType: StaticIcon,
          props: { background },
        });

        expect(wrapper).toHaveAttribute('data-background', background);
      });
    });

    describe('size', () => {
      it.each(sizes)("renders with '%s' size when provided", (size) => {
        const { wrapper } = renderComponent({
          iconType: StaticIcon,
          props: { size },
        });

        expect(wrapper).toHaveAttribute('data-size', size);
      });
    });
  });

  describe('attributes', () => {
    it('applies custom class when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({
        iconType: StaticIcon,
        props: { className: customClass },
      });

      expect(wrapper).toHaveClass(customClass);
    });

    it('applies aria attributes when provided', () => {
      const customAriaLabelText = 'Custom aria label';

      const { wrapper } = renderComponent({
        iconType: StaticIcon,
        props: { alt: customAriaLabelText, ariaHidden: false },
      });

      expect(wrapper).toHaveAttribute('aria-label', customAriaLabelText);
      expect(wrapper).toHaveAttribute('aria-hidden', 'false');
      expect(wrapper).toHaveRole('img');
    });
  });

  describe('children', () => {
    it('renders as svg with aria attributes when component provided', () => {
      const { svg, image } = renderComponent({
        iconType: StaticIcon,
        props: { component: HomeIcon },
      });

      expect(image).not.toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
    });

    it('renders as image with aria attributes when src provided', () => {
      const { image, svg } = renderComponent({
        iconType: StaticIcon,
        props: { src: '/test/img' },
      });

      expect(svg).not.toBeInTheDocument();
      expect(image).toHaveAttribute('aria-hidden', 'true');
      expect(image).toHaveRole('presentation');
    });

    it('renders no children when both src and component props are missing', () => {
      const { wrapper } = renderComponent({ iconType: StaticIcon });

      expect(wrapper.hasChildNodes()).toBe(false);
    });
  });
});

describe('Interactive Icon', () => {
  describe('visibility', () => {
    it("renders with 'medium' size and 'none' background by default", () => {
      const { wrapper } = renderComponent({ iconType: Icon });

      expect(wrapper).toHaveAttribute('data-size', 'medium');
      expect(wrapper).toHaveAttribute('data-background', 'none');
    });

    describe('background', () => {
      it.each(backgrounds)("renders with '%s' background when provided", (background) => {
        const { wrapper } = renderComponent({
          iconType: Icon,
          props: { background },
        });

        expect(wrapper).toHaveAttribute('data-background', background);
      });
    });

    describe('size', () => {
      it.each(sizes)("renders with '%s' size when provided", (size) => {
        const { wrapper } = renderComponent({
          iconType: Icon,
          props: { size },
        });

        expect(wrapper).toHaveAttribute('data-size', size);
      });
    });
  });

  describe('attributes', () => {
    it('applies custom class when provided', () => {
      const customClass = 'custom-class';
      const { wrapper } = renderComponent({
        iconType: Icon,
        props: { className: customClass },
      });

      expect(wrapper).toHaveClass(customClass);
    });

    it('applies aria attributes when provided', () => {
      const customAriaLabelText = 'Custom aria label';
      const customAriaControls = 'Custom aria controls';

      const { wrapper } = renderComponent({
        iconType: Icon,
        props: {
          alt: customAriaLabelText,
          ariaLabel: customAriaLabelText,
          ariaControls: customAriaControls,
          ariaHidden: false,
          ariaExpanded: true,
          ariaPressed: true,
        },
      });

      expect(wrapper).toHaveAttribute('aria-label', customAriaLabelText);
      expect(wrapper).toHaveAttribute('aria-controls', customAriaControls);
      expect(wrapper).toHaveAttribute('aria-hidden', 'false');
      expect(wrapper).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper).toHaveAttribute('aria-pressed', 'true');
    });

    describe('tabindex', () => {
      it('applies tabindex to wrapper when it is clickable', () => {
        const { wrapper } = renderComponent({ iconType: Icon, props: { interactive: true } });

        expect(wrapper).toHaveAttribute('tabIndex', '0');
      });

      it('does not apply tabindex to wrapper when it is not clickable', () => {
        const { wrapper } = renderComponent({ iconType: Icon, props: { interactive: false } });

        expect(wrapper).not.toHaveAttribute('tabIndex');
      });
    });

    describe('role', () => {
      it('applies custom role to wrapper when provided', () => {
        const customRole = 'custom-role';
        const { wrapper } = renderComponent({ iconType: Icon, props: { role: customRole } });

        expect(wrapper).toHaveRole(customRole);
      });

      it("applies 'button' role when wrapper is clickable", () => {
        const { wrapper } = renderComponent({ iconType: Icon, props: { interactive: true } });

        expect(wrapper).toHaveRole('button');
      });

      it("applies 'img' role when wrapper is not clickable", () => {
        const { wrapper } = renderComponent({ iconType: Icon, props: { interactive: false } });

        expect(wrapper).toHaveRole('img');
      });
    });
  });

  describe('user interaction', () => {
    it('calls onClick when user clicks and callback is provided', async () => {
      const onClick = vi.fn();
      const { wrapper, user } = renderComponent({ iconType: Icon, props: { onClick } });

      await user.click(wrapper);

      expect(onClick).toHaveBeenCalled();
    });

    it('calls onClick when user press Enter and callback is provided', async () => {
      const onClick = vi.fn();
      const { wrapper, user } = renderComponent({ iconType: Icon, props: { onClick } });

      await user.keyboard('[Tab]');
      expect(wrapper).toHaveFocus();

      await user.keyboard('[Enter]');
      expect(onClick).toHaveBeenCalled();
    });

    it('calls onClick when user press Space and callback is provided', async () => {
      const onClick = vi.fn();
      const { wrapper, user } = renderComponent({ iconType: Icon, props: { onClick } });

      await user.keyboard('[Tab]');
      expect(wrapper).toHaveFocus();

      await user.keyboard('[Space]');
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('children', () => {
    it('renders as svg with aria attributes when component provided', () => {
      const { svg, image } = renderComponent({
        iconType: Icon,
        props: { component: HomeIcon },
      });

      expect(image).not.toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
    });

    it('renders as image with aria attributes when src provided', () => {
      const { image, svg } = renderComponent({
        iconType: Icon,
        props: { src: '/test/img' },
      });

      expect(svg).not.toBeInTheDocument();
      expect(image).toHaveAttribute('aria-hidden', 'true');
      expect(image).toHaveRole('presentation');
    });

    it('renders no children when both src and component props are missing', () => {
      const { wrapper } = renderComponent({ iconType: Icon });

      expect(wrapper.hasChildNodes()).toBe(false);
    });
  });
});
