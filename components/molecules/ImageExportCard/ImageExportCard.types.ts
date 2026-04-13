import React from 'react';

/**
 * ImageExportCard component props
 */
export interface ImageExportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title: string;
  /** Card description */
  description: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Links to download file in each format */
  downloads?: {
    svg?: string;
    png?: string;
    jpg?: string;
  };
  /** Image attributes */
  image: {
    src: string;
    alt: string;
  };
}
