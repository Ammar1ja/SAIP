import { render, screen } from '@testing-library/react';
import { InfoBlockProps } from './InfoBlock.types';
import { InfoBlock } from './InfoBlock';

const renderComponent = (props?: Partial<InfoBlockProps>) => {
  const { container } = render(
    <InfoBlock title={props?.title} {...props}>
      {props?.children}
    </InfoBlock>,
  );

  return {
    wrapper: container.firstElementChild,
  };
};

describe('InfoBlock', () => {
  describe('rendering', () => {
    it('renders provided title', () => {
      const title = 'Test title';
      renderComponent({ title: <h5>{title}</h5> });

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });

    it('renders provided children', () => {
      const children = (
        <>
          <div data-testid="child">Test child 1</div>
          <div data-testid="child">Test child 2</div>
        </>
      );
      renderComponent({ children });

      expect(screen.getAllByTestId('child')).toHaveLength(2);
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
