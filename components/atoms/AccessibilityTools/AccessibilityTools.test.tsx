import { render, screen } from '@testing-library/react';
import { AccessibilityTools } from './AccessibilityTools';
import React from 'react';
import userEvent from '@testing-library/user-event';

const toggleContrastMock = vi.fn();

vi.mock('@/context/ContrastContext', () => ({
  useContrast: () => ({ highContrast: false, toggleContrast: toggleContrastMock }),
}));

type TestAccessibilityToolsProps = Partial<React.ComponentPropsWithRef<typeof AccessibilityTools>>;

const renderComponent = (props?: TestAccessibilityToolsProps) => {
  render(<AccessibilityTools {...props} />);

  return {
    heading: screen.getByRole('heading', { name: /accessibility tools/i }),
    toggleContrastButton: screen.getByLabelText(/toggle high contrast mode/i),
    toggleFontSizeButton: screen.getByLabelText(/toggle font size/i),
    toggle: toggleContrastMock,
    user: userEvent.setup(),
  };
};

describe('AccessibilityTools', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('large-font');
  });

  afterEach(() => {
    toggleContrastMock.mockClear();
    vi.restoreAllMocks();
  });

  describe('visability', () => {
    it('renders elements correctly', () => {
      const { heading, toggleContrastButton, toggleFontSizeButton } = renderComponent();

      expect(heading).toBeInTheDocument();
      expect(toggleContrastButton).toBeInTheDocument();
      expect(toggleFontSizeButton).toBeInTheDocument();
      expect(toggleContrastButton.tagName === 'BUTTON').toBe(true);
      expect(toggleFontSizeButton.tagName === 'BUTTON').toBe(true);
    });
  });

  describe('attributes', () => {
    it('applies custom class name when provided', () => {
      const customClass = 'custom-class';
      const { heading } = renderComponent({ className: customClass });
      const parent = heading.parentElement;

      expect(parent).toHaveClass(customClass);
    });
  });

  describe('user interaction', () => {
    it('calls toggle contrast function when toggle contrast button is clicked', async () => {
      const { toggleContrastButton, toggle, user } = renderComponent();

      await user.click(toggleContrastButton);

      expect(toggle).toHaveBeenCalled();
    });

    it('toggles large font size when font size button is clicked', async () => {
      const { toggleFontSizeButton, user } = renderComponent();

      expect(document.documentElement.classList.contains('large-font')).toBe(false);
      expect(localStorage.getItem('saip-font-size')).toBeNull();

      await user.click(toggleFontSizeButton);

      expect(document.documentElement.classList.contains('large-font')).toBe(true);
      expect(localStorage.getItem('saip-font-size')).toBe('large');
    });
  });
});
