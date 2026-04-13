import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  it('renders all navigation items', () => {
    render(<Navigation items={items} />);
    items.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders correct hrefs', () => {
    render(<Navigation items={items} />);
    items.forEach(({ label, href }) => {
      const link = screen.getByText(label);
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('applies additional className if provided', () => {
    const { container } = render(<Navigation items={items} className="custom-class" />);
    expect(container.querySelector('nav')).toHaveClass('custom-class');
  });
});
