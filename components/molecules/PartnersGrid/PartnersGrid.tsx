import React from 'react';

interface PartnersGridProps {
  children: React.ReactNode;
  className?: string;
}

const PartnersGrid = ({ children, className }: PartnersGridProps) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${className || ''}`}>
    {children}
  </div>
);

export default PartnersGrid;
