import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailPageLayout from './DetailPageLayout';

vi.mock('@/components/molecules/ExpandableTabGroup/ExpandableTabGroup', () => ({
  ExpandableTabGroup: vi.fn(() => <div data-testid="expandable-tab-group" />),
}));

describe('DetailPageLayout', () => {
  const defaultTabsMock = [{ id: '1', title: 'Tab 1', description: 'Content 1' }];

  it('renders children if provided and ignores defaultTabs', () => {
    render(
      <DetailPageLayout defaultTabs={defaultTabsMock}>
        <div data-testid="children">Child content</div>
      </DetailPageLayout>,
    );
    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.queryByTestId('expandablr-tab-group')).not.toBeInTheDocument();
  });

  it('renders ExpandableTabGroup if no children but defaultTabs provided', () => {
    render(<DetailPageLayout defaultTabs={defaultTabsMock} />);
    expect(screen.getByTestId('expandable-tab-group')).toBeInTheDocument();
  });

  it('renders nothing inside main container if no children and no defaultTabs', () => {
    const { container } = render(<DetailPageLayout />);
    const mainContent = container.querySelector('.flex-1');
    expect(mainContent).toBeEmptyDOMElement();
  });

  it('render sidebar if provided', () => {
    render(<DetailPageLayout sidebar={<div data-testid="sidebar">Sidebar</div>} />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders reserved sidebar space when reserveSidebarSpace is true and no sidebar', () => {
    const { container } = render(<DetailPageLayout reserveSidebarSpace />);
    const reservedDiv = container.querySelector(
      'div.hidden.lg\\:block.w-\\[340px\\].flex-shrink-0',
    );
    expect(reservedDiv).toBeInTheDocument();
  });

  it('applies provided className to container div', () => {
    const { container } = render(<DetailPageLayout className="custom-class" />);
    const containerDiv = container.querySelector('div.max-w-7xl');
    expect(containerDiv).toHaveClass('custom-class');
  });
});
