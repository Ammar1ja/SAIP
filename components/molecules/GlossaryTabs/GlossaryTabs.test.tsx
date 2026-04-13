import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlossaryTabs } from './GlossaryTabs';

describe('GlossaryTabs', () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  const onTabChange = vi.fn();

  beforeEach(() => {
    onTabChange.mockClear();
  });

  it('renders all tabs', () => {
    render(<GlossaryTabs tabs={tabs} activeTab="Tab 1" onTabChange={onTabChange} />);
    tabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it('does not crash when containerRef.current is null', () => {
    render(<GlossaryTabs tabs={[]} activeTab="NoTab" onTabChange={() => {}} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does nothing when activeButton is not found', () => {
    render(<GlossaryTabs tabs={['Tab 1', 'Tab 2']} activeTab="Tab 3" onTabChange={() => {}} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('applies active class to selected tab', () => {
    render(<GlossaryTabs tabs={tabs} activeTab="Tab 2" onTabChange={onTabChange} />);
    expect(screen.getByRole('button', { name: 'Tab 2' })).toHaveClass('text-text-default');
  });

  it('calls onTabChange when a tab is clicked', () => {
    render(<GlossaryTabs tabs={tabs} activeTab="Tab 1" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('Tab 3'));
    expect(onTabChange).toHaveBeenCalledWith('Tab 3');
  });
});
