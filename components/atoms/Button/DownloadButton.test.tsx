import { render, screen } from '@testing-library/react';
import DownloadButton from './DownloadButton';

type TestDownloadButtonProps = Partial<React.ComponentProps<typeof DownloadButton>>;

const renderComponent = (props?: TestDownloadButtonProps) => {
  const label = props?.ariaLabel || 'Test label';
  render(
    <DownloadButton {...props} ariaLabel={label}>
      {props?.children}
    </DownloadButton>,
  );

  const button = screen.getByRole('button');

  return {
    button,
    svg: button.querySelector('svg'),
    defaultProps: {
      intent: 'primary',
      size: 'md',
    },
  };
};

describe('DownloadButton', () => {
  it('renders correctly provided children', () => {
    const textContent = 'Download button';
    const children = <span>{textContent}</span>;
    const { button } = renderComponent({ children });

    expect(button).toHaveTextContent(textContent);
  });

  it('renders with default props', () => {
    const {
      button,
      defaultProps: { size, intent },
    } = renderComponent();

    expect(button).toHaveAttribute('data-intent', intent);
    expect(button).toHaveAttribute('data-size', size);
  });

  it('renders with provided props', () => {
    const { button } = renderComponent({ size: 'lg', intent: 'secondary' });

    expect(button).toHaveAttribute('data-intent', 'secondary');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('renders SVG icon with aria-hidden alongside children', () => {
    const { svg } = renderComponent();

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom class name when provided', () => {
    const customClass = 'custom-class';
    const { button } = renderComponent({ className: customClass });

    expect(button).toHaveClass(customClass);
  });
});
