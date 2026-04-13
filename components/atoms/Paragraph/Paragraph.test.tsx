import { render, screen } from '@testing-library/react';
import Paragraph from './Paragraph';
import React from 'react';

type TestParagraphProps = Omit<React.ComponentProps<typeof Paragraph>, 'children'> & {
  children?: React.ReactNode;
};

const renderComponent = (props?: TestParagraphProps) => {
  render(<Paragraph children="Test" {...props} />);

  return {
    paragraph: screen.getByRole('paragraph'),
  };
};

describe('Paragraph', () => {
  it('renders provided children', () => {
    const paragraphText = 'Test paragraph';
    const { paragraph } = renderComponent({ children: paragraphText });

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(paragraphText);
  });

  it('applies provided custom class', () => {
    const customClass = 'custom-class';
    const { paragraph } = renderComponent({ className: customClass });

    expect(paragraph).toHaveClass(customClass);
  });

  it('forwards provided HTML attributes', () => {
    const customId = 'custom-id';
    const { paragraph } = renderComponent({ id: customId });

    expect(paragraph).toHaveAttribute('id', customId);
  });
});
