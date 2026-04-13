import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlossaryRow } from './GlossaryRow';

function renderInTable(ui: React.ReactElement) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
}

describe('GlossaryRow', () => {
  const props = {
    english: 'Trademark',
    arabic: 'علامة تجارية',
    description: 'Description of glossary row',
    index: 0,
  };

  it('renders english and arabic text', () => {
    renderInTable(<GlossaryRow {...props} />);
    expect(screen.getByText(props.english)).toBeInTheDocument();
    expect(screen.getByText(props.arabic)).toBeInTheDocument();
  });

  it('does not show description initially when row is not the first', () => {
    renderInTable(<GlossaryRow {...props} index={1} />);
    expect(screen.queryByText(props.description)).not.toBeInTheDocument();
  });

  it('toggles description visibility off and on (to cover both branches)', () => {
    renderInTable(<GlossaryRow {...props} index={1} />);
    fireEvent.click(screen.getByText(props.english));
    expect(screen.getByText(props.description)).toBeInTheDocument();
    fireEvent.click(screen.getByText(props.english));
    expect(screen.queryByText(props.description)).not.toBeInTheDocument();
  });

  it('renders description row with gray background when index is odd (isEven === true)', () => {
    renderInTable(<GlossaryRow {...props} index={1} />);
    fireEvent.click(screen.getByText(props.english));
    const descriptionRow = screen.getByText(props.description).closest('tr');
    expect(descriptionRow).toHaveClass('bg-neutral-50');
  });

  it('adds and removes rotate-180 class on icon toggle', () => {
    renderInTable(<GlossaryRow {...props} index={1} />);
    const toggle = screen.getByRole('button', { name: /Expand row details/i });
    const icon = toggle.querySelector('svg');

    expect(icon?.getAttribute('class')).not.toMatch(/rotate-180/);
    fireEvent.click(toggle);
    expect(icon?.getAttribute('class')).toMatch(/rotate-180/);
    fireEvent.click(toggle);
    expect(icon?.getAttribute('class')).not.toMatch(/rotate-180/);
  });

  it('does not render description row when collapsed', () => {
    renderInTable(<GlossaryRow {...props} index={1} />);
    expect(screen.queryByText(props.description)).not.toBeInTheDocument();
  });

  it('adds background class depending on index', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <GlossaryRow {...props} index={0} />
        </tbody>
      </table>,
    );
    expect(screen.getAllByRole('row')[0]).toHaveClass('bg-white');

    rerender(
      <table>
        <tbody>
          <GlossaryRow {...props} index={1} />
        </tbody>
      </table>,
    );
    expect(screen.getAllByRole('row')[0]).toHaveClass('bg-neutral-50');
  });
});
