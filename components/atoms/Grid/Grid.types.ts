import { ReactNode } from 'react';

export interface GridCols {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface GridProps {
  children: ReactNode;
  className?: string;
  gap?: string;
  cols?: GridCols;
}
